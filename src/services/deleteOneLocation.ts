import { API_URL } from "../constants/environment";
import type { Location as ApiLocation } from "@/types/global";

export default async function deleteOneLocation(
  locationId: string,
  token: string
): Promise<ApiLocation> {
  const result = await fetch(`${API_URL}/api/location/${locationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return result.json() as Promise<ApiLocation>;
}
