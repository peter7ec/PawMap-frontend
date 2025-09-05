import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Plus } from "lucide-react";
import eventSearchService from "../services/eventSearchService";
import AuthContext from "../contexts/AuthContext";
import type { EventSearchResult } from "../types/searchTypes";
import SearchBar from "../components/SearchBar";
import SearchPageSkeleton from "../components/SearchPageSkeleton";
import { Button } from "../components/ui/button";
import { toShortDate } from "../constants/date";

const searchPlaceHolder: EventSearchResult = {
  ok: false,
  message: "",
  currentPage: 1,
  pageSize: 1,
  totalItems: 0,
  totalPages: 0,
  data: [],
};
export default function EventSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<EventSearchResult>(searchPlaceHolder);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [currentOrder, setCurrentOrder] = useState(
    searchParams.get("order") || "name_asc"
  );
  const auth = useContext(AuthContext);

  const handleSearch = useCallback(
    ({ order, query }: { order: string; query: string }) => {
      setSearchParams({ query, order });
      setLoading(true);
      setPage(1);
      setCurrentQuery(query);
      setCurrentOrder(order);
      setTimeout(() => {
        eventSearchService.getItems(1, order, query).then(setResults);
        setLoading(false);
      }, 1000);
    },
    [setSearchParams]
  );
  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;

    setIsFetchingMore(true);
    setTimeout(() => {
      eventSearchService
        .getItems(nextPage, currentOrder, currentQuery)
        .then((newResults) => {
          setResults((prevResults) => ({
            ...newResults,
            data: [...prevResults.data, ...newResults.data],
          }));
          setPage(nextPage);
          setIsFetchingMore(false);
        });
    }, 1000);
  }, [page, currentOrder, currentQuery]);

  useEffect(() => {
    const queryFromUrl = searchParams.get("query");
    const orderFromUrl = searchParams.get("order");

    if (queryFromUrl !== null) {
      setCurrentQuery(queryFromUrl);
      setCurrentOrder(orderFromUrl || "name_asc");
      handleSearch({
        query: queryFromUrl,
        order: orderFromUrl || "name_asc",
      });
    } else {
      handleSearch({ query: "", order: "name_asc" });
    }
  }, [searchParams, handleSearch]);
  return (
    <div className="md:w-3/5 w-4/5 mx-auto flex flex-col items-center">
      <div className="my-5 w-full ">
        <h1 className="text-2xl mb-4">Search</h1>
        <p className="text-sm">Search any event name !</p>
        <SearchBar
          onSearch={handleSearch}
          initialQuery={currentQuery}
          initialOrder={currentOrder}
        />
      </div>
      <div className="w-full flex flex-col items-center">
        {loading && <SearchPageSkeleton />}
        {!loading && results.totalItems === 0 && <p>No results yet.</p>}
        {!loading && results.totalItems > 0 && (
          <div className="space-y-6 w-full">
            {results.data.map((result) => (
              <div
                key={result.id}
                className="bg-white shadow-lg w-full rounded-lg p-6 transition-transform transform hover:scale-105"
              >
                <Link
                  to={`/event/${result.id}`}
                  className="text-xl font-bold text-gray-800 mb-2"
                >
                  {result.title}
                </Link>
                <p className="text-md text-gray-600 mb-4">{result.address}</p>
                <p className="text-gray-700 leading-relaxed">
                  {result.description}
                </p>

                <div className="border-t border-gray-200 mt-4 pt-4 text-sm text-gray-500">
                  <p>
                    <strong>Starts At:</strong>
                    {toShortDate(result.startsAt)}
                  </p>
                  {result.endsAt && (
                    <p>Ends At: {toShortDate(result.endsAt)}</p>
                  )}
                  <p className="mt-2 text-xs">
                    <em>
                      Created At:
                      {toShortDate(result.createdAt)}
                    </em>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && results.currentPage < results.totalPages && (
          <div className="my-4">
            <Button onClick={handleLoadMore} disabled={isFetchingMore}>
              {isFetchingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        {isFetchingMore && <SearchPageSkeleton />}
      </div>
      {auth?.user && (
        <Link to="/event-creation">
          <Button className="fixed rounded-4xl bottom-5 right-5">
            <Plus strokeWidth={1} />
          </Button>
        </Link>
      )}
    </div>
  );
}
