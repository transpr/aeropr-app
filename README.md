# aeropr-app

AeroPR web app (Next.js, App Router). Landing, press release directory,
JSON API and personalized RSS feeds (/feed/{token}.xml), reading the
central Supabase populated by aeropr-crawlers.

## Design system

Tokens in `app/globals.css` (data-brand="aeropr"). Inter + IBM Plex Mono.
The same codebase will serve RailPressRelease later with
data-brand="railpressrelease" and its teal theme — components only use
semantic tokens.

## Env

Copy `.env.example` to `.env.local` and fill:
- SUPABASE_URL
- SUPABASE_SERVICE_KEY (server-side only, never NEXT_PUBLIC)
- NEXT_PUBLIC_SITE_URL

## Deploy (Vercel)

1. Push this repo, import it on vercel.com (framework: Next.js auto-detected).
2. Add the 3 env vars in Project Settings -> Environment Variables.
3. Deploy.

## Testing a feed

Create a feed row in Supabase (Table Editor -> feeds):
- token: "demo" (or any string)
- sector: "air", plan: "pro", delay_hours: 0, filters: {}
Then open: /feed/demo.xml
