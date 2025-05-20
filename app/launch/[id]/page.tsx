import { LaunchDetailsClient } from '@/components/LaunchDetailsClient';
import { getLaunchDetails } from '@/lib/getLaunchDetails';

export default async function LaunchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const launch = await getLaunchDetails(id);
  return (
    <LaunchDetailsClient launch={launch} />
  );
}