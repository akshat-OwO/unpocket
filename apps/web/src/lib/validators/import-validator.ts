import { z } from "zod/v4";

export const importValidator = z.object({
    file: z.file().mime("text/csv"),
});
export type TImportValidator = z.infer<typeof importValidator>;
