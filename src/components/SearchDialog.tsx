import { useNavigate } from "react-router";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

type LoginPromptDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function SearchDialog(props: LoginPromptDialogProps) {
    const { open, onOpenChange } = props;

    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate("/login");
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Authentication Required</DialogTitle>
                    <DialogDescription>
                        You must be logged in to perform this action.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-between flex-col">
                    <Button onClick={handleLoginRedirect}>Login</Button>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
