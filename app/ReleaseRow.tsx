import type { Release } from "../lib/supabase";
import { categoryLabel, formatDate, isDateEstimated, excerpt } from "../lib/labels";

export default function ReleaseRow({ r }: { r: Release }) {
  const est = isDateEstimated(r);
  const desc = excerpt(r.body_en || r.body, 220);
  return (
    <article className="release-row">
      <div className="top">
        <span className="org">{r.org_name}</span>
        <span className="sep">·</span>
        <time className="date" dateTime={r.published_at}>
          {est ? "Date non vérifiée" : formatDate(r.published_at)}
        </time>
        {est && <span className="est">(date de collecte)</span>}
        {r.categories?.slice(0, 2).map((c) => (
          <span key={c} className="cat">{categoryLabel(c)}</span>
        ))}
      </div>
      <h3><a href={r.source_url}>{r.title}</a></h3>
      {desc && desc !== r.title && <p className="desc">{desc}</p>}
      <div className="foot">
        <a href={r.source_url}>Read original ({r.language.toUpperCase()})</a>
        {r.body_en && r.language !== "en" && <span>English translation available</span>}
      </div>
    </article>
  );
}
