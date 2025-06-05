import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
    beforeLoad: ({ context }) => {
        if (context.session) {
            throw redirect({ to: "/" });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="min-h-screen p-4 grid grid-cols-2 gap-10">
            <Outlet />
            <div className="hidden lg:block h-full w-full rounded-xl shadow-md bg-primary" />
        </div>
    );
}
