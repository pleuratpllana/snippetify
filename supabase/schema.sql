create extension if not exists pgcrypto;

create or replace function public.is_email_confirmed()
returns boolean
language sql
stable
security definer
set search_path = auth, public
as $$
  select exists (
    select 1
    from auth.users
    where id = auth.uid()
      and email_confirmed_at is not null
  );
$$;

revoke all on function public.is_email_confirmed() from public;
grant execute on function public.is_email_confirmed() to authenticated;

create table if not exists public.snippets (
  user_id uuid not null references auth.users(id) on delete cascade,
  id bigint not null,
  title text not null,
  subtitle text,
  code_content text not null default '',
  tags text[] not null default array['No tags']::text[],
  is_starred boolean not null default false,
  usage_count integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.folders (
  user_id uuid not null references auth.users(id) on delete cascade,
  id bigint not null,
  title text not null,
  description text,
  color text,
  snippet_ids bigint[] not null default '{}',
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.ask_ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  is_pinned boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ask_ai_chat_sessions
  add column if not exists is_pinned boolean not null default false;

create table if not exists public.ask_ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ask_ai_chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt text not null,
  result text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ask_ai_chat_sessions_user_updated_idx
on public.ask_ai_chat_sessions (user_id, is_pinned desc, is_archived, updated_at desc);

create index if not exists ask_ai_chat_messages_session_position_idx
on public.ask_ai_chat_messages (session_id, position, created_at);

create unique index if not exists ask_ai_chat_messages_session_position_unique_idx
on public.ask_ai_chat_messages (session_id, position);

alter table public.snippets enable row level security;
alter table public.folders enable row level security;
alter table public.ask_ai_chat_sessions enable row level security;
alter table public.ask_ai_chat_messages enable row level security;
alter table public.snippets force row level security;
alter table public.folders force row level security;
alter table public.ask_ai_chat_sessions force row level security;
alter table public.ask_ai_chat_messages force row level security;

revoke all on public.snippets from anon;
revoke all on public.folders from anon;
revoke all on public.ask_ai_chat_sessions from anon;
revoke all on public.ask_ai_chat_messages from anon;
grant select, insert, update, delete on public.snippets to authenticated;
grant select, insert, update, delete on public.folders to authenticated;
grant select, insert, update, delete on public.ask_ai_chat_sessions to authenticated;
grant select, insert, update, delete on public.ask_ai_chat_messages to authenticated;

drop policy if exists "Users can read own confirmed snippets" on public.snippets;
drop policy if exists "Users can insert own confirmed snippets" on public.snippets;
drop policy if exists "Users can update own confirmed snippets" on public.snippets;
drop policy if exists "Users can delete own confirmed snippets" on public.snippets;

create policy "Users can read own confirmed snippets"
on public.snippets
for select
to authenticated
using (auth.uid() = user_id and public.is_email_confirmed());

create policy "Users can insert own confirmed snippets"
on public.snippets
for insert
to authenticated
with check (auth.uid() = user_id and public.is_email_confirmed());

create policy "Users can update own confirmed snippets"
on public.snippets
for update
to authenticated
using (auth.uid() = user_id and public.is_email_confirmed())
with check (auth.uid() = user_id and public.is_email_confirmed());

create policy "Users can delete own confirmed snippets"
on public.snippets
for delete
to authenticated
using (auth.uid() = user_id and public.is_email_confirmed());

drop policy if exists "Users can read own confirmed folders" on public.folders;
drop policy if exists "Users can insert own confirmed folders" on public.folders;
drop policy if exists "Users can update own confirmed folders" on public.folders;
drop policy if exists "Users can delete own confirmed folders" on public.folders;

create policy "Users can read own confirmed folders"
on public.folders
for select
to authenticated
using (auth.uid() = user_id and public.is_email_confirmed());

create policy "Users can insert own confirmed folders"
on public.folders
for insert
to authenticated
with check (auth.uid() = user_id and public.is_email_confirmed());

create policy "Users can update own confirmed folders"
on public.folders
for update
to authenticated
using (auth.uid() = user_id and public.is_email_confirmed())
with check (auth.uid() = user_id and public.is_email_confirmed());

create policy "Users can delete own confirmed folders"
on public.folders
for delete
to authenticated
using (auth.uid() = user_id and public.is_email_confirmed());

drop policy if exists "Users can read own confirmed ask ai chat sessions" on public.ask_ai_chat_sessions;
drop policy if exists "Users can insert own confirmed ask ai chat sessions" on public.ask_ai_chat_sessions;
drop policy if exists "Users can update own confirmed ask ai chat sessions" on public.ask_ai_chat_sessions;
drop policy if exists "Users can delete own confirmed ask ai chat sessions" on public.ask_ai_chat_sessions;

create policy "Users can read own confirmed ask ai chat sessions"
on public.ask_ai_chat_sessions
for select
to authenticated
using (auth.uid() = user_id and public.is_email_confirmed());

create policy "Users can insert own confirmed ask ai chat sessions"
on public.ask_ai_chat_sessions
for insert
to authenticated
with check (auth.uid() = user_id and public.is_email_confirmed());

create policy "Users can update own confirmed ask ai chat sessions"
on public.ask_ai_chat_sessions
for update
to authenticated
using (auth.uid() = user_id and public.is_email_confirmed())
with check (auth.uid() = user_id and public.is_email_confirmed());

create policy "Users can delete own confirmed ask ai chat sessions"
on public.ask_ai_chat_sessions
for delete
to authenticated
using (auth.uid() = user_id and public.is_email_confirmed());

drop policy if exists "Users can read own confirmed ask ai chat messages" on public.ask_ai_chat_messages;
drop policy if exists "Users can insert own confirmed ask ai chat messages" on public.ask_ai_chat_messages;
drop policy if exists "Users can update own confirmed ask ai chat messages" on public.ask_ai_chat_messages;
drop policy if exists "Users can delete own confirmed ask ai chat messages" on public.ask_ai_chat_messages;

create policy "Users can read own confirmed ask ai chat messages"
on public.ask_ai_chat_messages
for select
to authenticated
using (
  auth.uid() = user_id
  and public.is_email_confirmed()
  and exists (
    select 1
    from public.ask_ai_chat_sessions sessions
    where sessions.id = ask_ai_chat_messages.session_id
      and sessions.user_id = auth.uid()
  )
);

create policy "Users can insert own confirmed ask ai chat messages"
on public.ask_ai_chat_messages
for insert
to authenticated
with check (
  auth.uid() = user_id
  and public.is_email_confirmed()
  and exists (
    select 1
    from public.ask_ai_chat_sessions sessions
    where sessions.id = ask_ai_chat_messages.session_id
      and sessions.user_id = auth.uid()
  )
);

create policy "Users can update own confirmed ask ai chat messages"
on public.ask_ai_chat_messages
for update
to authenticated
using (
  auth.uid() = user_id
  and public.is_email_confirmed()
  and exists (
    select 1
    from public.ask_ai_chat_sessions sessions
    where sessions.id = ask_ai_chat_messages.session_id
      and sessions.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and public.is_email_confirmed()
  and exists (
    select 1
    from public.ask_ai_chat_sessions sessions
    where sessions.id = ask_ai_chat_messages.session_id
      and sessions.user_id = auth.uid()
  )
);

create policy "Users can delete own confirmed ask ai chat messages"
on public.ask_ai_chat_messages
for delete
to authenticated
using (
  auth.uid() = user_id
  and public.is_email_confirmed()
  and exists (
    select 1
    from public.ask_ai_chat_sessions sessions
    where sessions.id = ask_ai_chat_messages.session_id
      and sessions.user_id = auth.uid()
  )
);
