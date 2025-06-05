import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import {
    fetchSavesQueryOpts,
    fetchSavesQueryOptsKey,
} from "../../../lib/queries/save-queries";
import SavesList, {
    SavesListErrorBoundary,
    SavesListFallback,
} from "../../../components/saves-list";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import SearchSaves from "../../../components/search-saves";
import { z } from "zod";
import { fetchTagQuery, fetchTagQueryKey } from "../../../lib/queries/tag-queries";
import TagsList, {
    TagsListErrorBoundary,
    TagsListFallback,
} from "../../../components/tags-list";
import CreateTagPopover from "../../../components/create-tag-popover";
import { Button } from "@repo/ui/components/button";
import { Plus } from "lucide-react";

const indexSearch = z.object({
    search: z.string().default(""),
    tag: z.string().default(""),
});

export const Route = createFileRoute("/_protected/dashboard/")({
    validateSearch: indexSearch,
    search: {
        middlewares: [stripSearchParams({ search: "", tag: "" })],
    },
    loaderDeps: ({ search: { search, tag } }) => ({ search, tag }),
    loader: ({ context, deps: { search, tag } }) => {
        context.queryClient.prefetchInfiniteQuery(
            fetchSavesQueryOpts(search, tag)
        );
        context.queryClient.prefetchQuery(fetchTagQuery);
        return {
            queryClient: context.queryClient,
            searchQuery: search,
            tagName: tag,
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { queryClient, searchQuery, tagName } = Route.useLoaderData();

    const navigate = Route.useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row justify-between sm:items-center">
                <h1 className="text-2xl font-bold">Your Saves</h1>
                <div className="flex items-center gap-4">
                    <SearchSaves />
                    <Button
                        variant="default"
                        onClick={() =>
                            navigate({
                                to: "/dashboard",
                                search: { save: "create" },
                            })
                        }
                    >
                        <Plus className="size-4" />
                        Create
                    </Button>
                </div>
            </div>
            <div className="flex justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <CreateTagPopover />
                </div>
                <ErrorBoundary
                    FallbackComponent={TagsListErrorBoundary}
                    onReset={async () =>
                        await queryClient.invalidateQueries({
                            queryKey: fetchTagQueryKey,
                        })
                    }
                >
                    <Suspense fallback={<TagsListFallback />}>
                        <TagsList />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                <ErrorBoundary
                    FallbackComponent={SavesListErrorBoundary}
                    onReset={async () =>
                        await queryClient.invalidateQueries({
                            queryKey: [...fetchSavesQueryOptsKey, searchQuery],
                        })
                    }
                >
                    <Suspense fallback={<SavesListFallback />}>
                        <SavesList
                            searchQuery={searchQuery}
                            tagName={tagName}
                        />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
}
