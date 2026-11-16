import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DifficultyTag, StatusBadge } from '@/components/StatusBadge';
import { currentUser } from '@/lib/auth';
import { problemMetas } from '@/lib/problems';
import { progressSummary } from '@/lib/progress';
import { DIFFICULTIES, STATUSES, STATUS_LABEL, type Status } from '@/lib/shared';

export const metadata: Metadata = { title: '마이페이지' };

const fmt = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export default async function MePage() {
  const user = await currentUser();
  if (!user) redirect('/login?next=/me');
  const problems = problemMetas();
  const byId = new Map(problems.map((p) => [p.id, p]));
  // 지금 문제 목록에 있는 문제의 기록만 센다.
  const rows = (await progressSummary(user.id)).filter((r) => byId.has(r.problemId));

  const byStatus: Record<Status, number> = { untried: 0, attempted: 0, solved: 0, retry: 0 };
  for (const r of rows) byStatus[r.status] += 1;
  byStatus.untried = problems.length - byStatus.attempted - byStatus.solved - byStatus.retry;

  const stats = DIFFICULTIES.map((d) => {
    const total = problems.filter((p) => p.difficulty === d).length;
    const solved = rows.filter((r) => r.status === 'solved' && byId.get(r.problemId)?.difficulty === d).length;
    return { d, total, solved, pct: total ? Math.round((solved / total) * 100) : 0 };
  });
  const timed = rows.filter((r) => r.status === 'solved' && r.minutesSpent != null);
  const avg = timed.length ? Math.round(timed.reduce((s, r) => s + (r.minutesSpent ?? 0), 0) / timed.length) : null;
  const recent = rows.filter((r) => r.status !== 'untried').slice(0, 12);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{user.username} 님의 기록</h1>
        <p className="mt-1 text-sm text-muted">전체 {problems.length}문제 중 {byStatus.solved}문제를 해결했어요.{avg != null && ` 해결한 문제의 평균 풀이 시간은 ${avg}분이에요.`}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" id="status-stats">
        {STATUSES.map((s) => (
          <div key={s} className="card p-4" data-stat={s}>
            <div className="text-xs text-muted">{STATUS_LABEL[s]}</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{byStatus[s]}</div>
          </div>
        ))}
      </div>

      <section className="card p-5" id="difficulty-stats">
        <h2 className="mb-3 text-sm font-bold">난이도별 해결</h2>
        <div className="space-y-3">
          {stats.map((s) => (
            <div key={s.d} data-difficulty={s.d}>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <DifficultyTag difficulty={s.d} />
                <span className="tabular-nums text-muted"><b className="text-ink">{s.solved}</b> / {s.total} ({s.pct}%)</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-sunken"><div className="h-full rounded-full bg-accent" style={{ width: `${s.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5" id="recent">
        <h2 className="mb-3 text-sm font-bold">최근 기록</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted">아직 기록이 없어요. <Link href="/" className="text-accent underline">문제 풀러 가기</Link></p>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {recent.map((r) => {
              const p = byId.get(r.problemId)!;
              return (
                <li key={r.problemId}>
                  <Link href={`/problems/${p.id}`} className="flex items-center gap-3 py-2.5 hover:text-accent">
                    <span className="w-9"><DifficultyTag difficulty={p.difficulty} /></span>
                    <span className="min-w-0 flex-1 truncate">{p.title}</span>
                    {r.minutesSpent != null && <span className="hidden text-xs text-muted sm:inline">{r.minutesSpent}분</span>}
                    <span className="hidden text-xs text-muted sm:inline">{fmt.format(r.updatedAt)}</span>
                    <StatusBadge status={r.status} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
