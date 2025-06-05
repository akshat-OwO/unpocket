import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchSaves() {
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate({
                from: "/dashboard",
                to: "/dashboard",
                search: (prev) => ({ ...prev, search: searchQuery }),
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
                type="text"
                placeholder="Search Saves..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-10 bg-card"
            />
            {searchQuery && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                >
                    <X className="size-4" />
                </Button>
            )}
        </div>
    );
}
