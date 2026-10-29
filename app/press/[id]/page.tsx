import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRelease, type Release } from "../../../lib/supabase";
import { t } from "../../../lib/i18n";
import { getLang } from "../../../lib/lang";
import { categoryLabel, formatDate, isDateEstimated } from "../../../lib/labels";
import { detectCoEmitters, faviconUrl, orgDomain, slugify } from "../../../lib/orgs";

export const dynamic = "force-dynamic";

interface PageProps { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const r = await getRelease(id).catch(() => null);
  return { title: r ? r.title + " — AeroPR" : "AeroPR" };
}

export default async function ReleasePage({ params }: PageProps) {
  const lang = await getLang();
  const { id } = await params;
  const r: Release | null = await getRelease(id).catch(() => null);
  if (!r) notFound();

  const est = isDateEstimated(r);
  const co = detectCoEmitters(r);
  const domain = orgDomain(r.org_name, r.source_url);
  const translated = !!r.body_en && r.body_en !== r.body;
  const body = r.body_en || r.body || "";
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="container">
      <div className="breadcrumb" style={{ paddingTop: 20 }}>
        <Link href="/press">{t(lang, "back_press")}</Link>
      </div>
      <article className="article">
        <div className="meta">
          <a className="org-line" href={"/org/" + slugify(r.org_name)}>
            <img className="org-logo-lg" src={faviconUrl(domain)} alt="" width={28} height={28} />
            <span className="org-name">{r.org_name}</span>
          </a>
          <span className="sep">·</span>
          <time dateTime={r.published_at}>
            {est ? t(lang, "est_date") + " " + t(lang, "coll_date") : formatDate(r.published_at, lang)}
          </time>
          {r.categories?.slice(0, 4).map((c) => (
            <span key={c} className="cat">{categoryLabel(c, lang)}</span>
          ))}
          {co.length > 0 && (
            <span className="badge-joint">
              {t(lang, "joint")} — {t(lang, "with_orgs")} {co.join(", ")}
            </span>
          )}
        </div>
        <h1>{r.title}</h1>
        {r.summary && (
          <div className="summary">
            <strong>{t(lang, "summary_label")}. </strong>{r.summary}
          </div>
        )}
        <div className="body">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        {translated && (
          <p className="translation-note">{t(lang, "machine_translation")} ({t(lang, "original_in")} {r.language.toUpperCase()})</p>
        )}
        <div className="source-link">
          <a href={r.source_url} rel="noopener noreferrer" target="_blank">↗ {t(lang, "view_original")} ({new URL(r.source_url).hostname})</a>
        </div>
      </article>
    </div>
  );
}
