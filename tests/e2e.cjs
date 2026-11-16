// 화면 테스트: 로컬 서버(기본 http://localhost:3100)에서 문제 열람·가입·로그인·기록 저장을 확인한다.
//   1) PGLITE_DIR=.data/e2e npx next dev -p 3100      (빈 테스트 DB 로 서버 실행)
//   2) npm i --no-save playwright-core && node tests/e2e.cjs
// Wandbox 호출은 가로채서, 문제의 기대 출력을 그대로(또는 일부러 틀리게) 돌려준다.
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PW_PATH || 'playwright-core');

const BASE = process.env.BASE_URL || 'http://localhost:3100';
const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'problems/manifest.json'), 'utf8')).files;
const problems = manifest.flatMap((f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'problems', f), 'utf8')));
const concepts = JSON.parse(fs.readFileSync(path.join(ROOT, 'concepts/manifest.json'), 'utf8')).concepts;
const byId = new Map(problems.map((p) => [p.id, p]));
const pick = (diff, n) => problems.filter((p) => p.difficulty === diff && p.id.startsWith('seed-'))[n];
const P1 = pick('입문', 0), P2 = pick('기본', 0), P3 = pick('도전', 0), P4 = pick('기본', 1);

// 테스트용 계정(이 테스트 DB 에만 만든다)
const stamp = Date.now().toString(36);
const USER_A = { name: `e2e_a_${stamp}`, pw: `pw-${stamp}-Aa1!` };
const USER_B = { name: `e2e_b_${stamp}`, pw: `pw-${stamp}-Bb2!` };

let passed = 0;
const failures = [];
function check(name, cond, extra = '') {
  if (cond) passed += 1;
  else failures.push(`${name}${extra ? ` — ${extra}` : ''}`);
  console.log(`${cond ? '  ok ' : 'FAIL '} ${name}${cond || !extra ? '' : ` — ${extra}`}`);
}

let wandboxMode = 'pass';
async function mockWandbox(context) {
  await context.route('https://wandbox.org/api/compile.json', async (route) => {
    const body = JSON.parse(route.request().postData() || '{}');
    const t = problems.flatMap((p) => p.tests).find((x) => x.input === body.stdin);
    const out = wandboxMode === 'pass' && t ? t.output : 'wrong\n';
    await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ status: '0', program_output: out, program_error: '', compiler_error: '' }) });
  });
}

const statusOf = (page) => page.$eval('#current-status [data-status]', (e) => e.dataset.status);
async function openProblem(page, id) {
  await page.goto(`${BASE}/problems/${id}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.cm-content');
}
async function grade(page) {
  await page.click('#run-tests');
  await page.waitForSelector('#summary', { timeout: 60000 });
  await page.waitForFunction(() => !document.querySelector('#run-tests').disabled, null, { timeout: 60000 });
}
async function auth(page, mode, user, confirm) {
  await page.fill('#username', user.name);
  await page.fill('#password', user.pw);
  if (mode === 'signup') await page.fill('#confirm', confirm ?? user.pw);
  await page.click('form button[type=submit]');
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const errors = [];
  const newContext = async () => {
    const c = await browser.newContext({ viewport: { width: 1360, height: 900 } });
    await mockWandbox(c);
    const p = await c.newPage();
    p.on('pageerror', (e) => errors.push(String(e)));
    p.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errors.push(m.text()); });
    return { c, p };
  };

  console.log('[1] 로그인 없이 열람');
  let { c: ctx, p: page } = await newContext();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  check('목록에 모든 문제가 보인다', (await page.$$('.problem-row')).length === problems.length, `${(await page.$$('.problem-row')).length}/${problems.length}`);
  check('주제는 기본으로 숨긴다', (await page.$$('.problem-row .tag-hidden')).length === problems.length);
  check('로그인 전에는 상태 필터를 못 쓴다', await page.$eval('[data-filter-status="solved"]', (e) => e.disabled));
  await page.check('#show-topics');
  check('주제 표시 토글', (await page.$$('.problem-row .tag-hidden')).length === 0);
  await page.uncheck('#show-topics');
  await page.click('[data-difficulty="도전"]');
  check('난이도 필터', (await page.$$('.problem-row')).length === problems.filter((p) => p.difficulty === '도전').length);
  await openProblem(page, P1.id);
  check('문제 제목', (await page.textContent('h1')).trim() === P1.title);
  check('로그인 전에는 기록 양식 대신 안내가 보인다', !(await page.$('#save-record')) && /로그인/.test(await page.textContent('#record')));
  await page.click('#hint-next');
  check('로그인 전 힌트는 확인 없이 열린다', (await page.$$('.hint-item')).length === 1);
  await grade(page);
  check('로그인 전에도 채점된다', /모두 통과/.test(await page.textContent('#summary')));
  const res404 = await page.goto(`${BASE}/problems/no-such-problem`);
  check('없는 문제는 404', res404.status() === 404);
  const meRes = await page.goto(`${BASE}/me`, { waitUntil: 'networkidle' });
  check('마이페이지는 로그인으로 보낸다', new URL(page.url()).pathname === '/login', page.url());

  console.log('[2] 회원가입');
  await page.goto(`${BASE}/signup?next=${encodeURIComponent(`/problems/${P1.id}`)}`, { waitUntil: 'networkidle' });
  await page.fill('#username', 'Bad Name!');
  await page.waitForFunction(() => /소문자/.test(document.querySelector('#username-hint').textContent));
  check('아이디 형식 안내', true);
  await auth(page, 'signup', USER_A, 'different-password');
  await page.waitForSelector('#form-error');
  check('비밀번호 확인 불일치', /서로 달라요/.test(await page.textContent('#form-error')));
  await page.fill('#password', 'short');
  check('8자 미만은 브라우저가 막는다', await page.$eval('#password', (e) => !e.checkValidity()));
  const shortRes = await page.evaluate(async () => {
    // 브라우저 검사를 끄고 보내도 서버가 막는지 확인
    document.querySelectorAll('input').forEach((i) => { i.removeAttribute('minlength'); i.removeAttribute('required'); });
    document.querySelector('#confirm').value = 'short';
    document.querySelector('form button[type=submit]').click();
  });
  await page.waitForFunction(() => /8자 이상/.test(document.querySelector('#form-error')?.textContent || ''));
  check('8자 미만은 서버도 막는다', true);
  await page.goto(`${BASE}/signup?next=${encodeURIComponent(`/problems/${P1.id}`)}`, { waitUntil: 'networkidle' });
  await auth(page, 'signup', USER_A);
  await page.waitForURL(`**/problems/${P1.id}`);
  check('가입하면 바로 로그인되고 보던 문제로 돌아간다', (await page.textContent('[data-testid=whoami]')) === USER_A.name);
  const cookies = await ctx.cookies();
  const session = cookies.find((k) => /session-token/.test(k.name));
  check('세션 쿠키는 httpOnly', Boolean(session && session.httpOnly));

  console.log('[3] 풀이 기록');
  await page.waitForSelector('.cm-content');
  check('처음 상태는 안 풂', (await statusOf(page)) === 'untried');
  wandboxMode = 'fail';
  await grade(page);
  check('틀리면 시도함', (await statusOf(page)) === 'attempted');
  check('오답 표시', (await page.$$('#results [data-verdict="fail"]')).length === P1.tests.length);
  wandboxMode = 'pass';
  await grade(page);
  check('모두 통과하면 해결', (await statusOf(page)) === 'solved');
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
  check('해결 날짜는 오늘(KST)', (await page.inputValue('#solved-on')) === today, await page.inputValue('#solved-on'));
  await page.fill('#minutes', '17');
  await page.fill('#memo', '경계값 주의 <b>메모</b>');
  await page.click('#save-record');
  await page.waitForFunction(() => /저장했어요/.test(document.querySelector('#record-msg').textContent));
  await page.click('.cm-content');
  await page.keyboard.press('Control+End');
  await page.keyboard.type('\n# e2e-marker');
  await page.waitForFunction(() => /코드 저장됨/.test(document.querySelector('#save-state').textContent), null, { timeout: 15000 });
  check('코드 자동 저장', true);

  await openProblem(page, P2.id);
  await page.click('#hint-next');
  check('힌트 확인 문구', /다시 풀기/.test(await page.textContent('#hint-confirm-text')));
  await page.click('#hint-no');
  check('취소하면 상태가 그대로', (await statusOf(page)) === 'untried' && (await page.$$('.hint-item')).length === 0);
  await page.click('#hint-next');
  await page.click('#hint-yes');
  await page.waitForSelector('.hint-item');
  check('힌트를 열면 다시 풀기', (await statusOf(page)) === 'retry');
  check('힌트를 열면 관련 개념이 보인다', (await page.$$('#related-concepts .concept-chip')).length > 0);
  await grade(page);
  check('힌트를 쓰고 통과하면 다시 풀기 그대로', (await statusOf(page)) === 'retry' && /힌트를 사용해서/.test(await page.textContent('#notice')));
  await page.click('#hint-clear');
  await page.waitForFunction(() => document.querySelector('#current-status [data-status]').dataset.status === 'solved');
  check('"힌트 없이 다시 풀었어요" → 해결', true);

  await openProblem(page, P3.id);
  await page.click('#status-switch [data-status="retry"]');
  await page.click('#save-record');
  await page.waitForFunction(() => document.querySelector('#current-status [data-status]').dataset.status === 'retry');
  check('상태를 직접 바꿀 수 있다', true);
  await openProblem(page, P4.id);
  wandboxMode = 'fail';
  await grade(page);
  wandboxMode = 'pass';
  check('네 번째 문제는 시도함', (await statusOf(page)) === 'attempted');

  console.log('[4] 다른 기기에서 로그인');
  const second = await newContext();
  const page2 = second.p;
  await page2.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await auth(page2, 'login', { name: USER_A.name.toUpperCase(), pw: USER_A.pw });
  await page2.waitForURL(`${BASE}/`);
  await page2.waitForSelector('.problem-row');
  const rowStatus = (p, id) => p.$eval(`.problem-row[data-id="${id}"] [data-status]`, (e) => e.dataset.status);
  check('목록에 내 상태가 보인다', (await rowStatus(page2, P1.id)) === 'solved' && (await rowStatus(page2, P2.id)) === 'solved' && (await rowStatus(page2, P3.id)) === 'retry' && (await rowStatus(page2, P4.id)) === 'attempted');
  await page2.click('[data-filter-status="solved"]');
  check('상태 필터: 해결', (await page2.$$('.problem-row')).length === 2);
  await page2.click('[data-filter-status="untried"]');
  check('상태 필터: 안 풂', (await page2.$$('.problem-row')).length === problems.length - 4);
  check('해결한 문제는 주제가 보인다', true === await (async () => { await page2.click('[data-filter-status="solved"]'); return (await page2.$$('.problem-row .tag-hidden')).length === 0; })());
  await openProblem(page2, P1.id);
  check('다른 기기에서도 걸린 시간·메모가 같다', (await page2.inputValue('#minutes')) === '17' && (await page2.inputValue('#memo')) === '경계값 주의 <b>메모</b>');
  check('다른 기기에서도 내 코드가 같다', /# e2e-marker/.test(await page2.textContent('.cm-content')));
  await page2.goto(`${BASE}/me`, { waitUntil: 'networkidle' });
  const stat = (s) => page2.$eval(`[data-stat="${s}"] .text-2xl`, (e) => Number(e.textContent));
  check('마이페이지 상태별 수', (await stat('solved')) === 2 && (await stat('retry')) === 1 && (await stat('attempted')) === 1 && (await stat('untried')) === problems.length - 4);
  const diffText = await page2.textContent('[data-difficulty="입문"]');
  check('마이페이지 난이도별 통계', diffText.includes(`1 / ${problems.filter((p) => p.difficulty === '입문').length}`), diffText);
  check('마이페이지 최근 기록 4개', (await page2.$$('#recent li')).length === 4);

  console.log('[5] 권한');
  const third = await newContext();
  const page3 = third.p;
  await page3.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });
  await page3.fill('#username', USER_A.name);
  await page3.waitForFunction(() => /이미 쓰고 있는/.test(document.querySelector('#username-hint').textContent));
  check('아이디 중복 확인(입력 중)', true);
  await auth(page3, 'signup', { name: USER_A.name, pw: USER_B.pw });
  await page3.waitForSelector('#form-error');
  check('중복 아이디는 가입 불가', /이미 쓰고 있는/.test(await page3.textContent('#form-error')));
  await page3.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });
  await auth(page3, 'signup', USER_B);
  await page3.waitForURL(`${BASE}/`);
  await page3.waitForSelector('.problem-row');
  check('다른 사용자는 남의 기록을 보지 못한다', (await page3.$$('.problem-row [data-status]:not([data-status="untried"])')).length === 0);
  await openProblem(page3, P1.id);
  check('다른 사용자의 문제 화면은 빈 기록', (await statusOf(page3)) === 'untried' && (await page3.inputValue('#memo')) === '' && !/e2e-marker/.test(await page3.textContent('.cm-content')));
  // 로그아웃한 탭에서 저장을 시도하면 서버가 거절한다.
  await openProblem(page, P1.id);
  await ctx.clearCookies();
  await page.fill('#memo', '세션 없이 저장 시도');
  await page.click('#save-record');
  await page.waitForSelector('#action-error');
  check('세션이 없으면 서버가 저장을 거절한다', /로그인이 필요/.test(await page.textContent('#action-error')));
  await openProblem(page2, P1.id);
  check('거절된 저장은 반영되지 않았다', (await page2.inputValue('#memo')) === '경계값 주의 <b>메모</b>');

  console.log('[6] 로그아웃과 로그인 시도 제한');
  await page2.click('header form button');
  await page2.waitForSelector('a[href="/login"]');
  check('로그아웃', !(await page2.$('[data-testid=whoami]')));
  await page2.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  let lastError = '';
  for (let i = 0; i < 6; i += 1) {
    await auth(page2, 'login', { name: USER_A.name, pw: `wrong-password-${i}` });
    await page2.waitForFunction((n) => document.querySelector('#form-error') && document.querySelector('form button[type=submit]').textContent === '로그인', i);
    lastError = await page2.textContent('#form-error');
    if (i === 0) check('틀린 비밀번호 안내는 아이디 존재 여부를 알려 주지 않는다', /아이디 또는 비밀번호/.test(lastError));
  }
  check('5번 틀리면 잠시 막힌다', /시도가 너무 많아요/.test(lastError), lastError);
  await auth(page2, 'login', USER_A);
  await page2.waitForFunction(() => document.querySelector('form button[type=submit]').textContent === '로그인');
  check('막힌 동안에는 맞는 비밀번호도 거절', /시도가 너무 많아요/.test(await page2.textContent('#form-error')) && new URL(page2.url()).pathname === '/login');

  console.log('[7] 개념서와 모바일');
  await page3.goto(`${BASE}/concepts`, { waitUntil: 'networkidle' });
  check('개념서 목록', (await page3.$$('.concept-card')).length === concepts.length);
  await page3.fill('#c-q', '힙');
  check('개념서 검색', (await page3.$$('.concept-card')).length >= 1 && (await page3.$$('.concept-card')).length < concepts.length);
  await page3.goto(`${BASE}/concepts/heap`, { waitUntil: 'networkidle' });
  check('개념 상세 7개 구역', (await page3.$$('.concept-section')).length === 7);
  await page3.click('.lang-tabs [data-lang="cpp"]');
  check('C++ 전환', /#include/.test(await page3.textContent('#c-examples pre.code')));
  await page3.click('.lang-tabs [data-lang="python"]');
  const nf = await page3.goto(`${BASE}/concepts/..%2Fproblems%2Fmanifest`);
  check('목록에 없는 개념은 404', nf.status() === 404);
  await page3.setViewportSize({ width: 390, height: 800 });
  for (const url of ['/', `/problems/${P2.id}`, '/concepts/heap', '/me']) {
    await page3.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });
    const overflow = await page3.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(`모바일 390px 가로 넘침 없음 ${url}`, overflow <= 0, `${overflow}px`);
  }
  if (process.argv[2]) {
    await page3.setViewportSize({ width: 1360, height: 900 });
    for (const [name, url] of [['home', '/'], ['problem', `/problems/${P1.id}`], ['me', '/me'], ['concept', '/concepts/heap']]) {
      await page3.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });
      await page3.waitForTimeout(600);
      await page3.screenshot({ path: path.join(process.argv[2], `next-${name}.png`), fullPage: true });
    }
  }

  check('콘솔 오류 없음', errors.length === 0, errors.slice(0, 3).join(' | '));
  await browser.close();
  console.log(`\n${passed}개 통과, ${failures.length}개 실패`);
  if (failures.length) { console.log(failures.map((f) => ` - ${f}`).join('\n')); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
