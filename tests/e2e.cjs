// 로컬 E2E 테스트: 정적 서버를 띄우고 Playwright(Chrome)로 화면을 확인한다.
// Wandbox 호출은 가로채서 로컬 python3 / g++ 로 실행하는 목으로 대체한다.
//
//   npm i --no-save playwright-core     (한 번)
//   node tests/e2e.cjs                  (환경 변수: PYTHON=python3 경로, CHROME_CHANNEL=chrome|msedge, SHOTS=스크린샷 폴더)
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const PYTHON = process.env.PYTHON || 'python3';
const SHOTS = process.env.SHOTS || '';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

// ---------------------------------------------------------------- 정적 서버 (/recall-code-lab/ 하위 경로 흉내)
const PREFIX = '/recall-code-lab/';
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (!url.startsWith(PREFIX)) { res.writeHead(404); res.end('outside prefix'); return; }
  let file = path.join(ROOT, url.slice(PREFIX.length) || 'index.html');
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

// ---------------------------------------------------------------- Wandbox 목
const mock = { calls: [], failMode: null };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'recall-e2e-'));
let seq = 0;
function fakeWandbox(body) {
  const id = ++seq;
  const out = { status: '0', signal: '', compiler_output: '', compiler_error: '', compiler_message: '', program_output: '', program_error: '', program_message: '', permlink: '', url: '' };
  let cmd;
  if (body.compiler.startsWith('cpython')) {
    const src = path.join(tmp, `prog${id}.py`);
    fs.writeFileSync(src, body.code);
    cmd = [PYTHON, ['-I', src]];
  } else {
    const src = path.join(tmp, `prog${id}.cc`);
    const exe = path.join(tmp, `prog${id}${process.platform === 'win32' ? '.exe' : ''}`);
    fs.writeFileSync(src, body.code);
    const c = spawnSync('g++', ['-O2', '-std=c++17', '-o', exe, src], { encoding: 'utf8' });
    if (c.status !== 0) {
      out.status = '1';
      out.compiler_error = c.stderr.replaceAll(src, 'prog.cc');
      return out;
    }
    cmd = [exe, []];
  }
  const r = spawnSync(cmd[0], cmd[1], { input: body.stdin || '', encoding: 'utf8', timeout: 10000 });
  out.program_output = r.stdout || '';
  out.program_error = r.stderr || '';
  out.status = String(r.status ?? 137);
  return out;
}

// ---------------------------------------------------------------- 테스트 도우미
let failures = 0;
function check(cond, name, extra = '') {
  console.log(`${cond ? '  ok ' : '  FAIL'} ${name}${extra ? ` — ${extra}` : ''}`);
  if (!cond) failures += 1;
}
// 기대값을 데이터에서 계산한다(문제가 늘어도 테스트가 그대로 맞게).
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const ALL = readJson('problems/manifest.json').files.flatMap((f) => readJson(`problems/${f}`));
const BY_ID = new Map(ALL.map((p) => [p.id, p]));
const CONCEPTS = readJson('concepts/manifest.json').concepts;
// 사이트·validate_concepts.py 와 같은 연결 규칙
const relates = (topic, topics) => (topics || []).some((raw) => {
  const c = String(raw).trim().toLowerCase();
  const t = String(topic).trim().toLowerCase();
  return c.startsWith('=') ? t === c.slice(1).trim() : c && t.includes(c);
});
const PY_SOL = (id) => fs.readFileSync(path.join(ROOT, '.solutions', `${id}.py`), 'utf8');
const CPP_SOL = (id) => fs.readFileSync(path.join(ROOT, '.solutions', `${id}.cpp`), 'utf8');

async function setCode(page, code) {
  await page.evaluate((c) => document.querySelector('.CodeMirror').CodeMirror.setValue(c), code);
}
async function shot(page, name) {
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: true });
}

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}${PREFIX}`;
  const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
  // 이 컨텍스트는 목에 요청을 많이 보내므로 요청 제한을 사실상 끈다(제한 자체는 아래 "요청 제한" 절에서 확인).
  await ctx.addInitScript(() => { window.__RECALL_RATE__ = { limit: 100000 }; });
  await ctx.route('https://wandbox.org/api/compile.json', async (route) => {
    const body = JSON.parse(route.request().postData());
    mock.calls.push(body);
    if (mock.failMode === '503') return route.fulfill({ status: 503, body: 'down' });
    // Wandbox가 붐빌 때 실제로 돌려준 응답: HTTP 200 + status 126 + 컨테이너 런타임 오류
    const oci = { status: '126', signal: '', compiler_output: '', compiler_error: '', compiler_message: '', program_output: '',
      program_error: 'Error: OCI runtime error: crun: clone: Resource temporarily unavailable\n', program_message: '' };
    const key = `${body.compiler}|${body.stdin}`;
    if (mock.failMode === 'oci' || (mock.failMode === 'oci-once' && !mock.seen.has(key))) {
      mock.seen.add(key);
      return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(oci) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(fakeWandbox(body)) });
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  // 목이 일부러 돌려주는 503 응답 로그는 오류로 세지 않는다.
  page.on('console', (m) => { if (m.type() === 'error' && !(mock.failMode && /status of 503/.test(m.text()))) errors.push(m.text()); });
  page.on('dialog', (d) => d.accept());

  console.log('== 문제 보관함');
  await page.goto(base);
  await page.waitForSelector('.problem-row');
  const rows = await page.$$eval('.problem-row', (els) => els.map((e) => e.dataset.id));
  check(rows.length >= 14, '문제 목록 로딩', `${rows.length}개`);
  check(rows[rows.length - 1] === 'index' && rows[rows.length - 8] === 'bfs', '기본기 8개는 맨 뒤');
  const dated = rows.filter((r) => r.startsWith('daily-'));
  const sortedDated = [...dated].sort((a, b) => (a.slice(6, 16) === b.slice(6, 16) ? a.localeCompare(b) : b.localeCompare(a)));
  check(JSON.stringify(dated) === JSON.stringify(sortedDated), '최신 날짜 먼저, 같은 날은 1→3');
  check((await page.textContent('#count')).includes(`총 ${rows.length}개 문제`), '"총 N개 문제" 표시');
  check(rows.length === ALL.length, 'manifest 의 문제 전부 표시', `${rows.length}/${ALL.length}`);
  const addedOrder = rows.map((id) => BY_ID.get(id).addedOn);
  const firstNull = addedOrder.indexOf(null);
  const datedPart = firstNull < 0 ? addedOrder : addedOrder.slice(0, firstNull);
  check(datedPart.every((d, i) => i === 0 || datedPart[i - 1] >= d) && (firstNull < 0 || addedOrder.slice(firstNull).every((d) => d === null)),
    'addedOn 내림차순, null 은 맨 뒤');
  const firstRow = await page.textContent('.problem-row');
  check(/약 \d+분/.test(firstRow) && !/문법 ·/.test(firstRow) && firstRow.includes('주제 숨김'), '처음에는 주제·문법 숨김, 소요 시간 표시');
  check(!(await page.isChecked('#show-topics')), '"주제 표시" 기본 꺼짐');
  check(await page.isVisible('.problem-row .badge.diff-입문, .problem-row .badge.diff-기본'), '난이도 배지');
  await shot(page, '01-archive');

  const count = async () => page.$$eval('.problem-row', (e) => e.length);
  await page.selectOption('#f-category', '기본기');
  check(await count() === 8, '유형 필터: 기본기 8개');
  await page.selectOption('#f-category', '');
  const expectSearch = (word, revealed) => ALL.filter((p) => (revealed ? `${p.title} ${p.topic} ${p.syntax}` : p.title).toLowerCase().includes(word)).length;
  await page.fill('#f-q', '이분');
  check(await count() === expectSearch('이분', false), '주제 숨김 중 검색은 제목만', `${await count()}개`);
  await page.click('label.switch');
  check(await count() === expectSearch('이분', true), '주제 표시 후 검색: "이분"', `${await count()}개`);
  await page.fill('#f-q', 'long long');
  check(await count() >= 1, '검색: 문법 텍스트');
  await page.fill('#f-q', '');
  check(/문법 ·/.test(await page.textContent('.problem-row')) && !(await page.textContent('.problem-row')).includes('주제 숨김'), '주제 표시 토글: 주제·문법 보임');
  await page.reload();
  await page.waitForSelector('.problem-row');
  check(await page.isChecked('#show-topics'), '주제 표시 토글 상태 저장');
  await page.click('label.switch');
  check((await page.textContent('.problem-row')).includes('주제 숨김'), '토글 끄면 다시 숨김');
  await page.selectOption('#f-difficulty', '입문');
  const intro = await count();
  check(intro >= 5, '난이도 필터: 입문', `${intro}개`);
  await page.selectOption('#f-topic', { index: 1 });
  check((await count()) <= intro, '알고리즘 필터 동작');
  await page.click('#reset-filters');
  check(await count() === rows.length, '필터 초기화');
  await page.selectOption('#f-syntax', 'append 인자');
  check(await count() === ALL.filter((p) => p.syntax.split(/[,，]/).map((s) => s.trim()).includes('append 인자')).length, '주제 숨김 중에도 문법 유형 필터 동작');
  await page.selectOption('#f-status', 'solved');
  check(await page.isVisible('.empty-state'), '결과 없음 안내');
  await page.click('.empty-state [data-reset]');
  check(await count() === rows.length, '빈 결과에서 필터 초기화');

  console.log('== 풀이 화면 (템플릿 형식)');
  await page.click('.problem-row[data-id="daily-2026-11-11-2"] a');
  await page.waitForSelector('.CodeMirror');
  check(page.url().endsWith('#p/daily-2026-11-11-2'), '해시 라우팅');
  const heads = await page.$$eval('.statement h2', (e) => e.map((x) => x.textContent));
  check(JSON.stringify(heads) === JSON.stringify(['제약', '입력 형식', '출력 형식', '예제']), '섹션 분리', heads.join(','));
  const chips = await page.$$eval('.meta-chip', (e) => e.map((x) => x.textContent));
  check(chips.length === 4 && chips.some((t) => t.includes('주제 숨김')) && !chips.some((t) => t.startsWith('핵심 문법')), '해결 전: [알고리즘 주제]/[핵심 문법] 칩 숨김', chips.join(' | '));
  check(await page.isVisible('#head-topic .tag-hidden'), '해결 전: 머리의 주제 태그 숨김');
  check(await page.$$eval('.statement ul li', (e) => e.length) >= 3, '제약 목록');
  const exIn = await page.textContent('.example pre');
  check(exIn.startsWith('5\n-10 0 3 8 15'), '예제 입력 = 첫 테스트');
  check((await page.textContent('#breadcrumb')).includes('정렬된 부품의 위치'), '브레드크럼에 제목');
  check((await page.textContent('.notice')).includes('Wandbox'), '전송 안내 문구');

  console.log('== Python 실행 (오답 → 정답)');
  await setCode(page, 'n = int(input())\nprint(-1)\n');
  await page.click('#run-all');
  await page.waitForSelector('.score strong.pass-none, .score strong.pass-some, .score strong.pass-all', { timeout: 60000 });
  const failScore = await page.textContent('.score strong');
  check(/^0\/4 통과$/.test(failScore), '오답 채점', failScore);
  await page.click('.result-item summary');
  const detail = await page.textContent('.result-item[open]');
  check(detail.includes('기대 출력') && detail.includes('실제 출력') && detail.includes('입력'), '실패 상세 펼치기');
  check(await page.$eval('#status-switch [data-status="unsolved"]', (b) => b.getAttribute('aria-pressed')) === 'true', '오답이면 상태 유지(미풀이)');
  await setCode(page, PY_SOL('daily-2026-11-11-2'));
  await page.click('#run-all');
  await page.waitForFunction(() => document.querySelector('.score strong')?.classList.contains('pass-all'), null, { timeout: 60000 });
  check((await page.textContent('.score strong')) === '4/4 통과', 'Python 정답 4/4 통과');
  check(await page.$eval('#status-switch [data-status="solved"]', (b) => b.getAttribute('aria-pressed')) === 'true', '힌트 없이 전부 통과 → 상태 "해결"');
  check(!(await page.isVisible('.msg-hint')), '힌트 없이 통과하면 복습 안내 없음');
  check(await page.$$eval('.meta-chip', (e) => e.length) === 5 && await page.isVisible('#head-topic .tag-topic'), '해결 후 주제·문법 칩 표시');
  await shot(page, '02-solve-pass');

  console.log('== 상태 저장 / 새로고침');
  await page.click('#status-switch [data-status="review"]');
  await page.reload();
  await page.waitForSelector('.CodeMirror');
  check(await page.$eval('#status-switch [data-status="review"]', (b) => b.getAttribute('aria-pressed')) === 'true', '새로고침 후 "복습 필요" 유지');
  const restored = await page.evaluate(() => document.querySelector('.CodeMirror').CodeMirror.getValue());
  check(restored === PY_SOL('daily-2026-11-11-2'), '코드 초안 복원');
  check((await page.textContent('.score strong')) === '4/4 통과', '마지막 결과 복원');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('recall-state-v1')));
  const e = saved.problems['daily-2026-11-11-2'];
  check(e && e.attempts.length === 2 && e.attempts[1].verdict === 'pass' && e.attempts[0].verdict === 'fail', '풀이 기록(attempts) 저장');
  check(saved.lang === 'python', '선택 언어 저장');

  console.log('== C++ 실행 (컴파일 오류 → 런타임 오류 → 정답)');
  await page.click('.lang-tabs [data-lang="cpp"]');
  const cppStart = await page.evaluate(() => document.querySelector('.CodeMirror').CodeMirror.getValue());
  check(cppStart.includes('#include <bits/stdc++.h>'), 'C++ 시작 코드');
  await setCode(page, 'int main() { return x; }\n');
  await page.click('#run-all');
  await page.waitForSelector('.error-box', { timeout: 60000 });
  check((await page.textContent('.error-box')).includes("'x' was not declared"), '컴파일 오류 그대로 표시');
  check(await page.$$eval('.verdict.v-skipped', (e) => e.length) >= 1, '컴파일 오류 뒤 나머지 건너뜀');
  await setCode(page, '#include <cstdlib>\nint main() { std::abort(); }\n');
  await page.click('#run-all');
  await page.waitForFunction(() => !document.querySelector('#run-all').disabled && document.querySelector('.verdict.v-error'), null, { timeout: 60000 });
  check(true, '런타임 오류 표시');
  await setCode(page, CPP_SOL('daily-2026-11-11-2'));
  await page.click('#run-all');
  await page.waitForFunction(() => document.querySelector('.score strong')?.classList.contains('pass-all'), null, { timeout: 60000 });
  check((await page.textContent('.score strong')) === '4/4 통과', 'C++ 정답 4/4 통과');
  const optsOk = mock.calls.filter((c) => c.compiler === 'gcc-13.2.0').every((c) => c.options === 'optimize,c++17' && c.save === false);
  const pyOk = mock.calls.filter((c) => c.compiler === 'cpython-3.13.8').length > 0;
  check(optsOk && pyOk, 'Wandbox 요청 형식(compiler/options/save)');

  console.log('== 직접 입력');
  await page.click('#run-custom');
  await page.waitForFunction(() => document.querySelector('#custom-out pre'), null, { timeout: 60000 });
  check((await page.textContent('#custom-out pre')).trim() === '3 -1 1 5', '직접 입력 실행(예제 입력 자동 채움)');
  await page.fill('#custom-stdin', '1\n7\n1\n7\n');
  await page.click('#custom-run');
  await page.waitForFunction(() => document.querySelector('#custom-out pre')?.textContent.trim() === '1', null, { timeout: 60000 });
  check(true, '수정한 입력으로 다시 실행');

  console.log('== 실행 서비스 장애');
  await page.click('.lang-tabs [data-lang="python"]');
  const before = mock.calls.length;
  mock.failMode = '503';
  await page.click('#run-all');
  await page.waitForSelector('.msg-service', { timeout: 60000 });
  check((await page.textContent('.results')).includes('실행 서비스에 연결하지 못했어요'), '"실행 서비스에 연결하지 못했어요" 표시');
  check(mock.calls.length - before === 8, '429/5xx 1회 재시도', `${mock.calls.length - before}회 요청(테스트 4개)`);
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('recall-state-v1')).problems['daily-2026-11-11-2'].attempts.length);
  check(after === 5, '장애는 풀이 기록에 남기지 않음', `attempts=${after} (Python 2회 + C++ 3회)`);

  console.log('== 실행 서버 과부하(HTTP 200 + OCI 런타임 오류)');
  mock.seen = new Set();
  mock.failMode = 'oci-once';
  let n0 = mock.calls.length;
  await page.click('#run-all');
  await page.waitForFunction(() => !document.querySelector('#run-all').disabled && document.querySelector('.score strong'), null, { timeout: 60000 });
  check(await page.evaluate(() => document.querySelector('.score strong').classList.contains('pass-all')), '한 번 실패 후 재시도로 전부 통과', `${mock.calls.length - n0}회 요청(테스트 4개)`);
  check(mock.calls.length - n0 === 8, '과부하 응답은 1회 재시도');
  mock.failMode = 'oci';
  n0 = mock.calls.length;
  await page.click('#run-all');
  await page.waitForSelector('.msg-service', { timeout: 60000 });
  check(!(await page.textContent('.results')).includes('런타임 오류'), '과부하를 런타임 오류로 표시하지 않음');
  const afterOci = await page.evaluate(() => JSON.parse(localStorage.getItem('recall-state-v1')).problems['daily-2026-11-11-2'].attempts.length);
  check(afterOci === 6, '과부하 실패는 풀이 기록에 남기지 않음', `attempts=${afterOci} (재시도 성공 1회만 추가)`);
  mock.failMode = null;

  console.log('== 처음 코드로 되돌리기');
  await page.click('#reset-code');
  const reset = await page.evaluate(() => document.querySelector('.CodeMirror').CodeMirror.getValue());
  check(reset === '# 표준 입력을 읽고 결과를 출력하세요.\n', '시작 코드로 복원');

  console.log('== 기본기 문제(짧은 형식, 버그 있는 시작 코드)');
  await page.goto(`${base}#p/bfs`);
  await page.waitForSelector('.CodeMirror');
  check(await page.$$eval('.statement h2', (e) => e.map((x) => x.textContent).join()) === '예제', '본문만 있는 형식 렌더링');
  const bfsChips = await page.$$eval('.meta-chip', (e) => e.map((x) => x.textContent));
  check(bfsChips.length === 4 && bfsChips.some((t) => t.includes('주제 숨김')), '필드로 메타 칩 구성(주제 숨김)', bfsChips.join(' | '));
  const bfsCode = await page.evaluate(() => document.querySelector('.CodeMirror').CodeMirror.getValue());
  check(bfsCode.includes('q.append(nx, ny, d+1)'), '시작 코드 버그 보존');
  await page.click('#run-all');
  await page.waitForFunction(() => !document.querySelector('#run-all').disabled && document.querySelector('.score strong'), null, { timeout: 60000 });
  const bfsScore = await page.textContent('.score strong');
  check(bfsScore !== '3/3 통과', '버그 코드는 통과하지 못함', bfsScore);
  await page.click('#status-switch [data-status="review"]');
  await page.goto(`${base}#p/없는-문제`);
  check(await page.isVisible('.empty-state'), '없는 문제 안내');

  console.log('== 보관함에 상태 반영');
  await page.goto(base);
  await page.waitForSelector('.problem-row');
  // daily-2026-11-11-2 는 "복습 필요"로 바꾼 뒤 C++ 로 전부 통과했으므로 다시 "해결"이어야 한다.
  check((await page.textContent('.problem-row[data-id="daily-2026-11-11-2"] .status')).trim() === '해결', '목록에 "해결" 표시(복습 필요 뒤 재통과)');
  check((await page.textContent('.problem-row[data-id="bfs"] .status')).trim() === '복습 필요', '목록에 "복습 필요" 표시');
  await page.selectOption('#f-status', 'review');
  check(await count() === 1, '풀이 여부 필터: 복습 필요 1개');
  await page.selectOption('#f-status', 'solved');
  check(await count() === 1, '풀이 여부 필터: 해결 1개');

  const stateOf = (id) => page.evaluate((pid) => JSON.parse(localStorage.getItem('recall-state-v1')).problems[pid] || {}, id);
  const pressed = (s) => page.$eval(`#status-switch [data-status="${s}"]`, (b) => b.getAttribute('aria-pressed') === 'true');

  console.log('== 힌트: 확인 → 3단계 → 힌트 사용 후 통과는 "복습 필요"');
  const H = 'daily-2026-11-12-2';
  await page.goto(`${base}#p/${H}`);
  await page.waitForSelector('#hint-next');
  check(await page.isVisible('#head-topic .tag-hidden') && (await page.textContent('#related-concepts')).trim() === '', '힌트 전: 주제 숨김, 관련 개념 없음');
  await page.click('#hint-next');
  check(await page.isVisible('#hint-confirm'), '첫 힌트 전에 화면 안 확인');
  check((await page.textContent('#hint-confirm-text')).trim() === "힌트를 보면 이 문제는 '복습 필요'로 분류돼요. 계속할까요?", '확인 문구');
  await page.click('#hint-no');
  check(!(await page.isVisible('#hint-confirm')) && await page.$$eval('.hint-item', (e) => e.length) === 0 && await pressed('unsolved'), '취소하면 아무것도 열지 않음');
  await page.click('#hint-next');
  await page.click('#hint-yes');
  check(await page.$$eval('.hint-item', (e) => e.length) === 1, '1단계 열림');
  check((await page.textContent('.hint-item p')).trim() === BY_ID.get(H).hints[0], '1단계 내용 = hints[0]');
  check(await pressed('review'), '힌트를 열면 "복습 필요"');
  check(await page.isVisible('#head-topic .tag-topic') && await page.$$eval('.meta-chip', (e) => e.length) === 5, '힌트 1단계 뒤 주제·문법 표시');
  const relH = CONCEPTS.filter((c) => relates(BY_ID.get(H).topic, c.topics));
  if (relH.length) {
    await page.waitForSelector('#related-concepts .concept-chip');
    check(await page.$$eval('#related-concepts .concept-chip', (e) => e.length) === relH.length, '힌트 1단계 뒤 관련 개념 링크', relH.map((c) => c.title).join(', '));
  } else {
    check(true, '관련 개념 없음(개념서에 이어진 항목이 없음)');
  }
  await page.click('#hint-next');
  check(!(await page.isVisible('#hint-confirm')) && await page.$$eval('.hint-item', (e) => e.length) === 2, '2단계는 확인 없이 열림');
  await page.click('#hint-next');
  check(await page.$$eval('.hint-item', (e) => e.length) === 3 && !(await page.isVisible('#hint-next')), '3단계까지 열면 버튼 사라짐');
  await page.reload();
  await page.waitForSelector('#hint-list');
  check(await page.$$eval('.hint-item', (e) => e.length) === 3, '연 단계는 새로고침 뒤에도 유지');
  const hs = await stateOf(H);
  check(hs.hintUsed === true && hs.hintLevel === 3 && Array.isArray(hs.hintOpenedAt) && hs.hintOpenedAt.length === 3 && !!hs.hintUsedAt, 'hintUsed·단계·시각 저장', JSON.stringify({ u: hs.hintUsed, l: hs.hintLevel, n: hs.hintOpenedAt?.length }));
  await setCode(page, PY_SOL(H));
  await page.click('#run-all');
  await page.waitForFunction(() => document.querySelector('.score strong')?.classList.contains('pass-all'), null, { timeout: 60000 });
  check(await pressed('review'), '힌트 사용 후 전체 통과 → "복습 필요"로 저장');
  check((await page.textContent('.msg-hint')).trim() === "힌트를 사용해서 '복습 필요'로 분류했어요. 나중에 힌트 없이 다시 풀어 보세요.", '힌트 사용 안내 문구');
  check((await stateOf(H)).status === 'review', '저장된 상태 = review');
  check(await page.isVisible('#hint-clear'), '"힌트 없이 다시 풀었어요" 버튼 표시');
  await shot(page, '05-hint-review');

  await page.goto(base);
  await page.waitForSelector('.problem-row');
  check(await page.isVisible(`.problem-row[data-id="${H}"] .badge-hint`), '목록에 "힌트 사용" 배지');
  await page.selectOption('#f-status', 'review');
  check(await page.isVisible(`.problem-row[data-id="${H}"]`), '풀이 여부 "복습 필요" 필터에 포함');
  await page.selectOption('#f-status', '');

  await page.goto(`${base}#p/${H}`);
  await page.waitForSelector('#hint-clear');
  await page.click('#hint-clear');
  check(await pressed('solved') && !(await page.isVisible('#hint-clear')), '"힌트 없이 다시 풀었어요" → 해결');
  const hs2 = await stateOf(H);
  check(hs2.status === 'solved' && hs2.hintUsed === false && hs2.hintLevel === 3, 'hintUsed 해제, 연 단계는 유지');

  console.log('== 힌트: 해결한 문제에서 열면 상태 그대로');
  const S = 'daily-2026-11-11-2'; // 위에서 힌트 없이 해결
  check(!(await stateOf(S)).hintUsed, '힌트 없이 해결한 문제는 hintUsed 없음');
  await page.goto(`${base}#p/${S}`);
  await page.waitForSelector('#hint-next');
  await page.click('#hint-next');
  check(!(await page.isVisible('#hint-confirm')) && await page.$$eval('.hint-item', (e) => e.length) === 1, '해결한 문제는 확인 없이 바로 열림');
  check(await pressed('solved') && (await stateOf(S)).hintUsed !== true && !(await page.isVisible('#hint-clear')), '해결 상태 유지, hintUsed 아님');

  console.log('== 힌트 사용 중(미해결) 문제');
  const U = 'daily-2026-11-12-1';
  await page.goto(`${base}#p/${U}`);
  await page.waitForSelector('#hint-next');
  await page.click('#hint-next');
  await page.click('#hint-yes');
  await page.goto(base);
  await page.waitForSelector('.problem-row');
  check(await page.isVisible(`.problem-row[data-id="${U}"] .badge-hint`) && (await page.textContent(`.problem-row[data-id="${U}"] .tag-topic`)).trim() === BY_ID.get(U).topic, '미해결이라도 힌트를 열면 배지·주제 표시');

  console.log('== 개념서');
  await page.click('[data-nav="concepts"]');
  await page.waitForSelector('#concept-list');
  check(page.url().endsWith('#concepts') && await page.$eval('[data-nav="concepts"]', (a) => a.classList.contains('is-active')), '사이드바 "개념서" 메뉴와 라우팅');
  const cards = () => page.$$eval('.concept-card', (e) => e.length);
  check(await cards() === CONCEPTS.length && CONCEPTS.length > 0, '개념 목록', `${CONCEPTS.length}개`);
  if (CONCEPTS.length) {
    const target = CONCEPTS.find((c) => c.slug === 'heap') || CONCEPTS[0];
    await page.fill('#c-q', target.title);
    check(await cards() >= 1 && await page.isVisible(`.concept-card[data-slug="${target.slug}"]`), '개념 검색', target.title);
    await page.fill('#c-q', 'zzz없는말zzz');
    check(await cards() === 0 && await page.isVisible('.empty-state'), '검색 결과 없음');
    await page.fill('#c-q', '');
    await page.click(`#c-cats [data-cat="${target.category}"]`);
    check(await cards() === CONCEPTS.filter((c) => c.category === target.category).length, '카테고리 필터', target.category);
    await page.click('#c-cats [data-cat=""]');
    await page.click(`.concept-card[data-slug="${target.slug}"]`);
    await page.waitForSelector('#c-items .api-table');
    check(page.url().endsWith(`#concepts/${target.slug}`), '개념 상세 라우팅');
    const secs = await page.$$eval('.concept-section h2', (e) => e.map((x) => x.textContent));
    check(JSON.stringify(secs) === JSON.stringify(['이럴 때 써요', '핵심 함수·문법', '예제 코드', '상황별 선택 가이드', '자주 하는 실수', '시험장 체크리스트', '관련 문제']), '상세 구성', secs.join(','));
    const detail = readJson(`concepts/${target.slug}.json`);
    check(await page.$$eval('.api-table tbody tr', (e) => e.length) === detail.python.items.length, 'Python 함수 표');
    // 언어 토글은 기존 언어 선택과 공유한다(위에서 마지막으로 고른 언어는 C++).
    await page.click('.lang-tabs [data-lang="python"]');
    check((await page.textContent('#c-examples pre.code')).trim() === detail.python.examples[0].code.trim(), 'Python 예제 코드');
    check((await page.textContent('#c-examples .io-box:last-child pre')).trim() === detail.python.examples[0].output.trim(), '예제 실행 결과 표시');
    await page.click('.lang-tabs [data-lang="cpp"]');
    check((await page.textContent('#c-examples pre.code')).trim() === detail.cpp.examples[0].code.trim() && await page.$$eval('.api-table tbody tr', (e) => e.length) === detail.cpp.items.length, 'C++ 로 전환');
    check(await page.$$eval('.pitfall', (e) => e.length) === detail.cpp.pitfalls.length, '자주 하는 실수(C++)');
    check(await page.isVisible('#c-examples [data-copy-ex="0"]'), '예제 복사 버튼');
    const rel = ALL.filter((p) => relates(p.topic, detail.topics));
    check(await page.$$eval('.related-problem', (e) => e.length) === rel.length, '관련 문제 연결', `${rel.length}개`);
    if (rel.length) check(await page.isVisible('.related-problem .status'), '관련 문제에 풀이 상태 표시');
    await page.goto(`${base}#p/daily-2026-11-10-1`);
    await page.waitForSelector('.CodeMirror');
    check(await page.$eval('.lang-tabs [data-lang="cpp"]', (b) => b.getAttribute('aria-selected')) === 'true', '개념서 언어 선택이 풀이 화면과 공유됨');
    await page.click('.lang-tabs [data-lang="python"]');
    await page.goto(`${base}#concepts/없는-개념`);
    await page.waitForSelector('.empty-state');
    check((await page.textContent('.empty-state')).includes('찾을 수 없어요'), '없는 개념 안내');
    await shot(page, '06-concepts');
  }

  console.log('== 예전 저장 데이터 호환');
  const old = await browser.newContext({ viewport: { width: 1360, height: 900 } });
  await old.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    // 힌트·주제 표시 필드가 생기기 전 형식
    localStorage.setItem('recall-state-v1', JSON.stringify({
      version: 1, lang: 'cpp',
      problems: {
        'daily-2026-11-10-1': { status: 'solved', statusAt: '2026-11-11T00:00:00.000Z', solvedAt: '2026-11-11T00:00:00.000Z', drafts: { python: '# 예전 초안\n' }, attempts: [{ at: '2026-11-11T00:00:00.000Z', lang: 'python', passed: 4, total: 4, verdict: 'pass' }] },
        bfs: { status: 'review', drafts: {}, attempts: [] },
      },
    }));
  });
  const op = await old.newPage();
  op.on('pageerror', (e2) => errors.push(`[old] ${e2}`));
  await op.goto(base);
  await op.waitForSelector('.problem-row');
  check((await op.textContent('.problem-row[data-id="daily-2026-11-10-1"] .status')).trim() === '해결' && (await op.textContent('.problem-row[data-id="bfs"] .status')).trim() === '복습 필요', '예전 상태 그대로 표시');
  check(await op.isVisible('.problem-row[data-id="daily-2026-11-10-1"] .tag-topic') && await op.isVisible('.problem-row[data-id="bfs"] .tag-hidden'), '예전 데이터: 해결한 문제만 주제 표시');
  check(await op.$$eval('.badge-hint', (e) => e.length) === 0 && !(await op.isChecked('#show-topics')), '예전 데이터: 힌트 배지 없음, 토글 꺼짐');
  await op.goto(`${base}#p/daily-2026-11-10-1`);
  await op.waitForSelector('.CodeMirror');
  check(await op.$eval('.lang-tabs [data-lang="cpp"]', (b) => b.getAttribute('aria-selected')) === 'true', '예전 언어 선택 유지');
  await op.click('.lang-tabs [data-lang="python"]');
  check((await op.evaluate(() => document.querySelector('.CodeMirror').CodeMirror.getValue())) === '# 예전 초안\n', '예전 초안 유지');
  await op.goto(`${base}#p/bfs`);
  await op.waitForSelector('#hint-next');
  await op.click('#hint-next');
  await op.click('#hint-yes');
  const ob = await op.evaluate(() => JSON.parse(localStorage.getItem('recall-state-v1')).problems.bfs);
  check(ob.hintUsed === true && ob.hintLevel === 1 && ob.status === 'review' && Array.isArray(ob.attempts), '예전 항목에 힌트 필드 추가');
  await old.close();

  console.log('== 모바일 폭(390px)');
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await m.route('https://wandbox.org/api/compile.json', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeWandbox(JSON.parse(route.request().postData()))) }));
  const mp = await m.newPage();
  mp.on('pageerror', (e2) => errors.push(String(e2)));
  await mp.goto(base);
  await mp.waitForSelector('.problem-row');
  const noScroll = async () => mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  check(await noScroll(), '보관함 가로 스크롤 없음');
  const sb = await mp.$eval('.sidebar', (el) => { const r = el.getBoundingClientRect(); return { h: r.height, w: r.width }; });
  check(sb.h < 80 && sb.w >= 389, '사이드바가 상단 바로 접힘', JSON.stringify(sb));
  await shot(mp, '03-mobile-archive');
  await mp.goto(`${base}#p/daily-2026-11-11-3`);
  await mp.waitForSelector('.CodeMirror');
  check(await noScroll(), '풀이 화면 가로 스크롤 없음');
  const stacked = await mp.evaluate(() => document.querySelector('.statement').getBoundingClientRect().bottom <= document.querySelector('.workbench').getBoundingClientRect().top);
  check(stacked, '문제/에디터 위아래로 쌓임');
  await mp.evaluate(() => document.querySelector('.CodeMirror').CodeMirror.setValue('print(0)\n'));
  await mp.click('#run-all');
  await mp.waitForFunction(() => !document.querySelector('#run-all').disabled && document.querySelector('.score strong'), null, { timeout: 60000 });
  await mp.click('.result-item summary');
  check(await noScroll(), '결과 펼쳐도 가로 스크롤 없음');
  await shot(mp, '04-mobile-solve');
  await mp.click('#hint-next');
  await mp.click('#hint-yes');
  await mp.click('#hint-next');
  check(await mp.$$eval('.hint-item', (e) => e.length) === 2 && await noScroll(), '모바일: 힌트 열기, 가로 스크롤 없음');
  const navBox = await mp.$eval('[data-nav="concepts"]', (el) => { const r = el.getBoundingClientRect(); return { right: r.right, w: window.innerWidth }; });
  check(navBox.right <= navBox.w, '모바일: 상단 바에 개념서 메뉴', JSON.stringify(navBox));
  await mp.click('[data-nav="concepts"]');
  await mp.waitForSelector('.concept-card');
  check(await noScroll(), '모바일: 개념서 목록 가로 스크롤 없음');
  await mp.click('.concept-card');
  await mp.waitForSelector('#c-items .api-table');
  check(await noScroll(), '모바일: 개념 상세 가로 스크롤 없음');
  check(await mp.$eval('.api-table thead', (el) => getComputedStyle(el).display) === 'none', '모바일: 함수 표를 카드처럼 쌓음');
  await shot(mp, '07-mobile-concept');
  await m.close();

  console.log('== 요청 제한(테스트용으로 3초에 3회로 줄임)');
  const rl = await browser.newContext();
  await rl.addInitScript(() => { window.__RECALL_RATE__ = { limit: 3, windowMs: 3000, penaltyMs: 1500 }; });
  const rlLog = [];
  const rlSeen = new Set();
  let rlMode = null;
  await rl.route('https://wandbox.org/api/compile.json', (route) => {
    const body = JSON.parse(route.request().postData());
    const key = `${body.compiler}|${body.stdin}`;
    const first = !rlSeen.has(key);
    rlSeen.add(key);
    rlLog.push({ t: Date.now(), key, status: rlMode === '429-once' && first ? 429 : 200 });
    if (rlMode === '429-once' && first) return route.fulfill({ status: 429, body: 'slow down' });
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeWandbox(body)) });
  });
  const rp = await rl.newPage();
  rp.on('pageerror', (e2) => errors.push(`[rate] ${e2}`));
  rp.on('console', (msg) => { if (msg.type() === 'error' && !/status of 429/.test(msg.text())) errors.push(`[rate] ${msg.text()}`); });
  await rp.goto(`${base}#p/daily-2026-11-12-1`);
  await rp.waitForSelector('.CodeMirror');
  await rp.evaluate((c) => document.querySelector('.CodeMirror').CodeMirror.setValue(c), PY_SOL('daily-2026-11-12-1'));
  let sawWait = false;
  const waitWatch = setInterval(async () => { try { if (await rp.$('.msg-wait') && await rp.$('.v-waiting')) sawWait = true; } catch { /* 닫힘 */ } }, 100);
  await rp.click('#run-all');
  await rp.waitForFunction(() => !document.querySelector('#run-all').disabled && document.querySelector('.score strong'), null, { timeout: 60000 });
  clearInterval(waitWatch);
  const maxIn = (log, ms) => Math.max(...log.map((a) => log.filter((b) => b.t >= a.t && b.t < a.t + ms).length));
  check(await rp.evaluate(() => document.querySelector('.score strong').classList.contains('pass-all')), '제한을 지키며 5개 모두 실행·통과');
  // 브라우저가 보낸 시각과 목이 받은 시각 사이의 흔들림(수십 ms)을 감안해 2.9초 구간으로 센다.
  // 실제 설정은 Wandbox 창(약 60초)보다 2초 넉넉한 62초다.
  const gaps = rlLog.slice(1).map((x, i) => x.t - rlLog[i].t).join(',');
  check(maxIn(rlLog, 2900) <= 3, '어느 3초 구간에도 요청 3개 이하', `요청 ${rlLog.length}개, 간격 ${gaps}ms`);
  check(sawWait, '기다리는 동안 "대기"와 안내 문구 표시');

  rlMode = '429-once';
  rlSeen.clear();
  rlLog.length = 0;
  await rp.evaluate(() => { try { localStorage.removeItem('recall-wandbox-log-v1'); } catch { /* */ } });
  await rp.click('.lang-tabs [data-lang="cpp"]');
  await rp.evaluate((c) => document.querySelector('.CodeMirror').CodeMirror.setValue(c), fs.readFileSync(path.join(ROOT, '.solutions', 'daily-2026-11-12-1.cpp'), 'utf8'));
  await rp.click('#run-all');
  await rp.waitForFunction(() => !document.querySelector('#run-all').disabled && document.querySelector('.score strong'), null, { timeout: 90000 });
  const firstRetry = rlLog.findIndex((x) => x.status === 200);
  const first429 = rlLog.find((x) => x.status === 429);
  check(await rp.evaluate(() => document.querySelector('.score strong').classList.contains('pass-all')), '429 뒤 기다렸다 1회 재시도해 모두 통과', `요청 ${rlLog.length}개`);
  check(rlLog.length === 10, '429는 테스트당 1회만 재시도');
  check(firstRetry > 0 && rlLog[firstRetry].t - first429.t >= 1400, '429 뒤 바로 다시 보내지 않음', `${firstRetry > 0 ? rlLog[firstRetry].t - first429.t : '?'}ms 뒤 재시도`);
  await rl.close();

  console.log('== 저장소를 쓸 수 없는 브라우저');
  const ns = await browser.newContext();
  await ns.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('denied'); } });
  });
  await ns.route('https://wandbox.org/api/compile.json', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeWandbox(JSON.parse(route.request().postData()))) }));
  const np = await ns.newPage();
  np.on('pageerror', (e2) => errors.push(`[no-storage] ${e2}`));
  await np.goto(`${base}#p/daily-2026-11-10-1`);
  await np.waitForSelector('.CodeMirror');
  check(await np.isVisible('.storage-warning'), '저장소 없음 안내');
  await np.evaluate((c) => document.querySelector('.CodeMirror').CodeMirror.setValue(c), PY_SOL('daily-2026-11-10-1'));
  await np.click('#run-all');
  await np.waitForFunction(() => document.querySelector('.score strong')?.classList.contains('pass-all'), null, { timeout: 60000 });
  check(true, '저장소 없이도 실행·채점');
  await ns.close();

  check(errors.length === 0, '페이지 오류 없음', errors.join(' | '));
  await browser.close();
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(failures ? `\n실패 ${failures}개` : '\n모두 통과');
  process.exit(failures ? 1 : 0);
})().catch((err) => { console.error(err); process.exit(1); });
