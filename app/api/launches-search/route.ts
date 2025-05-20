import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getLaunches } from '@/lib/getLaunches';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);
  const data = await getLaunches({ search, page, pageSize });
  return NextResponse.json(data);
}
