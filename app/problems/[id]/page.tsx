import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Workspace } from '@/components/Workspace';
import { currentUser } from '@/lib/auth';
import { conceptsForTopic, getProblem } from '@/lib/problems';
import { getRecord } from '@/lib/progress';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: getProblem(decodeURIComponent(id))?.title ?? '문제' };
}

export default async function ProblemPage({ params }: Props) {
  const { id } = await params;
  const problem = getProblem(decodeURIComponent(id));
  if (!problem) notFound();
  const user = await currentUser();
  const record = user ? await getRecord(user.id, problem.id) : null;
  const concepts = conceptsForTopic(problem.topic).map(({ slug, title }) => ({ slug, title }));
  return (
    <div>
      <Link href="/" className="text-sm text-muted hover:text-ink">← 문제 목록</Link>
      <Workspace key={problem.id} problem={problem} initialRecord={record} loggedIn={Boolean(user)} concepts={concepts} />
    </div>
  );
}
