-- IMPORTANT: harden the public schema before going live.
-- Tables created without RLS are readable/writable by anyone with the anon key.
-- Run this in the Supabase SQL editor of the AeroPR project.

alter table press_releases enable row level security;
alter table feeds enable row level security;
alter table sources_status enable row level security;

-- The Next.js app uses the service_role key server-side (bypasses RLS),
-- so no anon policy is needed. Deny-all by default:
-- (no policies created = no anon access)
