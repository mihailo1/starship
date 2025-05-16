import { gql } from '@apollo/client';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

export const LAUNCH_DETAILS_QUERY = gql`
  query Launch($id: ID!) {
    launch(id: $id) {
      id
      mission_name
      launch_date_utc
      details
      rocket { rocket_name rocket_type }
      links { wikipedia video_link mission_patch }
      launch_site { site_name_long }
    }
  }
`;

export const LAUNCHES_SEARCH_QUERY = gql`
  query Launches($find: LaunchFind, $limit: Int, $offset: Int, $sort: String, $order: String) {
    launches(find: $find, limit: $limit, offset: $offset, sort: $sort, order: $order) {
      id
      mission_name
      launch_date_utc
      rocket { rocket_name }
      links { wikipedia mission_patch }
    }
  }
`;

export function getApolloClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: 'https://spacex-production.up.railway.app/', fetch }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'no-cache', errorPolicy: 'ignore' },
      query: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
    },
  });
}
