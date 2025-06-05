import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchSavesQueryOpts } from "../lib/queries/save-queries";
import { FallbackProps } from "react-error-boundary";
import { Button } from "@repo/ui/components/button";
import { Delete, Loader2, Menu, Pencil, Plus, Save } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Image } from "@repo/ui/components/image";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface SavesListProps {
    searchQuery?: string;
    tagName?: string;
}

export default function SavesList({ searchQuery, tagName }: SavesListProps) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useSuspenseInfiniteQuery(fetchSavesQueryOpts(searchQuery, tagName));

    const navigate = useNavigate();
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const allSaves = data.pages.flatMap((page) => page.saves);

    if (allSaves.length === 0) {
        return (
            <div className="h-72 px-8 rounded-md bg-card text-card-foreground shadow-md col-span-1 md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center gap-2">
                <Save className="size-12 stroke-primary" />
                <h1 className="text-2xl font-semibold text-primary">
                    {searchQuery ? "No saves found" : "Create your first save"}
                </h1>
                {searchQuery ? (
                    <p className="text-muted-foreground text-center">
                        Try adjusting your search terms
                    </p>
                ) : (
                    <Button
                        onClick={() =>
                            navigate({
                                to: "/dashboard",
                                search: { save: "create" },
                            })
                        }
                    >
                        <Plus className="size-4" /> Create
                    </Button>
                )}
            </div>
        );
    }

    return (
        <>
            {allSaves.map((save, index) => (
                <div
                    key={save.id}
                    ref={index === allSaves.length - 1 ? ref : undefined}
                >
                    <a
                        href={`${save.url}?utm_source=unpocket_saves`}
                        target="_blank"
                        key={save.id}
                        className="group cursor-pointer h-72 bg-card text-card-foreground rounded-md shadow-md flex flex-col gap-2"
                    >
                        <div className="group/image relative h-40 w-full flex items-center justify-center overflow-hidden rounded-t-md bg-muted">
                            <Image
                                src={save.image_url}
                                alt={save.title}
                                className="h-full w-full object-cover rounded-t-md transition-transform duration-200 hover:scale-105"
                                loading="lazy"
                            />
                            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black/30 to-transparent group-hover/image:opacity-0 opacity-100 transition-all duration-300" />
                        </div>
                        <div className="pb-2 px-4 flex-1 flex flex-col justify-between">
                            <div className="flex flex-col gap-1">
                                <h4
                                    title={save.title}
                                    className="group-hover:underline font-semibold text-lg line-clamp-1"
                                >
                                    {save.title}
                                </h4>
                                {save.description && (
                                    <p
                                        title={save.description}
                                        className="group-hover:underline text-muted-foreground text-sm line-clamp-2"
                                    >
                                        {save.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {new URL(save.url).hostname}
                                    </span>
                                    {save.tags &&
                                        (() => {
                                            try {
                                                const tags = Array.isArray(
                                                    save.tags
                                                )
                                                    ? save.tags
                                                    : JSON.parse(
                                                          save.tags.toString()
                                                      );
                                                if (
                                                    !Array.isArray(tags) ||
                                                    tags.length === 0
                                                )
                                                    return null;

                                                const visibleTags = tags.slice(
                                                    0,
                                                    2
                                                );
                                                const remainingCount =
                                                    tags.length - 2;

                                                return (
                                                    <div className="flex items-center gap-1">
                                                        {visibleTags.map(
                                                            (tag) => (
                                                                <div
                                                                    key={tag.id}
                                                                    className="bg-secondary text-secondary-foreground text-xs rounded p-0.5"
                                                                >
                                                                    {tag.name}
                                                                </div>
                                                            )
                                                        )}
                                                        {remainingCount > 0 && (
                                                            <div className="bg-primary text-primary-foreground text-xs rounded p-0.5">
                                                                +
                                                                {remainingCount}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            } catch (error) {
                                                return null;
                                            }
                                        })()}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-fit w-fit"
                                            onClick={(e) => {
                                                e.preventDefault();
                                            }}
                                        >
                                            <Menu className="size-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="top" align="end">
                                        <DropdownMenuItem
                                            onClick={() => {
                                                let tags: string | undefined;

                                                if (save.tags) {
                                                    try {
                                                        const tagsArray =
                                                            Array.isArray(
                                                                save.tags
                                                            )
                                                                ? save.tags
                                                                : JSON.parse(
                                                                      save.tags.toString()
                                                                  );

                                                        if (
                                                            Array.isArray(
                                                                tagsArray
                                                            ) &&
                                                            tagsArray.length > 0
                                                        ) {
                                                            tags = tagsArray
                                                                .map(
                                                                    (tag) =>
                                                                        tag.name
                                                                )
                                                                .filter(Boolean)
                                                                .join(",");
                                                        }
                                                    } catch (error) {
                                                        tags = undefined;
                                                    }
                                                }

                                                navigate({
                                                    from: "/dashboard",
                                                    to: "/dashboard",
                                                    search: {
                                                        save: "edit",
                                                        id: save.id,
                                                        url: save.url,
                                                        title: save.title,
                                                        description:
                                                            save.description ??
                                                            undefined,
                                                        tags,
                                                    },
                                                });
                                            }}
                                        >
                                            <Pencil className="size-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                navigate({
                                                    from: "/dashboard",
                                                    to: "/dashboard",
                                                    search: {
                                                        save: "delete",
                                                        id: save.id,
                                                    },
                                                })
                                            }
                                        >
                                            <Delete className="size-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </a>
                </div>
            ))}
            {isFetchingNextPage && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-center py-4">
                    <Loader2 className="size-6 animate-spin" />
                </div>
            )}
        </>
    );
}

export function SavesListFallback() {
    return (
        <>
            <div className="h-72 w-full bg-secondary rounded-md shadow-md animate-pulse"></div>
            <div className="h-72 w-full bg-secondary rounded-md shadow-md animate-pulse"></div>
            <div className="h-72 w-full bg-secondary rounded-md shadow-md animate-pulse"></div>
            <div className="h-72 w-full bg-secondary rounded-md shadow-md animate-pulse"></div>
        </>
    );
}

export function SavesListErrorBoundary(props: FallbackProps) {
    return (
        <div className="h-72 col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col gap-2 items-center justify-center">
            <h1 className="text-2xl text-primary font-bold">404</h1>
            <p className="text-lg font-semibold">No saves found!</p>
            <Button onClick={() => props.resetErrorBoundary()}>Refresh</Button>
        </div>
    );
}
