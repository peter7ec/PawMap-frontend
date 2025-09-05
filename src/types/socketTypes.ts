export type CommentTargetType = "location" | "event";

export interface SubscribePayload {
  targetType: CommentTargetType;
  targetId: string;
}
export interface TypingPayload extends SubscribePayload {
  userId: string;
}
export interface CreatePayload extends SubscribePayload {
  userId: string;
  content: string;
  parentId?: string | null;
}
export interface UpdatePayload extends SubscribePayload {
  id: string;
  userId: string;
  content: string;
}
export interface DeletePayload extends SubscribePayload {
  id: string;
  userId: string;
}

export interface ServerAck {
  ok: boolean;
  error?: string;
}

export interface ClientToServerEvents {
  "comment:subscribe": (payload: SubscribePayload) => void;
  "comment:unsubscribe": (payload: SubscribePayload) => void;
  "comment:typing": (payload: TypingPayload) => void;
  "comment:create": (
    payload: CreatePayload,
    cb?: (res: ServerAck) => void
  ) => void;
  "comment:update": (
    payload: UpdatePayload,
    cb?: (res: ServerAck) => void
  ) => void;
  "comment:delete": (
    payload: DeletePayload,
    cb?: (res: ServerAck) => void
  ) => void;
}

export interface ServerToClientEvents {
  "comment:new": (payload: any) => void;
  "comment:updated": (payload: any) => void;
  "comment:deleted": (payload: { id: string }) => void;
  "comment:typing": (payload: TypingPayload) => void;
}
