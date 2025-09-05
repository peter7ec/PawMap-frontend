import { useCallback, useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router";
import { Plus } from "lucide-react";
import SearchBar from "../components/SearchBar";
import SearchPageSkeleton from "../components/SearchPageSkeleton";
import SearchResultCard from "../components/ResultCards";
import searchService from "../services/searchService";
import type { SearchResult } from "../types/searchTypes";
import { Button } from "../components/ui/button";
import AuthContext from "../contexts/AuthContext";
import {
  createFavorite,
  deleteFavorite,
  getAllFavorites,
} from "../services/favoritesService";

const searchPlaceHolder: SearchResult = {
  ok: false,
  message: "",
  currentPage: 1,
  pageSize: 1,
  totalItems: 0,
  totalPages: 0,
  data: [],
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [favoriteLocationIds, setFavoriteLocationIds] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult>(searchPlaceHolder);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(
    searchParams.get("query") || ""
  );
  const [currentOrder, setCurrentOrder] = useState(
    searchParams.get("order") || "name_asc"
  );
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth?.user?.token) {
      getAllFavorites(auth.user.token)
        .then((response) => {
          const ids = response.data.map((fav) => fav.locationId);
          setFavoriteLocationIds(ids);
        })
        .catch(() => {
          console.error("Failed to fetch favorites.");
        });
    } else {
      setFavoriteLocationIds([]);
    }
  }, [auth?.user?.token]);

  const handleToggleFavorite = useCallback(
    async (locationId: string) => {
      if (!auth?.user?.token) return;

      const isFavorite = favoriteLocationIds.includes(locationId);

      try {
        if (isFavorite) {
          await deleteFavorite(locationId, auth.user.token);
          setFavoriteLocationIds((prev) =>
            prev.filter((id) => id !== locationId)
          );
        } else {
          await createFavorite(locationId, auth.user.token);
          setFavoriteLocationIds((prev) => [...prev, locationId]);
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    },
    [auth?.user?.token, favoriteLocationIds]
  );

  const handleSearch = useCallback(
    ({ order, query }: { order: string; query: string }) => {
      setSearchParams({ query, order });
      setLoading(true);
      setPage(1);
      setCurrentQuery(query);
      setCurrentOrder(order);
      setTimeout(() => {
        searchService.getItems(1, order, query).then(setResults);
        setLoading(false);
      }, 1000);
    },
    [setSearchParams]
  );

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;

    setIsFetchingMore(true);
    setTimeout(() => {
      searchService
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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Search Locations</h1>
        <p className="text-muted-foreground mt-2">
          Find the best pet-friendly spots in town.
        </p>
      </div>
      <SearchBar
        onSearch={({ query, order }) => setSearchParams({ query, order })}
        initialQuery={currentQuery}
        initialOrder={currentOrder}
      />
      {loading && <SearchPageSkeleton />}{" "}
      {results.totalItems === 0 && !loading && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No Results Found</h2>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}{" "}
      {!loading && results.totalItems !== 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {results.data.map((result) => (
              <SearchResultCard
                key={result.id}
                result={result}
                isFavorite={favoriteLocationIds.includes(result.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
          {results.currentPage < results.totalPages && (
            <div className="flex justify-center mt-8">
              <Button onClick={handleLoadMore} disabled={isFetchingMore}>
                {isFetchingMore ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
      {auth?.user && (
        <Link to="/create">
          <Button
            size="icon"
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-8 w-8" />
          </Button>
        </Link>
      )}
    </div>
  );
}
