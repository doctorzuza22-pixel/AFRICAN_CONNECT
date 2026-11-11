-- African Connect: initial secure messaging foundation
-- Apply this file in the Supabase SQL Editor after creating a project.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  username text unique,
  country_code text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username is null or username ~ '^[a-zA-Z0-9_]{3,24}$')
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  conversation_type text not null check (conversation_type in ('direct', 'group')),
  title text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint group_title_required check (conversation_type <> 'group' or (title is not null and length(trim(title)) between 1 and 80))
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz,
  constraint message_body_length check (length(body) between 1 and 10000)
);

create index if not exists conversation_members_user_idx on public.conversation_members(user_id);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at desc);

-- SECURITY DEFINER avoids recursive membership-table RLS checks.
create or replace function public.is_conversation_member(target_conversation uuid, target_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = target_conversation and cm.user_id = target_user
  );
$$;

revoke all on function public.is_conversation_member(uuid, uuid) from public;
grant execute on function public.is_conversation_member(uuid, uuid) to authenticated;

-- Create a conversation and its initial membership list atomically.
create or replace function public.create_conversation(
  member_ids uuid[],
  conversation_type text default 'direct',
  conversation_title text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_conversation_id uuid;
  unique_members uuid[];
  member_count integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if conversation_type not in ('direct', 'group') then
    raise exception 'Invalid conversation type';
  end if;
  if conversation_type = 'group' and (conversation_title is null or length(trim(conversation_title)) not between 1 and 80) then
    raise exception 'Group title must be 1 to 80 characters';
  end if;

  select array_agg(distinct member_id)
    into unique_members
    from unnest(coalesce(member_ids, array[]::uuid[]) || array[auth.uid()]) as member_id
    where member_id is not null;
  member_count := coalesce(array_length(unique_members, 1), 0);

  if conversation_type = 'direct' and member_count <> 2 then
    raise exception 'A direct conversation must have exactly two members';
  end if;
  if conversation_type = 'group' and (member_count < 2 or member_count > 100) then
    raise exception 'A group must have between 2 and 100 members';
  end if;

  insert into public.conversations(conversation_type, title, created_by)
  values (conversation_type, nullif(trim(conversation_title), ''), auth.uid())
  returning id into new_conversation_id;

  insert into public.conversation_members(conversation_id, user_id, role)
  select new_conversation_id, member_id,
         case when member_id = auth.uid() then 'owner' else 'member' end
  from unnest(unique_members) as member_id;

  return new_conversation_id;
end;
$$;

revoke all on function public.create_conversation(uuid[], text, text) from public;
grant execute on function public.create_conversation(uuid[], text, text) to authenticated;

-- Automatically provision a private profile row when an auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

-- Profiles are visible to signed-in members; only the owner can change their row.
create policy "authenticated users can read profiles"
on public.profiles for select to authenticated using (true);
create policy "users can insert their own profile"
on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "users can update their own profile"
on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "members can read conversations"
on public.conversations for select to authenticated
using (public.is_conversation_member(id));
create policy "authenticated users can create conversations"
on public.conversations for insert to authenticated
with check (created_by = auth.uid());

create policy "members can read membership"
on public.conversation_members for select to authenticated
using (public.is_conversation_member(conversation_id));
-- Membership creation is intentionally routed through create_conversation().
create policy "members can read messages"
on public.messages for select to authenticated
using (public.is_conversation_member(conversation_id));
create policy "members can send as themselves"
on public.messages for insert to authenticated
with check (
  sender_id = auth.uid()
  and public.is_conversation_member(conversation_id)
);
create policy "senders can edit their own messages"
on public.messages for update to authenticated
using (sender_id = auth.uid() and public.is_conversation_member(conversation_id))
with check (sender_id = auth.uid() and public.is_conversation_member(conversation_id));

grant select, insert, update on public.profiles to authenticated;
grant select, insert on public.conversations to authenticated;
grant select on public.conversation_members to authenticated;
grant select, insert, update on public.messages to authenticated;

-- Enable Supabase Realtime for new-message subscriptions.
do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then
  null;
end $$;
