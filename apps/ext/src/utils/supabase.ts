import { createSupabaseClient } from "@repo/db/client";

export const supabase = createSupabaseClient({
    url: import.meta.env.WXT_SUPABASE_URL!,
    anonKey: import.meta.env.WXT_SUPABASE_ANON_KEY!,
});
