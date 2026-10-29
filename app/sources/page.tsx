import { getOrgs, getLatest, type Release } from "../../lib/supabase";
import { t } from "../../lib/i18n";
import { getLang } from "../../lib/lang";
import { slugify } from "../../lib/orgs";

export const dynamic = "force-dynamic";

const LOCALES: Record<string, string> = { en: "en-GB", fr: "fr-FR", it: "it-IT", de: "de-DE", es: "es-ES", pt: "pt-PT" };

export default async function SourcesPage() {
  const lang = await getLang();
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
        <h2>{t(lang, "nav_sources")}</h2>
        {lastCrawl && (
          <span className="count">{t(lang, "last_crawl")} {new Date(lastCrawl).toLocaleString(LOCALES[lang])}</span>
        )}
      </div>
      <p style={{ color: "var(--color-text-secondary)", maxWidth: 720, marginBottom: 18 }}>
        {t(lang, "sources_desc")}
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>{t(lang, "th_org")}</th>
            <th>{t(lang, "th_count")}</th>
            <th>{t(lang, "th_last")}</th>
            <th>{t(lang, "th_status")}</th>
          </tr>
        </thead>
        <tbody>
          {orgs.length === 0 ? (
            <tr><td colSpan={4} style={{ color: "var(--color-text-secondary)" }}>{t(lang, "no_sources")}</td></tr>
          ) : orgs.map((o) => (
            <tr key={o.org_name}>
              <td><a href={"/org/" + slugify(o.org_name)}>{o.org_name}</a></td>
              <td className="mono">{o.n}</td>
              <td className="mono">{lastRelease.get(o.org_name) ? new Date(lastRelease.get(o.org_name)!).toLocaleDateString(LOCALES[lang]) : "—"}</td>
              <td className="status-ok">{t(lang, "monitored")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
