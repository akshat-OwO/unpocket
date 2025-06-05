import {
    createFileRoute,
    Outlet,
    redirect,
    stripSearchParams,
} from "@tanstack/react-router";
import Navbar from "../components/navbar";
import { z } from "zod";
import CreateSaveDialog from "../components/create-save-dialog";
import EditSaveDialog from "../components/edit-save-dialog";
import DeleteSaveDialog from "../components/delete-save-dialog";

const dashboardSearch = z.object({
    save: z.enum(["create", "edit", "delete"]).optional(),
    id: z.string().optional(),
    url: z.string().url().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.string().optional(),
});

export const Route = createFileRoute("/_protected")({
    beforeLoad: ({ context }) => {
        if (!context.session) {
            throw redirect({ to: "/login" });
        }
        return { user: context.session.user };
    },
    validateSearch: dashboardSearch,
    search: {
        middlewares: [stripSearchParams({})],
    },
    loader: ({ context }) => {
        return {
            user: context.user,
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { save, id, title, url, description, tags } = Route.useSearch();
    const navigate = Route.useNavigate();

    const onCreateSaveDialogClose = () => {
        navigate({
            from: "/dashboard",
            to: "/dashboard",
            search: {
                save: undefined,
            },
        });
    };

    const onEditSaveDialogClose = () => {
        navigate({
            from: "/dashboard",
            to: "/dashboard",
            search: {
                save: undefined,
            },
        });
    };

    const onDeleteSaveDialogClose = () => {
        navigate({
            from: "/dashboard",
            to: "/dashboard",
            search: {},
        });
    };

    return (
        <>
            <div className="p-4 lg:p-8">
                <Navbar />
                <div className="mx-6 lg:mx-12 mt-10">
                    <Outlet />
                </div>
            </div>
            <CreateSaveDialog
                isOpen={save === "create"}
                onClose={onCreateSaveDialogClose}
            />
            <EditSaveDialog
                isOpen={save === "edit"}
                id={id ?? ""}
                title={title ?? ""}
                url={url ?? ""}
                description={description ?? ""}
                tags={tags?.split(",") ?? []}
                onClose={onEditSaveDialogClose}
            />
            <DeleteSaveDialog
                isOpen={save === "delete"}
                id={id ?? ""}
                onClose={onDeleteSaveDialogClose}
            />
        </>
    );
}
