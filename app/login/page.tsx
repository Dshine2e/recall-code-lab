import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { currentUser } from '@/lib/auth';

export const metadata: Metadata = { title: '로그인' };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safe = typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/';
  if (await currentUser()) redirect(safe);
  return <AuthForm mode="login" next={safe} />;
}
