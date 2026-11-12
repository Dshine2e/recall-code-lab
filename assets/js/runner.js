// Wandbox(https://wandbox.org)로 코드를 실행하고 테스트를 채점한다. 서버 없이 브라우저에서 직접 호출한다.
// 전송하는 것은 코드와 표준 입력뿐이다.

export const WANDBOX_URL = 'https://wandbox.org/api/compile.json';
export const LANGS = {
  python: { label: 'Python', compiler: 'cpython-3.13.8', options: '', info: 'Python 3.13' },
  cpp: { label: 'C++', compiler: 'gcc-13.2.0', options: 'optimize,c++17', info: 'GCC 13.2 · C++17 · -O2' },
};
const REQUEST_TIMEOUT_MS = 25000;
const CONCURRENCY = 2;

/** 채점 규칙(tools/validate.py 와 같음): 줄마다 오른쪽 공백 제거, 끝의 빈 줄 무시 */
export function normalize(text) {
  const lines = String(text ?? '').replace(/\r\n/g, '\n').split('\n').map((l) => l.replace(/\s+$/, ''));
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

export function sameOutput(expected, actual) {
  const a = normalize(expected);
  const b = normalize(actual);
  return a.length === b.length && a.every((line, i) => line === b[i]);
}

/** 처음 달라지는 줄 번호(1부터). 같으면 0 */
export function firstDiffLine(expected, actual) {
  const a = normalize(expected);
  const b = normalize(actual);
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i += 1) if (a[i] !== b[i]) return i + 1;
  return 0;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Wandbox 요청 제한: 실측으로 IP당 약 1분에 10회, 넘으면 429(Retry-After 없음).
// 제한을 넘지 않도록 이 브라우저에서 보낸 요청 시각을 기록해 두고, 자리가 날 때까지 기다렸다 보낸다.
// (기록은 탭 사이에 공유하려고 localStorage에 두지만, 못 쓰면 메모리로만 동작한다.)
// globalThis.__RECALL_RATE__ 는 화면 테스트(tests/e2e.cjs)에서만 값을 줄이거나 늘리는 데 쓴다.
const RATE_OVERRIDE = globalThis.__RECALL_RATE__ || {};
export const RATE_LIMIT = RATE_OVERRIDE.limit ?? 10;
export const RATE_WINDOW_MS = RATE_OVERRIDE.windowMs ?? 62000;
const RATE_KEY = 'recall-wandbox-log-v1';
// 429를 받으면 이만큼 뒤에 한 자리가 나는 것으로 본다(실측 회복 약 15초)
const RATE_PENALTY_MS = RATE_OVERRIDE.penaltyMs ?? 15000;
let memLog = [];

function readLog() {
  try {
    const v = JSON.parse(localStorage.getItem(RATE_KEY) || '[]');
    if (Array.isArray(v)) return v.filter((t) => Number.isFinite(t));
  } catch { /* 저장소 없음 */ }
  return memLog.slice();
}
function writeLog(log) {
  memLog = log.slice();
  try { localStorage.setItem(RATE_KEY, JSON.stringify(log)); } catch { /* 저장소 없음 */ }
}
function liveLog(now) {
  return readLog().filter((t) => t > now - RATE_WINDOW_MS && t < now + RATE_WINDOW_MS);
}

/** 보낼 자리가 날 때까지 기다린다. 기다리는 동안 onWait(남은 초)를 부른다. */
async function acquireSlot(onWait) {
  let waited = false;
  for (;;) {
    const now = Date.now();
    const log = liveLog(now);
    if (log.length < RATE_LIMIT) {
      log.push(now);
      writeLog(log);
      return waited;
    }
    const waitMs = Math.max(200, Math.min(...log) + RATE_WINDOW_MS - now);
    waited = true;
    if (onWait) onWait(Math.ceil(waitMs / 1000));
    await sleep(Math.min(waitMs, 1000));
  }
}

/** 429를 받았을 때: 창을 가득 찬 것으로 기록해, 약 15초 뒤부터 6초에 한 번씩만 자리가 나게 한다. */
function markRateLimited() {
  const base = Date.now() - RATE_WINDOW_MS + RATE_PENALTY_MS;
  const step = Math.ceil(RATE_WINDOW_MS / RATE_LIMIT);
  writeLog(Array.from({ length: RATE_LIMIT }, (_, k) => base + k * step));
}

// Wandbox 실행 환경 자체의 오류(예: status 126 + "OCI runtime error: crun: clone: Resource temporarily unavailable").
// 사용자 코드가 낸 출력이 없고 오류 메시지가 컨테이너 런타임에서 온 경우만 해당한다.
const SANDBOX_FAILURE = /OCI runtime (create |exec )?(error|failed)|\b(crun|runc): |Resource temporarily unavailable/;
export function isSandboxFailure(data) {
  if (String(data.status) === '0' || data.program_output) return false;
  return SANDBOX_FAILURE.test(String(data.program_error || '')) || SANDBOX_FAILURE.test(String(data.compiler_error || ''));
}

/**
 * Wandbox 한 번 호출. 요청 제한(RATE_LIMIT/RATE_WINDOW_MS)을 지키도록 필요하면 먼저 기다린다.
 * 429/5xx/네트워크 오류/실행 서버 과부하는 1회 재시도.
 * hooks.onWait(남은 초): 제한 때문에 기다리는 중, hooks.onSend(): 실제로 보낼 때.
 * 반환: { kind: 'ok', data, ms } | { kind: 'timeout', ms } | { kind: 'service', message }
 */
export async function callWandbox(lang, code, stdin, hooks = {}) {
  const cfg = LANGS[lang];
  const body = JSON.stringify({ compiler: cfg.compiler, code, stdin: stdin ?? '', options: cfg.options, save: false });
  let lastMessage = '';
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await acquireSlot(hooks.onWait);
    if (hooks.onSend) hooks.onSend();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    const start = performance.now();
    let res;
    try {
      res = await fetch(WANDBOX_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: ctrl.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      if (ctrl.signal.aborted) return { kind: 'timeout', ms: performance.now() - start };
      lastMessage = '네트워크 오류';
      if (attempt === 0) { await sleep(1200); continue; }
      return { kind: 'service', message: lastMessage };
    }
    try {
      if (res.status === 429) {
        lastMessage = '요청이 많아 잠시 막혔어요(HTTP 429)';
        markRateLimited();
        if (attempt === 0) continue; // 자리가 날 때까지 acquireSlot이 기다린 뒤 1회 재시도
        return { kind: 'service', message: lastMessage };
      }
      if (res.status >= 500) {
        lastMessage = `HTTP ${res.status}`;
        if (attempt === 0) {
          const retryAfter = Number(res.headers.get('Retry-After'));
          await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 5) * 1000 : 1500);
          continue;
        }
        return { kind: 'service', message: lastMessage };
      }
      if (!res.ok) return { kind: 'service', message: `HTTP ${res.status}` };
      const data = await res.json();
      if (!data || typeof data !== 'object' || data.status === undefined) {
        return { kind: 'service', message: '알 수 없는 응답' };
      }
      if (isSandboxFailure(data)) {
        // 서버가 붐벼 실행 컨테이너를 못 띄운 경우. HTTP 200으로 오지만 코드 문제가 아니므로 5xx처럼 다룬다.
        lastMessage = '실행 서버가 붐벼요';
        if (attempt === 0) { await sleep(2000); continue; }
        return { kind: 'service', message: lastMessage };
      }
      return { kind: 'ok', data, ms: performance.now() - start };
    } catch (err) {
      if (ctrl.signal.aborted) return { kind: 'timeout', ms: performance.now() - start };
      return { kind: 'service', message: '응답을 읽지 못했어요' };
    } finally {
      clearTimeout(timer);
    }
  }
  return { kind: 'service', message: lastMessage || '알 수 없는 오류' };
}

const EXIT_HINT = {
  134: '프로그램이 비정상 종료됐어요(abort)',
  136: '산술 오류예요(0으로 나누기 등)',
  137: '강제로 종료됐어요(시간·메모리 제한 초과일 수 있어요)',
  139: '잘못된 메모리에 접근했어요(세그멘테이션 오류)',
};

/** Wandbox 응답 해석 */
export function interpret(data) {
  const status = String(data.status ?? '');
  const compilerError = String(data.compiler_error || '');
  const stdout = String(data.program_output || '');
  const stderr = String(data.program_error || '');
  const isCompileError = status !== '0' && /(^|\n)[^\n]*:\s*(fatal )?error:/.test(compilerError) && !stdout && !stderr;
  if (isCompileError) return { type: 'compile', compileError: compilerError, stdout, stderr };
  if (status !== '0' || data.signal) {
    const code = Number(status);
    const hint = EXIT_HINT[code] || (data.signal ? `시그널: ${data.signal}` : `종료 코드 ${status}`);
    return { type: 'error', stdout, stderr, exitInfo: `${hint} (종료 코드 ${status}${data.signal ? `, ${data.signal}` : ''})` };
  }
  return { type: 'ok', stdout, stderr };
}

/**
 * 전체 테스트 실행(동시 2개).
 * onUpdate(results) 는 결과가 바뀔 때마다 호출된다.
 * 결과 verdict: pass | fail | error | compile | timeout | service | skipped | pending | waiting | running
 */
export async function runTests(lang, code, tests, onUpdate) {
  const results = tests.map((t) => ({ label: t.label, verdict: 'pending', ms: null, stdout: '', stderr: '' }));
  let compileError = '';
  let next = 0;
  const notify = () => onUpdate && onUpdate(results.map((r) => ({ ...r })), compileError);

  async function worker() {
    while (next < tests.length) {
      const i = next;
      next += 1;
      if (compileError) { results[i].verdict = 'skipped'; notify(); continue; }
      const out = results[i];
      const r = await callWandbox(lang, code, tests[i].input, {
        onWait: (sec) => { out.verdict = 'waiting'; out.waitSec = sec; notify(); },
        onSend: () => { out.verdict = 'running'; delete out.waitSec; notify(); },
      });
      if (r.kind === 'service') {
        out.verdict = 'service';
        out.message = r.message;
      } else if (r.kind === 'timeout') {
        out.verdict = 'timeout';
        out.ms = r.ms;
      } else {
        out.ms = r.ms;
        const res = interpret(r.data);
        out.stdout = res.stdout;
        out.stderr = res.stderr;
        if (res.type === 'compile') {
          out.verdict = 'compile';
          compileError ||= res.compileError;
        } else if (res.type === 'error') {
          out.verdict = 'error';
          out.exitInfo = res.exitInfo;
        } else {
          out.verdict = sameOutput(tests[i].output, res.stdout) ? 'pass' : 'fail';
        }
      }
      notify();
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, tests.length) }, worker));
  if (compileError) {
    for (const r of results) if (r.verdict !== 'compile') r.verdict = 'skipped';
  }
  notify();
  const passed = results.filter((r) => r.verdict === 'pass').length;
  const serviceErrors = results.filter((r) => r.verdict === 'service').length;
  return { lang, passed, total: tests.length, serviceErrors, compileError, results };
}

/** 직접 입력으로 한 번 실행 */
export async function runCustom(lang, code, stdin, hooks = {}) {
  const r = await callWandbox(lang, code, stdin, hooks);
  if (r.kind !== 'ok') return r;
  return { kind: 'ok', ms: r.ms, ...interpret(r.data) };
}
