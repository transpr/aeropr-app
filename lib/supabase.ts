// Server-side Supabase REST helpers (service role, never exposed to the client).

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export interface Release {
  id: string;
  sector: string;
  source_slug: string;
  org_name: string;
  org_group: string | null;
  alliance: string | null;
  title: string;
  published_at: string;
  source_url: string;
  language: string;
  summary: string | null;
  body: string;
  body_en: string | null;
  categories: string[] | null;
}

export interface FeedRow {
  token: string;
  sector: string;
  label: string | null;
  filters: Record<string, any>;
  plan: string;
  delay_hours: number;
}

async function supabase<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getLatest(sector: string, limit = 30): Promise<Release[]> {
  return supabase(
    `press_releases?sector=eq.${sector}&select=*&order=published_at.desc&limit=${limit}`,
  );
}

export async function getFeed(token: string): Promise<FeedRow | null> {
  const rows = await supabase<FeedRow[]>(`feeds?token=eq.${token}&select=*`);
  return rows?.[0] ?? null;
}

export async function getReleasesForFeed(feed: FeedRow, limit = 100): Promise<Release[]> {
  const f = feed.filters ?? {};
  let q = `press_releases?sector=eq.${feed.sector}&select=*&order=published_at.desc&limit=${limit}`;
  if (f.org_groups?.length) q += `&org_group=in.(${f.org_groups.join(",")})`;
  if (f.sources?.length) q += `&source_slug=in.(${f.sources.join(",")})`;
  if (f.alliances?.length) q += `&alliance=in.(${f.alliances.join(",")})`;
  return supabase(q);
}
