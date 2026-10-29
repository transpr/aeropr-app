// Sources & method — the DataParl'-style trust page.
import { getOrgs, getLatest, type Release } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  let orgs: { org_name: string; n: number }[] = [];
  let recent: Release[] = [];
  try {
    orgs = await getOrgs("air");
    recent = await getLatest("air", {}, 500);
  } catch { /* empty */ }

  const lastRelease = new Map<string, string>();
  for (const r of recent) {
    const prev = lastRelease.get(r.org_name);
    if (!prev || new Date(r.published_at) > new Date(prev)) lastRelease.set(r.org_name, r.published_at);
  }
  const lastCrawl = recent[0]?.created_at ?? null;

  return (
    <div className="container">
      <div className="page-head">
        <h2>Sources &amp; method</h2>
        {lastCrawl && (
          <span className="count">last successful crawl: {new Date(lastCrawl).toLocaleString("en-GB")}</span>
        )}
      </div>
      <p style={{ color: "var(--color-text-secondary)", maxWidth: 720, marginBottom: 18 }}>
        AeroPR monitors the official newsrooms of airlines, airline groups, alliances, airports,
        manufacturers, regulators and industry organizations. Every release links back to its
        original source. Publication dates are taken from the original page whenever available;
        items whose original date could not be verified are marked as such.
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Organization</th>
            <th>Recent releases</th>
            <th>Last release seen</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orgs.length === 0 ? (
            <tr><td colSpan={4} style={{ color: "var(--color-text-secondary)" }}>No sources reporting yet.</td></tr>
          ) : orgs.map((o) => (
            <tr key={o.org_name}>
              <td>{o.org_name}</td>
              <td className="mono">{o.n}</td>
              <td className="mono">{lastRelease.get(o.org_name) ? new Date(lastRelease.get(o.org_name)!).toLocaleDateString("en-GB") : "—"}</td>
              <td className="status-ok">monitored</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
