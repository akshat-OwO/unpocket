import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import {
    editSaveFormOpts,
    TEditSaveValidator,
} from "../lib/validators/save-validator";
import { useForm } from "@tanstack/react-form";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";
import { Button, buttonVariants } from "@repo/ui/components/button";
import { AlertTriangle, Globe, Loader2 } from "lucide-react";
import { Textarea } from "@repo/ui/components/textarea";
import { useEditSaveMutation } from "../lib/queries/save-queries";
import { useQuery } from "@tanstack/react-query";
import { fetchTagQuery } from "../lib/queries/tag-queries";
import { MultiSelect } from "@repo/ui/components/multi-select";

export default function EditSaveDialog({
    isOpen,
    onClose,
    id,
    url,
    title,
    description,
    tags,
}: {
    isOpen: boolean;
    onClose: () => void;
} & TEditSaveValidator) {
    const { data: allTags, isLoading } = useQuery(fetchTagQuery);
    const { mutate: editSave, isPending, error } = useEditSaveMutation({ id });

    const form = useForm({
        ...editSaveFormOpts({ id, url, title, description, tags }),
        onSubmit: ({ value }) => {
            editSave({ ...value, onClose: onClose });
            form.reset();
        },
    });

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit your save</AlertDialogTitle>
                    <AlertDialogDescription>
                        Edit url, title or description of your save.
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
                    <form.Field name="url">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Url</Label>
                                <div className="relative">
                                    <Input
                                        id={field.name}
                                        type="url"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        placeholder={url}
                                        className="pl-10"
                                    />
                                    <div
                                        className={cn(
                                            buttonVariants({
                                                variant: "ghost",
                                                size: "icon",
                                                className:
                                                    "absolute top-1/2 -translate-y-1/2 left-0",
                                            })
                                        )}
                                    >
                                        <Globe className="size-4" />
                                    </div>
                                </div>
                                {field.state.meta.isTouched &&
                                !field.state.meta.isValid ? (
                                    <ul
                                        role="alert"
                                        className="text-destructive list-inside list-disc text-xs"
                                    >
                                        {field.state.meta.errors.map(
                                            (err) =>
                                                err && (
                                                    <li key={err.message}>
                                                        {err.message}
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                ) : null}
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="title">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Title</Label>
                                <Input
                                    id={field.name}
                                    type="text"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    placeholder={title}
                                />
                                {field.state.meta.isTouched &&
                                !field.state.meta.isValid ? (
                                    <ul
                                        role="alert"
                                        className="text-destructive list-inside list-disc text-xs"
                                    >
                                        {field.state.meta.errors.map(
                                            (err) =>
                                                err && (
                                                    <li key={err.message}>
                                                        {err.message}
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                ) : null}
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="description">
                        {(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>Description</Label>
                                <Textarea
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    placeholder={description}
                                    className="resize-none"
                                />
                                {field.state.meta.isTouched &&
                                !field.state.meta.isValid ? (
                                    <ul
                                        role="alert"
                                        className="text-destructive list-inside list-disc text-xs"
                                    >
                                        {field.state.meta.errors.map(
                                            (err) =>
                                                err && (
                                                    <li key={err.message}>
                                                        {err.message}
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                ) : null}
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="tags" mode="array">
                        {(field) => (
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                {isLoading ? (
                                    <div className="p-2 border rounded animate-pulse bg-muted">
                                        Loading tags...
                                    </div>
                                ) : (
                                    <div className="relative z-50">
                                        <MultiSelect
                                            options={
                                                allTags?.map((tag) => ({
                                                    value: tag.name,
                                                    label: tag.name,
                                                })) || []
                                            }
                                            selected={
                                                field.state.value?.map(
                                                    (tagName) => ({
                                                        value: tagName,
                                                        label: tagName,
                                                    })
                                                ) || []
                                            }
                                            onSelectionChange={(selected) => {
                                                field.handleChange(
                                                    selected.map(
                                                        (option) => option.value
                                                    )
                                                );
                                            }}
                                            placeholder="Select tags..."
                                            className="w-full"
                                        />
                                    </div>
                                )}
                                {field.state.meta.isTouched &&
                                !field.state.meta.isValid ? (
                                    <ul
                                        role="alert"
                                        className="text-destructive list-inside list-disc text-xs"
                                    >
                                        {field.state.meta.errors.map(
                                            (err) =>
                                                err && (
                                                    <li key={err.message}>
                                                        {err.message}
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                ) : null}
                            </div>
                        )}
                    </form.Field>
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
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                "Edit"
                            )}
                        </Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
