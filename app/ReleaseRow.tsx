import type { Release } from "../lib/supabase";
import { CATEGORY_LABELS, formatDate, isDateEstimated, excerpt } from "../lib/labels";
import { t, type Locale } from "../lib/dictionaries";
import { orgByDbName, detectOrgsInText, logoUrl } from "../lib/orgs";
import { releaseUrl } from "../lib/releaseUrl";

export default function ReleaseRow({ r, locale }: { r: Release; locale: Locale }) {
  const est = isDateEstimated(r);
  const desc = excerpt(r.body_en || r.body, 220);
  const org = orgByDbName(r.org_name);
  const coOrgs = detectOrgsInText(r.title + " " + (r.body_en || r.body).slice(0, 2000), r.org_name);
  const href = releaseUrl(r);
  const isNew = Date.now() - new Date(r.published_at).getTime() < 24 * 3600 * 1000;
  return (
    <article className="release-row">
      <div className="top">
        <img className="org-logo" src={logoUrl(org)} alt="" width={16} height={16} />
        <a className="org" href={"/org/" + org.slug}>{r.org_name}</a>
        <span className="sep">·</span>
        <time className="date" dateTime={r.published_at}>
          {est ? t(locale, "date_est") : formatDate(r.published_at)}
        </time>
        {isNew && <span className="badge-new">{t(locale, "badge_new")}</span>}
        {(r.categories ?? []).slice(0, 3).map((c) => (
          <span key={c} className="cat">{CATEGORY_LABELS[locale][c] ?? c}</span>
        ))}
        {coOrgs.length > 0 && <span className="badge-joint">{t(locale, "joint_badge")}</span>}
      </div>
      <h3><a href={href}>{r.title}</a></h3>
      {desc && desc !== r.title && <p className="desc">{desc}</p>}
      <div className="foot">
        <a href={href}>{t(locale, "read_on_site")}</a>
        <a href={r.source_url} target="_blank" rel="noopener noreferrer">{t(locale, "rel_read")} ({r.language.toUpperCase()}) ↗</a>
      </div>
    </article>
  );
}
