import { useCallback, useEffect, useState } from "react";
import { socket, type CommentPayload } from "../../lib/socket";

export type CommentTargetType = "location" | "event";

export default function useComments(
  targetType: CommentTargetType,
  targetId: string,
  me?: { id: string }
) {
  const [comments, setComments] = useState<CommentPayload[]>([]);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!targetId || !targetType) return undefined;

    socket.emit("comment:subscribe", { targetType, targetId });

    const onNew = (d: CommentPayload) =>
      setComments((prev) => {
        if (prev.some((c) => c.id === d.id)) return prev;
        if (d.parentId) {
          const next = [d, ...prev];
          return next.map((c) =>
            c.id === d.parentId
              ? { ...c, repliesCount: (c.repliesCount ?? 0) + 1 }
              : c
          );
        }
        return [d, ...prev];
      });

    const onUpdated = (d: CommentPayload) =>
      setComments((prev) =>
        prev.map((c) => (c.id === d.id ? { ...c, ...d } : c))
      );
    const onDeleted = (d: { id: string }) =>
      setComments((prev) => {
        const deleted = prev.find((c) => c.id === d.id);
        const filtered = prev.filter((c) => c.id !== d.id);
        if (deleted?.parentId) {
          return filtered.map((c) =>
            c.id === deleted.parentId
              ? { ...c, repliesCount: Math.max(0, (c.repliesCount ?? 0) - 1) }
              : c
          );
        }
        return filtered;
      });

    let typingTimeout: ReturnType<typeof setTimeout> | null = null;
    const onTyping = (d: {
      targetType: CommentTargetType;
      targetId: string;
      userId: string;
    }) => {
      if (d.targetType !== targetType || d.targetId !== targetId) return;
      setTypingUserId(d.userId);
      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        setTypingUserId(null);
        typingTimeout = null;
      }, 1200);
    };

    socket.on("comment:new", onNew);
    socket.on("comment:updated", onUpdated);
    socket.on("comment:deleted", onDeleted);
    socket.on("comment:typing", onTyping);

    return () => {
      socket.emit("comment:unsubscribe", { targetType, targetId });
      socket.off("comment:new", onNew);
      socket.off("comment:updated", onUpdated);
      socket.off("comment:deleted", onDeleted);
      socket.off("comment:typing", onTyping);
    };
  }, [targetId, targetType]);

  const create = useCallback(
    (content: string, parentId?: string | null) =>
      new Promise<void>((resolve) => {
        const trimmed = content.trim();
        if (!me?.id) {
          resolve();
          return;
        }
        if (!trimmed) {
          resolve();
          return;
        }

        const payload = {
          targetType,
          targetId,
          userId: me.id,
          content: trimmed,
          parentId: parentId ?? null,
        };

        let settled = false;
        const done = (fn: () => void) => {
          if (settled) return;
          settled = true;
          fn();
        };

        const safety = setTimeout(() => {
          done(resolve);
        }, 6000);

        socket.timeout(5000).emit("comment:create", payload, () => {
          clearTimeout(safety);
          done(resolve);
        });
      }),
    [targetType, targetId, me?.id]
  );

  const update = useCallback(
    (id: string, content: string) =>
      new Promise<void>((resolve, reject) => {
        if (!me?.id) {
          reject(new Error("No user"));
          return;
        }

        const payload = {
          id,
          targetType,
          targetId,
          userId: me.id,
          content: content.trim(),
        };

        let settled = false;
        const done = (fn: () => void) => {
          if (settled) return;
          settled = true;
          fn();
        };

        const safety = setTimeout(() => {
          done(() => reject(new Error("Update timed out")));
        }, 6000);

        socket
          .timeout(5000)
          .emit(
            "comment:update",
            payload,
            (res?: { ok?: boolean; error?: string }) => {
              clearTimeout(safety);
              if (res?.ok === true) {
                done(resolve);
              } else if (res?.error) {
                done(() => reject(new Error(res.error)));
              } else {
                done(resolve);
              }
            }
          );
      }),
    [targetType, targetId, me?.id]
  );

  const remove = useCallback(
    (id: string) =>
      new Promise<void>((resolve, reject) => {
        if (!me?.id) {
          reject(new Error("No user"));
          return;
        }
        const payload = { id, targetType, targetId, userId: me.id };

        let settled = false;
        const done = (fn: () => void) => {
          if (settled) return;
          settled = true;
          fn();
        };
        const safety = setTimeout(() => {
          done(() => reject(new Error("Delete timed out")));
        }, 6000);

        socket
          .timeout(5000)
          .emit(
            "comment:delete",
            payload,
            (res?: { ok?: boolean; error?: string }) => {
              clearTimeout(safety);
              if (res?.ok === true) done(resolve);
              else if (res?.error) done(() => reject(new Error(res.error)));
              else done(resolve);
            }
          );
      }),
    [targetType, targetId, me?.id]
  );

  const typing = useCallback(() => {
    if (!me?.id) return;
    socket.emit("comment:typing", { targetType, targetId, userId: me.id });
  }, [targetType, targetId, me?.id]);

  const buildTree = useCallback((flat: CommentPayload[]) => {
    const nodeMap = flat.reduce<
      Record<
        string,
        CommentPayload & { children: any[]; repliesCount?: number }
      >
    >((acc, item) => {
      acc[item.id] = {
        ...item,
        children: [],
        repliesCount: (item as any).repliesCount ?? 0,
      };
      return acc;
    }, {});

    const attachChildren = (id: string): any => {
      const node = nodeMap[id];
      if (!node) return null;
      const children = flat
        .filter((it) => it.parentId === id)
        .map((it) => attachChildren(it.id))
        .filter(Boolean) as any[];
      return { ...node, children };
    };

    return flat
      .filter((it) => !it.parentId)
      .map((it) => attachChildren(it.id))
      .filter(Boolean) as any[];
  }, []);

  return {
    comments,
    typingUserId,
    create,
    update,
    remove,
    typing,
    setComments,
    buildTree,
  };
}
