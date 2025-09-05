import { API_URL } from "../constants/environment";
import type { Location as ApiLocation } from "../types/global";

interface ApiResponse<T> {
  ok: boolean;
  message: string;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  data: T;
}

export async function getAllLocations(): Promise<ApiLocation[]> {
  const res = await fetch(`${API_URL}/api/location`);
  if (!res.ok) {
    throw new Error("Couldn't get locations");
  }
  const response: ApiResponse<ApiLocation[]> = await res.json();
  if (!response.ok) {
    throw new Error(`API error: ${response.message}`);
  }
  return response.data;
}

export async function getAllLocationsWithoutPagination(): Promise<
  ApiResponse<ApiLocation[]>
> {
  const response = await fetch(`${API_URL}/api/location`);

  return response.json();
}
