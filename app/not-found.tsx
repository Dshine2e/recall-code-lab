import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card mx-auto mt-10 max-w-md p-8 text-center">
      <h1 className="text-lg font-bold">찾는 페이지가 없어요</h1>
      <p className="mt-2 text-sm text-muted">주소가 바뀌었거나 없는 문제일 수 있어요.</p>
      <Link href="/" className="btn btn-primary mt-4">문제 목록으로</Link>
    </div>
  );
}
