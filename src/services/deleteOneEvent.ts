import { API_URL } from "../constants/environment";
import type { Event as ApiEvent } from "../types/eventTypes";

export default async function deleteOneEvent(
  eventId: string,
  token: string
): Promise<ApiEvent> {
  const result = await fetch(`${API_URL}/api/event/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return result.json() as Promise<ApiEvent>;
}
