'use client';
import { useState, useEffect } from 'react';
import LaunchesListClient from './LaunchesListClient';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { ListLaunch } from '../lib/types';
import { useQuery } from '@tanstack/react-query';
import SearchInput from './SearchInput';

function fetchLaunches({ search, page }: { search: string; page: number }) {
  const params = new URLSearchParams({ search, page: String(page) });
  return fetch(`/api/launches-search?${params.toString()}`).then(res => res.json());
}

const getInitialPage = (initialPage: number) => {
  if (typeof window === 'undefined') return initialPage;
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get('page');
  const pageNum = pageParam ? parseInt(pageParam, 10) : initialPage;
  return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
};

function LaunchesListClientShell({ initialLaunches = [], initialTotal = 0, initialPage = 1 }: { initialLaunches?: ListLaunch[]; initialTotal?: number; initialPage?: number }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [page, setPage] = useState(() => getInitialPage(initialPage));
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const {
    data,
    isFetching,
  } = useQuery({
    queryKey: ['launches', debouncedSearch, page],
    queryFn: () => fetchLaunches({ search: debouncedSearch, page }),
    placeholderData: { launches: initialLaunches, total: initialTotal },
    enabled: !isFirstLoad,
  });

  useEffect(() => {
    if (isFirstLoad && (search !== '' || page !== initialPage)) {
      setIsFirstLoad(false);
    }
  }, [search, page, initialPage, isFirstLoad]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(page));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [page]);

  return (
    <div className="p-4 max-w-3xl mx-auto z-10 relative">
      <SearchInput
        value={search}
        onChange={value => {
          setSearch(value);
          setPage(1);
        }}
      />
      <LaunchesListClient
        launches={data.launches}
        page={page}
        total={data.total}
        loading={isFetching}
        onPageChange={setPage}
      />
    </div>
  );
}

export default LaunchesListClientShell;