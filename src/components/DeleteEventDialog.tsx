import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type DeleteEventDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventName?: string;
  onConfirm: () => void;
};

export default function DeleteEventDialog({
  open,
  onOpenChange,
  eventName,
  onConfirm,
}: DeleteEventDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete -{eventName ? `${eventName}` : "this event"}-
          </AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone. The location and its data will be permanently
            removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="hover:bg-red-500">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
