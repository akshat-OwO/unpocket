import { messages, MetaTags } from "../../utils/message";

export default defineContentScript({
    matches: ["<all_urls>"],
    main: () => {
        browser.runtime.onMessage.addListener(
            (message, sender, sendResponse) => {
                if (message.type === messages.getMetaTags) {
                    const getMeta = (name: string) =>
                        document.querySelector(`meta[name="${name}"]`)
                            ?.getAttribute("content") ||
                        document.querySelector(`meta[property="${name}"]`)
                            ?.getAttribute("content") ||
                        "";

                    const meta: MetaTags = {
                        title: document.title,
                        description: getMeta("description"),
                        ogTitle: getMeta("og:title"),
                        ogDescription: getMeta("og:description"),
                        twitterTitle: getMeta("twitter:title"),
                        twitterDescription: getMeta("twitter:description"),
                        ogImage: getMeta("og:image"),
                        twitterImage: getMeta("twitter:image"),
                        url: window.location.href,
                    };

                    browser.runtime.sendMessage({
                        type: messages.metaTagsExtracted,
                        meta,
                    });

                    sendResponse({ success: true });
                    return true;
                }
            },
        );
    },
});
