import { Session } from "@supabase/supabase-js";
import { browser } from "wxt/browser";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{ session: Session | null }>()({
    beforeLoad: async () => {
        try {
            const { session: localSession } = await browser.storage.local.get<{
                session: Session | null;
            }>("session");

            if (!localSession?.refresh_token) {
                return { session: null };
            }

            const { data, error } = await supabase.auth.refreshSession({
                refresh_token: localSession.refresh_token,
            });

            if (error || !data.session) {
                console.error("Session refresh failed in popup:", error);
                await browser.storage.local.remove("session");
                return { session: null };
            }

            await browser.storage.local.set({ session: data.session });
            return { session: data.session };
        } catch (error) {
            console.error("Error refreshing session in popup:", error);
            await browser.storage.local.remove("session");
            return { session: null };
        }
    },
    component: () => (
        <main className="p-4 min-h-screen min-w-[320px]">
            <Outlet />
        </main>
    ),
});
