import FeedBuilder from "./FeedBuilder";
import { getOrgs } from "../../lib/supabase";
import { CATEGORY_LABELS } from "../../lib/labels";
import { t } from "../../lib/dictionaries";
import { getLocale } from "../../lib/i18n";

export const dynamic = "force-dynamic";

export default async function FeedsPage() {
  const locale = await getLocale();
  let orgs: string[] = [];
  try { orgs = (await getOrgs("air")).map((o) => o.org_name); } catch { /* empty */ }
  return (
    <div className="container">
      <div className="page-head">
        <h2>{t(locale, "feeds_title")}</h2>
      </div>
      <p style={{ color: "var(--color-text-secondary)", maxWidth: 720, marginBottom: 18 }}>
        {t(locale, "feeds_desc")}
      </p>
      <FeedBuilder orgs={orgs} categories={Object.entries(CATEGORY_LABELS[locale])} locale={locale} />
    </div>
  );
}
