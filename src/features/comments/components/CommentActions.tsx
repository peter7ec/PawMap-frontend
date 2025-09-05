import { Edit, Trash } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function CommentActions({
  isOwner,
  onEdit,
  onDelete,
}: {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!isOwner) {
    return null;
  }
  return (
    <div className="flex items-center">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit comment</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={onDelete}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Delete comment</span>
      </Button>
    </div>
  );
}
