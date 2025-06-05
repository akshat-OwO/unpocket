import { buttonVariants } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useImportSaveMutation } from "../../../lib/queries/import-queries";

export const Route = createFileRoute("/_protected/settings/")({
    component: RouteComponent,
});

function RouteComponent() {
    const {
        mutate: importSaves,
        isPending,
        isSuccess,
        error,
    } = useImportSaveMutation();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row justify-between sm:items-center">
                <h1 className="text-2xl font-bold">Import Saves</h1>
            </div>
            <div className="space-y-2">
                <p className="max-w-prose">
                    You can import your saves by downloading a CSV file from{" "}
                    <a
                        href="https://getpocket.com/export"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            buttonVariants({
                                variant: "link",
                                className: "p-0",
                            })
                        )}
                    >
                        Pocket
                    </a>
                    .
                </p>
                {error && (
                    <p className="text-destructive">
                        {error instanceof Error
                            ? error.message
                            : "An error occurred"}
                    </p>
                )}
                <label
                    htmlFor="import-file"
                    aria-disabled={isPending || isSuccess}
                    className={cn(buttonVariants({ variant: "default" }))}
                >
                    {isPending
                        ? "Importing..."
                        : isSuccess
                          ? "Import Successful"
                          : "Import CSV File"}
                </label>
                <input
                    type="file"
                    id="import-file"
                    accept="text/csv"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            importSaves({ file });
                        }
                    }}
                />
            </div>
        </div>
    );
}
