create function saves_search(saves) returns text as $$
    select $1.url || '' || $1.title || '' || $1.description;
$$ language sql immutable;

create extension if not exists pg_trgm;

create index if not exists saves_trgm_idx
  on public.saves
  using gin (
    (
      coalesce(title, '') || ' '
      || coalesce(description, '') || ' '
      || coalesce(url, '')
    ) gin_trgm_ops
  );

create or replace function public.fuzzy_search_saves(
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
    and (
      similarity(title,       p_search) > 0.3
      or similarity(description, p_search) > 0.3
      or similarity(url,         p_search) > 0.3
    )
  order by greatest(
    similarity(title,       p_search),
    similarity(description, p_search),
    similarity(url,         p_search)
  ) desc
  limit p_limit
  offset p_offset;
$$ language sql stable security definer;

drop index if exists saves_trgm_idx;
create index if not exists saves_trgm_idx
  on public.saves
  using gin (
    (
      coalesce(title, '') || ' '
      || coalesce(description, '') || ' '
      || coalesce(url, '')
    )
    gin_trgm_ops
  );

create or replace function public.fuzzy_search_saves(
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
    and (
      -- exact substring match on URL
      url ilike '%' || p_search || '%'
      -- OR fuzzy matches via trigram
      or similarity(title,       p_search) > 0.3
      or similarity(description, p_search) > 0.3
      or similarity(url,         p_search) > 0.3
    )
  order by
    -- bump exact‐substring URL hits to the top
    (url ilike '%' || p_search || '%') desc,
    -- then sort by best fuzzy similarity
    greatest(
      similarity(title,       p_search),
      similarity(description, p_search),
      similarity(url,         p_search)
    ) desc
  limit p_limit
  offset p_offset;
$$ language sql stable security definer;

drop function if exists saves_search(saves);