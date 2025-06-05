import { createSupabaseClient } from "@repo/db/client";

export const supabase = createSupabaseClient({
    url: import.meta.env.VITE_SUPABASE_URL!,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
});
