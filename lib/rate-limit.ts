import 'server-only';
import { and, eq, gt, lt, sql } from 'drizzle-orm';
import { getDb, schema } from './db';

// 로그인 시도 제한: 최근 15분 동안 같은 아이디로 5번, 같은 IP 로 20번 틀리면 잠시 막는다.
// Vercel 은 요청마다 다른 서버가 받을 수 있어서 횟수를 메모리가 아니라 DB 에 적는다.
const WINDOW_MIN = 15;
const MAX_PER_USERNAME = 5;
const MAX_PER_IP = 20;

const { loginAttempts } = schema;
const since = () => new Date(Date.now() - WINDOW_MIN * 60_000);

export async function isLoginBlocked(username: string, ip: string): Promise<boolean> {
  const db = await getDb();
  const count = async (cond: ReturnType<typeof eq>) => {
    const [row] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(loginAttempts)
      .where(and(cond, eq(loginAttempts.success, false), gt(loginAttempts.attemptedAt, since())));
    return row?.n ?? 0;
  };
  if ((await count(eq(loginAttempts.username, username))) >= MAX_PER_USERNAME) return true;
  return (await count(eq(loginAttempts.ip, ip))) >= MAX_PER_IP;
}

export async function recordLoginAttempt(username: string, ip: string, success: boolean): Promise<void> {
  const db = await getDb();
  if (success) {
    // 성공하면 그 아이디의 실패 기록은 지운다.
    await db.delete(loginAttempts).where(and(eq(loginAttempts.username, username), eq(loginAttempts.success, false)));
    return;
  }
  await db.insert(loginAttempts).values({ username, ip, success });
  // 하루 지난 기록은 정리한다.
  await db.delete(loginAttempts).where(lt(loginAttempts.attemptedAt, new Date(Date.now() - 24 * 3600_000)));
}

export const LOGIN_WINDOW_MIN = WINDOW_MIN;
