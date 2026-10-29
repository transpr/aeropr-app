import FeedBuilder from "./FeedBuilder";
import { getOrgs } from "../../lib/supabase";
import { CATEGORY_LABELS } from "../../lib/labels";
import { t } from "../lib/i18n";
import { getLang } from "../../lib/lang";

export const dynamic = "force-dynamic";

export default async function FeedsPage() {
  const lang = await getLang();
  let orgs: string[] = [];
  try { orgs = (await getOrgs("air")).map((o) => o.org_name); } catch { /* empty */ }
  return (
    <div className="container">
      <div className="page-head">
        <h2>{t(lang, "feeds_title")}</h2>
      </div>
      <p style={{ color: "var(--color-text-secondary)", maxWidth: 720, marginBottom: 18 }}>
        {t(lang, "feeds_desc")}
      </p>
      <FeedBuilder orgs={orgs} categories={Object.entries(CATEGORY_LABELS[lang])} lang={lang} />
    </div>
  );
}
