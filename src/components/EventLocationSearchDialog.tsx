import { useState, useCallback } from "react";
import { useSearchParams } from "react-router";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import SearchBar from "./SearchBar";
import { getAllLocationsWithoutPagination } from "../services/getAllLocations";
import type { Location as ApiLocation } from "../types/global";

export default function EventLocationSearchDialog({
  onSelect,
  selectedLocationName,
}: {
  onSelect: (
    locationId: string,
    locationName: string,
    locationAddress: string,
    locationImg: string
  ) => void;
  selectedLocationName?: string | null;
}) {
  const [searchParams] = useSearchParams();
  const [locationOptions, setLocationOptions] = useState<ApiLocation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [currentOrder, setCurrentOrder] = useState(
    searchParams.get("order") || "name_asc"
  );
  const handleSearch = useCallback(
    async ({ query, order }: { query: string; order: string }) => {
      try {
        const locations = await getAllLocationsWithoutPagination();

        const results = locations.data.filter((loc) =>
          loc.name.toLowerCase().includes(query.trim().toLowerCase())
        );

        if (order === "name_asc") {
          results.sort((a, b) => a.name.localeCompare(b.name));
        } else if (order === "name_desc") {
          results.sort((a, b) => b.name.localeCompare(a.name));
        }
        setCurrentOrder(order);

        setLocationOptions(results);
        setHasSearched(true);
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    },
    []
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="w-full sm:w-auto">
          {selectedLocationName || "Select Location (Optional)"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="
          sm:w-[900px] sm:h-[730px] w-full sm:rounded-lg
          h-[90vh] flex flex-col
          p-0 sm:p-6 
        "
      >
        <DialogHeader className="p-4 sm:p-0">
          <DialogTitle className="text-lg sm:text-xl">
            Choose Location (optional)
          </DialogTitle>
          <DialogDescription className="text-sm ">
            Choose a location for your event. You can search by name.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-0">
          <SearchBar
            onSearch={handleSearch}
            initialQuery=""
            initialOrder={currentOrder}
          />
        </div>

        <ul className="flex-1 divide-y divide-gray-200 overflow-y-auto">
          {hasSearched && locationOptions.length === 0 && (
            <li className="p-4 text-center text-gray-500 text-lg">
              No locations found
            </li>
          )}
          {hasSearched &&
            locationOptions.map((loc) => (
              <li key={loc.id}>
                <DialogClose asChild>
                  <button
                    type="button"
                    onClick={() =>
                      onSelect(
                        loc.id.toString(),
                        loc.name,
                        loc.address,
                        loc.images[0] || ""
                      )
                    }
                    className="w-full text-left px-4 py-3 text-base hover:bg-gray-100 flex items-center gap-4"
                  >
                    <img
                      className="w-20 h-auto flex-shrink-0"
                      src={loc.images[0]}
                      alt={loc.name}
                    />
                    <div>
                      <p className="font-medium">{loc.name}</p>
                      <p className="text-sm text-gray-500">{loc.address}</p>
                    </div>
                  </button>
                </DialogClose>
              </li>
            ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
