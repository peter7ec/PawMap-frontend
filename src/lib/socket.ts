import { WS_API_URL } from "@/constants/environment";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socketTypes";
import { io, Socket } from "socket.io-client";

export type CommentPayload = {
  id: string;
  locationId: string;
  userId: string;
  content: string;
  parentId?: string | null;
  createdAt: string;
  socketId?: string;
  user?: { id: string; name: string; profile_avatar: string | null };
  repliesCount?: number;
  targetType?: "location" | "event";
  targetId?: string;
};

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  (import.meta as any).env.VITE_WS_URL ?? WS_API_URL,
  {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    withCredentials: true,
    path: "/socket.io/",
  }
);
