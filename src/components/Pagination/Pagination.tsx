interface PaginationProps {
  nextUrl?: string;
  prevUrl?: string;
  onPageChange: (url?: string) => void;
}

const Pagination = ({ nextUrl, prevUrl, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        className="border bg-black text-white py-2 px-4 rounded"
        type="button"
        onClick={() => onPageChange(prevUrl)}
        disabled={!prevUrl}
      >
        Prev
      </button>
      <button
        className="border bg-black text-white py-2 px-4 rounded"
        type="button"
        onClick={() => onPageChange(nextUrl)}
        disabled={!nextUrl}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
