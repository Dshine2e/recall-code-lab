// 문제 데이터 읽기와 description 파싱

const DIFF_ORDER = { 입문: 0, 기본: 1, 도전: 2 };

async function fetchJson(url) {
  // Pages 캐시(약 10분) 때문에 새 문제가 늦게 보이지 않도록 항상 재검증한다.
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${url} (${res.status})`);
  return res.json();
}

export async function loadProblems() {
  const manifest = await fetchJson('problems/manifest.json');
  const files = Array.isArray(manifest?.files) ? manifest.files : [];
  const settled = await Promise.allSettled(files.map((f) => fetchJson(`problems/${encodeURIComponent(f)}`)));
  const list = [];
  const failed = [];
  settled.forEach((r, fileIndex) => {
    if (r.status !== 'fulfilled' || !Array.isArray(r.value)) {
      failed.push(files[fileIndex]);
      return;
    }
    r.value.forEach((p, i) => {
      if (!p || typeof p.id !== 'string') return;
      list.push({ ...p, tests: Array.isArray(p.tests) ? p.tests : [], _order: fileIndex * 1000 + i });
    });
  });
  if (!list.length && files.length) throw new Error('문제 파일을 읽지 못했어요.');

  // 최신순: 날짜 내림차순 → 같은 날은 입문·기본·도전 순 → 기본기(addedOn=null)는 맨 뒤
  list.sort((a, b) => {
    if (a.addedOn && b.addedOn && a.addedOn !== b.addedOn) return a.addedOn < b.addedOn ? 1 : -1;
    if (!a.addedOn !== !b.addedOn) return a.addedOn ? -1 : 1;
    return a._order - b._order;
  });
  const seen = new Set();
  const unique = list.filter((p) => (seen.has(p.id) ? false : seen.add(p.id)));
  return { list: unique, byId: new Map(unique.map((p) => [p.id, p])), failed };
}

export function syntaxTokens(syntax) {
  return String(syntax || '')
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function difficultyRank(d) {
  return DIFF_ORDER[d] ?? 9;
}

/**
 * description 템플릿 파싱.
 *   [유형] …\n[알고리즘 주제] …\n…\n\n(본문)\n\n[제약]\n- …\n\n[입력 형식]\n…\n\n[출력 형식]\n…
 * 기본기 문제처럼 본문만 있는 짧은 형식도 그대로 받는다.
 */
export function parseDescription(desc) {
  const lines = String(desc || '').replace(/\r\n/g, '\n').split('\n');
  const meta = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^\[([^\]]+)\]\s*(\S.*)$/);
    if (!m) break;
    meta.push({ key: m[1].trim(), value: m[2].trim() });
    i += 1;
  }
  const sections = [];
  let current = { title: null, lines: [] };
  for (; i < lines.length; i += 1) {
    const head = lines[i].match(/^\[([^\]]+)\]\s*$/);
    if (head) {
      sections.push(current);
      current = { title: head[1].trim(), lines: [] };
    } else {
      current.lines.push(lines[i]);
    }
  }
  sections.push(current);
  const clean = (arr) => arr.join('\n').trim();
  const body = clean(sections[0].lines);
  const named = sections.slice(1).map((s) => ({ title: s.title, text: clean(s.lines) }));
  return { meta, body, sections: named };
}

/** 본문 텍스트 → 문단 배열(빈 줄로 구분, 줄바꿈 유지) */
export function paragraphs(text) {
  return String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

// ------------------------------------------------------------------ 개념서

let conceptIndex = null;
const conceptCache = new Map();

/** concepts/manifest.json → [{ slug, title, category, summary, topics }] (실패하면 예외) */
export async function loadConceptIndex() {
  if (!conceptIndex) {
    conceptIndex = fetchJson('concepts/manifest.json')
      .then((m) => (Array.isArray(m?.concepts) ? m.concepts.filter((c) => c && typeof c.slug === 'string') : []))
      .catch((err) => { conceptIndex = null; throw err; });
  }
  return conceptIndex;
}

export async function loadConcept(slug) {
  if (!conceptCache.has(slug)) {
    const p = fetchJson(`concepts/${encodeURIComponent(slug)}.json`).catch((err) => { conceptCache.delete(slug); throw err; });
    conceptCache.set(slug, p);
  }
  return conceptCache.get(slug);
}

/**
 * 문제 topic 과 개념 topics 연결 규칙(tools/validate_concepts.py 의 related() 와 같음, 대소문자 무시):
 * 개념의 topics 문자열 중 하나가 문제 topic 안에 들어 있으면 관련. '='로 시작하면 정확히 같을 때만.
 */
export function topicRelates(topic, conceptTopics) {
  const t = String(topic || '').trim().toLowerCase();
  if (!t || !Array.isArray(conceptTopics)) return false;
  return conceptTopics.some((raw) => {
    const c = String(raw || '').trim().toLowerCase();
    if (!c) return false;
    if (c.startsWith('=')) return t === c.slice(1).trim();
    return t.includes(c);
  });
}
