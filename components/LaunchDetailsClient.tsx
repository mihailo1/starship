'use client';
import { LaunchWithImage } from '../lib/types';
import Button from './Button';
import ReadMore from './ReadMore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export function LaunchDetailsClient({ launch }: { launch: LaunchWithImage | null }) {
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = useState(false);

  if (!launch) return <div className="p-6 text-center text-gray-500">Launch not found</div>;


  const imageUrl = launch.image_url || launch.links?.mission_patch || null;

  return (
    <div
      className="launchDetailsMobileCard p-4 sm:p-6 max-w-full sm:max-w-3xl mx-auto my-6 sm:my-12 bg-white sm:bg-gradient-to-br sm:from-white sm:to-gray-50 rounded-2xl animate-fade-in transition-all duration-300"
    >
      {/* Header Section */}
      <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-gray-100 pb-4 text-center sm:text-left">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight break-words">{launch.mission_name}</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {launch.launch_date_utc ? new Date(launch.launch_date_utc).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }) : 'Date unavailable'}
          </p>
        </div>
        <span className="overflow-hidden rounded-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={launch.mission_name || 'Mission'}
            width={96}
            height={96}
            priority
            quality={75}
            className={`object-cover border-2 border-gray-100 shadow-sm bg-gray-100 mx-auto sm:mx-0 aspect-square transition-all duration-100 ${imgLoaded ? 'blur-0 scale-100' : 'blur-md scale-110'}`}
            onLoadingComplete={() => setImgLoaded(true)}
          />
        ) : (
          <span className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full border-2 border-gray-100 bg-gray-100 text-gray-300 mx-auto sm:mx-0">
            <Image src="/rocket-placeholder.svg" alt="Rocket" width={32} height={32} className="sm:w-10 sm:h-10" />
          </span>
        )}
        </span>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 mb-8">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Mission Details</h2>
          <ReadMore
            text={launch.details || 'No mission details available.'}
            className="mt-2 text-gray-600 text-xs sm:text-sm leading-relaxed"
          />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Launch Information</h2>
          <ul className="mt-2 text-xs sm:text-sm text-gray-600 space-y-2">
            <li><span className="font-medium">Rocket:</span> {launch.rocket?.rocket_name || 'Unknown'} ({launch.rocket?.rocket_type || 'N/A'})</li>
            <li><span className="font-medium">Launch Site:</span> {launch.launch_site?.site_name_long || 'Unknown'}</li>
          </ul>
        </div>
      </div>

      {/* Links Section */}
      {(launch.links?.wikipedia || launch.links?.video_link) && (
        <div className="mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Resources</h2>
          <div className="mt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {launch.links?.wikipedia && (
              <a
                href={launch.links.wikipedia}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wikipedia
              </a>
            )}
            {launch.links?.video_link && (
              <a
                href={launch.links.video_link}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch Video
              </a>
            )}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-6 flex justify-center sm:justify-end">
        <Button dark onClick={() => router.push('/')}>
          Back to List
        </Button>
      </div>
    </div>
  );
}