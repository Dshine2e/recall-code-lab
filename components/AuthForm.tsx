'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import { checkUsername, loginAction, signupAction, type FormState } from '@/lib/actions/auth';
import { PASSWORD_MIN, USERNAME_MAX, USERNAME_MIN } from '@/lib/validation';

export function AuthForm({ mode, next }: { mode: 'login' | 'signup'; next: string }) {
  const signup = mode === 'signup';
  const [state, action, pending] = useActionState<FormState, FormData>(signup ? signupAction : loginAction, {});
  const [username, setUsername] = useState('');
  const [avail, setAvail] = useState<{ ok: boolean; message: string } | null>(null);
  const seq = useRef(0);

  useEffect(() => { if (state.username) setUsername(state.username); }, [state]);

  // 회원가입: 입력을 멈추면 아이디 중복을 확인한다.
  useEffect(() => {
    if (!signup) return;
    setAvail(null);
    const name = username.trim();
    if (name.length < USERNAME_MIN) return;
    const mine = ++seq.current;
    const t = setTimeout(async () => {
      try {
        const r = await checkUsername(name);
        if (mine === seq.current) setAvail(r);
      } catch { /* 확인 실패는 가입 때 다시 검사한다 */ }
    }, 400);
    return () => clearTimeout(t);
  }, [username, signup]);

  const other = signup ? '/login' : '/signup';
  const otherHref = next && next !== '/' ? `${other}?next=${encodeURIComponent(next)}` : other;
  return (
    <div className="mx-auto mt-8 max-w-sm">
      <h1 className="text-2xl font-bold tracking-tight">{signup ? '회원가입' : '로그인'}</h1>
      <p className="mt-1 text-sm text-muted">{signup ? '아이디와 비밀번호만 있으면 돼요. 이메일은 받지 않아요.' : '풀이 기록을 저장하고 다른 기기에서도 이어서 볼 수 있어요.'}</p>
      <form action={action} className="card mt-5 space-y-4 p-5">
        <input type="hidden" name="next" value={next} />
        <div>
          <label className="label" htmlFor="username">아이디</label>
          <input id="username" name="username" className="input" autoComplete="username" autoCapitalize="none" spellCheck={false} required minLength={signup ? USERNAME_MIN : 1} maxLength={USERNAME_MAX} value={username} onChange={(e) => setUsername(e.target.value)} />
          {signup && <p id="username-hint" className={`mt-1 text-xs ${avail ? (avail.ok ? 'text-ok' : 'text-bad') : 'text-muted'}`}>{avail ? avail.message : `영문 소문자, 숫자, 밑줄(_) ${USERNAME_MIN}~${USERNAME_MAX}자`}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">비밀번호</label>
          <input id="password" name="password" type="password" className="input" autoComplete={signup ? 'new-password' : 'current-password'} required minLength={signup ? PASSWORD_MIN : 1} />
          {signup && <p className="mt-1 text-xs text-muted">{PASSWORD_MIN}자 이상. 비밀번호를 잊으면 되찾을 방법이 없으니 꼭 기억해 두세요.</p>}
        </div>
        {signup && (
          <div>
            <label className="label" htmlFor="confirm">비밀번호 확인</label>
            <input id="confirm" name="confirm" type="password" className="input" autoComplete="new-password" required minLength={PASSWORD_MIN} />
          </div>
        )}
        {state.error && <p id="form-error" role="alert" className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad">{state.error}</p>}
        <button type="submit" className="btn btn-primary w-full py-2" disabled={pending}>{pending ? '잠시만요…' : signup ? '가입하고 시작하기' : '로그인'}</button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        {signup ? '이미 계정이 있나요? ' : '처음인가요? '}
        <Link href={otherHref} className="text-accent underline">{signup ? '로그인' : '회원가입'}</Link>
      </p>
    </div>
  );
}
