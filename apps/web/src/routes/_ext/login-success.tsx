import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_ext/login-success")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="p-4 rounded-md shadow-md bg-card text-card-foreground">
            <h3 className="text-center">Welcome to</h3>
            <h1 className="text-4xl font-semibold text-center">
                <span className="text-primary">Un</span>Pocket
            </h1>
            <p className="text-center">You can now use your extension :&#41;</p>
        </div>
    );
}
