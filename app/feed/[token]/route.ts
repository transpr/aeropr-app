// Personalized RSS feed: /feed/{token}.xml
// The token references a row in the `feeds` table (filters, plan, delay).

import { getFeed, getReleasesForFeed, type Release } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const feed = await getFeed(token).catch(() => null);
  if (!feed) {
    return new Response("Feed not found", { status: 404 });
  }
  const releases = await getReleasesForFeed(feed).catch(() => [] as Release[]);

  // Basic plan: enforce the delay (default 12h) — Pro plan feeds are real-time.
  const cutoff = Date.now() - feed.delay_hours * 3600 * 1000;
  const visible = releases.filter(
    (r) => feed.plan !== "basic" || new Date(r.published_at).getTime() <= cutoff,
  );

  const items = visible
    .map((r) => {
      const body = r.body_en || r.body;
      const description = body.slice(0, 1200);
      return `    <item>
      <title>${esc(r.title)}</title>
      <link>${esc(r.source_url)}</link>
      <guid isPermaLink="true">${esc(r.source_url)}</guid>
      <pubDate>${new Date(r.published_at).toUTCString()}</pubDate>
      <author>${esc(r.org_name)}</author>
      <category>${esc(r.org_name)}</category>
      ${(r.categories ?? []).map((c) => `<category>${esc(c)}</category>`).join("\n      ")}
      <description>${esc(description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>AeroPR — ${esc(feed.label ?? "Aviation press releases")}</title>
    <link>https://aeropr.fr</link>
    <description>Official aviation press releases, aggregated and normalized by AeroPR.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
