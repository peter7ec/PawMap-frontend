import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";

export default function CommentInput({
  onSend,
  onTyping,
  placeholder = "Write a comment…",
  disabled,
  initialValue = "",
}: {
  onSend: (text: string) => Promise<void> | void;
  onTyping?: () => void;
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string;
}) {
  const [text, setText] = useState(initialValue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    try {
      await onSend(t);
      setText("");
    } catch (err) {
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <Textarea
        value={text}
        className="resize-none overflow-y-auto break-words"
        onChange={(e) => {
          setText(e.target.value);
          onTyping?.();
        }}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!text.trim() || disabled}>
          Send
        </Button>
      </div>
    </form>
  );
}
