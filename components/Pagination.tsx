import Button from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function Pagination({ page, totalPages, onPageChange, loading = false }: PaginationProps) {
  return (
    <div className="flex justify-center gap-4 mt-6 items-center">
      <Button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || loading}
      >
        Previous
      </Button>
      {loading ? (
        <span className="px-4 py-2 min-w-[110px] h-6 bg-gray-200 rounded animate-pulse inline-flex items-center justify-center text-transparent select-none">
          Page {page} of {totalPages}
        </span>
      ) : (
        <span className="px-4 py-2 min-w-[110px]">Page {page} of {totalPages}</span>
      )}
      <Button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || loading}
      >
        Next
      </Button>
    </div>
  );
}
