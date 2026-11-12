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
  await ctx.route('https://wandbox.org/api/compile.json', async (route) => {
    const body = JSON.parse(route.request().postData());
    mock.calls.push(body);
    if (mock.failMode === '503') return route.fulfill({ status: 503, body: 'down' });
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
  const firstRow = await page.textContent('.problem-row');
  check(/약 \d+분/.test(firstRow) && /문법 ·/.test(firstRow), '행에 문법·소요 시간 표시');
  check(await page.isVisible('.problem-row .badge.diff-입문, .problem-row .badge.diff-기본'), '난이도 배지');
  await shot(page, '01-archive');

  const count = async () => page.$$eval('.problem-row', (e) => e.length);
  await page.selectOption('#f-category', '기본기');
  check(await count() === 8, '유형 필터: 기본기 8개');
  await page.selectOption('#f-category', '');
  await page.fill('#f-q', '이분');
  check(await count() === 1, '검색: "이분" → 1개');
  await page.fill('#f-q', 'long long');
  check(await count() >= 1, '검색: 문법 텍스트');
  await page.fill('#f-q', '');
  await page.selectOption('#f-difficulty', '입문');
  const intro = await count();
  check(intro >= 5, '난이도 필터: 입문', `${intro}개`);
  await page.selectOption('#f-topic', { index: 1 });
  check((await count()) <= intro, '알고리즘 필터 동작');
  await page.click('#reset-filters');
  check(await count() === rows.length, '필터 초기화');
  await page.selectOption('#f-syntax', 'append 인자');
  check(await count() === 1, '문법 유형 필터: append 인자 → bfs');
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
  check(await page.$$eval('.meta-chip', (e) => e.length) === 5, '메타 칩 5개');
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
  check(await page.$eval('#status-switch [data-status="solved"]', (b) => b.getAttribute('aria-pressed')) === 'true', '전부 통과 → 상태 "해결"');
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
  mock.failMode = null;

  console.log('== 처음 코드로 되돌리기');
  await page.click('#reset-code');
  const reset = await page.evaluate(() => document.querySelector('.CodeMirror').CodeMirror.getValue());
  check(reset === '# 표준 입력을 읽고 결과를 출력하세요.\n', '시작 코드로 복원');

  console.log('== 기본기 문제(짧은 형식, 버그 있는 시작 코드)');
  await page.goto(`${base}#p/bfs`);
  await page.waitForSelector('.CodeMirror');
  check(await page.$$eval('.statement h2', (e) => e.map((x) => x.textContent).join()) === '예제', '본문만 있는 형식 렌더링');
  check(await page.$$eval('.meta-chip', (e) => e.length) === 5, '필드로 메타 칩 구성');
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
  await m.close();

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
