import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getLaunches } from '@/lib/getLaunches';
import type { LaunchesSearchCacheEntry } from '@/lib/types';

const apiCache: Record<string, LaunchesSearchCacheEntry> = {};
const API_CACHE_TTL = 60_000;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);
  const cacheKey = `${search}|${page}|${pageSize}`;
  const now = Date.now();
  if (apiCache[cacheKey] && now - apiCache[cacheKey].timestamp < API_CACHE_TTL) {
    return NextResponse.json(apiCache[cacheKey].data);
  }
  const data = await getLaunches({ search, page, pageSize });
  apiCache[cacheKey] = { data, timestamp: now };
  return NextResponse.json(data);
}
  