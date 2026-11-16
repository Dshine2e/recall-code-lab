'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Concept, Lang, ProblemMeta } from '@/lib/shared';
import { usePref } from '@/lib/use-pref';
import { DifficultyTag } from './StatusBadge';

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="btn btn-sm btn-ghost" onClick={async () => { try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* 복사 권한 없음 */ } }}>
      {done ? '복사됨' : '복사'}
    </button>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="concept-section card p-5">
    <h2 className="mb-3 text-base font-bold">{title}</h2>
    {children}
  </section>
);

export function ConceptView({ concept, problems }: { concept: Concept; problems: ProblemMeta[] }) {
  const [lang, setLang] = usePref<Lang>('recall-lang', 'python');
  const L = concept[lang];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs text-muted">{concept.category}</div>
          <h1 className="text-2xl font-bold tracking-tight">{concept.title}</h1>
          <p className="mt-1 text-sm text-muted">{concept.summary}</p>
        </div>
        <div className="lang-tabs flex gap-1" role="tablist" aria-label="언어">
          {(['python', 'cpp'] as Lang[]).map((l) => (
            <button key={l} type="button" role="tab" data-lang={l} aria-selected={lang === l} className={`chip ${lang === l ? 'chip-on' : ''}`} onClick={() => setLang(l)}>{l === 'python' ? 'Python' : 'C++'}</button>
          ))}
        </div>
      </div>

      <Section title="이럴 때 써요">
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">{concept.when.map((w, i) => <li key={i}>{w}</li>)}</ul>
      </Section>

      <Section title="핵심 함수·문법">
        <div id="c-items" className="overflow-x-auto">
          <table className="api-table w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs text-muted">
              <tr><th className="pb-2 pr-3 font-semibold">쓰는 법</th><th className="pb-2 pr-3 font-semibold">하는 일</th><th className="pb-2 pr-3 font-semibold">언제</th><th className="pb-2 font-semibold">복잡도</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {L.items.map((it, i) => (
                <tr key={i} className="align-top">
                  <td className="py-2 pr-3 font-mono text-[13px]">{it.signature}</td>
                  <td className="py-2 pr-3">{it.does}</td>
                  <td className="py-2 pr-3 text-muted">{it.when}</td>
                  <td className="py-2 font-mono text-[13px] whitespace-nowrap">{it.complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="예제 코드">
        <div id="c-examples" className="space-y-5">
          {L.examples.map((ex, i) => (
            <div key={i}>
              <div className="mb-1 flex items-center justify-between"><h3 className="text-sm font-semibold">{ex.title}</h3><CopyButton text={ex.code} /></div>
              <pre className="code code-block">{ex.code}</pre>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {ex.stdin ? <div><div className="label">입력</div><pre className="code-block">{ex.stdin}</pre></div> : null}
                <div><div className="label">출력</div><pre className="code-block">{ex.output}</pre></div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="상황별 선택 가이드">
        <ul className="divide-y divide-line text-sm">
          {concept.decision.map((d, i) => (
            <li key={i} className="grid gap-1 py-2 sm:grid-cols-2"><span className="text-muted">{d.situation}</span><span className="font-medium">{d.use}</span></li>
          ))}
        </ul>
      </Section>

      <Section title="자주 하는 실수">
        <div className="space-y-4">
          {L.pitfalls.map((p, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-2">
              <div><div className="label text-bad">이렇게 쓰면 틀려요</div><pre className="code-block">{p.wrong}</pre></div>
              <div><div className="label text-ok">이렇게 써요</div><pre className="code-block">{p.right}</pre></div>
              <p className="text-sm leading-relaxed text-muted sm:col-span-2">{p.why}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="시험장 체크리스트">
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">{concept.checklist.map((c, i) => <li key={i}>{c}</li>)}</ul>
      </Section>

      <Section title="관련 문제">
        {problems.length === 0 ? (
          <p className="text-sm text-muted">아직 연결된 문제가 없어요.</p>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {problems.map((p) => (
              <li key={p.id}><Link href={`/problems/${p.id}`} className="flex items-center gap-3 py-2 hover:text-accent"><span className="w-9"><DifficultyTag difficulty={p.difficulty} /></span>{p.title}</Link></li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
