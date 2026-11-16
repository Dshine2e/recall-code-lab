import { ProblemList, type ListProgress } from '@/components/ProblemList';
import { currentUser } from '@/lib/auth';
import { problemMetas } from '@/lib/problems';
import { progressSummary } from '@/lib/progress';

export default async function HomePage() {
  const user = await currentUser();
  const progress: Record<string, ListProgress> = {};
  if (user) {
    for (const row of await progressSummary(user.id)) progress[row.problemId] = { status: row.status, hintLevel: row.hintLevel };
  }
  return <ProblemList problems={problemMetas()} progress={progress} loggedIn={Boolean(user)} />;
}
