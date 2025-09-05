import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Check, CircleQuestionMark } from "lucide-react";
import type { Event } from "../types/eventTypes";
import getOneEvent from "../services/getOneEvent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import AuthContext from "../contexts/AuthContext";
import CommentsSection from "../features/comments/containers/CommentsSection";
import useEventComments from "../features/comments/useComments";

export default function OneEventDetailPage() {
  const auth = useContext(AuthContext);
  const { eventId } = useParams<{ eventId: string }>();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    comments: liveComments,
    create: createComment,
    update: updateComment,
    remove: removeComment,
    typing: typingComment,
    typingUserId,
    setComments: setLiveComments,
    buildTree,
  } = useEventComments(
    "event",
    eventId ?? "",
    auth?.user ? { id: auth.user.id } : undefined
  );

  useEffect(() => {
    if (!eventData?.comments) return;
    setLiveComments((prev) => {
      if (prev.length > 0) return prev;
      const mapped = eventData.comments.map((c: any) => ({
        id: c.id,
        locationId: eventData.id,
        userId: c.user.id,
        content: c.content,
        createdAt: c.createdAt,
        parentId: c.parentId ?? null,
        user: {
          id: c.user.id,
          name: c.user.name,
          profile_avatar: c.user.profile_avatar,
        },
        repliesCount: c._count?.replies ?? 0,
      }));
      return mapped;
    });
  }, [eventData, setLiveComments]);

  useEffect(() => {
    if (!eventId) {
      setError("Missing event ID");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await getOneEvent(eventId);
        if (response && response.ok) {
          setEventData(response.data);
        } else {
          throw new Error(response.message || "Faild to fetch.");
        }
      } catch (err: any) {
        setError(err.message || "unknown error.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading || error || !eventData) {
    return (
      <div className="flex min-h-screen items-start justify-center bg-gray-50 p-4">
        <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-md">
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">Error: {error}</p>}
          {!loading && !error && !eventData && (
            <p className="text-center text-gray-500">Event not found</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center p-4 pt-8">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg md:p-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          {eventData.title}
        </h1>

        <div className="space-y-3 text-gray-600 ">
          <p>
            <strong className="font-semibold text-gray-800">Address: </strong>
            {eventData.address}
          </p>
          <p>
            <strong className="font-semibold text-gray-800 ">
              Description:
            </strong>
            {eventData.description}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Starts At: </strong>
            {new Date(eventData.startsAt).toLocaleString("hu-HU")}
          </p>
          {eventData.endsAt && (
            <p>
              <strong className="font-semibold text-gray-800">Ends At: </strong>
              {new Date(eventData.endsAt).toLocaleString("hu-HU")}
            </p>
          )}
        </div>
        <CommentsSection
          authUserId={auth?.user?.id}
          comments={liveComments}
          typingUserId={typingUserId}
          create={createComment}
          update={updateComment}
          remove={removeComment}
          typing={typingComment}
          buildTree={buildTree}
        />

        {eventData.eventParticipants &&
        eventData.eventParticipants.length > 0 ? (
          <div className="mt-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="participants" className="">
                <AccordionTrigger className="w-full  border-gray-200 py-3 text-xl font-semibold text-gray-800 hover:no-underline">
                  Participants ({eventData.eventParticipants.length})
                </AccordionTrigger>

                <AccordionContent className="pt-3">
                  <ul className="space-y-2">
                    {eventData.eventParticipants.map((participant) => (
                      <li
                        key={participant.id}
                        className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50"
                      >
                        <span className="text-gray-700">
                          {participant.user.name}
                        </span>

                        <div className="flex items-center">
                          {participant.willBeThere ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                              <Check />
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">
                              <CircleQuestionMark />
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : (
          <p className="mt-8 text-center text-gray-500">
            There are no participants yet.
          </p>
        )}
      </div>
    </div>
  );
}
