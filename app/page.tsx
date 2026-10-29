import ReleaseRow from "./ReleaseRow";
import { getLatest, type Release } from "../lib/supabase";
import { t } from "../lib/i18n";
import { getLang } from "../lib/lang";

export const dynamic = "force-dynamic";

export default async function Home() {
  const lang = await getLang();
  let releases: Release[] = [];
  try { releases = await getLatest("air", {}, 20); } catch { releases = []; }
  return (
    <>
      <section className="hero">
        <div className="container inner">
          <div className="kicker">{t(lang, "hero_kicker")}</div>
          <h1>{t(lang, "hero_title")}</h1>
          <p>{t(lang, "hero_sub")}</p>
          <form className="searchbar" action="/press" method="get" role="search">
            <input type="search" name="q" placeholder={t(lang, "search_ph")} aria-label={t(lang, "search_btn")} />
            <button type="submit">{t(lang, "search_btn")}</button>
          </form>
        </div>
      </section>
      <section className="container">
        <div className="page-head">
          <h2>{t(lang, "latest")}</h2>
          <span className="count">{t(lang, "sorted_by")} <a href="/press">{t(lang, "all_releases")}</a></span>
        </div>
        <div className="releases">
          {releases.length === 0 ? (
            <p style={{ padding: 20, color: "var(--color-text-secondary)" }}>
              {t(lang, "no_releases")}
            </p>
          ) : releases.map((r) => <ReleaseRow key={r.id} r={r} lang={lang} />)}
        </div>
      </section>
    </>
  );
}
