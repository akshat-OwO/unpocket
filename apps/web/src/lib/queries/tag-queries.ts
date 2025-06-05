import { queryOptions, useMutation } from "@tanstack/react-query";
import { createTag, fetchTags } from "../handlers/tag-handlers";
import { TCreateTagValidator } from "../validators/tag-validator";
import { queryClient } from "../../main";

export const fetchTagQueryKey = ["tags"] as const;

export const fetchTagQuery = queryOptions({
    queryKey: fetchTagQueryKey,
    queryFn: () => fetchTags(),
});

export const useCreateTagMutation = () =>
    useMutation({
        mutationKey: ["create", "tag"],
        mutationFn: (data: TCreateTagValidator) => createTag(data),
        onSuccess: async (data) => {
            if (data) {
                await queryClient.invalidateQueries({
                    queryKey: fetchTagQueryKey,
                });
            }
        },
    });
