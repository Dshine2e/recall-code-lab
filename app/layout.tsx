import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { currentUser } from '@/lib/auth';
import { logoutAction } from '@/lib/actions/auth';

export const metadata: Metadata = {
  title: { default: 'recall · 코딩테스트 복습실', template: '%s · recall' },
  description: '매일 새로 쌓이는 코딩테스트 문제를 풀고, 풀이 기록을 남기는 복습실',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
      </head>
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-1 px-4">
            <Link href="/" className="mr-3 text-lg font-bold tracking-tight">recall</Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link href="/" className="rounded-lg px-2.5 py-1.5 hover:bg-sunken">문제</Link>
              <Link href="/concepts" className="rounded-lg px-2.5 py-1.5 hover:bg-sunken">개념서</Link>
              {user && <Link href="/me" className="rounded-lg px-2.5 py-1.5 hover:bg-sunken">마이페이지</Link>}
            </nav>
            <div className="ml-auto flex items-center gap-2 text-sm">
              {user ? (
                <>
                  <span className="hidden text-muted sm:inline" data-testid="whoami">{user.username}</span>
                  <form action={logoutAction}>
                    <button className="btn btn-sm" type="submit">로그아웃</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-sm">로그인</Link>
                  <Link href="/signup" className="btn btn-sm btn-primary">회원가입</Link>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
