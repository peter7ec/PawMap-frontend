import { useMemo, useState, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import CommentInput from "../CommentInput";
import CommentThread, { type ThreadNode } from "../components/CommentThread";
import type { CommentPayload } from "@/lib/socket";

export default function CommentsSection({
  authUserId,
  comments,
  typingUserId,
  create,
  update,
  remove,
  typing,
  buildTree,
}: {
  authUserId?: string;
  comments: CommentPayload[];
  typingUserId: string | null;
  create: (text: string) => Promise<void>;
  update: (id: string, text: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  typing: () => void;
  buildTree: (flat: CommentPayload[]) => ThreadNode[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const tree = useMemo(() => buildTree(comments), [comments, buildTree]);

  const handleEditStart = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleSend = useCallback(
    async (t: string) => {
      await create(t);
    },
    [create]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await remove(id);
    },
    [remove]
  );

  const handleEditConfirm = useCallback(
    async (id: string, text: string) => {
      try {
        await update(id, text);
        setEditingId(null);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Update failed:", err);
      }
    },
    [update]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {authUserId && (
          <CommentInput
            onSend={handleSend}
            onTyping={typing}
            placeholder="Write a public comment..."
          />
        )}

        {typingUserId && (
          <p className="text-sm text-muted-foreground italic">
            Someone is typing...
          </p>
        )}

        {tree.length > 0 ? (
          <div className="space-y-6">
            {tree.map((node) => (
              <CommentThread
                key={node.id}
                node={node}
                depth={0}
                currentUserId={authUserId}
                onEditStart={handleEditStart}
                onDelete={handleDelete}
                editingId={editingId}
                onEditConfirm={handleEditConfirm}
                onEditCancel={handleEditCancel}
                onTyping={typing}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Nobody has commented yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
