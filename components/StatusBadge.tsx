import { STATUS_LABEL, type Status } from '@/lib/shared';

const STYLE: Record<Status, string> = {
  untried: 'border-line text-muted',
  attempted: 'border-transparent bg-accent-soft text-accent',
  solved: 'border-transparent bg-ok-soft text-ok',
  retry: 'border-transparent bg-warn-soft text-warn',
};

export function StatusBadge({ status }: { status: Status }) {
  return <span data-status={status} className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${STYLE[status]}`}>{STATUS_LABEL[status]}</span>;
}

const DIFF_STYLE: Record<string, string> = { 입문: 'text-ok', 기본: 'text-accent', 도전: 'text-bad' };

export function DifficultyTag({ difficulty }: { difficulty: string }) {
  return <span className={`shrink-0 text-xs font-semibold ${DIFF_STYLE[difficulty] ?? 'text-muted'}`}>{difficulty}</span>;
}
