import { usePagination } from "~/contexts/PaginationContext";

const Pagination = () => {
  const { paginationState, setPaginationState } = usePagination();

  const fetchPage = (url?: string) => {
    if (!url) return;
    setPaginationState((prevState: any) => ({
      ...prevState,
      currentPageUrl: url
    }));
  };

  return (
    <div className="flex justify-between mt-4">
      <button
        className="border bg-gray-800 text-white py-2 px-4 rounded"
        type="button"
        onClick={() => fetchPage(paginationState.prevPageUrl)}
        disabled={!paginationState.prevPageUrl}
      >
        Prev
      </button>
      <button
        className="border bg-gray-800  text-white py-2 px-4 rounded"
        type="button"
        onClick={() => fetchPage(paginationState.nextPageUrl)}
        disabled={!paginationState.nextPageUrl}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
