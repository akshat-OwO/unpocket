import { Session } from "@supabase/supabase-js";
import { messages, MetaTags } from "../../utils/message";

export default defineBackground(() => {
    browser.tabs.onUpdated.addListener((_, changeInfo) => {
        if (changeInfo.url?.startsWith(browser.identity.getRedirectURL())) {
            finishUserOAuth(changeInfo.url);
        }
    });

    browser.runtime.onMessage.addListener(async (message) => {
        if (message.type === messages.metaTagsExtracted) {
            await addUrl(message.meta as MetaTags);
        } else if (message.type === messages.remove) {
            await removeUrl(message.url as string);
        }
    });

    supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            browser.storage.local.set({ session });
        } else if (event === "SIGNED_OUT") {
            browser.storage.local.remove("session");
        }
    });

    browser.runtime.onStartup.addListener(async () => {
        await refreshSessionIfNeeded();
    });

    async function refreshSessionIfNeeded() {
        try {
            const { session: localSession } = await browser.storage.local.get<{
                session: Session | null;
            }>("session");

            if (!localSession?.refresh_token) {
                console.log("No stored session found");
                return null;
            }

            console.log("Attempting to refresh session...");

            const { data, error } = await supabase.auth.refreshSession({
                refresh_token: localSession.refresh_token,
            });

            if (error) {
                console.error("Session refresh failed:", error);
                // Clear invalid session
                await browser.storage.local.remove("session");
                await supabase.auth.signOut();
                return null;
            }

            if (data.session) {
                console.log("Session refreshed successfully");
                await browser.storage.local.set({ session: data.session });
                return data.session;
            }

            return null;
        } catch (error) {
            console.error("Error during session refresh:", error);
            await browser.storage.local.remove("session");
            return null;
        }
    }

    async function finishUserOAuth(url: string) {
        try {
            console.log("Handling user Oauth callback...");

            const hashMap = parseUrlHash(url);
            const access_token = hashMap.get("access_token");
            const refresh_token = hashMap.get("refresh_token");

            if (!access_token || !refresh_token) {
                throw new Error("no supabase tokens found in URL hash");
            }

            const { data, error } = await supabase.auth.setSession({
                access_token,
                refresh_token,
            });

            if (error) throw error;

            await browser.storage.local.set({ session: data.session });

            await browser.tabs.update({
                url: `${import.meta.env.WXT_WEB_URL}/callback?access_token=${access_token}&refresh_token=${refresh_token}`,
            });

            console.log("finished handling user Oauth callback");
        } catch (error) {
            console.error(error);
        }
    }

    function parseUrlHash(url: string) {
        const hashParts = new URL(url).hash.slice(1).split("&");
        const hashMap = new Map(
            hashParts.map((part) => {
                const [name, value] = part.split("=");
                return [name, value];
            }),
        );
        return hashMap;
    }

    async function addUrl(meta: MetaTags) {
        await refreshSessionIfNeeded();

        const { session: localSession } = await browser.storage.local.get<{
            session: Session | null | undefined;
        }>("session");
        if (!localSession?.user) {
            await browser.storage.local.clear();
            sendErrorMessage("Unauthorised");
            return;
        }

        const { data: { user } } = await supabase.auth
            .setSession({
                access_token: localSession.access_token,
                refresh_token: localSession.refresh_token,
            });
        if (!user) {
            await browser.storage.local.clear();
            sendErrorMessage("Unauthorised");
            return;
        }

        const getTitle = () =>
            meta.ogTitle?.trim()
                ? meta.ogTitle
                : meta.twitterTitle?.trim()
                ? meta.twitterTitle
                : meta.title?.trim()
                ? meta.title
                : "Untitled Save";

        const getDescription = () =>
            meta.ogDescription?.trim()
                ? meta.ogDescription
                : meta.twitterDescription?.trim()
                ? meta.twitterDescription
                : meta.description?.trim()
                ? meta.description
                : null;

        const getImage = () =>
            meta.ogImage?.trim()
                ? meta.ogImage
                : meta.twitterImage?.trim()
                ? meta.twitterImage
                : null;

        const { error } = await supabase.from("saves").insert({
            user_id: user.id,
            url: meta.url,
            title: getTitle(),
            description: getDescription(),
            image_url: getImage(),
        });
        if (error) {
            if (error.code === "23505") {
                sendErrorMessage("A save with this URL already exists.", false);
                return;
            }
        }
        sendSavedMessage("Added url successfully");
    }

    async function removeUrl(url: string) {
        sendLoadingMessage("Removing Url");

        await refreshSessionIfNeeded();

        const { session: localSession } = await browser.storage.local.get<{
            session: Session | null | undefined;
        }>("session");
        if (!localSession?.user) {
            await browser.storage.local.clear();
            sendErrorMessage("Unauthorised");
            return;
        }

        const { data: { user } } = await supabase.auth
            .setSession({
                access_token: localSession.access_token,
                refresh_token: localSession.refresh_token,
            });
        if (!user) {
            await browser.storage.local.clear();
            sendErrorMessage("Unauthorised");
            return;
        }

        const { error } = await supabase.from("saves").delete().eq(
            "user_id",
            user.id,
        )
            .eq("url", url);

        if (error) {
            console.log(error);
            sendErrorMessage("Something went wrong", false);
            return;
        }

        sendSuccessMessage("Removed saved url.");
    }

    function sendSuccessMessage(message: string) {
        browser.runtime.sendMessage({
            type: messages.success,
            message,
        });
    }

    function sendSavedMessage(message: string) {
        browser.runtime.sendMessage({
            type: messages.saved,
            message,
        });
    }

    function sendLoadingMessage(message: string) {
        browser.runtime.sendMessage({
            type: messages.loading,
            message,
        });
    }

    function sendErrorMessage(message: string, retry: boolean = true) {
        browser.runtime.sendMessage({
            type: messages.errorOccured,
            message,
            retry,
        });
    }
});
