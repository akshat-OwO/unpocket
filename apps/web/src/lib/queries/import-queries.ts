import { useMutation } from "@tanstack/react-query";
import { TImportValidator } from "../validators/import-validator";
import { importSaves } from "../handlers/import-handlers";
import { queryClient } from "../../main";
import { fetchSavesQueryOptsKey } from "./save-queries";

export const useImportSaveMutation = () => {
    return useMutation({
        mutationKey: ["import-save"],
        mutationFn: async (data: TImportValidator) => importSaves(data),
        onSuccess: async (data) => {
            if (data.success) {
                await queryClient.invalidateQueries({
                    queryKey: fetchSavesQueryOptsKey,
                });
            } else {
                throw new Error(data.errors.join(", "));
            }
        },
    });
};
