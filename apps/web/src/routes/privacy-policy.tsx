import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "@repo/ui/lib/utils";

export const Route = createFileRoute("/privacy-policy")({
    component: PrivacyPolicy,
});

function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <p>
                        Last updated: May 2025
                        <br />
                        UnPocket is committed to protecting your privacy.
                    </p>

                    <h2 className="text-xl font-semibold mt-8">
                        1. Information We Collect
                    </h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>
                            <strong>Supabase session:</strong> stored locally
                            via <code>storage</code> to keep you logged in.
                        </li>
                        <li>
                            <strong>User identity:</strong> via{" "}
                            <code>identity</code> permission for OAuth providers
                            (e.g., Google) through Supabase.
                        </li>
                        <li>
                            <strong>Page metadata:</strong> when you click the
                            UnPocket popup, we inject a content script into the
                            active tab (via <code>tabs</code>) to extract the
                            page’s title, description, and OpenGraph image.
                        </li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-8">
                        2. How We Use Your Data
                    </h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>
                            <strong>Authentication:</strong> to authenticate you
                            via Supabase and store your session.
                        </li>
                        <li>
                            <strong>Content saving:</strong> to send URLs and
                            metadata to our Supabase backend for storage.
                        </li>
                    </ul>
                    <p>
                        We do <em>not</em> save any content or browsing data
                        locally outside of the session token.
                    </p>

                    <h2 className="text-xl font-semibold mt-8">
                        3. Third-Party Services
                    </h2>
                    <p>
                        We use Supabase to store your data. Please review their
                        <a
                            href="https://supabase.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline mx-1"
                        >
                            Privacy Policy
                        </a>
                        and
                        <a
                            href="https://supabase.com/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline mx-1"
                        >
                            Terms of Service
                        </a>
                        .
                    </p>

                    <h2 className="text-xl font-semibold mt-8">
                        4. Data Retention
                    </h2>
                    <p>
                        We retain your session and saved content as long as you
                        have an active account. You can delete your account or
                        saved items at any time via the UnPocket settings.
                    </p>

                    <h2 className="text-xl font-semibold mt-8">5. Security</h2>
                    <p>
                        We follow industry best practices to protect your data
                        both in transit and at rest. However, no system is 100%
                        secure—use at your own risk.
                    </p>

                    <h2 className="text-xl font-semibold mt-8">
                        6. Changes to This Policy
                    </h2>
                    <p>
                        We may update this Privacy Policy periodically. Your
                        continued use of UnPocket after changes are posted
                        constitutes acceptance of those changes.
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
