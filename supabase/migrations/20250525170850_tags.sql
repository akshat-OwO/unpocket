create table tags (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    created_at timestamptz default now(),
    unique (user_id, name)
);

create table save_tags (
    id uuid primary key default gen_random_uuid(),
    save_id uuid not null references saves(id) on delete cascade,
    tag_id uuid not null references tags(id) on delete cascade,
    unique (save_id, tag_id)
);