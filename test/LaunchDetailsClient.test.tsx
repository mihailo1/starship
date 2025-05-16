import React from 'react';
import { render, screen } from '@testing-library/react';
import { LaunchDetailsClient } from '../components/LaunchDetailsClient';
import ApolloProviderWrapper from '../components/ApolloProviderWrapper';
import { getApolloClient, LAUNCH_DETAILS_QUERY, LAUNCHES_SEARCH_QUERY } from '../lib/spacexApi';
import { act } from 'react-dom/test-utils';
import { Launch } from '@/lib/types/__generated__/graphql';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), pathname: '/', query: {}, asPath: '/', basePath: '', events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() }, isFallback: false, isReady: true, isLocaleDomain: false, isPreview: false }),
}));


async function fetchValidLaunch(): Promise<Launch> {
  const client = getApolloClient();
  // Fetch a list of launches
  const { data } = await client.query({
    query: LAUNCHES_SEARCH_QUERY,
    variables: { limit: 10, offset: 0 },
  });
  // Find the first launch with mission_name and launch_site
  const valid = (data.launches || []).find((l: any) => l.id && l.mission_name && l.rocket?.rocket_name && l.launch_date_utc);
  if (!valid) throw new Error('No valid launch found in API');
  // Fetch full details for that launch
  const { data: details } = await client.query({
    query: LAUNCH_DETAILS_QUERY,
    variables: { id: valid.id },
  });
  return { ...details.launch, image_url: details.launch?.links?.mission_patch };
}

describe('LaunchDetailsClient (real API)', () => {
  it('renders real launch details from API', async () => {
    let launch: Launch | undefined;
    await act(async () => {
      launch = await fetchValidLaunch();
    });
    expect(launch).toBeDefined();
    render(
      <ApolloProviderWrapper>
        <LaunchDetailsClient launch={launch!} />
      </ApolloProviderWrapper>
    );
    expect(await screen.findByText(launch?.mission_name!)).toBeInTheDocument();
    if (launch?.launch_site && launch?.launch_site.site_name_long) {
      expect(screen.getByText(launch?.launch_site.site_name_long)).toBeInTheDocument();
    }
  });

  it('shows not found if launch is null', () => {
    render(
      <ApolloProviderWrapper>
        <LaunchDetailsClient launch={null} />
      </ApolloProviderWrapper>
    );
    expect(screen.getByText(/Launch not found/i)).toBeInTheDocument();
  });
});