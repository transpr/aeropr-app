import Link from "next/link";
import { notFound } from "next/navigation";
import { getReleaseById } from "../../../lib/supabase";
import { CATEGORY_LABELS, formatDate, isDateEstimated } from "../../../lib/labels";
import { t } from "../../../lib/dictionaries";
import { getLocale } from "../../../lib/i18n";
import { orgByDbName, detectOrgsInText, logoUrl } from "../../../lib/orgs";

export const dynamic = "force-dynamic";

export default async function ReleasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocale();
  const r = await getReleaseById(id).catch(() => null);
  if (!r) notFound();

  const org = orgByDbName(r.org_name);
  const est = isDateEstimated(r);
  const coOrgs = detectOrgsInText(r.title + " " + (r.body_en || r.body).slice(0, 2500), r.org_name);
  const body = r.body_en || r.body || "";
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter((p) => p.length > 0 && !/^Translations?:/i.test(p));

  return (
    <div className="container">
      <div className="breadcrumb" style={{ paddingTop: 18 }}>
        <Link href="/press">{t(locale, "back")}</Link>
      </div>
      <article className="article">
        <div className="meta">
          <img className="org-logo-lg" src={logoUrl(org)} alt="" width={28} height={28} />
          <Link href={"/org/" + org.slug} className="org-name">{org.name}</Link>
          <span className="date">
            {t(locale, "rel_published")} {formatDate(r.published_at)}{est ? " (" + t(locale, "date_est") + ")" : ""}
          </span>
          {(r.categories ?? []).slice(0, 4).map((c) => (
            <span key={c} className="cat">{CATEGORY_LABELS[locale][c] ?? c}</span>
          ))}
          {coOrgs.length > 0 && <span className="badge-joint">{t(locale, "joint_badge")}</span>}
        </div>
        <h1>{r.title}</h1>
        {r.summary && <p className="summary">{r.summary}</p>}
        <div className="body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {coOrgs.length > 0 && (
          <p className="joint-note">{t(locale, "joint_note")} {coOrgs.join(", ")}</p>
        )}
        {r.language !== "en" && !r.body_en && (
          <p className="translation-note">({r.language.toUpperCase()} — {t(locale, "rel_translation")})</p>
        )}
        <div className="source-link">
          {t(locale, "rel_source")} · <a href={r.source_url} target="_blank" rel="noopener noreferrer">{t(locale, "rel_read")} ({r.language.toUpperCase()}) ↗</a>
        </div>
      </article>
    </div>
  );
}
