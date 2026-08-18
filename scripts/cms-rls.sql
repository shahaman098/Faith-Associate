-- Faith Associates CMS access policies
-- Apply this in Supabase after creating the CMS tables and public `media` bucket.

grant usage on schema public to anon, authenticated;

grant select on public.site_settings to anon, authenticated;
grant select on public.pages to anon, authenticated;
grant select on public.entries to anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select, insert, update, delete on public.pages to authenticated;
grant select, insert, update, delete on public.entries to authenticated;
grant select, insert, update, delete on public.media to authenticated;

alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
alter table public.entries enable row level security;
alter table public.profiles enable row level security;
alter table public.media enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (id = 'default');

drop policy if exists "Public can read published pages" on public.pages;
create policy "Public can read published pages"
on public.pages
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public can read published entries" on public.entries;
create policy "Public can read published entries"
on public.entries
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "CMS editors manage site settings" on public.site_settings;
create policy "CMS editors manage site settings"
on public.site_settings
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
);

drop policy if exists "CMS editors manage pages" on public.pages;
create policy "CMS editors manage pages"
on public.pages
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
);

drop policy if exists "CMS editors manage entries" on public.entries;
create policy "CMS editors manage entries"
on public.entries
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
);

drop policy if exists "CMS editors manage media metadata" on public.media;
create policy "CMS editors manage media metadata"
on public.media
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
);

drop policy if exists "CMS editors can read media objects" on storage.objects;
create policy "CMS editors can read media objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'media'
  and exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
);

drop policy if exists "CMS editors can upload media objects" on storage.objects;
create policy "CMS editors can upload media objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media'
  and exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
);

drop policy if exists "CMS editors can update media objects" on storage.objects;
create policy "CMS editors can update media objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'media'
  and exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
)
with check (
  bucket_id = 'media'
  and exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
);

drop policy if exists "CMS editors can delete media objects" on storage.objects;
create policy "CMS editors can delete media objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'media'
  and exists (
    select 1
    from public.profiles
    where user_id = (select auth.uid())
      and role in ('editor', 'admin')
  )
);
