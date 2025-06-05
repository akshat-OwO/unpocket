import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pb-16 sm:pb-0">
                <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-muted/50 text-muted-foreground">
                        ✨ Looking for a Pocket alternative? Try UnPocket!
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
                            <span className="text-primary">Un</span>Pocket
                        </h1>
                        <h2 className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed px-2">
                            A simple, elegant alternative to Pocket. Save,
                            organize, and access your content effortlessly.
                        </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2 sm:pt-4 px-4">
                        <Link
                            to="/dashboard"
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            )}
                        >
                            Get Started
                        </Link>
                        <a
                            href="https://addons.mozilla.org/en-US/firefox/addon/unpocket/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold transition-all duration-200"
                            )}
                        >
                            Firefox Extension
                        </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-12 sm:pt-16 max-w-3xl mx-auto px-4">
                        <div className="text-center space-y-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                                <span className="text-primary text-xl sm:text-2xl">
                                    📚
                                </span>
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base">
                                Save Anything
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                Articles, videos, links - save content from
                                anywhere on the web
                            </p>
                        </div>
                        <div className="text-center space-y-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                                <span className="text-primary text-xl sm:text-2xl">
                                    🏷️
                                </span>
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base">
                                Smart Organization
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                Tag and categorize your saved content for easy
                                discovery
                            </p>
                        </div>
                        <div className="text-center space-y-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                                <span className="text-primary text-xl sm:text-2xl">
                                    ⚡
                                </span>
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base">
                                Lightning Fast
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                Access your saved content instantly, anywhere,
                                anytime
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <a
                    href="https://github.com/akshat-OwO/unpocket"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary underline hover:text-primary/80 transition"
                >
                    GitHub
                </a>
                <span className="hidden sm:inline text-muted-foreground">
                    |
                </span>
                <a
                    href="https://x.com/akshat_OwO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary underline hover:text-primary/80 transition"
                >
                    X
                </a>
                <span className="hidden sm:inline text-muted-foreground">
                    |
                </span>
                <Link
                    to="/terms"
                    className="text-xs text-primary underline hover:text-primary/80 transition"
                >
                    Terms & Conditions
                </Link>
                <span className="hidden sm:inline text-muted-foreground">
                    |
                </span>
                <Link
                    to="/privacy-policy"
                    className="text-xs text-primary underline hover:text-primary/80 transition"
                >
                    Privacy Policy
                </Link>
            </footer>
        </main>
    );
}
