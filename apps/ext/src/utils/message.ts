export const messages = {
    getMetaTags: "GET_META_TAGS",
    metaTagsExtracted: "META_TAGS_EXTRACTED",
    errorOccured: "ERROR_OCCURED",
    saved: "SAVED",
    success: "SUCCESS",
    remove: "REMOVE_URL",
    loading: "LOADING",
} as const;

export type MetaTags = {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
    ogImage: string;
    twitterImage: string;
    url: string;
};
