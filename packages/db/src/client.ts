import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const createSupabaseClient = ({
    url,
    anonKey,
}: {
    url: string;
    anonKey: string;
}) => createClient<Database>(url, anonKey);
