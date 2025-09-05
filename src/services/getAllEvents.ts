import { API_URL } from "../constants/environment";
import type { Event } from "../types/eventTypes";

type EventsResponse<T> = {
  ok: boolean;
  message: string;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  data: T[];
};

export default async function getAllEvents(options?: {
  signal?: AbortSignal;
}): Promise<Event[]> {
  const { signal } = options || {};
  const res = await fetch(`${API_URL}/api/event`, { signal });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch events: ${res.status} ${res.statusText}${
        text ? ` - ${text}` : ""
      }`
    );
  }
  const json = (await res.json()) as EventsResponse<Event> | unknown;
  if (json && typeof json === "object" && Array.isArray((json as any).data)) {
    return (json as any).data as Event[];
  }
  if (Array.isArray(json)) {
    return json as Event[];
  }
  throw new Error("Invalid data format: expected { data: Event[] }");
}
