import { getOrgs, getLatest, type Release } from "../../lib/supabase";
import { t } from "../../lib/dictionaries";
import { getLocale } from "../../lib/i18n";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const locale = await getLocale();
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
        <h2>{t(locale, "sources_title")}</h2>
        {lastCrawl && (
          <span className="count">{t(locale, "last_crawl")} {new Date(lastCrawl).toLocaleString("en-GB")}</span>
        )}
      </div>
      <p style={{ color: "var(--color-text-secondary)", maxWidth: 720, marginBottom: 18 }}>
        {t(locale, "sources_desc")}
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>{t(locale, "col_org")}</th>
            <th>{t(locale, "col_count")}</th>
            <th>{t(locale, "col_last")}</th>
            <th>{t(locale, "col_status")}</th>
          </tr>
        </thead>
        <tbody>
          {orgs.length === 0 ? (
            <tr><td colSpan={4} style={{ color: "var(--color-text-secondary)" }}>{t(locale, "no_sources")}</td></tr>
          ) : orgs.map((o) => (
            <tr key={o.org_name}>
              <td>{o.org_name}</td>
              <td className="mono">{o.n}</td>
              <td className="mono">{lastRelease.get(o.org_name) ? new Date(lastRelease.get(o.org_name)!).toLocaleDateString("en-GB") : "—"}</td>
              <td className="status-ok">{t(locale, "monitored")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
