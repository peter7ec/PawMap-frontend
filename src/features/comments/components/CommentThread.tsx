import { useMemo } from "react";
import CommentActions from "./CommentActions";
import InlineEditBar from "./InlineEditBar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import formatDate from "../../../services/formatDate";

export type ThreadNode = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user?: { id: string; name: string; profile_avatar: string | null };
  parentId?: string | null;
  repliesCount?: number;
  children?: ThreadNode[];
};

export default function CommentThread({
  node,
  depth = 0,
  currentUserId,
  onEditStart,
  onDelete,
  editingId,
  onEditConfirm,
  onEditCancel,
  onTyping,
}: {
  node: ThreadNode;
  depth?: number;
  currentUserId?: string;
  onEditStart: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  editingId?: string | null;
  onEditConfirm: (id: string, content: string) => Promise<void> | void;
  onEditCancel: () => void;
  onTyping?: () => void;
}) {
  const isOwner = useMemo(
    () => !!currentUserId && currentUserId === (node.user?.id ?? node.userId),
    [currentUserId, node.user?.id, node.userId]
  );

  return (
    <div
      className={`flex gap-4 ${depth > 0 ? "ml-4 md:ml-8 pl-4 border-l" : ""}`}
    >
      <Avatar className="h-10 w-10 mt-1">
        <AvatarImage
          src={node.user?.profile_avatar ?? undefined}
          alt={node.user?.name}
        />
        <AvatarFallback>
          {(node.user?.name ?? "U").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2 group">
        {editingId !== node.id ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{node.user?.name ?? "User"}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(node.createdAt)}
                </p>
              </div>
              <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <CommentActions
                  isOwner={isOwner}
                  onEdit={() => onEditStart(node.id, node.content)}
                  onDelete={() => onDelete(node.id)}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {node.content}
            </p>
          </>
        ) : (
          <InlineEditBar
            initialText={node.content}
            onConfirm={(text) => onEditConfirm(node.id, text)}
            onCancel={onEditCancel}
            onTyping={onTyping}
          />
        )}

        {node.children && (
          <div className="space-y-6 pt-4">
            {node.children.map((childNode) => (
              <CommentThread
                key={childNode.id}
                node={childNode}
                depth={depth + 1}
                currentUserId={currentUserId}
                onEditStart={onEditStart}
                onDelete={onDelete}
                editingId={editingId}
                onEditConfirm={onEditConfirm}
                onEditCancel={onEditCancel}
                onTyping={onTyping}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
