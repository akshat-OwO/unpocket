import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import {
    deleteSaveFormOpts,
    TDeleteSaveValidator,
} from "../lib/validators/save-validator";
import { useForm } from "@tanstack/react-form";
import { useDeleteSaveMutation } from "../lib/queries/save-queries";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";

export default function DeleteSaveDialog({
    isOpen,
    onClose,
    id,
}: {
    isOpen: boolean;
    onClose: () => void;
} & TDeleteSaveValidator) {
    const {
        mutate: deleteSave,
        isPending,
        error,
    } = useDeleteSaveMutation({ id });

    const form = useForm({
        ...deleteSaveFormOpts({ id }),
        onSubmit: ({ value }) => {
            deleteSave({ ...value, onClose: onClose });
            form.reset();
        },
    });

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this save?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    {error && (
                        <div className="p-4 rounded shadow flex items-center gap-4 bg-destructive/75 text-neutral-100">
                            <AlertTriangle className="size-4" />
                            <p className="text-sm font-semibold">
                                {error.message}
                            </p>
                        </div>
                    )}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onClose()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
