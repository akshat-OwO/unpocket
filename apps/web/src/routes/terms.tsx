import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "@repo/ui/lib/utils";

export const Route = createFileRoute("/terms")({
    component: Terms,
});

function Terms() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-6">
                    Terms &amp; Conditions
                </h1>
                <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <p>
                        Welcome to UnPocket! By installing or using our browser
                        extension, you agree to be bound by these Terms &amp;
                        Conditions. If you do not agree, please uninstall the
                        extension.
                    </p>

                    <h2 className="text-xl font-semibold mt-8">1. License</h2>
                    <p>
                        We grant you a non-exclusive, non-transferable,
                        revocable license to use the UnPocket extension for your
                        personal, non-commercial purposes, subject to these
                        terms.
                    </p>

                    <h2 className="text-xl font-semibold mt-8">
                        2. Permitted Use
                    </h2>
                    <p>
                        You may use UnPocket to save URLs and metadata via our
                        backend (Supabase). You may not modify, distribute, or
                        reverse-engineer the extension except as expressly
                        permitted by the GPLv3 license.
                    </p>

                    <h2 className="text-xl font-semibold mt-8">
                        3. Data &amp; Permissions
                    </h2>
                    <p>UnPocket requests these permissions:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>
                            <strong>storage:</strong> to store your Supabase
                            session locally (keeps you logged in).
                        </li>
                        <li>
                            <strong>identity:</strong> to enable OAuth sign-in
                            (e.g. Google) via Supabase.
                        </li>
                        <li>
                            <strong>tabs:</strong> to read the active tab’s URL
                            and inject a content script on demand (only when you
                            click the popup) to extract page metadata (title,
                            description, OpenGraph image).
                        </li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-8">
                        4. No Warranty
                    </h2>
                    <p>
                        UnPocket is provided “as is,” without warranty of any
                        kind, express or implied. We disclaim all warranties,
                        including merchantability, fitness for a particular
                        purpose, and non-infringement.
                    </p>

                    <h2 className="text-xl font-semibold mt-8">
                        5. Limitation of Liability
                    </h2>
                    <p>
                        In no event will the authors or distributors of UnPocket
                        be liable for any indirect, incidental, special, or
                        consequential damages arising out of the use or
                        inability to use the extension.
                    </p>

                    <h2 className="text-xl font-semibold mt-8">
                        6. Changes to Terms
                    </h2>
                    <p>
                        We may update these Terms &amp; Conditions from time to
                        time. We’ll post changes here, and your continued use
                        after changes are posted constitutes acceptance.
                    </p>

                    <p className="pt-8">
                        <Link
                            to="/"
                            className={cn(
                                "text-primary underline hover:text-primary/80 transition"
                            )}
                        >
                            ← Back to Home
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}
