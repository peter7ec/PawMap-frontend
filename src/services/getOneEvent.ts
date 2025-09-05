import type { ApiResponse } from "@/types/global";
import type { Event as ApiEvent } from "../types/eventTypes";
import { API_URL } from "../constants/environment";

export default async function getOneEvent(
  eventId: string
): Promise<ApiResponse<ApiEvent>> {
  const res = await fetch(`${API_URL}/api/event/${eventId}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Backend error: ${errorText}`);
  }
  return res.json();
}
