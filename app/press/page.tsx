import Link from "next/link";
import ReleaseRow from "../../ReleaseRow";
import { getLatest, getOrgs, type Release } from "../../lib/supabase";
import { CATEGORY_LABELS } from "../../lib/labels";
import { t } from "../lib/i18n" === undefined ? undefined : (await import("../../lib/i18n")).t;
import { slugify } from "../../lib/orgs";
import { getLang } from "../../lib/lang";

export const dynamic = "force-dynamic";

interface PageProps { searchParams: Promise<{ q?: string; org?: string; cat?: string }> }

export default async function PressPage({ searchParams }: PageProps) {
  const lang = await getLang();
  const sp = await searchParams;
  let releases: Release[] = [];
  let orgs: { org_name: string; n: number }[] = [];
  try {
    releases = await getLatest("air", { q: sp.q, cat: sp.cat }, 200);
    orgs = await getOrgs("air");
  } catch { /* empty state */ }
  if (sp.org) releases = releases.filter((r) => r.org_name === sp.org);

  const qs = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q: sp.q, cat: sp.cat, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? "/press?" + s : "/press";
  };

  return (
    <div className="container">
      <div className="page-head">
        <h2>{t(lang, "nav_press")}</h2>
        <span className="count">{releases.length} {t(lang, "shown")} · {t(lang, "updated_cont")}</span>
      </div>
      <form className="searchbar" action="/press" method="get" role="search">
        <input type="search" name="q" defaultValue={sp.q} placeholder={t(lang, "search_ph")} aria-label={t(lang, "search_btn")} />
        <button type="submit">{t(lang, "search_btn")}</button>
      </form>
      <div className="filters" style={{ marginTop: 14 }}>
        <Link href={qs({ cat: sp.cat === undefined ? undefined : sp.cat })} className={!sp.org ? "on" : ""}>{t(lang, "all_orgs")}</Link>
        {orgs.slice(0, 12).map((o) => (
          <Link key={o.org_name} href={"/org/" + slugify(o.org_name)} className={sp.org === o.org_name ? "on" : ""}>
            {o.org_name} ({o.n})
          </Link>
        ))}
      </div>
      <div className="filters">
        <Link href={qs({ cat: undefined })} className={!sp.cat ? "on" : ""}>{t(lang, "all_topics")}</Link>
        {Object.entries(CATEGORY_LABELS[lang]).map(([slug, label]) => (
          <Link key={slug} href={qs({ cat: slug })} className={sp.cat === slug ? "on" : ""}>{label}</Link>
        ))}
      </div>
      <div className="releases">
        {releases.length === 0 ? (
          <p style={{ padding: 20, color: "var(--color-text-secondary)" }}>
            {t(lang, "no_match")}
          </p>
        ) : releases.map((r) => <ReleaseRow key={r.id} r={r} lang={lang} />)}
      </div>
    </div>
  );
}
