// 서버·브라우저 양쪽에서 쓰는 타입과 순수 함수

export type Difficulty = '입문' | '기본' | '도전';
export const DIFFICULTIES: Difficulty[] = ['입문', '기본', '도전'];

export type Status = 'untried' | 'attempted' | 'solved' | 'retry';
export const STATUSES: Status[] = ['untried', 'attempted', 'solved', 'retry'];
export const STATUS_LABEL: Record<Status, string> = {
  untried: '안 풂',
  attempted: '시도함',
  solved: '해결',
  retry: '다시 풀기',
};

export type Lang = 'python' | 'cpp';

export interface TestCase { label: string; input: string; output: string }

export interface Problem {
  id: string;
  title: string;
  category: string;
  topic: string;
  syntax: string;
  difficulty: Difficulty;
  minutes: number;
  addedOn: string | null;
  description: string;
  tests: TestCase[];
  python: string;
  cpp: string;
  hints: string[];
}

/** 목록에 쓰는 가벼운 정보 */
export interface ProblemMeta {
  id: string;
  title: string;
  category: string;
  topic: string;
  difficulty: Difficulty;
  minutes: number;
  addedOn: string | null;
}

/** 브라우저로 보내는 내 기록 */
export interface RecordView {
  status: Status;
  solvedOn: string | null;
  minutesSpent: number | null;
  memo: string;
  codePython: string | null;
  codeCpp: string | null;
  hintLevel: number;
  updatedAt: string | null;
}

export const EMPTY_RECORD: RecordView = {
  status: 'untried', solvedOn: null, minutesSpent: null, memo: '', codePython: null, codeCpp: null, hintLevel: 0, updatedAt: null,
};

export interface ConceptMeta { slug: string; title: string; category: string; summary: string; topics: string[] }

export interface ConceptLang {
  items: { name: string; signature: string; does: string; when: string; complexity: string }[];
  examples: { title: string; code: string; stdin?: string; output: string }[];
  pitfalls: { wrong: string; right: string; why: string }[];
}
export interface Concept extends ConceptMeta {
  order: number;
  when: string[];
  python: ConceptLang;
  cpp: ConceptLang;
  decision: { situation: string; use: string }[];
  checklist: string[];
}

export const CONCEPT_CATEGORIES = ['기초 문법', '자료구조', '탐색', '알고리즘', '그래프', '수학', '실전 팁'];

/**
 * description 템플릿 파싱.
 *   [유형] …\n[알고리즘 주제] …\n\n(본문)\n\n[제약]\n- …\n\n[입력 형식]\n…\n\n[출력 형식]\n…
 * 기본기 문제처럼 본문만 있는 짧은 형식도 그대로 받는다.
 */
export function parseDescription(desc: string) {
  const lines = String(desc || '').replace(/\r\n/g, '\n').split('\n');
  const meta: { key: string; value: string }[] = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^\[([^\]]+)\]\s*(\S.*)$/);
    if (!m) break;
    meta.push({ key: m[1].trim(), value: m[2].trim() });
    i += 1;
  }
  const sections: { title: string | null; lines: string[] }[] = [];
  let current: { title: string | null; lines: string[] } = { title: null, lines: [] };
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
  const clean = (arr: string[]) => arr.join('\n').trim();
  return {
    meta,
    body: clean(sections[0].lines),
    sections: sections.slice(1).map((s) => ({ title: s.title as string, text: clean(s.lines) })),
  };
}

/** 본문 텍스트 → 문단 배열(빈 줄로 구분) */
export function paragraphs(text: string): string[] {
  return String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

/**
 * 문제 topic 과 개념 topics 연결 규칙(tools/validate_concepts.py 의 related() 와 같음, 대소문자 무시):
 * 개념의 topics 문자열 중 하나가 문제 topic 안에 들어 있으면 관련. '='로 시작하면 정확히 같을 때만.
 */
export function topicRelates(topic: string, conceptTopics: string[]): boolean {
  const t = String(topic || '').trim().toLowerCase();
  if (!t || !Array.isArray(conceptTopics)) return false;
  return conceptTopics.some((raw) => {
    const c = String(raw || '').trim().toLowerCase();
    if (!c) return false;
    if (c.startsWith('=')) return t === c.slice(1).trim();
    return t.includes(c);
  });
}

/** 주제를 보여 줘도 되는가: '주제 표시'를 켰거나, 해결했거나, 힌트를 한 번이라도 열었을 때 */
export function topicVisible(showTopics: boolean, rec: Pick<RecordView, 'status' | 'hintLevel'> | undefined): boolean {
  return showTopics || rec?.status === 'solved' || (rec?.hintLevel ?? 0) > 0;
}

/** 오늘 날짜(KST, YYYY-MM-DD) */
export function todayKst(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
}
