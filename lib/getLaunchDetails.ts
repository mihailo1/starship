import { ApolloQueryResult } from '@apollo/client';
import type { Launch } from './types/__generated__/graphql';
import { getWikipediaImage } from './utils/getWikipediaImage';
import { LAUNCH_DETAILS_QUERY, getApolloClient } from './spacexApi';

const CACHE_TTL = 600_000;
const launchCache: Record<string, { launch: Launch | null; image_url?: string; timestamp: number }> = {};

export async function fetchLaunchDetails(id: string) {
  const client = getApolloClient();
  const { data }: ApolloQueryResult<{ launch: Launch | null }> = await client.query({
    query: LAUNCH_DETAILS_QUERY,
    variables: { id },
  });
  let image_url: string | undefined = undefined;
  const wikipedia = data.launch?.links?.wikipedia;
  if (wikipedia) {
    const match = wikipedia.match(/\/wiki\/(.+)$/);
    const title = match ? match[1] : undefined;
    if (title) {
      image_url = await getWikipediaImage(title);
    }
  }
  return { ...data.launch, image_url };
}

export async function getLaunchDetails(id: string) {
  if (!id) throw new Error('Missing id');
  const now = Date.now();
  const cached = launchCache[id];
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return { ...cached.launch, image_url: cached.image_url };
  }
  const launch = await fetchLaunchDetails(id);
  launchCache[id] = { launch, image_url: launch.image_url, timestamp: now };
  return launch;
}
