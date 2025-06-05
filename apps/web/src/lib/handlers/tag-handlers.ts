import { supabase } from "../supabase";
import {
    createTagValidator,
    TCreateTagValidator,
} from "../validators/tag-validator";

export const fetchTags = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorised");

    const { data, error } = await supabase.from("tags").select("*").eq(
        "user_id",
        user.id,
    );
    if (error) throw new Error(error.message);

    return data ?? [];
};

export const createTag = async (data: TCreateTagValidator) => {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorised");

    const validatedData = createTagValidator.safeParse(data);
    if (!validatedData.success) {
        throw new Error("Invalid payload");
    }

    const { error } = await supabase.from("tags").insert({
        name: validatedData.data.name,
        user_id: user.id,
    });
    if (error) {
        if (error.code === "23505") {
            throw new Error("A tag with this name already exists");
        }
        throw new Error("Something went wrong");
    }

    return true;
};
