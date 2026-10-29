import Link from "next/link";
import ReleaseRow from "../ReleaseRow";
import Logo from "../Logo";
import { getLatest, getOrgs, type Release } from "../../lib/supabase";
import { CATEGORY_LABELS } from "../../lib/labels";
import { t } from "../../lib/dictionaries";
import { getLocale } from "../../lib/i18n";

export const dynamic = "force-dynamic";

interface PageProps { searchParams: Promise<{ q?: string; org?: string; cat?: string; type?: string }> }

// Sidebar type filters → source_type sets (see lib/registry for the taxonomy).
const TYPE_SETS: Record<string, string[]> = {
  airline: ["airline"],
  airport: ["airport"],
  oem: ["oem"],
  org: ["regulator", "alliance", "mixed", "org", "group", "mro", "fuel", "inframan", "union", "consumer", "eco"],
};

const icon = (d: string) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

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
  if (sp.type && TYPE_SETS[sp.type]) releases = releases.filter((r) => TYPE_SETS[sp.type].includes(r.source_type));

  const qs = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q: sp.q, org: sp.org, cat: sp.cat, type: sp.type, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? "/press?" + s : "/press";
  };

  const navItems = [
    { key: undefined, label: t(locale, "nav_all_news"), icon: icon("<path d='M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2'/><path d='M18 14h-8M18 10h-8M18 18h-8'/>") },
    { key: "airline", label: t(locale, "nav_airlines"), icon: icon("<path d='M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z'/>") },
    { key: "airport", label: t(locale, "nav_airports"), icon: icon("<rect width='16' height='10' x='4' y='7' rx='2'/><path d='M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 17h20'/>") },
    { key: "oem", label: t(locale, "nav_manufacturers"), icon: icon("<path d='M2 20a6 6 0 0 0 12 0v-7a4 4 0 0 1 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4v7M2 20h12'/>") },
    { key: "org", label: t(locale, "nav_organizations"), icon: icon("<circle cx='12' cy='12' r='10'/><path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20'/>") },
  ];

  return (
    <div className="container">
      <div className="press-layout">
        <aside className="sidebar" aria-label="Filters">
          <div className="sidebar-logo"><Logo variant="white" height={20} /></div>
          <nav>
            {navItems.map((n) => (
              <Link key={n.label} href={qs({ type: n.key })} className={"item" + (sp.type === n.key || (!sp.type && n.key === undefined) ? " on" : "")}>
                {n.icon}{n.label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <Link href="/feeds" className="item">{icon("<path d='M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16'/><circle cx='5' cy='19' r='1'/>")}RSS</Link>
            <a href="/api/releases?sector=air&amp;limit=10" className="item">{icon("<path d='m16 18 6-6-6-6M8 6l-6 6 6 6'/>")}API &amp; webhooks</a>
          </div>
        </aside>
        <div className="press-main">
          <div className="page-head">
            <h2>{sp.type ? navItems.find((n) => n.key === sp.type)?.label ?? t(locale, "press_title") : t(locale, "nav_all_news")}</h2>
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
      </div>
    </div>
  );
}
