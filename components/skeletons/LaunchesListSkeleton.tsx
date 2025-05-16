export default function LaunchesListSkeleton() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i} className="bg-white shadow rounded p-4 hover:bg-gray-50 transition flex flex-col min-h-[100px] flex justify-center">
          <div className="flex w-full mb-1">
            <div className="flex-1 flex flex-col justify-center">
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
            </div>
            <div className="ml-4 flex items-center justify-center">
              <span className="w-14 h-14 flex items-center justify-center rounded-full border bg-gray-100 animate-pulse">
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
