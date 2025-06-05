import { browser } from "wxt/browser";
import { Button } from "@repo/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";
import { googleIcon } from "../../../../components/icons/google";
import { supabase } from "../../../../utils/supabase";

export const Route = createFileRoute("/_auth/login")({
    component: RouteComponent,
});

function RouteComponent() {
    const handleProviderLogin = async (provider: "google") => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: browser.identity.getRedirectURL(),
            },
        });
        if (error) {
            console.error(error);
            return;
        }

        await browser.tabs.create({ url: data.url ?? undefined });
        window.close();
    };

    return (
        <Button
            variant="ghost"
            className="w-full"
            onClick={() => handleProviderLogin("google")}
        >
            {googleIcon({ className: "size-4" })} Sign In with Google
        </Button>
    );
}
