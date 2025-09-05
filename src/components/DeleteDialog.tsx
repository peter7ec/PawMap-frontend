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

type DeleteLocationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationName?: string;
  onConfirm: () => void;
};

export default function DeleteLocationDialog({
  open,
  onOpenChange,
  locationName,
  onConfirm,
}: DeleteLocationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {locationName ? `“${locationName}”` : "this location"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The location and its data will be
            permanently removed.
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
