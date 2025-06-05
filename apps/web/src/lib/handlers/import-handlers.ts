import { supabase } from "../supabase";
import {
    importValidator,
    TImportValidator,
} from "../validators/import-validator";
import Papa from "papaparse";

export const importSaves = async (data: TImportValidator) => {
    try {
        const validatedData = importValidator.safeParse(data);

        if (!validatedData.success) {
            throw new Error("Invalid file format");
        }

        const { file } = validatedData.data;

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
            throw new Error(`Authentication error: ${authError.message}`);
        }

        if (!user) {
            throw new Error("Unauthorised");
        }

        let fileContent: string;
        try {
            fileContent = await file.text();
        } catch (error) {
            throw new Error("Failed to read file content");
        }

        const parseResult = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(),
        });

        if (parseResult.errors.length > 0) {
            throw new Error(`CSV parsing error: ${parseResult.errors[0].message}`);
        }

        const rows = parseResult.data as Record<string, string>[];

        if (rows.length === 0) {
            throw new Error("CSV file must contain at least one row of data");
        }

        const expectedHeaders = ["title", "url", "time_added", "tags", "status"];
        const headers = Object.keys(rows[0]);

        if (!expectedHeaders.every((h) => headers.includes(h))) {
            throw new Error(
                `CSV file must contain the following headers: ${expectedHeaders.join(", ")}`,
            );
        }

        const savesToImport: {
            title: string;
            url: string;
            timeAdded: number | null;
            tags: string[];
            status: string;
        }[] = [];
        const errors: string[] = [];

        rows.forEach((row, index) => {
            const rowNum = index + 2;

            const title = row.title?.trim() || "Untitled Save";
            const url = row.url?.trim();
            const timeAdded = row.time_added?.trim();
            const tags = row.tags?.trim()
                ? row.tags.split("|").map((t) => t.trim())
                : [];
            const status = row.status?.trim() || "unread";

            if (!url) {
                errors.push(`Row ${rowNum} is missing a URL`);
                return;
            }
            if (!isValidUrl(url)) {
                errors.push(`Row ${rowNum} has an invalid URL: ${url}`);
                return;
            }

            savesToImport.push({
                title,
                url,
                timeAdded: timeAdded ? parseInt(timeAdded) : null,
                tags,
                status,
            });
        });

        if (errors.length > 0) {
            return {
                success: false,
                error: `Import validation errors: ${errors.join(", ")}`,
                errors: errors,
            };
        }

        const saveRows = savesToImport.map((save) => ({
            url: save.url,
            user_id: user.id,
            title: save.title,
            description: null,
            image_url: null,
            created_at: save.timeAdded
                ? new Date(save.timeAdded * 1000).toISOString()
                : undefined,
        }));

        const { data: insertedSaves, error: savesError } = await supabase
            .from("saves")
            .upsert(saveRows, { ignoreDuplicates: true })
            .select("id, url");

        if (savesError) {
            throw new Error(`Failed to insert saves: ${savesError.message}`);
        }

        const allTags = [
            ...new Set(savesToImport.flatMap((save) => save.tags)),
        ].filter(Boolean);

        let tagMap: Record<string, string> = {};
        if (allTags.length > 0) {
            const { data: existingTags, error: tagsError } = await supabase
                .from("tags")
                .select("id, name")
                .eq("user_id", user.id)
                .in("name", allTags);

            if (tagsError) {
                console.warn(`Failed to fetch existing tags: ${tagsError.message}`);
            } else if (existingTags) {
                tagMap = Object.fromEntries(
                    existingTags.map((tag) => [tag.name, tag.id]),
                );
            }

            const existingTagNames = existingTags?.map(tag => tag.name) || [];
            const newTagNames = allTags.filter(tagName => !existingTagNames.includes(tagName));

            if (newTagNames.length > 0) {
                const newTagRows = newTagNames.map(name => ({
                    name,
                    user_id: user.id,
                }));

                const { data: createdTags, error: createTagsError } = await supabase
                    .from("tags")
                    .insert(newTagRows)
                    .select("id, name");

                if (createTagsError) {
                    console.warn(`Failed to create new tags: ${createTagsError.message}`);
                } else if (createdTags) {
                    createdTags.forEach(tag => {
                        tagMap[tag.name] = tag.id;
                    });
                }
            }
        }

        const saveTagsRows: { save_id: string; tag_id: string }[] = [];
        if (insertedSaves) {
            for (let i = 0; i < savesToImport.length; i++) {
                const save = savesToImport[i];
                const insertedSave = insertedSaves.find(
                    (s) => s.url === save.url,
                );
                if (!insertedSave) continue;
                for (const tagName of save.tags) {
                    const tagId = tagMap[tagName];
                    if (tagId) {
                        saveTagsRows.push({
                            save_id: insertedSave.id,
                            tag_id: tagId,
                        });
                    }
                }
            }
        }

        if (saveTagsRows.length > 0) {
            const { error: saveTagsError } = await supabase
                .from("save_tags")
                .upsert(saveTagsRows, { ignoreDuplicates: true });

            if (saveTagsError) {
                console.warn(`Failed to insert save tags: ${saveTagsError.message}`);
            }
        }

        return {
            success: true,
            errors: [],
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            errors: [],
        };
    }
};

function isValidUrl(string: string): boolean {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
