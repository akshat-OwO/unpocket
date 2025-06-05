import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="h-full w-full">
            <h1 className="text-4xl font-semibold text-center">
                <span className="text-primary">Un</span>Pocket
            </h1>
            <div className="mt-4 bg-card text-card-foreground p-4 rounded-md shadow-md">
                <Outlet />
            </div>
        </div>
    );
}
