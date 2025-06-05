import ReactDOM from "react-dom/client";
import {
    RouterProvider,
    createHashHistory,
    createRouter,
} from "@tanstack/react-router";
import "../../utils/styles.css";

import { routeTree } from "./routeTree.gen";

const hashHistory = createHashHistory();

const router = createRouter({
    routeTree,
    context: { session: null },
    history: hashHistory,
    scrollRestoration: true,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<RouterProvider router={router} />);
}
