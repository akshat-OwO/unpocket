import {
    createFileRoute,
    redirect,
    stripSearchParams,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { EXT_callbackValidator } from "../../lib/validators/auth-validator";
import { supabase } from "../../lib/supabase";

export const Route = createFileRoute("/_ext/callback")({
    validateSearch: EXT_callbackValidator,
    search: {
        middlewares: [
            stripSearchParams({ access_token: "", refresh_token: "" }),
        ],
    },
    beforeLoad: async ({ search: { access_token, refresh_token } }) => {
        const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        });
        if (error) {
            throw redirect({
                to: "/login-failed",
            });
        }
        throw redirect({
            to: "/login-success",
        });
    },
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="p-4 rounded-md shadow-md bg-card text-card-foreground">
            <Loader2 className="size-4 animate-spin" />
        </div>
    );
}
