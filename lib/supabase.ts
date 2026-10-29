// Server-side Supabase REST helpers (service role, never exposed to the client).

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export interface Release {
  id: string;
  sector: string;
  source_slug: string;
  source_type: string;
  org_group: string | null;
  alliance: string | null;
  org_name: string;
  title: string;
  published_at: string;
  source_url: string;
  language: string;
  summary: string | null;
  body: string;
  body_en: string | null;
  categories: string[] | null;
  created_at: string | null;
}

export interface FeedRow {
  token: string;
  sector: string;
  label: string | null;
  filters: Record<string, any>;
  plan: string;
  delay_hours: number;
}

async function supabase<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });
  if (!res.ok) throw new Error(`Supabase ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export interface FeedFilters { q?: string; org?: string; cat?: string; sector?: string }

export async function getLatest(sector: string, f: FeedFilters = {}, limit = 60): Promise<Release[]> {
  let q = `press_releases?sector=eq.${sector}&select=*&order=published_at.desc&limit=${limit}`;
  if (f.org) q += `&org_name=eq.${f.org}`;
  const rows = await supabase<Release[]>(q);
  if (!f.q && !f.cat) return rows;
  const needle = (f.q ?? "").toLowerCase();
  return rows.filter((r) => {
    const okQ = !needle || r.title.toLowerCase().includes(needle) || (r.body_en || r.body).toLowerCase().includes(needle);
    const okC = !f.cat || (r.categories ?? []).includes(f.cat);
    return okQ && okC;
  });
}

export async function getOrgs(sector: string): Promise<{ org_name: string; n: number }[]> {
  const rows = await supabase<{ org_name: string }[]>(
    `press_releases?sector=eq.${sector}&select=org_name&order=published_at.desc&limit=500`,
  );
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(r.org_name, (counts.get(r.org_name) ?? 0) + 1);
  return [...counts.entries()].map(([org_name, n]) => ({ org_name, n })).sort((a, b) => b.n - a.n);
}

export async function getFeed(token: string): Promise<FeedRow | null> {
  const rows = await supabase<FeedRow[]>(`feeds?token=eq.${encodeURIComponent(token)}&select=*`);
  return rows?.[0] ?? null;
}

export async function getReleasesForFeed(feed: FeedRow, limit = 100): Promise<Release[]> {
  const f = feed.filters ?? {};
  let q = `press_releases?sector=eq.${feed.sector}&select=*&order=published_at.desc&limit=${limit}`;
  if (f.org_groups?.length) q += `&org_group=in.(${f.org_groups.join(",")})`;
  if (f.alliances?.length) q += `&alliance=in.(${f.alliances.join(",")})`;
  const rows = await supabase<Release[]>(q);
  // f.sources holds org display names (as shown in the feed builder UI).
  if (f.sources?.length) {
    return rows.filter((r) => f.sources.includes(r.org_name));
  }
  if (f.categories?.length) {
    return rows.filter((r) => (r.categories ?? []).some((c) => f.categories.includes(c)));
  }
  if (f.keywords?.length) {
    const kws = f.keywords.map((k: string) => k.toLowerCase());
    return rows.filter((r) => {
      const hay = `${r.title}\n${r.body_en || r.body}`.toLowerCase();
      return kws.some((k: string) => hay.includes(k));
    });
  }
  return rows;
}

export async function createFeed(row: FeedRow): Promise<FeedRow> {
  const saved = await supabase<FeedRow[]>("feeds", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify([row]),
  });
  return saved[0];
}
