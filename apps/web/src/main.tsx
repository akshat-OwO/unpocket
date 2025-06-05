import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./styles.css";

import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PostHogProvider } from "posthog-js/react";

export const queryClient = new QueryClient();

const options = {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
};

const router = createRouter({
    routeTree,
    context: { queryClient, session: null },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById("app")!;
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <QueryClientProvider client={queryClient}>
            <PostHogProvider
                apiKey={import.meta.env.VITE_POSTHOG_KEY}
                options={options}
            >
                <RouterProvider router={router} />
            </PostHogProvider>
        </QueryClientProvider>
    );
}
