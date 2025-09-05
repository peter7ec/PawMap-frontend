import { API_URL } from "../constants/environment";
import type { UpdateLocationSchema } from "@/schemas/locationSchema";
import type { Location as ApiLocation } from "../types/global";

export default async function updateLocation(
  token: string,
  locationId: string,
  updateData: UpdateLocationSchema
): Promise<ApiLocation> {
  const res = await fetch(`${API_URL}/api/location/${locationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  const updatedLocation = (await res.json()) as ApiLocation;

  return updatedLocation;
}
