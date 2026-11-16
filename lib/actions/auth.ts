'use server';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import { signIn, signOut } from '../auth';
import { getDb, schema } from '../db';
import { LOGIN_WINDOW_MIN } from '../rate-limit';
import { normalizeUsername, passwordError, usernameError } from '../validation';

export interface FormState { error?: string; username?: string }

/** 로그인 뒤 돌아갈 주소. 사이트 안의 경로만 허용한다. */
function safeNext(raw: FormDataEntryValue | null): string {
  const next = String(raw ?? '');
  return next.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : '/';
}

async function usernameTaken(username: string): Promise<boolean> {
  const db = await getDb();
  const [row] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.username, username)).limit(1);
  return Boolean(row);
}

/** 아이디 중복 확인(회원가입 화면에서 입력 중에 부른다) */
export async function checkUsername(raw: string): Promise<{ ok: boolean; message: string }> {
  const username = normalizeUsername(String(raw ?? ''));
  const err = usernameError(username);
  if (err) return { ok: false, message: err };
  if (await usernameTaken(username)) return { ok: false, message: '이미 쓰고 있는 아이디예요.' };
  return { ok: true, message: '쓸 수 있는 아이디예요.' };
}

async function doSignIn(username: string, password: string, redirectTo: string): Promise<FormState> {
  try {
    await signIn('credentials', { username, password, redirectTo });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      const code = (err as AuthError & { code?: string }).code;
      if (code === 'rate_limited') return { username, error: `로그인 시도가 너무 많아요. ${LOGIN_WINDOW_MIN}분쯤 뒤에 다시 해 주세요.` };
      return { username, error: '아이디 또는 비밀번호가 맞지 않아요.' };
    }
    throw err; // 성공하면 redirect 가 예외로 전달된다
  }
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const username = normalizeUsername(String(formData.get('username') ?? ''));
  const password = String(formData.get('password') ?? '');
  if (!username || !password) return { username, error: '아이디와 비밀번호를 입력해 주세요.' };
  return doSignIn(username, password, safeNext(formData.get('next')));
}

export async function signupAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const username = normalizeUsername(String(formData.get('username') ?? ''));
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');
  const err = usernameError(username) ?? passwordError(password);
  if (err) return { username, error: err };
  if (password !== confirm) return { username, error: '비밀번호 확인이 서로 달라요.' };
  if (await usernameTaken(username)) return { username, error: '이미 쓰고 있는 아이디예요.' };

  // 비밀번호는 bcrypt 해시로만 저장한다.
  const passwordHash = await bcrypt.hash(password, 12);
  const db = await getDb();
  const inserted = await db.insert(schema.users).values({ username, passwordHash }).onConflictDoNothing().returning({ id: schema.users.id });
  if (!inserted.length) return { username, error: '이미 쓰고 있는 아이디예요.' };
  return doSignIn(username, password, safeNext(formData.get('next')));
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: '/' });
}
