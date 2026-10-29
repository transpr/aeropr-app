import ReleaseRow from "./ReleaseRow";
import { getLatest, type Release } from "../lib/supabase";
import { t } from "../lib/dictionaries";
import { getLocale } from "../lib/i18n";

export const dynamic = "force-dynamic";

const iconProps = {
  width: 18, height: 18, viewBox: "0 0 24 24",
  fill: "none", stroke: "currentColor", strokeWidth: 1.7,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export default async function Home() {
  const locale = await getLocale();
  let releases: Release[] = [];
  try { releases = await getLatest("air", {}, 20); } catch { releases = []; }
  return (
    <>
      <section className="hero">
        <div className="container inner">
          <div className="kicker">{t(locale, "hero_kicker")}</div>
          <h1>{t(locale, "hero_title")}</h1>
          <p>{t(locale, "hero_sub")}</p>
          <form className="searchbar" action="/press" method="get" role="search">
            <input type="search" name="q" placeholder={t(locale, "search_ph")} aria-label={t(locale, "search_btn")} />
            <button type="submit">{t(locale, "search_btn")}</button>
          </form>
          <div className="hero-features">
            <span className="feature">
              <svg {...iconProps}><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>
              {t(locale, "hero_feat_monitor")}
            </span>
            <span className="feature">
              <svg {...iconProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
              {t(locale, "hero_feat_verified")}
            </span>
            <span className="feature">
              <svg {...iconProps}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
              {t(locale, "hero_feat_dist")}
            </span>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="page-head">
          <h2>{t(locale, "latest")}</h2>
          <span className="count">{t(locale, "latest_sub")} · <a href="/press">{t(locale, "view_all")}</a></span>
        </div>
        <div className="releases">
          {releases.length === 0 ? (
            <p style={{ padding: 20, color: "var(--color-text-secondary)" }}>{t(locale, "empty")}</p>
          ) : releases.map((r) => <ReleaseRow key={r.id} r={r} locale={locale} />)}
        </div>
      </section>
    </>
  );
}
