'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { currentUser } from '../auth';
import { hasProblem, getProblem } from '../problems';
import { getRecord, upsertRecord } from '../progress';
import { EMPTY_RECORD, STATUSES, todayKst, type RecordView } from '../shared';

// 모든 기록 변경은 여기(서버)에서 세션을 확인한 뒤에만 한다. 브라우저가 보낸 사용자 id 는 받지 않는다.

export type ActionResult = { ok: true; record: RecordView } | { ok: false; error: string };

const NEED_LOGIN: ActionResult = { ok: false, error: '로그인이 필요해요.' };
const BAD_INPUT: ActionResult = { ok: false, error: '입력 값을 확인해 주세요.' };

const problemId = z.string().min(1).max(100).refine(hasProblem, '없는 문제');

async function guard<T>(schema: z.ZodType<T>, input: unknown, run: (userId: string, data: T) => Promise<RecordView>): Promise<ActionResult> {
  const user = await currentUser();
  if (!user) return NEED_LOGIN;
  const parsed = schema.safeParse(input);
  if (!parsed.success) return BAD_INPUT;
  const record = await run(user.id, parsed.data);
  revalidatePath('/');
  revalidatePath('/me');
  return { ok: true, record };
}

const recordSchema = z.object({
  problemId,
  status: z.enum(STATUSES),
  solvedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((s) => !Number.isNaN(Date.parse(s))).nullable(),
  minutesSpent: z.number().int().min(0).max(100000).nullable(),
  memo: z.string().max(5000),
});

/** 상태·해결 날짜·걸린 시간·메모 저장 */
export async function saveRecord(input: z.input<typeof recordSchema>): Promise<ActionResult> {
  return guard(recordSchema, input, async (userId, d) => {
    const solved = d.status === 'solved';
    return upsertRecord(userId, d.problemId, {
      status: d.status,
      // 해결로 바꾸는데 날짜가 비어 있으면 오늘(KST)로 채운다. 안 풂으로 되돌리면 날짜를 지운다.
      solvedOn: d.status === 'untried' ? null : d.solvedOn ?? (solved ? todayKst() : null),
      minutesSpent: d.minutesSpent,
      memo: d.memo,
      // 직접 '해결'로 표시하면 힌트 사용 표시도 푼다.
      ...(solved || d.status === 'untried' ? { hintLevel: 0 } : {}),
    });
  });
}

const codeSchema = z.object({ problemId, lang: z.enum(['python', 'cpp']), code: z.string().max(100_000) });

/** 내 코드 저장(입력 중 자동 저장) */
export async function saveCode(input: z.input<typeof codeSchema>): Promise<ActionResult> {
  return guard(codeSchema, input, (userId, d) => upsertRecord(userId, d.problemId, d.lang === 'python' ? { codePython: d.code } : { codeCpp: d.code }));
}

const hintSchema = z.object({ problemId, level: z.number().int().min(1).max(3) });

/** 힌트 열기: 해결 전에 힌트를 보면 '다시 풀기'로 분류한다. */
export async function openHint(input: z.input<typeof hintSchema>): Promise<ActionResult> {
  return guard(hintSchema, input, async (userId, d) => {
    const prev = (await getRecord(userId, d.problemId)) ?? EMPTY_RECORD;
    const max = getProblem(d.problemId)?.hints.length ?? 0;
    const level = Math.min(Math.max(prev.hintLevel, d.level), max);
    return upsertRecord(userId, d.problemId, { hintLevel: level, ...(prev.status === 'solved' ? {} : { status: 'retry' as const }) });
  });
}

const resultSchema = z.object({ problemId, allPassed: z.boolean() });

/** 테스트 실행 결과 반영: 전부 통과하면 해결(힌트를 썼으면 다시 풀기), 아니면 시도함 */
export async function reportResult(input: z.input<typeof resultSchema>): Promise<ActionResult> {
  return guard(resultSchema, input, async (userId, d) => {
    const prev = (await getRecord(userId, d.problemId)) ?? EMPTY_RECORD;
    if (!d.allPassed) {
      return upsertRecord(userId, d.problemId, prev.status === 'untried' ? { status: 'attempted' } : {});
    }
    if (prev.hintLevel > 0 && prev.status !== 'solved') return upsertRecord(userId, d.problemId, { status: 'retry' });
    return upsertRecord(userId, d.problemId, { status: 'solved', solvedOn: prev.solvedOn ?? todayKst() });
  });
}

const idSchema = z.object({ problemId });

/** "힌트 없이 다시 풀었어요": 힌트 사용 표시를 풀고 해결로 바꾼다. */
export async function clearHint(input: z.input<typeof idSchema>): Promise<ActionResult> {
  return guard(idSchema, input, async (userId, d) => {
    const prev = (await getRecord(userId, d.problemId)) ?? EMPTY_RECORD;
    return upsertRecord(userId, d.problemId, { hintLevel: 0, status: 'solved', solvedOn: prev.solvedOn ?? todayKst() });
  });
}
