// localStorage('recall-state-v1') 저장소. 저장소를 못 써도 메모리로 동작한다.
//
// 형식:
// {
//   version: 1,
//   lang: 'python' | 'cpp',                       // 마지막으로 고른 언어
//   problems: {
//     [id]: {
//       status: 'unsolved' | 'review' | 'solved',
//       statusAt: ISO,                             // 상태를 바꾼 시각
//       solvedAt: ISO,                             // 처음 해결한 시각
//       drafts: { python?: string, cpp?: string }, // 코드 초안
//       lastResult: { at, lang, passed, total, serviceErrors, compileError, results: [...] },
//       attempts: [{ at, lang, passed, total, verdict: 'pass'|'fail'|'compile' }]  // 최근 50개, 나중에 오답 노트/복습에 쓴다
//     }
//   }
// }

const KEY = 'recall-state-v1';
const MAX_ATTEMPTS = 50;
const MAX_SAVED_OUTPUT = 4000;
export const STATUS_LABEL = { unsolved: '미풀이', review: '복습 필요', solved: '해결' };

let persistent = true;
let state = load();

function empty() {
  return { version: 1, lang: 'python', problems: {} };
}

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    // 쓰기가 되는지도 확인한다(사파리 사생활 보호 모드 등).
    window.localStorage.setItem(`${KEY}-probe`, '1');
    window.localStorage.removeItem(`${KEY}-probe`);
    if (!raw) return empty();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return empty();
    if (!parsed.problems || typeof parsed.problems !== 'object') parsed.problems = {};
    parsed.lang = parsed.lang === 'cpp' ? 'cpp' : 'python';
    parsed.version = 1;
    return parsed;
  } catch {
    persistent = false;
    return empty();
  }
}

function save() {
  if (!persistent) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // 용량이 부족하면 오래된 실행 결과의 출력부터 덜어 내고 한 번 더 시도한다.
    try {
      for (const p of Object.values(state.problems)) {
        if (p.lastResult) p.lastResult.results = (p.lastResult.results || []).map((r) => ({ ...r, stdout: '', stderr: '' }));
      }
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      persistent = false;
    }
  }
}

export function isPersistent() {
  return persistent;
}

function entry(id) {
  if (!state.problems[id]) state.problems[id] = { status: 'unsolved', drafts: {}, attempts: [] };
  const e = state.problems[id];
  e.drafts ||= {};
  e.attempts ||= [];
  return e;
}

export function getStatus(id) {
  const s = state.problems[id]?.status;
  return s === 'review' || s === 'solved' ? s : 'unsolved';
}

export function setStatus(id, status) {
  const e = entry(id);
  if (e.status === status) return;
  e.status = status;
  e.statusAt = new Date().toISOString();
  if (status === 'solved' && !e.solvedAt) e.solvedAt = e.statusAt;
  save();
}

export function getLang() {
  return state.lang === 'cpp' ? 'cpp' : 'python';
}

export function setLang(lang) {
  state.lang = lang === 'cpp' ? 'cpp' : 'python';
  save();
}

export function getDraft(id, lang) {
  const d = state.problems[id]?.drafts?.[lang];
  return typeof d === 'string' ? d : null;
}

export function setDraft(id, lang, code) {
  const e = entry(id);
  if (e.drafts[lang] === code) return;
  e.drafts[lang] = code;
  save();
}

export function clearDraft(id, lang) {
  const e = state.problems[id];
  if (e?.drafts && lang in e.drafts) {
    delete e.drafts[lang];
    save();
  }
}

export function getLastResult(id) {
  return state.problems[id]?.lastResult || null;
}

export function setLastResult(id, result) {
  const e = entry(id);
  const trim = (s) => (typeof s === 'string' && s.length > MAX_SAVED_OUTPUT ? `${s.slice(0, MAX_SAVED_OUTPUT)}\n…(저장 시 잘림)` : s);
  e.lastResult = {
    ...result,
    compileError: trim(result.compileError || ''),
    results: (result.results || []).map((r) => ({ ...r, stdout: trim(r.stdout || ''), stderr: trim(r.stderr || '') })),
  };
  save();
}

export function addAttempt(id, attempt) {
  const e = entry(id);
  e.attempts.push(attempt);
  if (e.attempts.length > MAX_ATTEMPTS) e.attempts.splice(0, e.attempts.length - MAX_ATTEMPTS);
  save();
}

export function counts(ids) {
  const out = { unsolved: 0, review: 0, solved: 0 };
  for (const id of ids) out[getStatus(id)] += 1;
  return out;
}
