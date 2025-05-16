import { LaunchDetailsClient } from '@/components/LaunchDetailsClient';

export default async function LaunchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/launch-details?id=${id}`, { cache: 'no-store' });
  const data = await res.json();

  return (
      <LaunchDetailsClient launch={data.launch} />
  );
}