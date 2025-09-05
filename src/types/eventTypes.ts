export type User = {
  id: string;
  name?: string;
  email: string;
};

export type EventParticipant = {
  id: string;
  eventId: string;
  userId: string;
  interested: boolean;
  willBeThere: boolean;
  createdAt: string;
  user: User;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  eventId: string | null;
  locationId: string;
  userId: string;
  user: User;
  replies: Comment[];
};

export type Event = {
  id: string;
  createdById: string;
  createdAt: string;
  locationId?: string | null;
  address: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string | null;
  comments: Comment[];
  eventParticipants?: EventParticipant[];
};
