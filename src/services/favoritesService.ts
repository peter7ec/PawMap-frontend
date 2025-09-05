import type { ApiResponse } from "@/types/global";
import { API_URL } from "../constants/environment";
import type { Favorite } from "@/types/favoritesType";

export async function createFavorite(locationId: string, token: string) {
  const res = await fetch(`${API_URL}/api/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ locationId }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Backend error: ${errorText}`);
  }

  return res.json();
}

export async function getAllFavorites(
  token: string
): Promise<ApiResponse<Favorite[]>> {
  const res = await fetch(`${API_URL}/api/favorites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Backend error: ${errorText}`);
  }

  return res.json();
}

export async function deleteFavorite(
  locationId: string,
  token: string
): Promise<ApiResponse<{}>> {
  const res = await fetch(`${API_URL}/api/favorites/${locationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Backend error: ${errorText}`);
  }

  return res.json();
}
