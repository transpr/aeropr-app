# Resend Inbound webhook

Reçoit les événements `email.received` de Resend (domaine avec MX racine + Receiving activé).

- Adresses media lists : `cp-{source_slug}@<domaine>` — le préfixe donne le `source_slug`, insertion directe dans `press_releases`.
- Le payload du webhook ne contient que les métadonnées ; le corps est récupéré via `GET /emails/{id}` (clé `RESEND_API_KEY`).
- Dédup : `source_url` unique + `Prefer: resolution=ignore-duplicates`.
- À faire : vérifier la signature du webhook (header `svix-signature`) avant traitement.

Env Vercel à ajouter : `RESEND_API_KEY`.
Configuration Resend : Webhooks → endpoint `https://<domaine>/api/resend-webhook` → événement `email.received`.
