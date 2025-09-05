import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Star, Trash2Icon, NotebookIcon, Plus } from "lucide-react";
import { Link } from "react-router";
import type { Location as ApiLocation, LocationUpdate } from "../types/global";
import AuthContext from "../contexts/AuthContext";
import { getAllLocationsWithoutPagination } from "../services/getAllLocations";
import deleteOneLocation from "../services/deleteOneLocation";
import LocationUpdateDialog from "../components/LocationUpdateDialog";
import { Badge } from "../components/ui/badge";
import type { LocationType } from "../types/locationTypes";
import DeleteLocationDialog from "../components/DeleteDialog";
import type { UpdateLocationSchema } from "../schemas/locationSchema";
import { Button } from "../components/ui/button";
import { parseAddress } from "../lib/utils";

export default function MyLocationsPage() {
  const [places, setPlaces] = useState<LocationUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationUpdate | null>(null);

  const auth = useContext(AuthContext);
  const currentUserId = useMemo(() => auth?.user?.id ?? null, [auth?.user?.id]);
  const token = useMemo(() => auth?.user?.token, [auth?.user?.token]);

  useEffect(() => {
    setLoading(true);
    const fetchPlaces = async () => {
      try {
        const data = await getAllLocationsWithoutPagination();
        if (!Array.isArray(data.data)) {
          throw new Error("Invalid data format");
        }
        const myPlaces = data.data.filter(
          (place: ApiLocation) =>
            String(place.createdById) === String(currentUserId)
        );
        const convertedPlaces = myPlaces.map((place) => ({
          ...place,
          address: parseAddress(place.address),
        }));
        setPlaces(convertedPlaces);
      } catch {
        setError("Failed to fetch locations");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [currentUserId]);

  const handleDelete = useCallback(
    async (locationId: string) => {
      try {
        if (!token) {
          setError("You must be logged in ");
          return;
        }
        await deleteOneLocation(locationId, token);
        setPlaces((prev) => prev.filter((place) => place.id !== locationId));
      } catch {
        setError("Failed to delete location");
      }
    },
    [setPlaces, setError, token]
  );

  const handleOpenUpdateDialog = useCallback((location: LocationUpdate) => {
    setSelectedLocation(location);
    setIsUpdateDialogOpen(true);
  }, []);

  const handleUpdateSelect = useCallback(
    (
      locationId: string,
      locationName: string,
      locationCity: string,
      locationStreet: string,
      locationImg: string,
      locationType?: UpdateLocationSchema["type"],
      description?: string | null
    ) => {
      setPlaces((previous) =>
        previous.map((prev) =>
          prev.id === locationId
            ? {
                ...prev,
                name: locationName || prev.name,
                address: { city: locationCity, street: locationStreet },
                images: locationImg ? [locationImg] : prev.images,
                type: locationType ?? prev.type,
                description: description ?? prev.description,
              }
            : prev
        )
      );
      setIsUpdateDialogOpen(false);
      setSelectedLocation(null);
    },
    []
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8 text-center">My Locations</h1>
      <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {places.length === 0 && <p>You have not created place.</p>}
        {places.length > 0 &&
          places.map((place) => (
            <li
              key={place.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              {place.images && place.images.length > 0 && (
                <img
                  src={place.images[0]}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 flex flex-col flex-grow">
                <Link
                  to={`/location/${place.id}`}
                  className="text-xl font-semibold mb-2"
                >
                  {place.name}
                </Link>
                <p className="text-gray-600 mb-1">{place.address.city}</p>
                <p className="text-gray-600 mb-1">{place.address.street}</p>
                <Badge variant={place.type as LocationType}>
                  {" "}
                  {place.type}
                </Badge>

                <div className="text-gray-500 text-sm mb-3">
                  Created at: {new Date(place.createdAt).toLocaleDateString()}
                </div>

                <div className="flex justify-between mb-3 text-sm text-gray-600">
                  <div>Comments: {place._count.comments}</div>
                  <div>Events: {place._count.events}</div>
                </div>

                <div className="flex items-center space-x-2 text-yellow-500 mb-4">
                  <Star />
                  <span>Avg: {place.reviewStats.average ?? "N/A"}</span>
                </div>

                <div className="mt-auto flex space-x-3">
                  <Button
                    className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition"
                    aria-label="Delete location"
                    variant="ghost"
                    onClick={() => {
                      setSelectedLocation(place);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2Icon />
                    <span>Delete</span>
                  </Button>

                  <Button
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition"
                    aria-label="Edit location"
                    variant="ghost"
                    onClick={() => handleOpenUpdateDialog(place)}
                  >
                    <NotebookIcon />
                    <span>Update</span>
                  </Button>
                </div>
              </div>
            </li>
          ))}
      </ul>

      {selectedLocation && (
        <LocationUpdateDialog
          open={isUpdateDialogOpen}
          onOpenChange={(open) => {
            setIsUpdateDialogOpen(open);
            if (!open) setSelectedLocation(null);
          }}
          selectedLocationId={selectedLocation.id}
          selectedLocationName={selectedLocation.name}
          selectedLocationCity={selectedLocation.address.city}
          selectedLocationStreet={selectedLocation.address.street}
          selectedLocationImg={
            selectedLocation.images ? selectedLocation.images[0] : ""
          }
          selectedLocationType={selectedLocation.type as any}
          selectedLocationDescription={selectedLocation.description}
          onSelect={handleUpdateSelect}
        />
      )}
      {selectedLocation && (
        <DeleteLocationDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            if (!open) setSelectedLocation(null);
          }}
          locationName={selectedLocation.name}
          onConfirm={async () => {
            await handleDelete(selectedLocation.id);
            setIsDeleteDialogOpen(false);
            setSelectedLocation(null);
          }}
        />
      )}
      {auth?.user && (
        <Link to="/create">
          <Button className="fixed rounded-4xl bottom-5 right-5">
            <Plus strokeWidth={1} />
          </Button>
        </Link>
      )}
    </div>
  );
}
