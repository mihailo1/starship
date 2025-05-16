import { render, screen } from '@testing-library/react';
import React from 'react'
import LaunchesListClient from '../components/LaunchesListClient';
import ApolloProviderWrapper from '../components/ApolloProviderWrapper';
import { getApolloClient, LAUNCHES_SEARCH_QUERY } from '../lib/spacexApi';
import { act } from 'react-dom/test-utils';
import type { ListLaunch } from '../lib/types';
import { Launch } from '@/lib/types/__generated__/graphql';

async function fetchValidLaunches(): Promise<ListLaunch[]> {
  const client = getApolloClient();
  const { data }: { data: { launches: Launch[] } } = await client.query({
    query: LAUNCHES_SEARCH_QUERY,
    variables: { limit: 10, offset: 0 },
  });

  return (data.launches || [])
    .map((l) => ({
      id: l.id!,
      mission_name: l.mission_name || '',
      launch_date_utc: l.launch_date_utc || '',
      rocket_name: l.rocket!.rocket_name || '',
      wikipedia: l.links?.wikipedia || '',
      image_url: l.links?.mission_patch || '',
    }));
}

describe('LaunchesListClient (real API)', () => {
  it('renders a list of launches from API', async () => {
    let launches: ListLaunch[] = [];
    await act(async () => {
      launches = await fetchValidLaunches();
    });
    expect(launches.length).toBeGreaterThan(0);
    render(
      <ApolloProviderWrapper>
        <LaunchesListClient
          launches={launches}
          page={1}
          pageSize={10}
          total={launches.length}
          loading={false}
          onPageChange={() => {}}
        />
      </ApolloProviderWrapper>
    );
    expect(await screen.findByText(launches[0].mission_name)).toBeInTheDocument();
  });

  it('shows empty state if no launches', () => {
    render(
      <ApolloProviderWrapper>
        <LaunchesListClient
          launches={[]}
          page={1}
          pageSize={10}
          total={0}
          loading={false}
          onPageChange={() => {}}
        />
      </ApolloProviderWrapper>
    );
    expect(screen.getByText(/No launches found/i)).toBeInTheDocument();
  });
});
