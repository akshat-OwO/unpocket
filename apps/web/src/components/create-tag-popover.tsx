import { Button } from "@repo/ui/components/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@repo/ui/components/popover";
import { useForm } from "@tanstack/react-form";
import { Tags } from "lucide-react";
import { createTagFormOpts } from "../lib/validators/tag-validator";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import { useCreateTagMutation } from "../lib/queries/tag-queries";

export default function CreateTagPopover() {
    const { mutate: createTag } = useCreateTagMutation();
    const form = useForm({
        ...createTagFormOpts,
        onSubmit: ({ value }) => {
            createTag(value);
            form.reset();
        },
    });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    <Tags className="size-4" />
                    Create tags
                </Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="start">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <form.Field name="name">
                        {(field) => (
                            <>
                                <Label htmlFor={field.name}>Tag name</Label>
                                <Input
                                    id={field.name}
                                    type="text"
                                    name={field.name}
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    onBlur={field.handleBlur}
                                    placeholder="Enter tag name..."
                                />
                            </>
                        )}
                    </form.Field>
                </form>
            </PopoverContent>
        </Popover>
    );
}
