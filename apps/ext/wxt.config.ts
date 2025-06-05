import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
    srcDir: "src",
    manifest: ({ mode }) => {
        return {
            name: "UnPocket",
            description:
                "A simple, elegant alternative to Pocket. Save, organize, and access your content effortlessly.",
            permissions: ["storage", "identity", "tabs"],
            ...(mode === "development" && {
                browser_specific_settings: {
                    gecko: {
                        id: "{52a0a0d3-7221-c788-df5a-116ab3854e03}",
                    },
                },
            }),
        };
    },
    vite: () => ({
        plugins: [
            TanStackRouterVite({
                target: "react",
                autoCodeSplitting: true,
                routesDirectory: "./src/entrypoints/popup/routes",
                generatedRouteTree: "./src/entrypoints/popup/routeTree.gen.ts",
            }),
            react(),
        ],
    }),
});
