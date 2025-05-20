import { ApolloQueryResult } from '@apollo/client';
import { getWikipediaImage } from './utils/getWikipediaImage';
import { LAUNCHES_SEARCH_QUERY, getApolloClient } from './spacexApi';
import type { ListLaunch } from './types';
import { Launch } from './types/__generated__/graphql';

const CACHE_TTL = 600_000;
const launchesCache: { launches: ListLaunch[]; timestamp: number } = { launches: [], timestamp: 0 };

export async function fetchAllLaunches(): Promise<ListLaunch[]> {
  const client = getApolloClient();
  const { data }: ApolloQueryResult<{ launches: Launch[] }> = await client.query({
    query: LAUNCHES_SEARCH_QUERY,
  });
  return (data.launches || []).map(l => ({
    id: l.id ?? '',
    mission_name: l.mission_name ?? '',
    launch_date_utc: l.launch_date_utc,
    rocket_name: l.rocket?.rocket_name || '',
    wikipedia: l.links?.wikipedia || '',
  }));
}

export async function getLaunches({ search = '', page = 1, pageSize = 12 }: { search?: string; page?: number; pageSize?: number }) {
  const now = Date.now();
  if (!launchesCache.launches.length || now - launchesCache.timestamp > CACHE_TTL) {
    try {
      launchesCache.launches = await fetchAllLaunches();
      launchesCache.timestamp = now;
    } catch (err) {
      console.error('Fetch failure:', err);
    }
  }
  let launches = launchesCache.launches;
  if (search) {
    launches = launches.filter(l => l.mission_name?.toLowerCase().includes(search.toLowerCase()));
  }
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paged = launches.slice(start, end);
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
  return {
    launches: launchesWithImages,
    total: launches.length,
    page,
    pageSize,
  };
}
