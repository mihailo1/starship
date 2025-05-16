import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ApolloQueryResult } from '@apollo/client';
import { getWikipediaImage } from '@/lib/utils/getWikipediaImage';
import { LAUNCHES_SEARCH_QUERY, getApolloClient } from '@/lib/spacexApi';

const CACHE_TTL = 600_000;
const launchesCache: { launches: { id: string; mission_name: string; launch_date_utc: string; rocket_name: string; wikipedia?: string }[]; timestamp: number } = { launches: [], timestamp: 0 };

async function fetchAllLaunches() {
  const client = getApolloClient();
  const { data }: ApolloQueryResult<{ launches: { id: string; mission_name: string; launch_date_utc: string; rocket: { rocket_name: string }; links: { wikipedia?: string } }[] }> = await client.query({
    query: LAUNCHES_SEARCH_QUERY,
  });
  return (data.launches || []).map(l => ({
    id: l.id,
    mission_name: l.mission_name,
    launch_date_utc: l.launch_date_utc,
    rocket_name: l.rocket?.rocket_name || '',
    wikipedia: l.links?.wikipedia || '',
  }));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '12';
  let launches: { id: string; mission_name: string; launch_date_utc: string; rocket_name: string; wikipedia?: string }[] = [];

  // In-memory cache logic
  const now = Date.now();
  if (!launchesCache.launches.length || now - launchesCache.timestamp > CACHE_TTL) {
    try {
      launchesCache.launches = await fetchAllLaunches();
      launchesCache.timestamp = now;
    } catch (err) {
      console.error('Fetch failure:', err);
    }
  }
  launches = launchesCache.launches;

  // Filter by search (case-insensitive substring)
  const filtered = search
    ? launches.filter(l => l.mission_name?.toLowerCase().includes(search.toLowerCase()))
    : launches;

  const pageNum = parseInt(page, 10) || 1;
  const pageSizeNum = parseInt(pageSize, 10) || 12;
  const start = (pageNum - 1) * pageSizeNum;
  const end = start + pageSizeNum;
  const paged = filtered.slice(start, end);

  // For each paged launch, fetch image if wikipedia exists
  const launchesWithImages = await Promise.all(
    paged.map(async l => {
      let image_url: string | undefined = undefined;
      if (l.wikipedia) {
        const match = l.wikipedia.match(/\/wiki\/(.+)$/);
        const title = match ? match[1] : undefined;
        if (title) {
          image_url = await getWikipediaImage(title);
        }
      }
      return { ...l, image_url };
    })
  );

  return NextResponse.json({
    launches: launchesWithImages,
    total: filtered.length,
    page: pageNum,
    pageSize: pageSizeNum,
  });
}
