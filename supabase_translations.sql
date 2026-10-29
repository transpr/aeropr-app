-- release_translations: cache for on-demand AI translations of press
-- releases (aeropr-app lib/translate.ts). Run ONCE in the Supabase SQL editor.
create table if not exists public.release_translations (
  release_id uuid not null references public.press_releases(id) on delete cascade,
  locale text not null check (locale in ('en','fr','it','de','es','pt')),
  title text,
  body text,
  model text,
  created_at timestamptz not null default now(),
  primary key (release_id, locale)
);

alter table public.release_translations enable row level security;
-- The app server uses the service role key, which bypasses RLS:
-- no policy needed, the table is unreachable with the anon key.
