import type { QueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import {
    createRootRouteWithContext,
    HeadContent,
    Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsInProd } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { supabase } from "../lib/supabase";
import { ThemeProvider } from "next-themes";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
    session: Session | null;
}>()({
    head: () => ({
        meta: [
            {
                name: "Unpocket | Open-Source alternative to Pocket",
                content:
                    "UnPocket is a free, open-source alternative to Pocket. Save, organize, and access your favorite web content easily.",
            },
            {
                title: "UnPocket | Open-Source alternative to Pocket",
            },
            {
                name: "og:image",
                content: "https://unpocket.me/unpocketme.png",
            },
            {
                name: "og:url",
                content: "https://unpocket.me",
            },
            {
                name: "og:type",
                content: "website",
            },
            {
                name: "og:title",
                content: "UnPocket | Open-Source alternative to Pocket",
            },
            {
                name: "og:description",
                content:
                    "UnPocket is a free, open-source alternative to Pocket. Save, organize, and access your favorite web content easily.",
            },
            {
                name: "twitter:card",
                content: "summary_large_image",
            },
            {
                name: "twitter:image",
                content: "https://unpocket.me/unpocketme.png",
            },
            {
                name: "twitter:title",
                content: "UnPocket | Open-Source alternative to Pocket",
            },
            {
                name: "twitter:description",
                content:
                    "UnPocket is a free, open-source alternative to Pocket. Save, organize, and access your favorite web content easily.",
            },
        ],
        links: [
            {
                rel: "icon",
                href: "/favicon.ico",
            },
        ],
    }),
    beforeLoad: async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return { session };
    },
    component: () => (
        <>
            <head>
                <HeadContent />
            </head>
            <ThemeProvider
                disableTransitionOnChange
                attribute={["class", "data-theme"]}
                defaultTheme="light"
            >
                <Outlet />
            </ThemeProvider>
            <ReactQueryDevtools />
            {import.meta.env.DEV && <TanStackRouterDevtoolsInProd />}
        </>
    ),
});
