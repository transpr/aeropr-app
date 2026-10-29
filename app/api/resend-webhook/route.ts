import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

// Resend Inbound webhook (email.received).
// Adresses media lists : cp-{source_slug}@… — préfixe = source_slug, parse auto.
// Payload = métadonnées seulement ; le corps est récupéré via l'API retrieve.
// Signature vérifiée (svix) avec RESEND_WEBHOOK_SECRET (paramétré dans Vercel).

const SUPA = () => ({
  url: process.env.SUPABASE_URL!,
  key: process.env.SUPABASE_SERVICE_KEY!,
});

const CATEGORIZE: Record<string, string[]> = {
  fleet: ["order", "delivery", "fleet", "took delivery"],
  network: ["route", "destination", "launch", "capacity", "slot", "base"],
  partnerships: ["codeshare", "interline", "alliance", "joint venture", "loyalty", "partnership"],
  "fuel-environment": ["saf", "sustainable aviation fuel", "decarbon", "carbon", "kerosene"],
  "geopolitics-regulation": ["airspace", "sanction", "tax", "open skies", "regulat"],
  labour: ["strike", "union", "labour", "labor", "negotiat", "cadet", "hiring", "recruitment"],
  "operations-incidents": ["disruption", "outage", "investigation", "airworthiness", "recall", "incident", "divert"],
  "finance-ma": ["results", "revenue", "profit", "loss", "acquisition", "merger", "bankrupt", "ipo", "outlook"],
  "product-passenger": ["lounge", "cabin", "wifi", "gastronomy", "menu", "seat", "passenger experience"],
  "ground-mro": ["mro", "maintenance", "leasing", "handling", "overhaul"],
  cargo: ["cargo", "freighter", "p2f", "freight"],
  events: ["airshow", "bourget", "farnborough", "dubai airshow", "agm"],
};

function categorize(text: string): string[] {
  const t = text.toLowerCase();
  const cats = new Set<string>();
  for (const [cat, kws] of Object.entries(CATEGORIZE)) {
    if (kws.some((k) => t.includes(k))) cats.add(cat);
  }
  return [...cats];
}

function slugFromAddress(to: string): string | null {
  const m = to.match(/^cp-([a-z0-9-]+)@/);
  return m ? m[1] : null;
}

/** Vérifie la signature svix (Resend) : headers svix-id, svix-timestamp, svix-signature. */
function verifySvix(rawBody: string, headers: Headers, secret: string): boolean {
  const id = headers.get("svix-id") ?? "";
  const timestamp = headers.get("svix-timestamp") ?? "";
  const signatureHeader = headers.get("svix-signature") ?? "";
  if (!id || !timestamp || !signatureHeader) return false;

  // anti-replay : fenêtre de 5 minutes
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const toSign = Buffer.from(`${id}.${timestamp}.${rawBody}`, "utf8");
  const expected = createHmac("sha256", secretBytes).update(toSign).digest("base64");
  const provided = signatureHeader.split(" ").find((p) => p.startsWith("v1,"));
  if (!provided) return false;
  const a = Buffer.from(provided.slice(3));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const { url, key } = SUPA();
  const raw = await req.text();

  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (webhookSecret && !verifySvix(raw, req.headers, webhookSecret)) {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const to: string = payload?.data?.to ?? "";
  const slug = slugFromAddress(to);
  if (!slug) return NextResponse.json({ ok: true, ignored: true, reason: "no cp- prefix" });

  // Corps du message via l'API retrieve (le webhook ne porte que les métadonnées)
  const emailId = payload?.data?.email?.id ?? payload?.data?.email_id;
  let html = "";
  let text = "";
  if (emailId) {
    const r = await fetch(`https://api.resend.com/emails/${emailId}`, {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    if (r.ok) {
      const email = await r.json();
      html = email.html ?? "";
      text = email.text ?? "";
    }
  }
  const body = html || text;
  if (!body) return NextResponse.json({ ok: false, error: "empty body" }, { status: 422 });

  const title = (payload?.data?.subject ?? "(no subject)").trim();
  const body_en = null; // traduction IA : à brancher sur Mistral (comme les crawlers)

  const res = await fetch(`${url}/rest/v1/press_releases`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates",
    },
    body: JSON.stringify({
      sector: "air",
      source_slug: slug,
      source_type: "org",
      org_name: slug,
      title,
      published_at: payload?.data?.created_at ?? new Date().toISOString(),
      source_url: emailId ? `https://api.resend.com/emails/${emailId}` : `mailto:${to}`,
      language: "en",
      summary: text.slice(0, 300),
      body,
      body_en,
      categories: categorize(`${title}\n${text || body}`),
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: await res.text() }, { status: 502 });
  }
  return NextResponse.json({ ok: true, source: slug });
}
