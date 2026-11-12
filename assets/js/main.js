import { loadProblems, parseDescription, paragraphs, syntaxTokens, loadConceptIndex, loadConcept, topicRelates } from './data.js';
import * as store from './store.js';
import { LANGS, RATE_LIMIT, runTests, runCustom, firstDiffLine } from './runner.js';
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
const conceptFilters = { q: '', category: '' };
const CONCEPT_CATEGORIES = ['기초 문법', '자료구조', '탐색', '알고리즘', '그래프', '수학', '실전 팁'];
// 주제(topic·syntax)를 아직 보여 주지 않는 문제에 쓰는 문구
const HIDDEN_TOPIC = '주제 숨김';

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
  viewToken += 1; // 아직 그리는 중인 이전 화면(개념서 로딩)이 새 화면을 덮지 않게
  const hash = location.hash;
  const m = hash.match(/^#p\/(.+)$/);
  const c = hash.match(/^#concepts(?:\/(.+))?$/);
  setNav(c ? 'concepts' : 'archive');
  if (m) renderProblem(decodeURIComponent(m[1]));
  else if (c && c[1]) renderConcept(decodeURIComponent(c[1]));
  else if (c) renderConceptList();
  else renderArchive();
  window.scrollTo(0, 0);
}

function setNav(key) {
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const on = a.dataset.nav === key;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
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
  if (filters.status && store.filterStatus(p.id) !== filters.status) return false;
  const q = filters.q.trim().toLowerCase();
  if (q) {
    // 숨긴 주제로는 검색되지 않게 한다(알고리즘·문법 필터는 그대로 쓸 수 있다).
    const hay = (store.topicRevealed(p.id) ? `${p.title} ${p.topic} ${p.syntax}` : p.title).toLowerCase();
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
      <span class="list-bar-right">
        <button class="btn btn-sm btn-ghost" type="button" id="reset-filters">필터 초기화</button>
        <label class="switch" title="해결 전이고 힌트도 열지 않은 문제의 알고리즘 주제와 핵심 문법을 보여 줘요">
          <input type="checkbox" id="show-topics"${store.getShowTopics() ? ' checked' : ''}>
          <span class="switch-track" aria-hidden="true"></span>
          <span>주제 표시</span>
        </label>
      </span>
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
  viewEl.querySelector('#show-topics').addEventListener('change', (e) => {
    store.setShowTopics(e.target.checked);
    drawList();
  });

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

function topicTag(p) {
  return store.topicRevealed(p.id)
    ? `<span class="tag tag-topic">${esc(p.topic)}</span>`
    : `<span class="tag tag-hidden" title="해결하거나 힌트를 열면 보여요">${HIDDEN_TOPIC}</span>`;
}

function hintBadge(id) {
  return store.getHint(id).used ? '<span class="badge badge-hint" title="해결 전에 힌트를 열었어요">힌트 사용</span>' : '';
}

function rowHtml(p) {
  const status = store.getStatus(p.id);
  const revealed = store.topicRevealed(p.id);
  return `
    <li class="problem-row" data-id="${esc(p.id)}">
      <a class="problem-link" href="#p/${encodeURIComponent(p.id)}">
        <div>
          <div class="problem-title">${esc(p.title)}</div>
          <div class="problem-tags">
            ${topicTag(p)}
            <span class="tag tag-cat">${esc(p.category)}</span>
          </div>
          <div class="problem-meta">
            <span>${p.addedOn ? esc(p.addedOn) : '기본기'}</span>
            ${revealed ? `<span class="meta-syntax">문법 · ${esc(p.syntax)}</span>` : ''}
            <span>약 ${esc(p.minutes)}분</span>
          </div>
        </div>
        <div class="problem-side">
          ${diffBadge(p.difficulty)}
          ${statusBadge(status)}
          ${hintBadge(p.id)}
        </div>
      </a>
    </li>`;
}

// ------------------------------------------------------------------ 풀이 화면

// 주제를 숨길 때 빼는 설명 머리글
const TOPIC_META_KEYS = ['알고리즘 주제', '핵심 문법'];

function metaChipsHtml(p) {
  const d = parseDescription(p.description);
  const metaFromFields = [
    { key: '유형', value: p.category },
    { key: '알고리즘 주제', value: p.topic },
    { key: '핵심 문법', value: p.syntax },
    { key: '난이도', value: p.difficulty },
    { key: '예상 풀이 시간', value: `${p.minutes}분` },
  ];
  let meta = d.meta.length ? d.meta : metaFromFields;
  if (!store.topicRevealed(p.id)) {
    // 첫 주제 칩 자리에 "주제 숨김" 칩 하나만 남긴다.
    let placed = false;
    meta = meta.flatMap((m) => {
      if (!TOPIC_META_KEYS.includes(m.key)) return [m];
      if (placed) return [];
      placed = true;
      return [{ key: '알고리즘 주제', value: HIDDEN_TOPIC, hidden: true }];
    });
  }
  return meta.map((m) => `<span class="meta-chip${m.hidden ? ' meta-chip-hidden' : ''}"><b>${esc(m.key)}</b>${esc(m.value)}</span>`).join('');
}

function statementHtml(p) {
  const d = parseDescription(p.description);
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
    <div class="meta-chips" id="meta-chips">${metaChipsHtml(p)}</div>
    <div class="body">${para(d.body)}</div>
    ${d.sections.map(sectionHtml).join('')}
    ${examples}`;
}

const HINT_STEPS = ['무엇을 쓸까', '어떻게 접근할까', '놓치기 쉬운 점'];
const HINT_CONFIRM = "힌트를 보면 이 문제는 '복습 필요'로 분류돼요. 계속할까요?";
const HINT_REVIEW_MSG = "힌트를 사용해서 '복습 필요'로 분류했어요. 나중에 힌트 없이 다시 풀어 보세요.";

function hasHints(p) {
  return Array.isArray(p.hints) && p.hints.some((h) => typeof h === 'string' && h.trim());
}

function hintCardHtml(p) {
  if (!hasHints(p)) {
    return `<section class="card hint-card" id="hints"><div class="hint-head"><h2>힌트</h2></div><p class="muted hint-empty">이 문제에는 아직 힌트가 없어요.</p><div id="related-concepts"></div></section>`;
  }
  return `
    <section class="card hint-card" id="hints" aria-labelledby="hints-title">
      <div class="hint-head">
        <h2 id="hints-title">힌트</h2>
        <span class="muted hint-progress" id="hint-progress"></span>
      </div>
      <ol class="hint-list" id="hint-list"></ol>
      <div class="hint-confirm" id="hint-confirm" role="alertdialog" aria-labelledby="hint-confirm-text" hidden>
        <p id="hint-confirm-text">${esc(HINT_CONFIRM)}</p>
        <div class="hint-confirm-actions">
          <button class="btn btn-sm btn-primary" type="button" id="hint-yes">계속</button>
          <button class="btn btn-sm btn-ghost" type="button" id="hint-no">취소</button>
        </div>
      </div>
      <button class="btn" type="button" id="hint-next">힌트 보기</button>
      <div id="related-concepts"></div>
    </section>`;
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
          <span id="head-topic">${topicTag(p)}</span>
          <span class="tag tag-cat">${esc(p.category)}</span>
          <span class="muted" style="font-size:13px">${p.addedOn ? esc(p.addedOn) : '기본기'} · 약 ${esc(p.minutes)}분</span>
        </div>
      </div>
      <div>
        <span class="status-label" id="status-label">풀이 상태</span>
        <div class="status-switch" role="group" aria-labelledby="status-label" id="status-switch">
          ${['unsolved', 'review', 'solved'].map((s) => `<button type="button" data-status="${s}">${STATUS_LABEL[s]}</button>`).join('')}
        </div>
        <div class="hint-clear-row">
          <button class="btn btn-sm" type="button" id="hint-clear" hidden>힌트 없이 다시 풀었어요</button>
        </div>
      </div>
    </div>
    <div class="solve-grid">
      <div class="left-col">
        <article class="card statement" id="statement">${statementHtml(p)}</article>
        ${hintCardHtml(p)}
      </div>
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
  const hintClearBtn = viewEl.querySelector('#hint-clear');
  const drawStatus = () => {
    const s = store.getStatus(p.id);
    switchEl.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.status === s)));
    hintClearBtn.hidden = !(s === 'review' && store.getHint(p.id).used);
  };
  switchEl.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-status]');
    if (!b) return;
    // 직접 '해결'로 바꾸면 힌트 사용 표시도 푼다(목록 배지와 필터가 상태와 어긋나지 않게).
    if (b.dataset.status === 'solved' && store.getHint(p.id).used) store.clearHintUsed(p.id);
    store.setStatus(p.id, b.dataset.status);
    drawAll();
    toast(`풀이 상태를 '${STATUS_LABEL[b.dataset.status]}'(으)로 바꿨어요.`);
  });
  hintClearBtn.addEventListener('click', () => {
    store.clearHintUsed(p.id);
    store.setStatus(p.id, 'solved');
    drawAll();
    toast("힌트 없이 다시 풀었어요! 상태를 '해결'로 바꿨어요.");
  });

  // ---- 힌트
  const hintList = viewEl.querySelector('#hint-list');
  const hintNext = viewEl.querySelector('#hint-next');
  const hintConfirm = viewEl.querySelector('#hint-confirm');
  const hintProgress = viewEl.querySelector('#hint-progress');
  const hints = hasHints(p) ? p.hints.slice(0, store.HINT_LEVELS) : [];
  function drawHints() {
    if (!hintList) return;
    const { level } = store.getHint(p.id);
    const shown = Math.min(level, hints.length);
    hintList.innerHTML = hints.slice(0, shown).map((h, i) => `
      <li class="hint-item">
        <div class="hint-step">${i + 1}단계 · ${HINT_STEPS[i] || ''}</div>
        <p>${esc(h)}</p>
      </li>`).join('');
    hintProgress.textContent = `${shown}/${hints.length}`;
    hintNext.hidden = shown >= hints.length;
    hintNext.textContent = shown === 0 ? '힌트 보기' : `다음 힌트 보기 (${shown + 1}단계)`;
  }
  function openHint() {
    const before = store.getStatus(p.id);
    store.openNextHint(p.id);
    hintConfirm.hidden = true;
    drawAll();
    const after = store.getStatus(p.id);
    if (before !== after) toast("힌트를 열어서 '복습 필요'로 분류했어요.");
    const items = hintList.querySelectorAll('.hint-item');
    items[items.length - 1]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  if (hintNext) {
    hintNext.addEventListener('click', () => {
      // 처음 여는 힌트이고 아직 해결 전이면 화면 안에서 먼저 확인을 받는다.
      if (store.getHint(p.id).level === 0 && store.getStatus(p.id) !== 'solved') {
        hintConfirm.hidden = false;
        hintNext.hidden = true;
        viewEl.querySelector('#hint-yes').focus();
        return;
      }
      openHint();
    });
    viewEl.querySelector('#hint-yes').addEventListener('click', openHint);
    viewEl.querySelector('#hint-no').addEventListener('click', () => {
      hintConfirm.hidden = true;
      hintNext.hidden = false;
      hintNext.focus();
    });
  }

  // ---- 관련 개념: 힌트 1단계를 열었거나 해결한 뒤에만 보여 준다.
  const relatedEl = viewEl.querySelector('#related-concepts');
  let conceptsForTopic = null;
  loadConceptIndex()
    .then((list) => { conceptsForTopic = list.filter((c) => topicRelates(p.topic, c.topics)); if (alive) drawRelated(); })
    .catch(() => { conceptsForTopic = []; });
  function drawRelated() {
    const open = store.getStatus(p.id) === 'solved' || store.getHint(p.id).level >= 1;
    if (!open || !conceptsForTopic || !conceptsForTopic.length) { relatedEl.innerHTML = ''; return; }
    relatedEl.innerHTML = `
      <div class="related-concepts">
        <span class="related-label">관련 개념</span>
        ${conceptsForTopic.map((c) => `<a class="concept-chip" href="#concepts/${encodeURIComponent(c.slug)}">${esc(c.title)}</a>`).join('')}
      </div>`;
  }

  function drawAll() {
    drawStatus();
    drawHints();
    drawRelated();
    viewEl.querySelector('#head-topic').innerHTML = topicTag(p);
    viewEl.querySelector('#meta-chips').innerHTML = metaChipsHtml(p);
  }
  drawAll();

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
    const done = res.results.filter((r) => !['pending', 'waiting', 'running'].includes(r.verdict)).length;
    const waiting = live && res.results.some((r) => r.verdict === 'waiting');
    const passed = res.results.filter((r) => r.verdict === 'pass').length;
    const service = res.results.filter((r) => r.verdict === 'service').length;
    const cls = passed === total ? 'pass-all' : passed ? 'pass-some' : 'pass-none';
    const when = live ? `${LANGS[res.lang].label} · 실행 중 (${done}/${total})` : `${LANGS[res.lang].label} · ${fmtWhen(res.at)}`;
    let cheer = '';
    if (!live) {
      if (service) cheer = '';
      else if (res.compileError) cheer = '컴파일 오류부터 고쳐 볼까요? 오류 메시지의 줄 번호를 확인해 보세요.';
      else if (passed === total && res.hintReview) cheer = '';
      else if (passed === total) cheer = '모든 테스트를 통과했어요. 잘했어요!';
      else cheer = '괜찮아요, 다음에 맞힐 문제예요. 실패한 테스트를 펼쳐 기대 출력과 비교해 보세요.';
    }
    resultsEl.innerHTML = `
      <div class="results-head">
        <div class="score"><strong class="${live ? '' : cls}">${passed}/${total} 통과</strong><small>${esc(when)}</small></div>
        <small class="muted">시간은 네트워크·컴파일을 포함한 왕복 시간이에요.</small>
      </div>
      <div class="progress" aria-hidden="true"><span style="width:${total ? (passed / total) * 100 : 0}%"></span></div>
      ${waiting ? `<div class="msg msg-wait" style="margin-bottom:12px">Wandbox는 1분에 약 ${RATE_LIMIT}번까지만 실행할 수 있어요. 자리가 나면 이어서 실행할게요.</div>` : ''}
      ${service && !live ? `<div class="msg msg-service" style="margin-bottom:12px">실행 서비스에 연결하지 못했어요. 테스트 ${service}개를 확인하지 못했어요 — 잠시 후 다시 실행해 주세요. (이번 결과는 풀이 기록에 남기지 않았어요)</div>` : ''}
      ${res.hintReview && !live && passed === total ? `<div class="msg msg-hint" style="margin-bottom:12px">${esc(HINT_REVIEW_MSG)}</div>` : ''}
      ${cheer ? `<p class="cheer">${cheer}</p>` : ''}
      ${res.compileError ? `<div class="error-box"><h4>컴파일 오류</h4><pre>${esc(clip(res.compileError, SHOW_OUTPUT))}</pre></div>` : ''}
      <div class="result-list" style="${res.compileError ? 'margin-top:10px' : ''}">
        ${res.results.map((r, i) => resultItemHtml(r, i)).join('')}
      </div>`;
  }

  const VERDICT = {
    pass: '통과', fail: '실패', error: '런타임 오류', compile: '컴파일 오류', timeout: '시간 초과',
    service: '연결 실패', skipped: '건너뜀', pending: '대기', waiting: '대기', running: '실행 중',
  };

  function resultItemHtml(r, i) {
    const t = p.tests[i] || { input: '', output: '' };
    const head = `
      <span class="verdict v-${r.verdict}">${VERDICT[r.verdict] || r.verdict}</span>
      <span class="r-label" title="${esc(r.label)}">${i + 1}. ${esc(r.label)}</span>
      <span class="r-time">${fmtMs(r.ms)}</span>`;
    if (!['fail', 'error', 'timeout'].includes(r.verdict)) {
      const extra = r.verdict === 'service' ? `<span class="muted" style="font-size:12px">${esc(r.message || '')}</span>`
        : r.verdict === 'waiting' ? `<span class="muted" style="font-size:12px">${r.waitSec}초 후 실행</span>` : '';
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
      if (!res.serviceErrors) {
        const verdict = res.compileError ? 'compile' : res.passed === res.total ? 'pass' : 'fail';
        store.addAttempt(p.id, { at: startedAt, lang: runLang, passed: res.passed, total: res.total, verdict, ...(store.getHint(p.id).used ? { hintUsed: true } : {}) });
        if (verdict === 'pass') {
          const before = store.getStatus(p.id);
          if (before !== 'solved' && store.getHint(p.id).used) {
            // 해결 전에 힌트를 열었으면 '해결'이 아니라 '복습 필요'로 둔다.
            store.setStatus(p.id, 'review');
            record.hintReview = true;
            if (alive) toast(HINT_REVIEW_MSG);
          } else {
            store.setStatus(p.id, 'solved');
            if (alive && before !== 'solved') toast("모든 테스트를 통과했어요! 상태를 '해결'로 바꿨어요.");
          }
        }
      }
      store.setLastResult(p.id, record);
      if (alive) { drawResults(record); drawAll(); }
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
      const r = await runCustom(runLang, docs[runLang].getValue(), stdinEl.value, {
        onWait: (sec) => {
          if (alive) customOut.innerHTML = `<p class="muted" style="margin:0">Wandbox는 1분에 약 ${RATE_LIMIT}번까지만 실행할 수 있어요. ${sec}초 후 실행해요…</p>`;
        },
        onSend: () => {
          if (alive) customOut.innerHTML = `<p class="muted" style="margin:0">${LANGS[runLang].label}로 실행 중이에요…</p>`;
        },
      });
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

// ------------------------------------------------------------------ 개념서

// 비동기로 그리는 화면이 다른 화면으로 넘어간 뒤에 덮어쓰지 않게 하는 표식
let viewToken = 0;
function claimView() {
  viewToken += 1;
  const mine = viewToken;
  return () => mine === viewToken;
}

function conceptLoadError(err, retry) {
  viewEl.innerHTML = `
    <div class="card empty-state">
      <p>개념서를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
      <p class="muted">${esc(err?.message || err || '')}</p>
      <button class="btn" type="button" id="retry">다시 불러오기</button>
    </div>`;
  viewEl.querySelector('#retry').addEventListener('click', retry);
}

function relatedProblems(c) {
  return DATA.list.filter((p) => topicRelates(p.topic, c.topics));
}

function renderConceptList() {
  setCrumb([{ label: '개념서' }]);
  const isCurrent = claimView();
  viewEl.innerHTML = '<div class="loading">개념서를 불러오는 중이에요…</div>';
  loadConceptIndex().then((list) => {
    if (!isCurrent()) return;
    const cats = CONCEPT_CATEGORIES.filter((cat) => list.some((c) => c.category === cat));
    viewEl.innerHTML = `
      <div class="page-head">
        <div>
          <h1>개념서</h1>
          <p>문제를 풀다 막힐 때 꺼내 보는 도구 사용법과 선택 기준이에요. 특정 문제의 정답은 담지 않았어요.</p>
        </div>
      </div>
      <form class="card concept-filters" role="search" id="concept-filters">
        <div class="field field-search">
          <label for="c-q">검색</label>
          <input class="input" id="c-q" type="search" placeholder="이름, 요약, 함수로 찾기" value="${esc(conceptFilters.q)}" autocomplete="off">
        </div>
        <div class="field">
          <span class="field-label" id="c-cat-label">카테고리</span>
          <div class="chip-group" role="group" aria-labelledby="c-cat-label" id="c-cats">
            ${['', ...cats].map((cat) => `<button type="button" class="chip" data-cat="${esc(cat)}" aria-pressed="${conceptFilters.category === cat}">${cat ? esc(cat) : '전체'}</button>`).join('')}
          </div>
        </div>
      </form>
      <div class="list-bar"><span id="c-count"></span></div>
      <div id="concept-list"></div>`;
    const form = viewEl.querySelector('#concept-filters');
    form.addEventListener('submit', (e) => e.preventDefault());
    viewEl.querySelector('#c-q').addEventListener('input', (e) => { conceptFilters.q = e.target.value; draw(); });
    viewEl.querySelector('#c-cats').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      conceptFilters.category = b.dataset.cat;
      viewEl.querySelectorAll('#c-cats [data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      draw();
    });
    function draw() {
      const words = conceptFilters.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const shown = list.filter((c) => {
        if (conceptFilters.category && c.category !== conceptFilters.category) return false;
        const hay = `${c.title} ${c.summary} ${c.category} ${(c.topics || []).join(' ')} ${c.slug}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      });
      viewEl.querySelector('#c-count').innerHTML = shown.length === list.length
        ? `총 <strong>${list.length}</strong>개 개념`
        : `총 <strong>${list.length}</strong>개 개념 중 <strong>${shown.length}</strong>개`;
      const el = viewEl.querySelector('#concept-list');
      if (!shown.length) {
        el.innerHTML = '<div class="card empty-state"><p>조건에 맞는 개념이 없어요.</p></div>';
        return;
      }
      const groups = CONCEPT_CATEGORIES.map((cat) => [cat, shown.filter((c) => c.category === cat)]).filter(([, cs]) => cs.length);
      el.innerHTML = groups.map(([cat, cs]) => `
        <section class="concept-group">
          <h2 class="concept-group-title">${esc(cat)}</h2>
          <ul class="concept-grid">
            ${cs.map((c) => {
              const n = relatedProblems(c).length;
              return `
              <li>
                <a class="card concept-card" href="#concepts/${encodeURIComponent(c.slug)}" data-slug="${esc(c.slug)}">
                  <span class="concept-card-title">${esc(c.title)}</span>
                  <span class="concept-card-summary">${esc(c.summary)}</span>
                  <span class="concept-card-meta">${n ? `관련 문제 ${n}개` : '도구 사용법'}</span>
                </a>
              </li>`;
            }).join('')}
          </ul>
        </section>`).join('');
    }
    draw();
  }).catch((err) => { if (isCurrent()) conceptLoadError(err, renderConceptList); });
}

function renderConcept(slug) {
  setCrumb([{ label: '개념서', href: '#concepts' }, { label: '불러오는 중…' }]);
  const isCurrent = claimView();
  viewEl.innerHTML = '<div class="loading">개념을 불러오는 중이에요…</div>';
  // 목록에 없는 slug 는 파일을 요청하지 않는다(불필요한 404 방지).
  loadConceptIndex().then((index) => (index.some((x) => x.slug === slug) ? loadConcept(slug).catch(() => null) : null)).then((c) => {
    if (!isCurrent()) return;
    if (!c) {
      setCrumb([{ label: '개념서', href: '#concepts' }, { label: '찾을 수 없음' }]);
      viewEl.innerHTML = `
        <div class="card empty-state">
          <p>이 개념을 찾을 수 없어요.</p>
          <a class="btn" href="#concepts">개념서 목록으로</a>
        </div>`;
      return;
    }
    setCrumb([{ label: '개념서', href: '#concepts' }, { label: c.title }]);
    const related = relatedProblems(c);
    const list = (arr) => (Array.isArray(arr) ? arr : []);
    viewEl.innerHTML = `
      <div class="solve-head concept-head">
        <div>
          <h1>${esc(c.title)}</h1>
          <div class="head-badges"><span class="tag tag-cat">${esc(c.category)}</span></div>
          <p class="concept-summary">${esc(c.summary)}</p>
        </div>
        <div class="lang-tabs" role="tablist" aria-label="언어">
          ${Object.entries(LANGS).map(([k, v]) => `<button type="button" role="tab" data-lang="${k}">${v.label}</button>`).join('')}
        </div>
      </div>
      <div class="concept-body">
        <section class="card concept-section">
          <h2>이럴 때 써요</h2>
          <ul class="bullet-list">${list(c.when).map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
        </section>
        <section class="card concept-section">
          <h2>핵심 함수·문법</h2>
          <div id="c-items"></div>
        </section>
        <section class="card concept-section">
          <h2>예제 코드</h2>
          <div id="c-examples"></div>
        </section>
        <section class="card concept-section">
          <h2>상황별 선택 가이드</h2>
          <ul class="decision-list">
            ${list(c.decision).map((d) => `<li><span class="decision-when">${esc(d.situation)}</span><span class="decision-arrow" aria-hidden="true">→</span><span class="decision-use">${esc(d.use)}</span></li>`).join('')}
          </ul>
        </section>
        <section class="card concept-section">
          <h2>자주 하는 실수</h2>
          <div id="c-pitfalls"></div>
        </section>
        <section class="card concept-section">
          <h2>시험장 체크리스트</h2>
          <ul class="checklist">${list(c.checklist).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </section>
        <section class="card concept-section">
          <h2>관련 문제</h2>
          ${related.length ? `<ul class="related-problems">${related.map((p) => `
            <li>
              <a href="#p/${encodeURIComponent(p.id)}" class="related-problem" data-id="${esc(p.id)}">
                <span class="related-title">${esc(p.title)}</span>
                <span class="related-side">${diffBadge(p.difficulty)}${statusBadge(store.getStatus(p.id))}${hintBadge(p.id)}</span>
              </a>
            </li>`).join('')}</ul>` : '<p class="muted">아직 이 개념과 이어진 문제가 없어요.</p>'}
        </section>
      </div>`;

    const tabs = viewEl.querySelectorAll('.lang-tabs [data-lang]');
    function drawLang() {
      const lang = store.getLang();
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.lang === lang)));
      const block = c[lang] || {};
      viewEl.querySelector('#c-items').innerHTML = `
        <div class="table-wrap">
          <table class="api-table">
            <thead><tr><th>이름</th><th>시그니처</th><th>하는 일</th><th>언제 쓰나</th><th>시간 복잡도</th></tr></thead>
            <tbody>${list(block.items).map((it) => `
              <tr>
                <td data-label="이름"><code>${esc(it.name)}</code></td>
                <td data-label="시그니처"><code class="sig">${esc(it.signature)}</code></td>
                <td data-label="하는 일">${esc(it.does)}</td>
                <td data-label="언제 쓰나">${esc(it.when)}</td>
                <td data-label="시간 복잡도"><span class="complexity">${esc(it.complexity)}</span></td>
              </tr>`).join('')}</tbody>
          </table>
        </div>`;
      viewEl.querySelector('#c-examples').innerHTML = list(block.examples).map((ex, i) => `
        <div class="code-example">
          <div class="code-head"><span>${esc(ex.title)}</span><button class="btn btn-sm btn-ghost" type="button" data-copy-ex="${i}">복사</button></div>
          <pre class="code"><code>${esc(ex.code)}</code></pre>
          <div class="code-io">
            ${typeof ex.stdin === 'string' && ex.stdin ? `<div class="io-box"><h4>입력</h4><pre>${esc(ex.stdin)}</pre></div>` : ''}
            <div class="io-box"><h4>실행 결과</h4><pre>${esc(ex.output) || '<span class="muted">(출력 없음)</span>'}</pre></div>
          </div>
        </div>`).join('');
      viewEl.querySelector('#c-pitfalls').innerHTML = list(block.pitfalls).map((pt) => `
        <div class="pitfall">
          <div class="pitfall-grid">
            <div><h4 class="pit-wrong">잘못된 코드</h4><pre class="code code-wrong"><code>${esc(pt.wrong)}</code></pre></div>
            <div><h4 class="pit-right">올바른 코드</h4><pre class="code code-right"><code>${esc(pt.right)}</code></pre></div>
          </div>
          <p class="pitfall-why"><b>이유</b> ${esc(pt.why)}</p>
        </div>`).join('');
    }
    tabs.forEach((t) => t.addEventListener('click', () => {
      if (t.dataset.lang === store.getLang()) return;
      store.setLang(t.dataset.lang);
      drawLang();
    }));
    viewEl.querySelector('#c-examples').addEventListener('click', async (e) => {
      const b = e.target.closest('[data-copy-ex]');
      if (!b) return;
      const ex = list((c[store.getLang()] || {}).examples)[Number(b.dataset.copyEx)];
      const ok = await copyText(ex?.code || '');
      toast(ok ? '코드를 복사했어요.' : '복사하지 못했어요. 직접 선택해서 복사해 주세요.');
    });
    drawLang();
  }).catch((err) => { if (isCurrent()) conceptLoadError(err, () => renderConcept(slug)); });
}

window.addEventListener('beforeunload', () => { if (cleanup) cleanup(); });
boot();
