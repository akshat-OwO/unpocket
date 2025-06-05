import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { useForm } from "@tanstack/react-form";
import { createSaveFormOpts } from "../lib/validators/save-validator";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Textarea } from "@repo/ui/components/textarea";
import { AlertTriangle, Globe, Loader2 } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Button, buttonVariants } from "@repo/ui/components/button";
import { MultiSelect } from "@repo/ui/components/multi-select";
import { useCreateSaveMutation } from "../lib/queries/save-queries";
import { useQuery } from "@tanstack/react-query";
import { fetchTagQuery } from "../lib/queries/tag-queries";

export default function CreateSaveDialog({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { data: tags, isLoading } = useQuery(fetchTagQuery);
    const { mutate: createSave, isPending, error } = useCreateSaveMutation();

    const form = useForm({
        ...createSaveFormOpts,
        onSubmit: ({ value }) => {
            createSave({ ...value, onClose: onClose });
            form.reset();
        },
    });

    return (
        <AlertDialog open={isOpen} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create new save</AlertDialogTitle>
                    <AlertDialogDescription>
                        Save any url in UnPocket.
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
                                        placeholder="https://syllabusx.live"
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
                    <Accordion type="multiple">
                        <AccordionItem value="optional-details">
                            <AccordionTrigger>
                                Optional details
                            </AccordionTrigger>
                            <AccordionContent
                                className="space-y-4 px-px"
                                wrapperClassName="overflow-visible"
                            >
                                <form.Field name="title">
                                    {(field) => (
                                        <div className="space-y-2">
                                            <Label htmlFor={field.name}>
                                                Title
                                            </Label>
                                            <Input
                                                id={field.name}
                                                type="text"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="SyllabusX"
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
                                                                <li
                                                                    key={
                                                                        err.message
                                                                    }
                                                                >
                                                                    {
                                                                        err.message
                                                                    }
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
                                            <Label htmlFor={field.name}>
                                                Description
                                            </Label>
                                            <Textarea
                                                id={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Embark on a streamlined academic journey with SyllabusX – the ultimate hub for GGSIPU syllabi and study materials."
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
                                                                <li
                                                                    key={
                                                                        err.message
                                                                    }
                                                                >
                                                                    {
                                                                        err.message
                                                                    }
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
                                                            tags?.map(
                                                                (tag) => ({
                                                                    value: tag.name,
                                                                    label: tag.name,
                                                                })
                                                            ) || []
                                                        }
                                                        selected={
                                                            field.state.value?.map(
                                                                (tagName) => ({
                                                                    value: tagName,
                                                                    label: tagName,
                                                                })
                                                            ) || []
                                                        }
                                                        onSelectionChange={(
                                                            selected
                                                        ) => {
                                                            field.handleChange(
                                                                selected.map(
                                                                    (option) =>
                                                                        option.value
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
                                                                <li
                                                                    key={
                                                                        err.message
                                                                    }
                                                                >
                                                                    {
                                                                        err.message
                                                                    }
                                                                </li>
                                                            )
                                                    )}
                                                </ul>
                                            ) : null}
                                        </div>
                                    )}
                                </form.Field>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    {error && (
                        <div className="p-4 rounded shadow flex items-center gap-4 bg-destructive/75 text-neutral-100">
                            <AlertTriangle className="size-4" />
                            <p className="text-sm font-semibold">
                                {error.message}
                            </p>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel type="button">
                            Cancel
                        </AlertDialogCancel>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
