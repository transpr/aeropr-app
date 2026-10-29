import { getLatest, type Release } from "../../lib/supabase";
import { excerpt, isDateEstimated } from "../../lib/labels";
import { t } from "../../lib/dictionaries";
import { getLocale } from "../../lib/i18n";
import { releaseUrl } from "../../lib/releaseUrl";
import NewsDashboard, { type NdCategory, type NdItem } from "./NewsDashboard";

export const dynamic = "force-dynamic";

// source_type taxonomy -> v0 dashboard categories.
const TYPE_TO_CAT: Record<string, NdCategory> = {
  airline: "airlines",
  airport: "airports",
  oem: "manufacturers",
};
const cat = (st: string): NdCategory => TYPE_TO_CAT[st] ?? "organizations";

// Source mark: short identifier for the list (v0 SourceMark), e.g. "AIRBUS", "AF·KLM".
function sourceShort(name: string): string {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, "").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 7).toUpperCase();
  return words.slice(0, 3).map((w) => w[0]).join("·").toUpperCase();
}

const prettyDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// Legacy URL filters (?type=airline…) -> v0 categories.
const LEGACY_TYPE: Record<string, NdCategory> = {
  airline: "airlines", airport: "airports", oem: "manufacturers", org: "organizations",
  airlines: "airlines", airports: "airports", manufacturers: "manufacturers", organizations: "organizations",
};

interface PageProps {
  searchParams: Promise<{ q?: string; type?: string; article?: string }>;
}

export default async function PressPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const locale = await getLocale();
  let releases: Release[] = [];
  try { releases = await getLatest("air", {}, 200); } catch { /* empty state */ }

  const items: NdItem[] = releases.map((r) => {
    const est = isDateEstimated(r);
    return {
      id: r.id,
      href: releaseUrl(r),
      headline: r.title,
      source: r.org_name,
      sourceShort: sourceShort(r.org_name),
      category: cat(r.source_type),
      date: prettyDate(r.published_at) + (est ? " · " + t(locale, "date_est") : ""),
      isNew: Date.now() - new Date(r.published_at).getTime() < 24 * 3600 * 1000,
      excerpt: excerpt(r.body_en || r.body, 180),
      originalUrl: r.source_url,
    };
  });

  const labels = {
    all: t(locale, "nav_all_news"),
    airlines: t(locale, "nav_airlines"),
    airports: t(locale, "nav_airports"),
    manufacturers: t(locale, "nav_manufacturers"),
    organizations: t(locale, "nav_organizations"),
    searchPh: t(locale, "nd_search"),
    searchLabel: t(locale, "search_btn"),
    noMatch: t(locale, "no_match"),
    new: t(locale, "badge_new"),
    readOn: t(locale, "read_on_site"),
    readOriginal: t(locale, "rel_read"),
    settings: t(locale, "nd_settings"),
    rss: "RSS",
    api: t(locale, "nd_api"),
    source: t(locale, "rel_source"),
    origDate: t(locale, "nd_orig_date"),
    typeTerm: t(locale, "nd_type_term"),
    typeValue: t(locale, "nd_type_value"),
    share: t(locale, "nd_share"),
    download: t(locale, "nd_download"),
    viewSource: t(locale, "nd_view_source"),
  };

  return (
    <NewsDashboard
      items={items}
      labels={labels}
      initialFilter={sp.type && LEGACY_TYPE[sp.type] ? LEGACY_TYPE[sp.type] : "all"}
      initialQuery={sp.q ?? ""}
      initialArticleId={sp.article}
    />
  );
}
