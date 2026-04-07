-- User taste table (music, film, literature favorites) with FK to users
create table if not exists public.user_taste (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  category text not null check (category in ('music', 'film', 'literature')),
  item_type text not null check (item_type in ('song', 'album', 'movie', 'tv', 'book')),
  external_id text not null,
  title text not null,
  subtitle text,
  cover_url text,
  position integer default 0,
  created_at timestamptz default now()
);

create index if not exists user_taste_user_id_idx on public.user_taste(user_id);
create unique index if not exists user_taste_unique_idx on public.user_taste(user_id, category, external_id);

alter table public.user_taste enable row level security;

create policy "Taste is viewable by everyone"
  on public.user_taste for select using (true);

create policy "Users can insert their own taste"
  on public.user_taste for insert with check (auth.uid() = user_id);

create policy "Users can update their own taste"
  on public.user_taste for update using (auth.uid() = user_id);

create policy "Users can delete their own taste"
  on public.user_taste for delete using (auth.uid() = user_id);
