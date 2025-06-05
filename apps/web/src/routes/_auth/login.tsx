import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@repo/ui/components/button";
import { Loader2 } from "lucide-react";
import { useProviderAuthMutation } from "../../lib/queries/auth-queries";
import { googleIcon } from "../../components/icons/google";

export const Route = createFileRoute("/_auth/login")({
    component: RouteComponent,
});

function RouteComponent() {
    const { mutate: loginWithProvider, isPending: isProviderPending } =
        useProviderAuthMutation();

    return (
        <main className="h-full col-span-2 lg:col-span-1 flex flex-col gap-4 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold">
                    <span className="text-primary">Un</span>Pocket
                </h1>
                <p className="text-lg">Login to continue further.</p>
            </div>
            <div className="p-4 w-full max-w-sm rounded-md bg-card text-card-foreground grid grid-cols-2 gap-4">
                <Button
                    variant="ghost"
                    className="col-span-2"
                    disabled={isProviderPending}
                    onClick={() => loginWithProvider({ provider: "google" })}
                >
                    {isProviderPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        googleIcon({ className: "size-4" })
                    )}
                    Google
                </Button>
            </div>
        </main>
    );
}
