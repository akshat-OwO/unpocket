import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { browser } from "wxt/browser";
import { supabase } from "../../../utils/supabase";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { messages } from "../../../utils/message";
import { Button } from "@repo/ui/components/button";

export const Route = createFileRoute("/")({
    beforeLoad: async ({ context }) => {
        if (context.session) {
            const { error } = await supabase.auth.setSession(context.session);
            if (error) {
                throw redirect({
                    to: "/login",
                });
            }
        } else {
            throw redirect({
                to: "/login",
            });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    const [status, setStatus] = useState<
        "saving" | "saved" | "success" | "error" | "loading"
    >("saving");
    const [receivedMessage, setReceivedMessage] = useState<string | null>(null);
    const [retry, setRetry] = useState<boolean>(true);

    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function handleMessage(message: any) {
            switch (message.type) {
                case messages.saved:
                    setStatus("saved");
                    setReceivedMessage(message.message);
                    break;
                case messages.success:
                    setStatus("success");
                    setReceivedMessage(message.message);
                    break;
                case messages.loading:
                    setStatus("loading");
                    setReceivedMessage(message.message);
                    break;
                case messages.errorOccured:
                    setStatus("error");
                    if (message.message === "Unauthorised") {
                        router.invalidate();
                    }
                    setReceivedMessage(message.message);
                    setRetry(message.retry);
                    break;
            }
        }

        browser.runtime.onMessage.addListener(handleMessage);

        sendAddTabMessage();

        return () => {
            browser.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    async function sendAddTabMessage() {
        const [tab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });
        if (!tab.id) return;

        await browser.tabs.sendMessage(tab.id, { type: messages.getMetaTags });
    }

    async function sendRemoveTabMessage() {
        const [tab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });
        if (!tab.id) return;

        await browser.runtime.sendMessage({
            type: messages.remove,
            url: tab.url,
        });
    }

    const brandName = (
        <span className="font-semibold">
            <span className="text-primary">Un</span>Pocket
        </span>
    );

    const primaryIcon = (
        <CheckCircle className="fill-primary stroke-primary-foreground size-5" />
    );

    const statusConfig = {
        saving: {
            text: <>Saving to {brandName}</>,
            icon: <Loader2 className="animate-spin size-6" />,
            action: null,
        },
        saved: {
            text: <>Saved to {brandName}</>,
            icon: primaryIcon,
            action: (
                <Button size="sm" onClick={sendRemoveTabMessage}>
                    Undo
                </Button>
            ),
        },
        success: {
            text: receivedMessage || "Success",
            icon: primaryIcon,
            action: null,
        },
        error: {
            text: receivedMessage || "Something went wrong",
            icon: <AlertTriangle className="stroke-destructive size-5" />,
            action: (
                <Button
                    size="sm"
                    onClick={retry ? sendAddTabMessage : sendRemoveTabMessage}
                >
                    {retry ? "Retry" : "Remove"}
                </Button>
            ),
        },
        loading: {
            text: receivedMessage || "Loading",
            icon: <Loader2 className="animate-spin size-5" />,
            action: null,
        },
    };

    return (
        <div className="p-4 bg-card text-card-foreground rounded-md shadow-md">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {statusConfig[status].icon}
                    <p className="font-medium">{statusConfig[status].text}</p>
                </div>
                {statusConfig[status].action}
            </div>
        </div>
    );
}
