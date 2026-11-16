'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DIFFICULTIES, STATUSES, STATUS_LABEL, topicVisible, type ProblemMeta, type Status } from '@/lib/shared';
import { usePref } from '@/lib/use-pref';
import { DifficultyTag, StatusBadge } from './StatusBadge';

export interface ListProgress { status: Status; hintLevel: number }

export function ProblemList({ problems, progress, loggedIn }: { problems: ProblemMeta[]; progress: Record<string, ListProgress>; loggedIn: boolean }) {
  const [q, setQ] = useState('');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [showTopics, setShowTopics] = usePref<'on' | 'off'>('recall-show-topics', 'off');
  const show = showTopics === 'on';

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return problems.filter((p) => {
      const rec = progress[p.id];
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false;
      if (status !== 'all' && (rec?.status ?? 'untried') !== status) return false;
      if (!needle) return true;
      // 숨긴 주제로는 검색되지 않게 한다.
      const hay = `${p.title} ${p.id} ${topicVisible(show, rec) ? p.topic : ''}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [problems, progress, q, difficulty, status, show]);

  const counts = useMemo(() => {
    const c: Record<Status, number> = { untried: 0, attempted: 0, solved: 0, retry: 0 };
    for (const p of problems) c[progress[p.id]?.status ?? 'untried'] += 1;
    return c;
  }, [problems, progress]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">문제</h1>
          <p className="mt-1 text-sm text-muted" id="count">
            {filtered.length === problems.length ? `총 ${problems.length}개 문제` : `${problems.length}개 중 ${filtered.length}개`}
            {loggedIn && ` · 해결 ${counts.solved} · 다시 풀기 ${counts.retry} · 시도함 ${counts.attempted}`}
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
          <input id="show-topics" type="checkbox" className="h-4 w-4 accent-(--color-accent)" checked={show} onChange={(e) => setShowTopics(e.target.checked ? 'on' : 'off')} />
          주제 표시
        </label>
      </div>

      <div className="card mb-4 flex flex-col gap-3 p-3">
        <input className="input" type="search" placeholder="제목으로 찾기" value={q} onChange={(e) => setQ(e.target.value)} aria-label="문제 검색" />
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="난이도">
          <span className="mr-1 text-xs font-semibold text-muted">난이도</span>
          {['all', ...DIFFICULTIES].map((d) => (
            <button key={d} type="button" data-difficulty={d} aria-pressed={difficulty === d} className={`chip ${difficulty === d ? 'chip-on' : ''}`} onClick={() => setDifficulty(d)}>
              {d === 'all' ? '전체' : d}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="내 상태">
          <span className="mr-1 text-xs font-semibold text-muted">내 상태</span>
          {['all', ...STATUSES].map((s) => (
            <button key={s} type="button" data-filter-status={s} aria-pressed={status === s} disabled={!loggedIn && s !== 'all'} className={`chip ${status === s ? 'chip-on' : ''} disabled:opacity-50`} onClick={() => setStatus(s)}>
              {s === 'all' ? '전체' : `${STATUS_LABEL[s as Status]} ${counts[s as Status]}`}
            </button>
          ))}
          {!loggedIn && <span className="text-xs text-muted"><Link className="text-accent underline" href="/login">로그인</Link>하면 내 상태로 걸러 볼 수 있어요.</span>}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="card p-8 text-center text-sm text-muted">조건에 맞는 문제가 없어요.</p>
      ) : (
        <ul className="card divide-y divide-line overflow-hidden">
          {filtered.map((p) => {
            const rec = progress[p.id];
            return (
              <li key={p.id} className="problem-row" data-id={p.id}>
                <Link href={`/problems/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-sunken">
                  <span className="w-9"><DifficultyTag difficulty={p.difficulty} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{p.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {topicVisible(show, rec) ? p.topic : <span className="tag-hidden">주제 숨김</span>} · {p.minutes}분{p.addedOn ? ` · ${p.addedOn}` : ' · 기본기'}
                    </span>
                  </span>
                  {rec && rec.hintLevel > 0 && rec.status !== 'solved' && <span className="hidden shrink-0 text-xs text-warn sm:inline">힌트 사용</span>}
                  {loggedIn && <StatusBadge status={rec?.status ?? 'untried'} />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
