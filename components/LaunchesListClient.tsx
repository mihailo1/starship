'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import LaunchesListSkeleton from './skeletons/LaunchesListSkeleton';
import Pagination from './Pagination';
import { ListLaunch } from '../lib/types';
import RocketPlaceholderIcon from '../public/rocket-placeholder.svg';

interface LaunchesListClientProps {
  launches: ListLaunch[];
  page: number;
  pageSize: number;
  total: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

function LaunchListItem({ launch }: { launch: ListLaunch }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <li className="bg-white shadow rounded p-4 hover:bg-gray-50 transition flex flex-col min-h-[100px] flex justify-center">
      <Link href={`/launch/${launch.id}`} className="text-gray-900 w-full">
        <div className="flex w-full mb-1">
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div
              className="font-bold text-lg truncate whitespace-nowrap overflow-hidden"
              title={launch.mission_name}
            >
              {launch.mission_name}
            </div>
            <div className="text-sm text-gray-500">{launch.rocket_name} | {launch.launch_date_utc ? new Date(launch.launch_date_utc).toLocaleDateString() : 'Unknown date'}</div>
          </div>
          <div className="ml-4 flex items-center justify-center">
            <span className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden">
              {launch.image_url ? (
                <Image
                  src={launch.image_url}
                  alt={launch.mission_name}
                  width={56}
                  height={56}
                  priority
                  quality={75}
                  className={`object-cover rounded-full aspect-square w-14 h-14 transition-all duration-100 ${imgLoaded ? 'blur-0 scale-100' : 'blur-md scale-110'}`}
                  onLoadingComplete={() => setImgLoaded(true)}
                />
              ) : (
                <Image src={RocketPlaceholderIcon} alt="Rocket" width={32} height={32} />
              )}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function LaunchesListClient({ launches, page, pageSize, total, loading = false, onPageChange }: LaunchesListClientProps) {
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div>
      {loading ? (
        <LaunchesListSkeleton />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {launches.map(launch => (
            <LaunchListItem key={launch.id} launch={launch} />
          ))}
        </ul>
      )}
      {!loading && launches.length === 0 ? (
        <div className="text-center text-gray-400 py-12 text-lg select-none">
          <span role="img" aria-label="not found" className="block text-4xl mb-2">🚀</span>
            No launches found.
        </div>
      ) : (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} loading={loading} />
      )}
    </div>
  );
}