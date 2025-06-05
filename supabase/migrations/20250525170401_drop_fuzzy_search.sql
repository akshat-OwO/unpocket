drop function if exists public.fuzzy_search_saves(text, int, int);

drop index if exists saves_trgm_idx;
drop extension if exists pg_trgm;

create or replace function public.simple_url_search_saves(
  p_search text,
  p_limit  int,
  p_offset int
)
returns table (
  id          uuid,
  url         text,
  user_id     uuid,
  title       text,
  description text,
  image_url   text,
  created_at  timestamptz
) as $$
  select
    id, url, user_id, title, description, image_url, created_at
  from public.saves
  where user_id = auth.uid()
    and url ilike '%' || p_search || '%'
  order by created_at desc
  limit p_limit
  offset p_offset;
$$ language sql stable security definer;