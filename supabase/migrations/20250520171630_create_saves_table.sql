create table saves (
    id uuid not null default gen_random_uuid () primary key,
    user_id uuid not null references auth.users (id) on delete cascade,
    url text not null,
    title text not null,
    description text,
    image_url text,
    created_at timestamptz not null default now ()
);

-- Row level security
alter table saves enable row level security;

create policy "Users can see their own saves only."
on saves
for select using ( (select auth.uid()) = user_id );

create policy "Users can insert their own saves."
on saves for insert
to authenticated
with check ( (select auth.uid()) = user_id );

create policy "Users can update their own saves."
on saves for update
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );

create policy "Users can delete their own saves."
on saves for delete
to authenticated
using ( (select auth.uid()) = user_id );