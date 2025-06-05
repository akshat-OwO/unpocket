import { z } from "zod";

export const providerAuthValidator = z.object({
    provider: z.enum(["google"]),
});
export type TProviderAuthValidator = z.infer<typeof providerAuthValidator>;

export const EXT_callbackValidator = z.object({
    access_token: z.string(),
    refresh_token: z.string(),
});
export type T_EXT_callbackValidator = z.infer<typeof EXT_callbackValidator>;
