import { supabase } from "../supabase";
import {
    createSaveValidator,
    deleteSaveValidator,
    editSaveValidator,
    TCreateSaveValidator,
    TDeleteSaveValidator,
    TEditSaveValidator,
} from "../validators/save-validator";

export const createSave = async ({
    data,
}: {
    data: TCreateSaveValidator;
}) => {
    const validatedCreateSaveData = createSaveValidator.safeParse(data);
    if (!validatedCreateSaveData.success) {
        throw new Error("Validation failed");
    }

    const { url, title, description, tags } = validatedCreateSaveData.data;

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorised");
    }

    const {
        data: { data: ogData },
    } = await supabase.functions.invoke("fetch-metadata", {
        body: { url },
    });

    const imageUrl: string | null = ogData?.og?.image ??
        ogData?.twitter?.image ?? null;

    const { data: saveData, error: saveError } = await supabase
        .from("saves")
        .insert([
            {
                url,
                user_id: user.id,
                title: title.length > 0 ? title : ogData?.meta?.title ??
                    ogData?.og?.title ??
                    ogData?.twitter?.title ??
                    "Untitled Save",
                description: description.length > 0
                    ? description
                    : ogData?.meta?.description ??
                        ogData?.og?.description ??
                        ogData?.twitter?.description ??
                        null,
                image_url: imageUrl ? imageUrl : null,
            },
        ])
        .select("id")
        .single();

    if (saveError) {
        if (saveError.code === "23505") {
            throw new Error("A save with this URL already exists.");
        }
        throw new Error("Something went wrong");
    }

    if (tags && tags.length > 0) {
        const uniqueTagNames = [
            ...new Set(tags.filter((tag) => tag.trim().length > 0)),
        ];

        if (uniqueTagNames.length > 0) {
            const tagIds: string[] = [];

            for (const tagName of uniqueTagNames) {
                const { data: existingTag } = await supabase
                    .from("tags")
                    .select("id")
                    .eq("user_id", user.id)
                    .eq("name", tagName.trim())
                    .single();

                if (existingTag) {
                    tagIds.push(existingTag.id);
                }
            }

            if (tagIds.length > 0) {
                const saveTagsData = tagIds.map((tagId) => ({
                    save_id: saveData.id,
                    tag_id: tagId,
                }));

                const { error: saveTagsError } = await supabase
                    .from("save_tags")
                    .insert(saveTagsData);

                if (saveTagsError) {
                    throw new Error("Failed to associate tags with save");
                }
            }
        }
    }

    return true;
};

export const fetchSaves = async (
    pageParam = 0,
    pageSize = 12,
    searchQuery?: string,
    tagName?: string,
) => {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorised");

    const { data, error } = await supabase.rpc("search_saves_with_tags", {
        p_user_id: user.id,
        p_search: searchQuery?.trim(),
        p_tag_name: tagName?.trim() === "" ? undefined : tagName?.trim(),
        p_limit: pageSize,
        p_offset: pageParam * pageSize,
    });

    if (error) throw new Error(error.message);

    const saves = data ?? [];
    const fullPage = saves.length === pageSize;
    return {
        saves,
        nextPage: fullPage ? pageParam + 1 : null,
        hasMore: fullPage,
    };
};

export const editSave = async ({ data }: { data: TEditSaveValidator }) => {
    const validatedEditSaveData = editSaveValidator.safeParse(data);
    if (!validatedEditSaveData.success) {
        throw new Error("Validation failed");
    }

    const { id, url, title, description, tags } = validatedEditSaveData.data;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorised");
    }

    const { data: { data: ogData } } = await supabase.functions.invoke(
        "fetch-metadata",
        {
            body: { url },
        },
    );

    const imageUrl: string | null = ogData?.og?.image ??
        ogData?.twitter?.image ?? null;

    const { error } = await supabase.from("saves").update({
        url,
        title: title.length > 0 ? title : "Untitled Save",
        description: description.length > 0 ? description : null,
        image_url: imageUrl ? imageUrl : null,
    }).eq("user_id", user.id).eq("id", id);

    if (error) {
        if (error.code === "23505") {
            throw new Error("A save with this URL already exists.");
        }
        throw new Error("Something went wrong");
    }

    if (tags !== undefined) {
        const { error: deleteTagsError } = await supabase
            .from("save_tags")
            .delete()
            .eq("save_id", id);

        if (deleteTagsError) {
            throw new Error("Failed to update tags");
        }

        if (tags && tags.length > 0) {
            const uniqueTagNames = [
                ...new Set(tags.filter((tag) => tag.trim().length > 0)),
            ];

            if (uniqueTagNames.length > 0) {
                const tagIds: string[] = [];

                for (const tagName of uniqueTagNames) {
                    const { data: existingTag } = await supabase
                        .from("tags")
                        .select("id")
                        .eq("user_id", user.id)
                        .eq("name", tagName.trim())
                        .single();

                    if (existingTag) {
                        tagIds.push(existingTag.id);
                    }
                }

                if (tagIds.length > 0) {
                    const saveTagsData = tagIds.map((tagId) => ({
                        save_id: id,
                        tag_id: tagId,
                    }));

                    const { error: saveTagsError } = await supabase
                        .from("save_tags")
                        .insert(saveTagsData);

                    if (saveTagsError) {
                        throw new Error("Failed to associate tags with save");
                    }
                }
            }
        }
    }

    return true;
};

export const deleteSave = async ({ data }: { data: TDeleteSaveValidator }) => {
    const validatedDeleteSaveData = deleteSaveValidator.safeParse(data);
    if (!validatedDeleteSaveData.success) {
        throw new Error("Validation failed");
    }

    const { id } = validatedDeleteSaveData.data;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorised");
    }

    const { error } = await supabase.from("saves").delete().eq(
        "user_id",
        user.id,
    ).eq(
        "id",
        id,
    );

    if (error) {
        throw new Error("Something went wrong");
    }

    return true;
};
