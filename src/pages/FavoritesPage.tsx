import { useCallback, useContext, useEffect, useState } from "react";
import { Star, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import AuthContext from "../contexts/AuthContext";
import type { Favorite } from "@/types/favoritesType";
import { deleteFavorite, getAllFavorites } from "../services/favoritesService";
import { Badge } from "../components/ui/badge";
import { LocationType } from "../types/locationTypes";
import { Button } from "../components/ui/button";
import FavoritesSkeleton from "../components/FavoritesSkeleton";
import { Toaster } from "../components/ui/sonner";

export default function FavoritesPage() {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [favoritesData, setFavoritesData] = useState<Favorite[]>([]);
  const [error, setError] = useState("");

  const handleDeleteBtn = useCallback(
    async (locationId: string) => {
      if (!auth?.user?.token) {
        setError("You do not have token.");
        toast.error(error, {
          duration: 3000,
          style: { background: "#f7f7f7", color: "red" },
        });
        return;
      }
      const deletedData = await deleteFavorite(locationId, auth?.user?.token);
      if (deletedData.ok === true) {
        const updatedFavorites = favoritesData.filter(
          (favorite) => favorite.locationId !== locationId
        );
        setFavoritesData(updatedFavorites);
        setError("");
      } else {
        setError("Failed to delete the favorite location");
        toast.error(error, {
          duration: 3000,
          style: { background: "#f7f7f7", color: "red" },
        });
      }
    },
    [auth?.user?.token, error, favoritesData]
  );

  useEffect(() => {
    setLoading(true);
    setError("");
    const fetchPlaces = async () => {
      try {
        if (!auth?.user?.token) return;

        const data = await getAllFavorites(auth?.user?.token);

        setFavoritesData(data.data);
      } catch {
        setError("Failed to fetch locations");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [auth?.user?.token]);
  return (
    <div>
      <h1 className="text-3xl mb-4">Favorite Locations</h1>
      {loading && <FavoritesSkeleton />}
      {!loading && error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && favoritesData.length === 0 && (
        <p className="text-gray-500 text-center">
          You have no favorite locations yet.
        </p>
      )}

      {!loading && !error && favoritesData.length > 0 && (
        <div>
          <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {favoritesData.map((place) => (
              <li
                key={place.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                {place.location.images && place.location.images.length > 0 && (
                  <img
                    src={place.location.images[0]}
                    alt={place.location.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-2">
                    <Link to={`/location/${place.locationId}`}>
                      {place.location.name}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-1">{place.location.address}</p>
                  <Badge variant={place.location.type as LocationType}>
                    {" "}
                    {place.location.type}
                  </Badge>

                  <div className="flex justify-between mb-3 text-sm text-gray-600">
                    <div>Comments: {place.location._count.comments}</div>
                    <div>Events: {place.location._count.events}</div>
                  </div>

                  <div className="flex items-center space-x-2 text-yellow-500 mb-4">
                    <Star />
                    <span>Avg: {place.location.reviewAverage ?? "N/A"}</span>
                  </div>

                  <div className="mt-auto flex space-x-3">
                    <Button
                      className="flex items-center text-base space-x-1 text-red-500 hover:text-red-700 transition h-8 w-auto px-2"
                      variant="ghost"
                      onClick={() => {
                        handleDeleteBtn(place.locationId);
                      }}
                    >
                      <Trash2Icon />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Toaster richColors position="top-center" />
        </div>
      )}
    </div>
  );
}
