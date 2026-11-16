import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ConceptView } from '@/components/ConceptView';
import { getConcept, problemsForConcept } from '@/lib/problems';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: getConcept(slug)?.title ?? '개념서' };
}

export default async function ConceptPage({ params }: Props) {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) notFound();
  return (
    <div>
      <Link href="/concepts" className="text-sm text-muted hover:text-ink">← 개념서 목록</Link>
      <div className="mt-3"><ConceptView concept={concept} problems={problemsForConcept(concept.topics)} /></div>
    </div>
  );
}
