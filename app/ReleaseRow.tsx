import type { Release } from "../lib/supabase";
import type { Lang } from "../lib/i18n";
import { t } from "../lib/i18n";
import { categoryLabel, formatDate, isDateEstimated, excerpt } from "../lib/labels";
import { detectCoEmitters, faviconUrl, orgDomain, slugify } from "../lib/orgs";

export default function ReleaseRow({ r, lang }: { r: Release; lang: Lang }) {
  const est = isDateEstimated(r);
  const desc = excerpt(r.body_en || r.body, 220);
  const co = detectCoEmitters(r);
  const domain = orgDomain(r.org_name, r.source_url);
  return (
    <article className="release-row">
      <div className="top">
        <span className="org-line">
          <img className="org-logo" src={faviconUrl(domain)} alt="" width={16} height={16} />
          <a className="org" href={"/org/" + slugify(r.org_name)}>{r.org_name}</a>
        </span>
        <span className="sep">·</span>
        <time className="date" dateTime={r.published_at}>
          {est ? t(lang, "est_date") : formatDate(r.published_at, lang)}
        </time>
        {est && <span className="est">{t(lang, "coll_date")}</span>}
        {r.categories?.slice(0, 2).map((c) => (
          <span key={c} className="cat">{categoryLabel(c, lang)}</span>
        ))}
        {co.length > 0 && (
          <span className="badge-joint">
            {t(lang, "joint")} — {t(lang, "with_orgs")} {co.join(", ")}
          </span>
        )}
      </div>
      <h3><a href={"/press/" + r.id}>{r.title}</a></h3>
      {desc && desc !== r.title && <p className="desc">{desc}</p>}
      <div className="foot">
        <a href={"/press/" + r.id}>{t(lang, "read_original")}</a>
        <a href={r.source_url} rel="noopener noreferrer" target="_blank">↗ {new URL(r.source_url).hostname}</a>
        {r.body_en && r.language !== "en" && <span>{t(lang, "translation_avail")}</span>}
      </div>
    </article>
  );
}
