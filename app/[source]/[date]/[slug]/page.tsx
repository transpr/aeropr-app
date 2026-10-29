// Canonical release page: /{source_slug}/{YYYY-MM-DD}/{title-slug}
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getReleasesBySourceAndDate, type Release } from "../../../../lib/supabase";
import { slugifyTitle, releaseAbsoluteUrl } from "../../../../lib/releaseUrl";
import { CATEGORY_LABELS, formatDate, isDateEstimated } from "../../../../lib/labels";
import { t } from "../../../../lib/dictionaries";
import { getLocale } from "../../../../lib/i18n";
import { localizeRelease } from "../../../../lib/translate";
import { orgByDbName, detectOrgsInText, logoUrl } from "../../../../lib/orgs";

export const dynamic = "force-dynamic";

async function findRelease(source: string, date: string, slug: string): Promise<Release | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const rows = await getReleasesBySourceAndDate(source, date).catch(() => []);
  const exact = rows.find((r) => slugifyTitle(r.title) === slug);
  if (exact) return exact;
  // Tolerate truncated slinks (80-char cap): prefix match.
  return rows.find((r) => slugifyTitle(r.title).startsWith(slug)) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ source: string; date: string; slug: string }> }): Promise<Metadata> {
  const { source, date, slug } = await params;
  const r = await findRelease(source, date, slug);
  if (!r) return { title: "AeroPR" };
  return {
    title: r.title + " — " + r.org_name + " · AeroPR",
    description: r.summary || (r.body_en || r.body).slice(0, 200),
    alternates: { canonical: releaseAbsoluteUrl(r) },
    openGraph: {
      title: r.title,
      description: r.summary || (r.body_en || r.body).slice(0, 200),
      type: "article",
      publishedTime: r.published_at,
      siteName: "AeroPR",
    },
  };
}

export default async function ReleasePage({ params }: { params: Promise<{ source: string; date: string; slug: string }> }) {
  const { source, date, slug } = await params;
  const locale = await getLocale();
  const r = await findRelease(source, date, slug);
  if (!r) notFound();

  // Translate the release into the visitor's locale (cached in Supabase).
  const loc = await localizeRelease(r, locale);

  const org = orgByDbName(r.org_name);
  const est = isDateEstimated(r);
  const coOrgs = detectOrgsInText(r.title + " " + (r.body_en || r.body).slice(0, 2500), r.org_name);
  const paragraphs = loc.body
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter((p) => p.length > 0 && !/^Translations?:/i.test(p));

  // JSON-LD NewsArticle: makes releases readable by AI answer engines & Google News.
  // Stays in the original language and title — the canonical URL does not change.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: r.title,
    datePublished: r.published_at,
    dateModified: r.published_at,
    inLanguage: r.language,
    publisher: { "@type": "Organization", name: r.org_name },
    mainEntityOfPage: releaseAbsoluteUrl(r),
    articleSection: (r.categories ?? []).slice(0, 3).join(", "),
  };

  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
        <h1>{loc.title}</h1>
        {r.summary && <p className="summary">{r.summary}</p>}
        <div className="body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {coOrgs.length > 0 && (
          <p className="joint-note">{t(locale, "joint_note")} {coOrgs.join(", ")}</p>
        )}
        {loc.translated && (
          <p className="translation-note">{t(locale, "rel_ai_translation")} ({r.language.toUpperCase()})</p>
        )}
        {!loc.translated && r.language !== "en" && r.language !== locale && !r.body_en && (
          <p className="translation-note">({r.language.toUpperCase()} — {t(locale, "rel_translation")})</p>
        )}
        <div className="source-link">
          {t(locale, "rel_source")} · <a href={r.source_url} target="_blank" rel="noopener noreferrer">{t(locale, "rel_read")} ({r.language.toUpperCase()}) ↗</a>
        </div>
      </article>
    </div>
  );
}
