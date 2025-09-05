import type { CreateEventSchema } from "../schemas/eventCreationFormData";
import { API_URL } from "../constants/environment";

export default async function addNewEvent(
  eventData: CreateEventSchema,
  token: string
) {
  const baseData = {
    ...eventData,
    startsAt: eventData.startsAt.toISOString(),
    endsAt: eventData.endsAt?.toISOString(),
  };

  const response = await fetch(`${API_URL}/api/event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(baseData),
  });

  return response.json();
}
