import { API_URL } from "../constants/environment";
import type { Event } from "../types/eventTypes";

type UpdateEventData = Partial<Omit<Event, "id">>;

export default async function updateEvent(
  token: string,
  eventId: string,
  updateData: UpdateEventData
): Promise<Event> {
  const res = await fetch(`${API_URL}/api/event/${eventId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to update event: ${res.status} ${res.statusText}${
        text ? ` - ${text}` : ""
      }`
    );
  }

  const updatedEvent = (await res.json()) as Event;

  return updatedEvent;
}
