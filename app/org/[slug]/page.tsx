import { notFound } from "next/navigation";
import ReleaseRow from "../../ReleaseRow";
import { getOrgs, getReleasesByOrg, type Release } from "../../../lib/supabase";
import { t } from "../../../lib/dictionaries";
import { getLocale } from "../../../lib/i18n";
import { findOrgBySlug, orgByDbName, logoUrl, slugifyName } from "../../../lib/orgs";

export const dynamic = "force-dynamic";

export default async function OrgPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();

  let org = findOrgBySlug(slug);
  if (!org) {
    // Org present in the data but not in the registry: resolve by slugified DB name.
    const dbOrgs = await getOrgs("air").catch(() => [] as { org_name: string; n: number }[]);
    const match = dbOrgs.find((o) => slugifyName(o.org_name) === slug);
    if (match) org = orgByDbName(match.org_name);
  }
  if (!org) notFound();

  let releases: Release[] = [];
  try { releases = await getReleasesByOrg([org.name, ...org.aliases], 200); } catch { /* empty */ }

  return (
    <div className="container">
      <div className="page-head org-hero" style={{ alignItems: "center", gap: 12 }}>
        <img src={logoUrl(org)} alt="" width={28} height={28} />
        <h2>{org.name}</h2>
        <span className="count">{releases.length} {t(locale, "org_releases")}</span>
      </div>
      <div className="releases">
        {releases.length === 0 ? (
          <p style={{ padding: 20, color: "var(--color-text-secondary)" }}>{t(locale, "no_match")}</p>
        ) : releases.map((r) => (
          <ReleaseRow key={r.id} r={r} locale={locale} />
        ))}
      </div>
    </div>
  );
}
