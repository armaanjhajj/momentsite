-- Org claims: policies and RPCs

-- Helpful index
create index if not exists organization_requests_org_status_idx
  on public.organization_requests (organization_id, status);

-- RLS policies on organization_requests
alter table public.organization_requests enable row level security;

-- Recreate policies with descriptive names (safe to run multiple times)
drop policy if exists "Users can insert own organization requests" on public.organization_requests;
create policy "Users can insert own organization requests"
  on public.organization_requests
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can view own or org requests" on public.organization_requests;
create policy "Users can view own or org requests"
  on public.organization_requests
  for select
  to authenticated
  using (organization_id = auth.uid() or user_id = auth.uid());

drop policy if exists "Users can update org requests for their org" on public.organization_requests;
create policy "Users can update org requests for their org"
  on public.organization_requests
  for update
  to authenticated
  using (organization_id = auth.uid())
  with check (organization_id = auth.uid());

-- Approve request: adds org to requester's profiles.organizations
create or replace function public.approve_org_request(req_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_user uuid;
  v_status text;
  v_orgs jsonb;
begin
  select organization_id, user_id, status
    into v_org, v_user, v_status
  from public.organization_requests
  where id = req_id
  for update;

  if not found then
    raise exception 'request not found';
  end if;

  if v_org <> auth.uid() then
    raise exception 'not authorized';
  end if;

  update public.organization_requests
    set status = 'approved', updated_at = now()
  where id = req_id;

  select organizations into v_orgs
  from public.profiles
  where user_id = v_user
  for update;

  if v_orgs is null then
    v_orgs := '[]'::jsonb;
  end if;

  if not (v_orgs @> to_jsonb(array[v_org::text])) then
    update public.profiles
      set organizations = v_orgs || to_jsonb(v_org::text)
    where user_id = v_user;
  end if;
end;
$$;

grant execute on function public.approve_org_request(uuid) to authenticated;

-- Reject request: mark as rejected
create or replace function public.reject_org_request(req_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.organization_requests
  set status = 'rejected', updated_at = now()
  where id = req_id and organization_id = auth.uid();
$$;

grant execute on function public.reject_org_request(uuid) to authenticated;

-- Revoke membership: remove org from requester's array and mark rejected
create or replace function public.revoke_org_membership(req_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org uuid;
  v_user uuid;
begin
  select organization_id, user_id
    into v_org, v_user
  from public.organization_requests
  where id = req_id
  for update;

  if not found then
    raise exception 'request not found';
  end if;

  if v_org <> auth.uid() then
    raise exception 'not authorized';
  end if;

  update public.profiles
    set organizations = (
      select coalesce(jsonb_agg(elem) filter (where elem <> to_jsonb(v_org::text)), '[]'::jsonb)
      from jsonb_array_elements(coalesce(organizations, '[]'::jsonb)) elem
    )
  where user_id = v_user;

  update public.organization_requests
    set status = 'rejected', updated_at = now()
  where id = req_id;
end;
$$;

grant execute on function public.revoke_org_membership(uuid) to authenticated;



-- Allow re-requests after rejection: ensure ONLY one PENDING at a time per (user, org)
-- If you previously had a full unique index on (user_id, organization_id), drop it first (best-effort):
alter table public.organization_requests
  drop constraint if exists organization_requests_user_id_organization_id_key;
drop index if exists organization_requests_user_id_organization_id_key;
drop index if exists organization_requests_user_id_organization_id_idx;
drop index if exists org_requests_unique_user_org;

-- Enforce uniqueness only for PENDING requests
create unique index if not exists org_reqs_unique_pending
  on public.organization_requests (user_id, organization_id)
  where status = 'pending';

-- RPC: requester creates or returns existing pending request; allows re-request after rejection
create or replace function public.request_org_membership(target_org_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_req uuid;
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  -- Try to insert a new pending request
  begin
    insert into public.organization_requests (user_id, organization_id, status)
    values (v_user, target_org_id, 'pending')
    returning id into v_req;
  exception when unique_violation then
    -- If a pending request already exists, return its id
    select id into v_req
    from public.organization_requests
    where user_id = v_user and organization_id = target_org_id and status = 'pending'
    limit 1;
  end;

  return v_req;
end;
$$;

grant execute on function public.request_org_membership(uuid) to authenticated;

