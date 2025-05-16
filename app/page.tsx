import LaunchesListClientShell from "../components/LaunchesListClientShell";

export default async function LaunchesPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  const params = new URLSearchParams({ search: "", page: "1", pageSize: "12" });
  const res = await fetch(
    `${baseUrl}/api/launches-search?${params.toString()}`,
    {
      next: { revalidate: 3600 },
    }
  );
  const data = await res.json();
  return (
    <LaunchesListClientShell
      initialLaunches={data.launches}
      initialTotal={data.total}
    />
  );
}
