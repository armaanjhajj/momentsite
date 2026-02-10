-- Minimal organizations table + sync triggers

-- 1) Create minimal organizations table
create table if not exists public.organizations (
  id uuid primary key,                 -- mirrors profiles.user_id for orgs
  name text not null,
  avatar_url text,
  bio text,
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: anyone can select; updates only by the org itself
alter table public.organizations enable row level security;

drop policy if exists "Anyone can view organizations" on public.organizations;
create policy "Anyone can view organizations"
  on public.organizations for select to authenticated using (true);

drop policy if exists "Org can update own row" on public.organizations;
create policy "Org can update own row"
  on public.organizations for update to authenticated using (id = auth.uid());

-- 2) Seed from existing profiles where is_org = true
insert into public.organizations (id, name, avatar_url, bio, is_verified, created_at, updated_at)
select p.user_id, coalesce(trim(p.first_name || ' ' || p.last_name), 'Organization'), p.avatar_url, p.bio, coalesce(p.is_verified,false), p.created_at, p.updated_at
from public.profiles p
where p.is_org = true
on conflict (id) do update set
  name = excluded.name,
  avatar_url = excluded.avatar_url,
  bio = excluded.bio,
  is_verified = excluded.is_verified,
  updated_at = excluded.updated_at;

-- 3) Triggers to sync changes from profiles
create or replace function public.sync_organization_from_profile()
returns trigger language plpgsql as $$
begin
  -- When a profile flips to org=true, ensure org row exists
  if new.is_org = true then
    insert into public.organizations (id, name, avatar_url, bio, is_verified, created_at, updated_at)
    values (new.user_id, coalesce(trim(new.first_name || ' ' || new.last_name), 'Organization'), new.avatar_url, new.bio, coalesce(new.is_verified,false), now(), now())
    on conflict (id) do update set
      name = excluded.name,
      avatar_url = excluded.avatar_url,
      bio = excluded.bio,
      is_verified = excluded.is_verified,
      updated_at = now();
  else
    -- if a profile is no longer an org, remove its org row
    delete from public.organizations where id = new.user_id;
  end if;
  return new;
end$$;

drop trigger if exists trg_sync_org_from_profile on public.profiles;
create trigger trg_sync_org_from_profile
after insert or update of is_org, first_name, last_name, avatar_url, bio, is_verified on public.profiles
for each row execute function public.sync_organization_from_profile();

