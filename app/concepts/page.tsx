import type { Metadata } from 'next';
import { ConceptList } from '@/components/ConceptList';
import { conceptIndex } from '@/lib/problems';

export const metadata: Metadata = { title: '개념서' };

export default function ConceptsPage() {
  return <ConceptList concepts={conceptIndex()} />;
}
