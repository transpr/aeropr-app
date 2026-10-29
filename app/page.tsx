import ReleaseRow from "./ReleaseRow";
import { getLatest, type Release } from "../lib/supabase";
import { t } from "../lib/dictionaries";
import { getLocale } from "../lib/i18n";

export const dynamic = "force-dynamic";

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
