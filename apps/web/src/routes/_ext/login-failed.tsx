import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_ext/login-failed")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="p-4 rounded-md shadow-md bg-card text-card-foreground">
            <p className="text-center">Something went wrong</p>
            <p className="text-center">while logging you in.</p>
            <p className="text-muted-foreground text-center">Please try again later.</p>
        </div>
    );
}
