-- Enable public read access for feed (posts and profiles)

-- Ensure RLS is enabled on posts (should already be enabled)
alter table public.posts enable row level security;

-- Posts: Allow public (anon) and authenticated users to read
drop policy if exists "posts_read_authenticated" on public.posts;
drop policy if exists "posts_read_public" on public.posts;
create policy "posts_read_public"
on public.posts
for select
to public
using (true);

-- Keep authenticated insert policy (for creating posts)
drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own"
on public.posts
for insert
to authenticated
with check (author_id = auth.uid());

-- Ensure RLS is enabled on profiles (if not already)
alter table public.profiles enable row level security;

-- Profiles: Allow public read for feed display
-- This allows anonymous users to read profile data needed for the feed
-- The API query only selects id, display_name, avatar_url
drop policy if exists "profiles_read_public_feed" on public.profiles;
create policy "profiles_read_public_feed"
on public.profiles
for select
to public
using (true);
