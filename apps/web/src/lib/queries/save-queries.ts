import { infiniteQueryOptions, useMutation } from "@tanstack/react-query";
import {
    createSave,
    deleteSave,
    editSave,
    fetchSaves,
} from "../handlers/save-handlers";
import {
    TCreateSaveValidator,
    TDeleteSaveValidator,
    TEditSaveValidator,
} from "../validators/save-validator";
import { queryClient } from "../../main";

export const fetchSavesQueryOptsKey = ["saves"] as const;

export const fetchSavesQueryOpts = (searchQuery?: string, tag?: string) => infiniteQueryOptions({
    queryKey: [...fetchSavesQueryOptsKey, searchQuery, tag],
    queryFn: ({ pageParam }) => fetchSaves(pageParam, 12, searchQuery, tag),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
});

export const useCreateSaveMutation = () => {
    return useMutation({
        mutationKey: ["create", "save"],
        mutationFn: (data: TCreateSaveValidator & { onClose: () => void }) =>
            createSave({ data }),
        onSuccess: async (data, { onClose }) => {
            if (data) {
                await queryClient.invalidateQueries({
                    queryKey: fetchSavesQueryOptsKey,
                });
                onClose();
            }
        },
    });
};

export const useEditSaveMutation = ({ id }: { id: string }) =>
    useMutation({
        mutationKey: ["edit", "save", id],
        mutationFn: (data: TEditSaveValidator & { onClose: () => void }) =>
            editSave({ data }),
        onSuccess: async (data, { onClose }) => {
            if (data) {
                await queryClient.invalidateQueries({
                    queryKey: fetchSavesQueryOptsKey,
                });
                onClose();
            }
        },
    });

export const useDeleteSaveMutation = ({ id }: { id: string }) =>
    useMutation({
        mutationKey: ["delete", "save", id],
        mutationFn: (data: TDeleteSaveValidator & { onClose: () => void }) =>
            deleteSave({ data }),
        onSuccess: async (data, { onClose }) => {
            if (data) {
                await queryClient.invalidateQueries({
                    queryKey: fetchSavesQueryOptsKey,
                });
                onClose();
            }
        },
    });
