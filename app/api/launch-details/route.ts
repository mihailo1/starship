import { NextRequest, NextResponse } from 'next/server';
import { ApolloQueryResult } from '@apollo/client';
import type { Launch } from '../../../lib/types/__generated__/graphql';
import { getWikipediaImage } from '@/lib/utils/getWikipediaImage';
import { LAUNCH_DETAILS_QUERY, getApolloClient } from '@/lib/spacexApi';

const CACHE_TTL = 600_000;
const launchCache: Record<string, { launch: Launch | null; image_url?: string; timestamp: number }> = {};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const now = Date.now();
  const cached = launchCache[id];
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ launch: { ...cached.launch, image_url: cached.image_url } });
  }

  const client = getApolloClient();
  try {
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
    launchCache[id] = { launch: data.launch ?? null, image_url, timestamp: now };
    return NextResponse.json({ launch: { ...data.launch, image_url } });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch launch' }, { status: 500 });
  }
}
