import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
    Cog,
    Laptop,
    Loader2,
    LogOut,
    Moon,
    Sun,
    UserIcon,
} from "lucide-react";
import { useLogoutMutation } from "../lib/queries/auth-queries";
import { Button } from "@repo/ui/components/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTheme } from "next-themes";

export default function Navbar() {
    const { mutate: logout, isPending } = useLogoutMutation();

    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <nav className="mx-6 lg:mx-12 flex items-center justify-between p-4 rounded-md bg-card text-card-foreground shadow-sm">
            <Link to="/" className="text-xl font-bold hover:underline">
                <span className="text-primary">Un</span>Pocket
            </Link>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer">
                        <Avatar className="bg-secondary">
                            <AvatarFallback className="bg-transparent">
                                <UserIcon className="size-4" />
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <div className="flex items-center">
                            <Button
                                title="system"
                                variant={
                                    theme === "system" ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => setTheme("system")}
                            >
                                <Laptop className="size-2" />
                            </Button>
                            <Button
                                title="light"
                                variant={
                                    theme === "light" ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => setTheme("light")}
                            >
                                <Sun className="size-2" />
                            </Button>
                            <Button
                                title="dark"
                                variant={theme === "dark" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setTheme("dark")}
                            >
                                <Moon className="size-2" />
                            </Button>
                        </div>
                        <DropdownMenuItem
                            onClick={() => navigate({ to: "/settings" })}
                        >
                            <Cog className="size-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => logout()}>
                            {isPending ? (
                                <Loader2 className="size-4" />
                            ) : (
                                <LogOut className="size-4" />
                            )}
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
