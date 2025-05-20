import LaunchesListClientShell from "../components/LaunchesListClientShell";
import { getLaunches } from "../lib/getLaunches";

export default async function LaunchesPage() {
  const { launches, total } = await getLaunches({ search: "", page: 1, pageSize: 12 });
  return (
    <LaunchesListClientShell
      initialLaunches={launches}
      initialTotal={total}
    />
  );
}
