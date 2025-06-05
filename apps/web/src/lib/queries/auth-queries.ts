import { useMutation } from "@tanstack/react-query";
import { TProviderAuthValidator } from "../validators/auth-validator";
import { logoutUser, providerAuth } from "../handlers/auth-handlers";
import { useRouter } from "@tanstack/react-router";

export const useProviderAuthMutation = () =>
    useMutation({
        mutationKey: ["login", "provider"],
        mutationFn: (data: TProviderAuthValidator) => providerAuth({ data }),
    });

export const useLogoutMutation = () => {
    const router = useRouter();
    return useMutation({
        mutationKey: ["logout"],
        mutationFn: () => logoutUser(),
        onSuccess: async (data) => {
            if (data) {
                await router.invalidate();
                router.navigate({ to: "/login" });
            }
        },
    });
};
