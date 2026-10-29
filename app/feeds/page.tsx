import FeedBuilder from "./FeedBuilder";
import { getOrgs } from "../../lib/supabase";
import { CATEGORY_LABELS } from "../../lib/labels";

export const dynamic = "force-dynamic";

export default async function FeedsPage() {
  let orgs: string[] = [];
  try { orgs = (await getOrgs("air")).map((o) => o.org_name); } catch { /* empty */ }
  return (
    <div className="container">
      <div className="page-head">
        <h2>RSS feeds</h2>
      </div>
      <p style={{ color: "var(--color-text-secondary)", maxWidth: 720, marginBottom: 18 }}>
        Build a personalized feed: select organizations, alliances or topics, get a single URL,
        and paste it into Feedly, Slack or any RSS reader. Basic feeds are free and refreshed
        continuously.
      </p>
      <FeedBuilder orgs={orgs} categories={Object.entries(CATEGORY_LABELS)} />
    </div>
  );
}
