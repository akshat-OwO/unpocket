import { supabase } from "../supabase";
import {
    providerAuthValidator,
    TProviderAuthValidator,
} from "../validators/auth-validator";

export const providerAuth = async ({
    data,
}: {
    data: TProviderAuthValidator;
}) => {
    const validatedData = providerAuthValidator.safeParse(data);
    if (!validatedData.success) {
        throw new Error("Validation failed");
    }
    const { provider } = validatedData.data;

    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: import.meta.env.VITE_WEB_URL,
            }
        });
        if (error) {
            throw new Error(error.message);
        }
        return true;
    } catch (error) {
        throw new Error("Provider authentication failed");
    }
};

export const logoutUser = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
        return true;
    } catch (error) {
        throw new Error("Logout failed");
    }
};
