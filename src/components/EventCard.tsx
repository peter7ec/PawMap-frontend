import { Link } from "react-router";
import { Card, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import formatDate from "../services/formatDate";
import type { Event } from "@/types/eventTypes";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { id, startsAt, endsAt, title, description } = event;

  return (
    <Link to={`/event/${id}`}>
      <div className=" py-2">
        <Card className="gap-2 py-1 px-3 cursor-pointer animate-in fade-in-5 [animation-duration:700ms] transition-all ease-in-out hover:scale-105 [transition-duration:300ms]">
          <CardHeader className="px-0 py-3">
            <h3 className="text-xl ">{title}</h3>
          </CardHeader>
          <p className="truncate">{description}</p>
          <Separator />
          <div className="flex justify-between flex-col md:flex-row">
            <p className="text-sm">{`Start Date: ${formatDate(startsAt)}`}</p>
            {endsAt !== null ? (
              <p className="text-sm">{`End Date: ${formatDate(endsAt)}`}</p>
            ) : null}
          </div>
        </Card>
      </div>
    </Link>
  );
}
