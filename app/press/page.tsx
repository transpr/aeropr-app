import Link from "next/link";
import ReleaseRow from "../ReleaseRow";
import { getLatest, getOrgs, type Release } from "../../lib/supabase";
import { CATEGORY_LABELS } from "../../lib/labels";
import { t } from "../../lib/dictionaries";
import { getLocale } from "../../lib/i18n";

export const dynamic = "force-dynamic";

interface PageProps { searchParams: Promise<{ q?: string; org?: string; cat?: string }> }

export default async function PressPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const locale = await getLocale();
  let releases: Release[] = [];
  let orgs: { org_name: string; n: number }[] = [];
  try {
    releases = await getLatest("air", { q: sp.q, cat: sp.cat }, 200);
    orgs = await getOrgs("air");
  } catch { /* empty state */ }
  if (sp.org) releases = releases.filter((r) => r.org_name === sp.org);

  const qs = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q: sp.q, org: sp.org, cat: sp.cat, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? "/press?" + s : "/press";
  };

  return (
    <div className="container">
      <div className="page-head">
        <h2>{t(locale, "press_title")}</h2>
        <span className="count">{releases.length} {t(locale, "shown")}</span>
      </div>
      <form className="searchbar" action="/press" method="get" role="search">
        <input type="search" name="q" defaultValue={sp.q} placeholder={t(locale, "search_ph2")} aria-label={t(locale, "search_btn")} />
        <button type="submit">{t(locale, "search_btn")}</button>
      </form>
      <div className="filters" style={{ marginTop: 14 }}>
        <Link href={qs({ org: undefined })} className={!sp.org ? "on" : ""}>{t(locale, "all_orgs")}</Link>
        {orgs.slice(0, 12).map((o) => (
          <Link key={o.org_name} href={qs({ org: o.org_name })} className={sp.org === o.org_name ? "on" : ""}>
            {o.org_name} ({o.n})
          </Link>
        ))}
      </div>
      <div className="filters">
        <Link href={qs({ cat: undefined })} className={!sp.cat ? "on" : ""}>{t(locale, "all_topics")}</Link>
        {Object.entries(CATEGORY_LABELS[locale]).map(([slug, label]) => (
          <Link key={slug} href={qs({ cat: slug })} className={sp.cat === slug ? "on" : ""}>{label}</Link>
        ))}
      </div>
      <div className="releases">
        {releases.length === 0 ? (
          <p style={{ padding: 20, color: "var(--color-text-secondary)" }}>{t(locale, "no_match")}</p>
        ) : releases.map((r) => <ReleaseRow key={r.id} r={r} locale={locale} />)}
      </div>
    </div>
  );
}
