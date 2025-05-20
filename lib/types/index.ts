import { Launch } from './__generated__/graphql';

export type LaunchWithImage = Launch & { image_url?: string | null };

export type ListLaunch = {
  id: string;
  mission_name: string;
  launch_date_utc: string;
  rocket_name: string;
  wikipedia?: string;
  image_url?: string;
};

export type LaunchesSearchCacheEntry = {
  data: {
    launches: ListLaunch[];
    total: number;
    page: number;
    pageSize: number;
  };
  timestamp: number;
};
