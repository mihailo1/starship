import { NextRequest, NextResponse } from 'next/server';
import { getLaunchDetails } from '@/lib/getLaunchDetails';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  try {
    const launch = await getLaunchDetails(id);
    return NextResponse.json({ launch });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch launch' }, { status: 500 });
  }
}
