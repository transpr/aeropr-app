import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReleaseRow from "../../ReleaseRow";
import { getOrgs, getOrgReleases, type Release } from "../../../lib/supabase";
import { t } from "../../../lib/i18n";
import { getLang } from "../../../lib/lang";
import { faviconUrl, orgDomain, slugify } from "../../../lib/orgs";

export const dynamic = "force-dynamic";

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const orgs = await getOrgs("air").catch(() => []);
  const match = orgs.find((o) => slugify(o.org_name) === slug);
  return { title: (match ? match.org_name : slug) + " — AeroPR" };
}

export default async function OrgPage({ params }: PageProps) {
  const lang = await getLang();
  const { slug } = await params;
  const orgs = await getOrgs("air").catch(() => [] as { org_name: string; n: number }[]);
  const match = orgs.find((o) => slugify(o.org_name) === slug);
  if (!match) notFound();

  let releases: Release[] = [];
  try { releases = await getOrgReleases("air", match.org_name); } catch { releases = []; }
  const domain = orgDomain(match.org_name, releases[0]?.source_url ?? null);

  return (
    <div className="container">
      <div className="page-head org-hero">
        <img src={faviconUrl(domain, 64)} alt="" width={32} height={32} />
        <h2>{match.org_name}</h2>
        <span className="count">{match.n} {t(lang, "org_releases")} · {t(lang, "updated_cont")}</span>
      </div>
      <div className="releases">
        {releases.length === 0 ? (
          <p style={{ padding: 20, color: "var(--color-text-secondary)" }}>{t(lang, "no_releases")}</p>
        ) : releases.map((r) => <ReleaseRow key={r.id} r={r} lang={lang} />)}
      </div>
    </div>
  );
}
