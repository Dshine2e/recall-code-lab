'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CONCEPT_CATEGORIES, type ConceptMeta } from '@/lib/shared';

export function ConceptList({ concepts }: { concepts: ConceptMeta[] }) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const categories = CONCEPT_CATEGORIES.filter((c) => concepts.some((x) => x.category === c));
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return concepts.filter((c) => (category === 'all' || c.category === category) && (!needle || `${c.title} ${c.summary} ${c.slug}`.toLowerCase().includes(needle)));
  }, [concepts, q, category]);
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">개념서</h1>
      <p className="mt-1 text-sm text-muted">도구 사용법과 선택 기준만 모았어요. 예제 출력은 모두 실제 실행 결과예요.</p>
      <div className="card my-4 flex flex-col gap-3 p-3">
        <input id="c-q" className="input" type="search" placeholder="개념 찾기" value={q} onChange={(e) => setQ(e.target.value)} aria-label="개념 검색" />
        <div className="flex flex-wrap gap-1.5">
          {['all', ...categories].map((c) => (
            <button key={c} type="button" aria-pressed={category === c} className={`chip ${category === c ? 'chip-on' : ''}`} onClick={() => setCategory(c)}>{c === 'all' ? '전체' : c}</button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="card p-8 text-center text-sm text-muted">조건에 맞는 개념이 없어요.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link key={c.slug} href={`/concepts/${c.slug}`} data-slug={c.slug} className="concept-card card block p-4 hover:border-accent">
              <div className="text-xs text-muted">{c.category}</div>
              <div className="mt-1 font-semibold">{c.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{c.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
