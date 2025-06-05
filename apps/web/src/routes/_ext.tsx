import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_ext")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
            <Outlet />
        </div>
    );
}
