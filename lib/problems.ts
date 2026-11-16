import 'server-only';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Concept, ConceptMeta, Problem, ProblemMeta } from './shared';
import { topicRelates } from './shared';

// 문제와 개념서는 저장소의 JSON 파일이 원본이다(problems/, concepts/). DB 에는 넣지 않는다.
const ROOT = process.cwd();
const readJson = (...parts: string[]) => JSON.parse(readFileSync(path.join(/*turbopackIgnore: true*/ ROOT, ...parts), 'utf8'));

let problemCache: { list: Problem[]; byId: Map<string, Problem> } | null = null;

function loadProblems() {
  if (problemCache) return problemCache;
  const files: string[] = readJson('problems', 'manifest.json').files ?? [];
  const list: (Problem & { _order: number })[] = [];
  files.forEach((file, fileIndex) => {
    // manifest 에는 파일 이름만 있다. 경로가 섞인 이름은 받지 않는다.
    if (!/^[\w.-]+\.json$/.test(file)) return;
    const arr = readJson('problems', file);
    if (!Array.isArray(arr)) return;
    arr.forEach((p: Problem, i: number) => {
      if (!p || typeof p.id !== 'string') return;
      list.push({ ...p, tests: Array.isArray(p.tests) ? p.tests : [], hints: Array.isArray(p.hints) ? p.hints : [], _order: fileIndex * 1000 + i });
    });
  });
  // 최신순: 날짜 내림차순 → 같은 날은 파일 안 순서(입문·기본·도전) → 기본기(addedOn=null)는 맨 뒤
  list.sort((a, b) => {
    if (a.addedOn && b.addedOn && a.addedOn !== b.addedOn) return a.addedOn < b.addedOn ? 1 : -1;
    if (!a.addedOn !== !b.addedOn) return a.addedOn ? -1 : 1;
    return a._order - b._order;
  });
  const byId = new Map<string, Problem>();
  for (const { _order, ...p } of list) if (!byId.has(p.id)) byId.set(p.id, p);
  problemCache = { list: [...byId.values()], byId };
  return problemCache;
}

export function allProblems(): Problem[] {
  return loadProblems().list;
}

export function getProblem(id: string): Problem | undefined {
  return loadProblems().byId.get(id);
}

export function hasProblem(id: string): boolean {
  return loadProblems().byId.has(id);
}

export function problemMetas(): ProblemMeta[] {
  return allProblems().map(({ id, title, category, topic, difficulty, minutes, addedOn }) => ({ id, title, category, topic, difficulty, minutes, addedOn }));
}

let conceptIndexCache: ConceptMeta[] | null = null;

export function conceptIndex(): ConceptMeta[] {
  conceptIndexCache ??= ((readJson('concepts', 'manifest.json').concepts ?? []) as ConceptMeta[]).filter((c) => c && typeof c.slug === 'string');
  return conceptIndexCache;
}

export function getConcept(slug: string): Concept | undefined {
  // 목록에 있는 slug 만 파일을 읽는다.
  if (!conceptIndex().some((c) => c.slug === slug)) return undefined;
  return readJson('concepts', `${slug}.json`) as Concept;
}

export function conceptsForTopic(topic: string): ConceptMeta[] {
  return conceptIndex().filter((c) => topicRelates(topic, c.topics));
}

export function problemsForConcept(topics: string[]): ProblemMeta[] {
  return problemMetas().filter((p) => topicRelates(p.topic, topics));
}
