import type { ApiResponse } from "@/types/global";
import { API_URL } from "../constants/environment";
import type { Location } from "../types/locationTypes";

export async function createLocation(payload: any, token: string) {
  const res = await fetch(`${API_URL}/api/location`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Backend error: ${errorText}`);
  }

  return res.json();
}
export async function getOneLocation(
  locationId: string
): Promise<ApiResponse<Location>> {
  const res = await fetch(`${API_URL}/api/location/${locationId}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Backend error: ${errorText}`);
  }
  return res.json();
}
