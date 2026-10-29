import { NextResponse } from "next/server";

// Resend Inbound webhook (email.received).
// Adresses media lists : cp-{source_slug}@… — préfixe = source_slug, parse auto.
// Payload = métadonnées seulement ; le corps est récupéré via l'API retrieve.

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

export async function POST(req: Request) {
  const { url, key } = SUPA();
  let payload: any;
  try {
    payload = await req.json();
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
