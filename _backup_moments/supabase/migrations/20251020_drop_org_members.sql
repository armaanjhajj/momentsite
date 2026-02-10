-- Drop org_members artifacts safely
begin;
  drop policy if exists "Org admins can manage members" on public.org_members;
  drop policy if exists "Members can view memberships" on public.org_members;
  alter table if exists public.org_members disable row level security;
  drop table if exists public.org_members cascade;
  -- Also drop any helper fns
  drop function if exists public.is_org_admin(uuid);
  drop function if exists public.is_org_admin(uuid, uuid);
  drop function if exists public.get_user_orgs();
  drop function if exists public.get_user_orgs(uuid);
commit;
