import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Notebook, Plus, Trash } from "lucide-react";
import { Link } from "react-router";
import AuthContext from "../contexts/AuthContext";
import type { Event as ApiEvent } from "../types/eventTypes";
import getAllEvents from "../services/getAllEvents";
import { toDate, toShortDate } from "../constants/toShortDate";
import { Button } from "../components/ui/button";
import DeleteEventDialog from "../components/DeleteEventDialog";
import deleteOneEvent from "../services/deleteOneEvent";
import EventUpdateDialog from "../components/EventUpdateDialog";

export default function MyEventsPage() {
  const auth = useContext(AuthContext);
  const currentUserId = useMemo(() => auth?.user?.id ?? null, [auth?.user?.id]);
  const token = useMemo(() => auth?.user?.token ?? null, [auth?.user?.token]);

  const [events, setEvents] = useState<ApiEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const myEvents = useMemo(() => {
    if (!events || !currentUserId) return [];
    return events.filter((e) => e.createdById === currentUserId);
  }, [events, currentUserId]);

  useEffect(() => {
    if (!currentUserId) {
      setEvents([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);
    getAllEvents({ signal: controller.signal })
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          return;
        }
        const message =
          err instanceof Error ? err.message : "Failed to fetch events";
        setError(message);
        setEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [currentUserId]);

  const handleDelete = useCallback(
    async (eventId: string) => {
      try {
        if (!token) {
          setError("You must be logged in to delete an event.");
          return;
        }

        await deleteOneEvent(eventId, token);
        setEvents((prev) => prev.filter((event) => event.id !== eventId));

        setIsDeleteDialogOpen(false);
        setSelectedEvent(null);
      } catch {
        setError("Failed to delete event");
      }
    },
    [token]
  );

  const handleUpdateSelect = useCallback(
    (
      eventId: string,
      eventTitle: string,
      eventDescription: string,
      eventAddress: string,
      startsAt: Date,
      locationId: string,
      endsAt: Date
    ) => {
      setEvents((previous) =>
        previous.map((prev) =>
          prev.id === eventId
            ? {
                ...prev,
                title: eventTitle || prev.title,
                description: eventDescription || prev.description,
                address: eventAddress || prev.address,
                startsAt: startsAt ? startsAt.toISOString() : prev.startsAt,
                locationId: locationId || prev.locationId,
                endsAt: endsAt ? endsAt.toISOString() : prev.endsAt,
              }
            : prev
        )
      );
      setIsUpdateDialogOpen(false);
      setSelectedEvent(null);
    },
    []
  );

  return (
    <div className="min-h-screen p-4 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
      </header>

      {loading && <p className="text-gray-600">Loading events…</p>}

      {error && !loading && (
        <div className="text-red-600 bg-red-100 p-3 rounded mb-4">
          <p>Could not load events: {error}</p>
        </div>
      )}

      {!loading && !error && currentUserId && (
        <div>
          {myEvents.length === 0 ? (
            <p className="text-gray-600 text-center py-10">
              No events created yet.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {myEvents.map((event) => (
                <li
                  key={event.id}
                  className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  <div>
                    <h2 className="text-lg font-semibold mb-2 text-gray-900 truncate">
                      <Link to={`/event/${event.id}`}>{event.title}</Link>
                    </h2>
                    {event.address && (
                      <p className="text-sm text-gray-700 mb-1 truncate">
                        {event.address}
                      </p>
                    )}
                    {event.startsAt && (
                      <p className="text-xs text-gray-500 mb-1">
                        Starts: {toShortDate(event.startsAt)}
                      </p>
                    )}
                    {event.endsAt && (
                      <p className="text-xs text-gray-500 mb-3">
                        Ends: {toShortDate(event.endsAt)}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-gray-700 mb-3 line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    {event.eventParticipants &&
                      event.eventParticipants.length > 0 && (
                        <div className="text-sm text-gray-600 mb-4">
                          <p>
                            Will Be There:{" "}
                            {
                              event.eventParticipants.filter(
                                (participant) => participant.willBeThere
                              ).length
                            }
                          </p>
                          <p>
                            Interested:{" "}
                            {
                              event.eventParticipants.filter(
                                (participant) => participant.interested
                              ).length
                            }
                          </p>
                        </div>
                      )}
                  </div>

                  <div className="flex space-x-3 mt-auto pt-4 border-t border-gray-200">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      aria-label="Delete event"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="mr-2" size={16} />
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      aria-label="Edit event"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsUpdateDialogOpen(true);
                      }}
                    >
                      <Notebook className="mr-2" size={16} />
                      Edit
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedEvent && (
        <DeleteEventDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          eventName={selectedEvent.title}
          onConfirm={async () => {
            await handleDelete(selectedEvent.id);
          }}
        />
      )}

      {selectedEvent && (
        <EventUpdateDialog
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          selectedEventId={selectedEvent.id}
          selectedEventTitle={selectedEvent.title}
          selectedEventAddress={selectedEvent.address ?? ""}
          selectedEventDescription={selectedEvent.description ?? ""}
          selectedEventLocationId={selectedEvent.locationId ?? ""}
          selectedEventStartsAt={toDate(selectedEvent.startsAt)}
          selectedEventEndsAt={toDate(selectedEvent.endsAt)}
          onSelect={handleUpdateSelect}
        />
      )}
      {auth?.user && (
        <Link to="/event-creation">
          <Button className="fixed rounded-4xl bottom-5 right-5">
            <Plus strokeWidth={1} />
          </Button>
        </Link>
      )}
    </div>
  );
}
