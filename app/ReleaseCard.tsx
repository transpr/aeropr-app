import type { Release } from "../lib/supabase";

export default function ReleaseCard({ r }: { r: Release }) {
  const date = new Date(r.published_at).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const desc = (r.body_en || r.body || "").slice(0, 260);
  return (
    <article className="card">
      <div className="meta">
        {r.categories?.slice(0, 1).map((c) => (
          <span key={c} className="cat">{c}</span>
        ))}
        <time dateTime={r.published_at}>{date}</time>
        <span>{r.language.toUpperCase()}</span>
      </div>
      <h3><a href={r.source_url}>{r.title}</a></h3>
      <p className="desc">{desc}{desc.length >= 260 ? "…" : ""}</p>
      <div>
        <div className="org">{r.org_name}</div>
        <a className="src" href={r.source_url}>Read original →</a>
      </div>
    </article>
  );
}
