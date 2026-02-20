-- Create posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  caption text,
  media_url text,
  media_type text check (media_type in ('image','video')),
  like_count integer not null default 0
);

-- Enable Row Level Security
alter table public.posts enable row level security;

-- Anyone signed in can read the feed
drop policy if exists "posts_read_authenticated" on public.posts;
create policy "posts_read_authenticated"
on public.posts
for select
to authenticated
using (true);

-- Signed-in users can create their own posts
drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own"
on public.posts
for insert
to authenticated
with check (author_id = auth.uid());
