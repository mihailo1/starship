import { PAGE_SIZE } from "@/lib/constants";
import LaunchesListClientShell from "../components/LaunchesListClientShell";
import { getLaunches } from "../lib/getLaunches";
import { redirect } from "next/navigation";

interface SearchParams {
  page?: string;
}

export default async function LaunchesPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const page = Number(resolvedSearchParams.page) || 1;
  if (page < 1) {
    redirect("/?page=1");
  }
  const { launches, total } = await getLaunches({ search: "", page, pageSize: PAGE_SIZE });
  return (
    <LaunchesListClientShell
      initialLaunches={launches}
      initialTotal={total}
      initialPage={page}
    />
  );
}
