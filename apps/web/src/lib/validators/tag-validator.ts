import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

export const createTagValidator = z.object({
    name: z.string().min(1, {
        message: "Tag name should be atleast 1 character long.",
    }),
});
export type TCreateTagValidator = z.infer<typeof createTagValidator>;

export const createTagFormOpts = formOptions({
    defaultValues: {
        name: "",
    },
    validators: {
        onChange: createTagValidator,
    },
});
