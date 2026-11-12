import { loadProblems, parseDescription, paragraphs, syntaxTokens } from './data.js';
import * as store from './store.js';
import { LANGS, runTests, runCustom, firstDiffLine } from './runner.js';
import { esc, fmtMs, fmtWhen, clip, toast, copyText, debounce } from './util.js';

const viewEl = document.getElementById('view');
const crumbEl = document.getElementById('breadcrumb');
const STATUS_LABEL = store.STATUS_LABEL;
const CATEGORY_ORDER = ['기초 문법', '알고리즘', '백준형', '기본기'];
const DIFFS = ['입문', '기본', '도전'];
const SHOW_OUTPUT = 20000;

let DATA = null;
let cleanup = null;
const filters = { q: '', difficulty: '', topic: '', syntax: '', status: '', category: '' };

// ------------------------------------------------------------------ 부팅과 라우팅

async function boot() {
  try {
    DATA = await loadProblems();
  } catch (err) {
    setCrumb([{ label: '문제 보관함' }]);
    viewEl.innerHTML = `
      <div class="empty-state">
        <p>문제를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
        <p class="muted">${esc(err.message || err)}</p>
        <button class="btn" type="button" id="retry">다시 불러오기</button>
      </div>`;
    viewEl.querySelector('#retry').addEventListener('click', () => { viewEl.innerHTML = '<div class="loading">문제를 불러오는 중이에요…</div>'; boot(); });
    return;
  }
  window.addEventListener('hashchange', route);
  route();
}

function route() {
  if (cleanup) { cleanup(); cleanup = null; }
  const m = location.hash.match(/^#p\/(.+)$/);
  if (m) renderProblem(decodeURIComponent(m[1]));
  else renderArchive();
  window.scrollTo(0, 0);
}

function setCrumb(items) {
  const parts = [{ label: 'recall', href: '#' }, ...items];
  crumbEl.innerHTML = parts.map((p, i) => {
    const last = i === parts.length - 1;
    const node = last
      ? `<span class="current" aria-current="page">${esc(p.label)}</span>`
      : `<a href="${p.href || '#'}">${esc(p.label)}</a>`;
    return (i ? '<span class="sep" aria-hidden="true">›</span>' : '') + node;
  }).join('');
  document.title = items.length ? `${items[items.length - 1].label} · recall` : 'recall · 코딩테스트 복습실';
}

function diffBadge(d) {
  return `<span class="badge diff-${esc(d)}">${esc(d)}</span>`;
}

function statusBadge(status) {
  return `<span class="badge status status-${status}">${STATUS_LABEL[status]}</span>`;
}

function storageWarning() {
  return store.isPersistent() ? '' : '<div class="msg msg-service storage-warning">이 브라우저에서는 저장소를 쓸 수 없어서, 코드와 풀이 기록이 새로고침하면 사라져요.</div>';
}

// ------------------------------------------------------------------ 문제 보관함

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ko'));
}

function matches(p) {
  if (filters.difficulty && p.difficulty !== filters.difficulty) return false;
  if (filters.topic && p.topic !== filters.topic) return false;
  if (filters.syntax && !syntaxTokens(p.syntax).includes(filters.syntax)) return false;
  if (filters.category && p.category !== filters.category) return false;
  if (filters.status && store.getStatus(p.id) !== filters.status) return false;
  const q = filters.q.trim().toLowerCase();
  if (q) {
    const hay = `${p.title} ${p.topic} ${p.syntax}`.toLowerCase();
    if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
  }
  return true;
}

function renderArchive() {
  setCrumb([{ label: '문제 보관함' }]);
  const all = DATA.list;
  const c = store.counts(all.map((p) => p.id));
  const latest = all.find((p) => p.addedOn)?.addedOn;
  const topics = uniqueSorted(all.map((p) => p.topic));
  const syntaxes = uniqueSorted(all.flatMap((p) => syntaxTokens(p.syntax)));
  const cats = CATEGORY_ORDER.filter((cat) => all.some((p) => p.category === cat));
  const opt = (value, label, current) => `<option value="${esc(value)}"${value === current ? ' selected' : ''}>${esc(label)}</option>`;
  const select = (key, label, options) => `
    <div class="field">
      <label for="f-${key}">${label}</label>
      <select class="select" id="f-${key}" data-filter="${key}">
        ${opt('', '전체', filters[key])}
        ${options.map(([v, l]) => opt(v, l, filters[key])).join('')}
      </select>
    </div>`;

  viewEl.innerHTML = `
    ${storageWarning()}
    <div class="page-head">
      <div>
        <h1>문제 보관함</h1>
        <p>매일 새벽 3시, 새 문제 3개가 도착해요.${latest ? ` 가장 최근 문제는 ${esc(latest)}에 왔어요.` : ''}</p>
      </div>
      <div class="archive-stats">
        <span class="stat-chip">해결<b>${c.solved}</b></span>
        <span class="stat-chip">복습 필요<b>${c.review}</b></span>
        <span class="stat-chip">미풀이<b>${c.unsolved}</b></span>
      </div>
    </div>
    ${DATA.failed.length ? `<div class="msg msg-service storage-warning">일부 문제 파일을 읽지 못했어요: ${esc(DATA.failed.join(', '))}</div>` : ''}
    <form class="card filters" role="search" id="filters">
      <div class="field field-search">
        <label for="f-q">검색</label>
        <input class="input" id="f-q" type="search" data-filter="q" placeholder="제목, 주제, 문법으로 찾기" value="${esc(filters.q)}" autocomplete="off">
      </div>
      ${select('difficulty', '난이도', DIFFS.map((d) => [d, d]))}
      ${select('topic', '알고리즘', topics.map((t) => [t, t]))}
      ${select('syntax', '문법 유형', syntaxes.map((s) => [s, s]))}
      ${select('status', '풀이 여부', [['unsolved', '미풀이'], ['review', '복습 필요'], ['solved', '해결']])}
      ${select('category', '새벽 문제 유형', cats.map((cat) => [cat, cat]))}
    </form>
    <div class="list-bar">
      <span id="count"></span>
      <button class="btn btn-sm btn-ghost" type="button" id="reset-filters">필터 초기화</button>
    </div>
    <div id="list"></div>`;

  const form = viewEl.querySelector('#filters');
  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('input', (e) => {
    const key = e.target.dataset.filter;
    if (!key) return;
    filters[key] = e.target.value;
    drawList();
  });
  viewEl.querySelector('#reset-filters').addEventListener('click', resetFilters);

  function resetFilters() {
    Object.keys(filters).forEach((k) => { filters[k] = ''; });
    form.querySelectorAll('[data-filter]').forEach((el) => { el.value = ''; });
    drawList();
  }

  function drawList() {
    const shown = all.filter(matches);
    const active = Object.values(filters).some((v) => v);
    viewEl.querySelector('#count').innerHTML = active
      ? `총 <strong>${all.length}</strong>개 문제 중 <strong>${shown.length}</strong>개`
      : `총 <strong>${all.length}</strong>개 문제`;
    viewEl.querySelector('#reset-filters').hidden = !active;
    const listEl = viewEl.querySelector('#list');
    if (!shown.length) {
      listEl.innerHTML = `
        <div class="card empty-state">
          <p>조건에 맞는 문제가 없어요.</p>
          <button class="btn" type="button" data-reset>필터 초기화</button>
        </div>`;
      listEl.querySelector('[data-reset]').addEventListener('click', resetFilters);
      return;
    }
    listEl.innerHTML = `<ul class="card problem-list">${shown.map(rowHtml).join('')}</ul>`;
  }
  drawList();
}

function rowHtml(p) {
  const status = store.getStatus(p.id);
  return `
    <li class="problem-row" data-id="${esc(p.id)}">
      <a class="problem-link" href="#p/${encodeURIComponent(p.id)}">
        <div>
          <div class="problem-title">${esc(p.title)}</div>
          <div class="problem-tags">
            <span class="tag">${esc(p.topic)}</span>
            <span class="tag tag-cat">${esc(p.category)}</span>
          </div>
          <div class="problem-meta">
            <span>${p.addedOn ? esc(p.addedOn) : '기본기'}</span>
            <span>문법 · ${esc(p.syntax)}</span>
            <span>약 ${esc(p.minutes)}분</span>
          </div>
        </div>
        <div class="problem-side">
          ${diffBadge(p.difficulty)}
          ${statusBadge(status)}
        </div>
      </a>
    </li>`;
}

// ------------------------------------------------------------------ 풀이 화면

function statementHtml(p) {
  const d = parseDescription(p.description);
  const metaFromFields = [
    { key: '유형', value: p.category },
    { key: '알고리즘 주제', value: p.topic },
    { key: '핵심 문법', value: p.syntax },
    { key: '난이도', value: p.difficulty },
    { key: '예상 풀이 시간', value: `${p.minutes}분` },
  ];
  const meta = d.meta.length ? d.meta : metaFromFields;
  const para = (text) => paragraphs(text).map((t) => `<p>${esc(t).replace(/\n/g, '<br>')}</p>`).join('');
  const sectionHtml = (s) => {
    const lines = s.text.split('\n').filter((l) => l.trim());
    const isList = lines.length && lines.every((l) => /^\s*[-•]\s+/.test(l));
    const inner = isList
      ? `<ul>${lines.map((l) => `<li>${esc(l.replace(/^\s*[-•]\s+/, ''))}</li>`).join('')}</ul>`
      : para(s.text);
    return `<h2>${esc(s.title)}</h2>${inner}`;
  };
  const ex = p.tests[0];
  const examples = ex ? `
    <h2>예제</h2>
    <div class="examples">
      <div class="example">
        <div class="example-head">예제 입력 <button class="btn btn-sm btn-ghost" type="button" data-copy="input">복사</button></div>
        <pre>${esc(ex.input)}</pre>
      </div>
      <div class="example">
        <div class="example-head">예제 출력 <button class="btn btn-sm btn-ghost" type="button" data-copy="output">복사</button></div>
        <pre>${esc(ex.output)}</pre>
      </div>
    </div>
    <p class="tests-note">테스트 ${p.tests.length}개로 확인해요. 첫 번째 테스트가 위 예제예요.</p>` : '';
  return `
    <div class="meta-chips">${meta.map((m) => `<span class="meta-chip"><b>${esc(m.key)}</b>${esc(m.value)}</span>`).join('')}</div>
    <div class="body">${para(d.body)}</div>
    ${d.sections.map(sectionHtml).join('')}
    ${examples}`;
}

function renderProblem(id) {
  const p = DATA.byId.get(id);
  if (!p) {
    setCrumb([{ label: '문제 보관함', href: '#' }, { label: '찾을 수 없음' }]);
    viewEl.innerHTML = `
      <div class="card empty-state">
        <p>이 문제를 찾을 수 없어요. 주소가 바뀌었거나 아직 도착하지 않은 문제일 수 있어요.</p>
        <a class="btn" href="#">문제 보관함으로</a>
      </div>`;
    return;
  }
  setCrumb([{ label: '문제 보관함', href: '#' }, { label: p.title }]);
  let lang = store.getLang();
  let alive = true;
  let running = false;

  viewEl.innerHTML = `
    ${storageWarning()}
    <div class="solve-head">
      <div>
        <h1>${esc(p.title)}</h1>
        <div class="head-badges">
          ${diffBadge(p.difficulty)}
          <span class="tag">${esc(p.topic)}</span>
          <span class="tag tag-cat">${esc(p.category)}</span>
          <span class="muted" style="font-size:13px">${p.addedOn ? esc(p.addedOn) : '기본기'} · 약 ${esc(p.minutes)}분</span>
        </div>
      </div>
      <div>
        <span class="status-label" id="status-label">풀이 상태</span>
        <div class="status-switch" role="group" aria-labelledby="status-label" id="status-switch">
          ${['unsolved', 'review', 'solved'].map((s) => `<button type="button" data-status="${s}">${STATUS_LABEL[s]}</button>`).join('')}
        </div>
      </div>
    </div>
    <div class="solve-grid">
      <article class="card statement" id="statement">${statementHtml(p)}</article>
      <section class="workbench" aria-label="코드 작성과 실행">
        <div class="card editor-card">
          <div class="editor-top">
            <div class="lang-tabs" role="tablist" aria-label="언어">
              ${Object.entries(LANGS).map(([k, v]) => `<button type="button" role="tab" data-lang="${k}">${v.label}</button>`).join('')}
            </div>
            <span class="save-hint" id="save-hint"></span>
          </div>
          <div id="editor"></div>
          <div class="editor-actions">
            <button class="btn btn-primary" type="button" id="run-all">전체 테스트 실행 <span class="kbd">Ctrl+Enter</span></button>
            <button class="btn" type="button" id="run-custom">직접 입력으로 실행</button>
            <span class="spacer"></span>
            <button class="btn btn-ghost" type="button" id="reset-code">처음 코드로 되돌리기</button>
          </div>
          <p class="notice">실행하면 코드와 표준 입력만 Wandbox(wandbox.org)로 전송돼요. 테스트는 학습용이며 공식 채점기가 아니에요.</p>
        </div>
        <div class="card custom-input" id="custom" hidden>
          <div class="custom-head">
            <span>직접 입력</span>
            <span>
              <button class="btn btn-sm btn-primary" type="button" id="custom-run">이 입력으로 실행</button>
              <button class="btn btn-sm btn-ghost" type="button" id="custom-close">닫기</button>
            </span>
          </div>
          <label class="sr-only" for="custom-stdin">표준 입력</label>
          <textarea id="custom-stdin" spellcheck="false" placeholder="표준 입력으로 넣을 내용을 적어 주세요"></textarea>
          <div class="custom-out" id="custom-out" aria-live="polite"></div>
        </div>
        <div class="card results" id="results" aria-live="polite"></div>
      </section>
    </div>`;

  // ---- 상태 스위치
  const switchEl = viewEl.querySelector('#status-switch');
  const drawStatus = () => {
    const s = store.getStatus(p.id);
    switchEl.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.status === s)));
  };
  switchEl.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-status]');
    if (!b) return;
    store.setStatus(p.id, b.dataset.status);
    drawStatus();
    toast(`풀이 상태를 '${STATUS_LABEL[b.dataset.status]}'(으)로 바꿨어요.`);
  });
  drawStatus();

  // ---- 예제 복사
  viewEl.querySelector('#statement').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b || !p.tests[0]) return;
    const ok = await copyText(p.tests[0][b.dataset.copy]);
    toast(ok ? '복사했어요.' : '복사하지 못했어요. 직접 선택해서 복사해 주세요.');
  });

  // ---- 에디터
  const starter = (l) => (typeof p[l] === 'string' ? p[l] : '');
  const modeOf = { python: 'python', cpp: 'text/x-c++src' };
  const docs = {};
  for (const l of Object.keys(LANGS)) {
    docs[l] = window.CodeMirror.Doc(store.getDraft(p.id, l) ?? starter(l), modeOf[l]);
  }
  const editorHost = viewEl.querySelector('#editor');
  const cm = window.CodeMirror(editorHost, {
    value: docs[lang],
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    viewportMargin: 20,
    extraKeys: {
      Tab: (c) => (c.somethingSelected() ? c.indentSelection('add') : c.replaceSelection(' '.repeat(c.getOption('indentUnit')), 'end')),
      'Shift-Tab': (c) => c.indentSelection('subtract'),
      'Ctrl-Enter': () => runAll(),
      'Cmd-Enter': () => runAll(),
    },
  });
  const saveHint = viewEl.querySelector('#save-hint');
  const setHint = (text) => { saveHint.textContent = text; };
  const saveDraft = debounce((l) => {
    store.setDraft(p.id, l, docs[l].getValue());
    setHint(store.isPersistent() ? `${LANGS[l].info} · 자동 저장됨` : `${LANGS[l].info}`);
  }, 400);
  cm.on('changes', () => { setHint(`${LANGS[lang].info} · 저장 중…`); saveDraft(lang); });

  const tabs = viewEl.querySelectorAll('.lang-tabs [data-lang]');
  function selectLang(l) {
    saveDraft.flush(lang);
    lang = l;
    store.setLang(l);
    cm.swapDoc(docs[l]);
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.lang === l)));
    setHint(`${LANGS[l].info}${store.isPersistent() ? ' · 자동 저장됨' : ''}`);
  }
  tabs.forEach((t) => t.addEventListener('click', () => { if (t.dataset.lang !== lang) { selectLang(t.dataset.lang); cm.focus(); } }));
  selectLang(lang);

  viewEl.querySelector('#reset-code').addEventListener('click', () => {
    if (!window.confirm(`${LANGS[lang].label} 코드를 처음 코드로 되돌릴까요? 지금 작성한 코드는 사라져요.`)) return;
    docs[lang].setValue(starter(lang));
    saveDraft.flush(lang);
    store.clearDraft(p.id, lang);
    toast('처음 코드로 되돌렸어요.');
  });

  // ---- 결과 패널
  const resultsEl = viewEl.querySelector('#results');
  const runBtn = viewEl.querySelector('#run-all');
  const customBtn = viewEl.querySelector('#run-custom');
  const customRunBtn = viewEl.querySelector('#custom-run');

  function setRunning(on) {
    running = on;
    [runBtn, customBtn, customRunBtn].forEach((b) => { b.disabled = on; });
  }

  function drawResults(res, { live = false } = {}) {
    if (!res) {
      resultsEl.innerHTML = `<p class="results-empty">아직 실행 결과가 없어요. 코드를 작성하고 <b>전체 테스트 실행</b>을 눌러 보세요.</p>`;
      return;
    }
    const total = res.total ?? p.tests.length;
    const done = res.results.filter((r) => !['pending', 'running'].includes(r.verdict)).length;
    const passed = res.results.filter((r) => r.verdict === 'pass').length;
    const service = res.results.filter((r) => r.verdict === 'service').length;
    const cls = passed === total ? 'pass-all' : passed ? 'pass-some' : 'pass-none';
    const when = live ? `${LANGS[res.lang].label} · 실행 중 (${done}/${total})` : `${LANGS[res.lang].label} · ${fmtWhen(res.at)}`;
    let cheer = '';
    if (!live) {
      if (service) cheer = '';
      else if (res.compileError) cheer = '컴파일 오류부터 고쳐 볼까요? 오류 메시지의 줄 번호를 확인해 보세요.';
      else if (passed === total) cheer = '모든 테스트를 통과했어요. 잘했어요!';
      else cheer = '괜찮아요, 다음에 맞힐 문제예요. 실패한 테스트를 펼쳐 기대 출력과 비교해 보세요.';
    }
    resultsEl.innerHTML = `
      <div class="results-head">
        <div class="score"><strong class="${live ? '' : cls}">${passed}/${total} 통과</strong><small>${esc(when)}</small></div>
        <small class="muted">시간은 네트워크·컴파일을 포함한 왕복 시간이에요.</small>
      </div>
      <div class="progress" aria-hidden="true"><span style="width:${total ? (passed / total) * 100 : 0}%"></span></div>
      ${service && !live ? `<div class="msg msg-service" style="margin-bottom:12px">실행 서비스에 연결하지 못했어요. 테스트 ${service}개를 확인하지 못했어요 — 잠시 후 다시 실행해 주세요. (이번 결과는 풀이 기록에 남기지 않았어요)</div>` : ''}
      ${cheer ? `<p class="cheer">${cheer}</p>` : ''}
      ${res.compileError ? `<div class="error-box"><h4>컴파일 오류</h4><pre>${esc(clip(res.compileError, SHOW_OUTPUT))}</pre></div>` : ''}
      <div class="result-list" style="${res.compileError ? 'margin-top:10px' : ''}">
        ${res.results.map((r, i) => resultItemHtml(r, i)).join('')}
      </div>`;
  }

  const VERDICT = {
    pass: '통과', fail: '실패', error: '런타임 오류', compile: '컴파일 오류', timeout: '시간 초과',
    service: '연결 실패', skipped: '건너뜀', pending: '대기', running: '실행 중',
  };

  function resultItemHtml(r, i) {
    const t = p.tests[i] || { input: '', output: '' };
    const head = `
      <span class="verdict v-${r.verdict}">${VERDICT[r.verdict] || r.verdict}</span>
      <span class="r-label" title="${esc(r.label)}">${i + 1}. ${esc(r.label)}</span>
      <span class="r-time">${fmtMs(r.ms)}</span>`;
    if (!['fail', 'error', 'timeout'].includes(r.verdict)) {
      const extra = r.verdict === 'service' ? `<span class="muted" style="font-size:12px">${esc(r.message || '')}</span>` : '';
      return `<div class="result-item"><div class="result-line">${head}${extra}</div></div>`;
    }
    const diffLine = r.verdict === 'fail' ? firstDiffLine(t.output, r.stdout) : 0;
    const note = r.verdict === 'timeout'
      ? '25초 안에 응답이 없었어요. 무한 루프이거나 너무 느린 풀이일 수 있어요.'
      : r.verdict === 'error'
        ? esc(r.exitInfo || '실행 중 오류가 났어요.')
        : `${diffLine}번째 줄부터 달라요. (줄 끝 공백과 마지막 빈 줄은 무시하고 비교해요)`;
    return `
      <details class="result-item">
        <summary>${head}</summary>
        <div class="result-detail">
          <p class="muted" style="margin:6px 0 0;font-size:12.5px">${note}</p>
          <div class="io-grid">
            <div class="io-box"><h4>입력</h4><pre>${esc(clip(t.input, SHOW_OUTPUT))}</pre></div>
            <div class="io-box"><h4>기대 출력</h4><pre>${esc(clip(t.output, SHOW_OUTPUT))}</pre></div>
            <div class="io-box"><h4>실제 출력</h4><pre>${esc(clip(r.stdout, SHOW_OUTPUT)) || '<span class="muted">(출력 없음)</span>'}</pre></div>
          </div>
          ${r.stderr ? `<div class="io-box"><h4>stderr</h4><pre class="stderr">${esc(clip(r.stderr, SHOW_OUTPUT))}</pre></div>` : ''}
        </div>
      </details>`;
  }

  async function runAll() {
    if (running || !alive) return;
    if (!p.tests.length) { toast('이 문제에는 테스트가 없어요.'); return; }
    saveDraft.flush(lang);
    setRunning(true);
    const runLang = lang;
    const code = docs[runLang].getValue();
    const startedAt = new Date().toISOString();
    try {
      const res = await runTests(runLang, code, p.tests, (results, compileError) => {
        if (alive) drawResults({ lang: runLang, at: startedAt, total: p.tests.length, compileError, results }, { live: true });
      });
      const record = { ...res, at: startedAt };
      store.setLastResult(p.id, record);
      if (!res.serviceErrors) {
        const verdict = res.compileError ? 'compile' : res.passed === res.total ? 'pass' : 'fail';
        store.addAttempt(p.id, { at: startedAt, lang: runLang, passed: res.passed, total: res.total, verdict });
        if (verdict === 'pass') {
          const before = store.getStatus(p.id);
          store.setStatus(p.id, 'solved');
          if (alive && before !== 'solved') toast("모든 테스트를 통과했어요! 상태를 '해결'로 바꿨어요.");
        }
      }
      if (alive) { drawResults(record); drawStatus(); }
    } finally {
      if (alive) setRunning(false); else running = false;
    }
  }
  runBtn.addEventListener('click', runAll);

  // ---- 직접 입력
  const customEl = viewEl.querySelector('#custom');
  const stdinEl = viewEl.querySelector('#custom-stdin');
  const customOut = viewEl.querySelector('#custom-out');
  async function runCustomInput() {
    if (running || !alive) return;
    saveDraft.flush(lang);
    setRunning(true);
    const runLang = lang;
    customOut.innerHTML = `<p class="muted" style="margin:0">${LANGS[runLang].label}로 실행 중이에요…</p>`;
    try {
      const r = await runCustom(runLang, docs[runLang].getValue(), stdinEl.value);
      if (!alive) return;
      if (r.kind === 'service') {
        customOut.innerHTML = `<div class="msg msg-service">실행 서비스에 연결하지 못했어요. 잠시 후 다시 시도해 주세요. <span class="muted">(${esc(r.message)})</span></div>`;
      } else if (r.kind === 'timeout') {
        customOut.innerHTML = '<div class="msg msg-error">25초 안에 응답이 없었어요. 무한 루프이거나 입력을 기다리고 있지 않은지 확인해 보세요.</div>';
      } else if (r.type === 'compile') {
        customOut.innerHTML = `<div class="error-box"><h4>컴파일 오류</h4><pre>${esc(clip(r.compileError, SHOW_OUTPUT))}</pre></div>`;
      } else {
        customOut.innerHTML = `
          <h4>출력 <span class="muted">· ${fmtMs(r.ms)}${r.type === 'error' ? ` · ${esc(r.exitInfo)}` : ''}</span></h4>
          <pre>${esc(clip(r.stdout, SHOW_OUTPUT)) || '<span class="muted">(출력 없음)</span>'}</pre>
          ${r.stderr ? `<h4>stderr</h4><pre class="stderr">${esc(clip(r.stderr, SHOW_OUTPUT))}</pre>` : ''}`;
      }
    } finally {
      if (alive) setRunning(false); else running = false;
    }
  }
  customBtn.addEventListener('click', () => {
    if (customEl.hidden) {
      customEl.hidden = false;
      if (!stdinEl.value && p.tests[0]) stdinEl.value = p.tests[0].input;
    }
    runCustomInput();
  });
  customRunBtn.addEventListener('click', runCustomInput);
  viewEl.querySelector('#custom-close').addEventListener('click', () => { customEl.hidden = true; });

  drawResults(store.getLastResult(p.id));

  cleanup = () => {
    alive = false;
    saveDraft.flush(lang);
  };
}

window.addEventListener('beforeunload', () => { if (cleanup) cleanup(); });
boot();
