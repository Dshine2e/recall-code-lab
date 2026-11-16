import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { getDb, schema } from './db';
import type { ProgressRow } from './db/schema';
import type { RecordView } from './shared';

const { progress } = schema;

export function toView(row: ProgressRow): RecordView {
  return {
    status: row.status,
    solvedOn: row.solvedOn,
    minutesSpent: row.minutesSpent,
    memo: row.memo,
    codePython: row.codePython,
    codeCpp: row.codeCpp,
    hintLevel: row.hintLevel,
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** 목록용: 문제 id → 상태·힌트 단계(코드와 메모는 빼고 가볍게) */
export async function progressSummary(userId: string) {
  const db = await getDb();
  const rows = await db
    .select({ problemId: progress.problemId, status: progress.status, hintLevel: progress.hintLevel, solvedOn: progress.solvedOn, minutesSpent: progress.minutesSpent, updatedAt: progress.updatedAt })
    .from(progress)
    .where(eq(progress.userId, userId))
    .orderBy(desc(progress.updatedAt));
  return rows;
}

export async function getRecord(userId: string, problemId: string): Promise<RecordView | null> {
  const db = await getDb();
  const [row] = await db.select().from(progress).where(and(eq(progress.userId, userId), eq(progress.problemId, problemId))).limit(1);
  return row ? toView(row) : null;
}

type Patch = Partial<Pick<ProgressRow, 'status' | 'solvedOn' | 'minutesSpent' | 'memo' | 'codePython' | 'codeCpp' | 'hintLevel'>>;

/** 내 기록 한 줄을 만들거나 고친다. userId 는 반드시 서버 세션에서 온 값이어야 한다. */
export async function upsertRecord(userId: string, problemId: string, patch: Patch): Promise<RecordView> {
  const db = await getDb();
  const [row] = await db
    .insert(progress)
    .values({ userId, problemId, ...patch })
    .onConflictDoUpdate({ target: [progress.userId, progress.problemId], set: { ...patch, updatedAt: new Date() } })
    .returning();
  return toView(row);
}
