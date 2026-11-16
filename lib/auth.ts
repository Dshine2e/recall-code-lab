import 'server-only';
import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { getDb, schema } from './db';
import { isLoginBlocked, recordLoginAttempt } from './rate-limit';
import { normalizeUsername, PASSWORD_MAX } from './validation';

class RateLimited extends CredentialsSignin {
  code = 'rate_limited';
}

// 없는 아이디일 때도 같은 시간이 걸리도록 비교해 둘 해시(아이디 존재 여부를 응답 시간으로 알 수 없게)
const DUMMY_HASH = bcrypt.hashSync('recall-dummy-password', 12);

function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      async authorize(credentials, request) {
        const username = normalizeUsername(String(credentials?.username ?? ''));
        const password = String(credentials?.password ?? '');
        if (!username || !password || password.length > PASSWORD_MAX) return null;
        const ip = clientIp(request);
        if (await isLoginBlocked(username, ip)) throw new RateLimited();

        const db = await getDb();
        const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
        const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !ok) {
          await recordLoginAttempt(username, ip, false);
          return null;
        }
        await recordLoginAttempt(username, ip, true);
        return { id: user.id, name: user.username };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.uid === 'string') session.user.id = token.uid;
      return session;
    },
  },
});

/** 로그인한 사용자의 id. 로그인하지 않았으면 null. 권한 확인은 항상 이 값(서버 세션)으로 한다. */
export async function currentUser(): Promise<{ id: string; username: string } | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return { id, username: session.user?.name ?? '' };
}
