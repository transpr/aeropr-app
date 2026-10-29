# Resend Inbound webhook

Reçoit les événements `email.received` de Resend (domaine `airpressrelease.com` avec MX racine + Receiving activé).

- Adresses media lists : `cp-{source_slug}@airpressrelease.com` — le préfixe donne le `source_slug`, insertion directe dans `press_releases`.
- Signature **svix** vérifiée si `RESEND_WEBHOOK_SECRET` est défini (recommandé en prod, fenêtre anti-replay 5 min).
- Le payload du webhook ne contient que les métadonnées ; le corps est récupéré via `GET /emails/{id}` (clé `RESEND_API_KEY`).
- Dédup : `source_url` unique + `Prefer: resolution=ignore-duplicates`.

Env Vercel :
- `RESEND_API_KEY` (fourni par l'intégration Vercel ↔ Resend)
- `RESEND_WEBHOOK_SECRET` (signing secret du webhook Resend, `whsec_…`)
- `NEXT_PUBLIC_SITE_URL=https://airpressrelease.com`

Configuration Resend : Webhooks → endpoint `https://airpressrelease.com/api/resend-webhook` → événements `email.received`, `email.bounced`. *(créé : ID 619073d1-9f06-4348-a3e4-d04d0f281c11)*
