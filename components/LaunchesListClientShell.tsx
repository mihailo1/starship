'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import LaunchesListClient from './LaunchesListClient';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { ListLaunch } from '../lib/types';

function LaunchesListClientShell({ initialLaunches = [], initialTotal = 0 }: { initialLaunches?: ListLaunch[]; initialTotal?: number }) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [loading, setLoading] = useState(false);
  const [launches, setLaunches] = useState(initialLaunches);
  const [total, setTotal] = useState(initialTotal);
  const isFirstRender = useRef(true);

  const fetchLaunches = useCallback(async (searchValue: string) => {
    setLoading(true);
    const params = new URLSearchParams({ search: searchValue, page: String(page), pageSize: String(pageSize) });
    const res = await fetch(`/api/launches-search?${params.toString()}`);
    const data = await res.json();
    setLaunches(data.launches);
    setTotal(data.total);
    setLoading(false);
  }, [page, pageSize]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchLaunches(debouncedSearch);
  }, [fetchLaunches, page, debouncedSearch]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <input
        className="border p-2 w-full mb-4 rounded"
        placeholder="Search by mission name..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
      <LaunchesListClient
        launches={launches}
        page={page}
        pageSize={pageSize}
        total={total}
        loading={loading}
        onPageChange={setPage}
      />
    </div>
  );
}

export default LaunchesListClientShell;