alter table tags enable row level security;
alter table save_tags enable row level security;

-- SELECT
create policy "Users can view their own tags"
on tags
for select
using (auth.uid() = user_id);

-- INSERT
create policy "Users can insert their own tags"
on tags
for insert
with check (auth.uid() = user_id);

-- UPDATE
create policy "Users can update their own tags"
on tags
for update
using (auth.uid() = user_id);

-- DELETE
create policy "Users can delete their own tags"
on tags
for delete
using (auth.uid() = user_id);

-- SELECT
create policy "Users can view their own save_tags"
on save_tags
for select
using (
  exists (
    select 1 from saves s
    where s.id = save_tags.save_id
    and s.user_id = auth.uid()
  )
);

-- INSERT
create policy "Users can insert save_tags for their own saves and tags"
on save_tags
for insert
with check (
  exists (
    select 1 from saves s
    where s.id = save_tags.save_id
    and s.user_id = auth.uid()
  )
  and
  exists (
    select 1 from tags t
    where t.id = save_tags.tag_id
    and t.user_id = auth.uid()
  )
);

-- DELETE
create policy "Users can delete their own save_tags"
on save_tags
for delete
using (
  exists (
    select 1 from saves s
    where s.id = save_tags.save_id
    and s.user_id = auth.uid()
  )
);