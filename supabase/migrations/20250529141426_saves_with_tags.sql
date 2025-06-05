CREATE OR REPLACE FUNCTION get_saves_with_tags(
    p_user_id uuid,
    p_search text DEFAULT NULL,
    p_tag_name text DEFAULT NULL,
    p_limit int DEFAULT 12,
    p_offset int DEFAULT 0
)
RETURNS TABLE (
    id uuid,
    user_id uuid,
    url text,
    title text,
    description text,
    created_at timestamptz,
    updated_at timestamptz,
    tags jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.user_id,
        s.url,
        s.title,
        s.description,
        s.created_at,
        s.updated_at,
        COALESCE(
            jsonb_agg(
                jsonb_build_object('id', t.id, 'name', t.name)
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::jsonb
        ) as tags
    FROM saves s
    LEFT JOIN save_tags st ON s.id = st.save_id
    LEFT JOIN tags t ON st.tag_id = t.id
    WHERE s.user_id = p_user_id
    AND (p_search IS NULL OR s.url ILIKE '%' || p_search || '%')
    AND (p_tag_name IS NULL OR t.name = p_tag_name)
    GROUP BY s.id, s.user_id, s.url, s.title, s.description, s.created_at, s.updated_at
    ORDER BY s.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;