import { useCallback } from "react";
import { Button } from "../../../components/ui/button";
import CommentInput from "../CommentInput";

export default function InlineEditBar({
  onConfirm,
  onCancel,
  disabled,
  onTyping,
  initialText = "",
}: {
  onConfirm: (text: string) => Promise<void> | void;
  onCancel: () => void;
  disabled?: boolean;
  onTyping?: () => void;
  initialText?: string;
}) {
  const handleSend = useCallback(
    async (t: string) => {
      await onConfirm(t);
      onCancel();
    },
    [onConfirm, onCancel]
  );
  return (
    <div className="flex flex-col md:flex-row gap-2 items-start">
      <CommentInput
        onSend={handleSend}
        onTyping={onTyping}
        disabled={disabled}
        initialValue={initialText}
        placeholder="Edit…"
      />
      <Button type="button" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
