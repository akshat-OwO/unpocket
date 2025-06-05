import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

export const createSaveValidator = z.object({
    url: z.string().url("Invalid url format."),
    title: z.string().trim(),
    description: z.string().trim(),
    tags: z.array(z.string().trim(), { message: "Tags should be an array." })
        .optional(),
});
export type TCreateSaveValidator = z.infer<typeof createSaveValidator>;

export const editSaveValidator = createSaveValidator.extend({
    id: z.string(),
});
export type TEditSaveValidator = z.infer<typeof editSaveValidator>;

export const deleteSaveValidator = editSaveValidator.omit({
    url: true,
    title: true,
    description: true,
});
export type TDeleteSaveValidator = z.infer<typeof deleteSaveValidator>;

const defaultCreateValues: TCreateSaveValidator = {
    url: "",
    title: "",
    description: "",
    tags: [],
}
export const createSaveFormOpts = formOptions({
    defaultValues: defaultCreateValues,
    validators: {
        onChange: createSaveValidator,
    },
});

export const editSaveFormOpts = (defaultValues: TEditSaveValidator) =>
    formOptions({
        defaultValues,
        validators: {
            onChange: editSaveValidator,
        },
    });

export const deleteSaveFormOpts = (defaultValues: TDeleteSaveValidator) =>
    formOptions({
        defaultValues,
        validators: {
            onChange: deleteSaveValidator,
        },
    });
