import { Button, buttonVariants } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchTagQuery } from "../lib/queries/tag-queries";
import { Tag } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";

export default function TagsList() {
    const { data } = useSuspenseQuery(fetchTagQuery);

    const { tag: searchTag } = useSearch({ from: "/_protected/dashboard/" });
    const navigate = useNavigate();

    if (data.length === 0) {
        return (
            <Button variant="secondary">
                <Tag className="size-4" />
                Create a tag
            </Button>
        );
    }

    return (
        <div className="flex-1 flex gap-4 items-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex-1" />
            {data.map((tag) => (
                <Button
                    key={tag.id}
                    variant={searchTag === tag.name ? "default" : "outline"}
                    className="flex-shrink-0"
                    onClick={() =>
                        navigate({
                            from: "/dashboard",
                            to: "/dashboard",
                            search: (prev) => ({
                                ...prev,
                                tag: searchTag === tag.name ? "" : tag.name,
                            }),
                        })
                    }
                >
                    {tag.name}
                </Button>
            ))}
        </div>
    );
}

export const TagsListFallback = () => {
    return (
        <div className="flex gap-2 items-center justify-end">
            <div
                className={cn(
                    buttonVariants({
                        variant: "secondary",
                        className: "animate-pulse",
                    })
                )}
            />
            <div
                className={cn(
                    buttonVariants({
                        variant: "secondary",
                        className: "animate-pulse",
                    })
                )}
            />
            <div
                className={cn(
                    buttonVariants({
                        variant: "secondary",
                        className: "animate-pulse",
                    })
                )}
            />
            <div
                className={cn(
                    buttonVariants({
                        variant: "secondary",
                        className: "animate-pulse",
                    })
                )}
            />
        </div>
    );
};

export const TagsListErrorBoundary = () => {
    return (
        <div className="flex items-center justify-end">
            <p className="p-2 border border-destructive text-destructive-foreground rounded text-xs">
                Failed to fetch tags.
            </p>
        </div>
    );
};
