import ReleaseCard from "./ReleaseCard";
import { getLatest, type Release } from "../lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  let releases: Release[] = [];
  try {
    releases = await getLatest("air", 12);
  } catch {
    releases = [];
  }
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="kicker">Aviation intelligence · Press releases</div>
          <h1>Every aviation announcement.<br />One place.</h1>
          <p>
            Monitor airline, airport, manufacturer and aviation industry announcements
            from a single platform — normalized, categorized and delivered in real time
            via RSS, webhooks and API.
          </p>
          <div className="actions">
            <a className="btn-primary" href="/feeds">Create your RSS feed</a>
            <a className="btn-secondary" href="/press">View latest releases</a>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2>Latest press releases</h2>
          {releases.length === 0 ? (
            <p style={{ color: "var(--color-text-secondary)" }}>
              No releases collected yet — the crawler runs every 5 minutes.
            </p>
          ) : (
            <div className="grid">
              {releases.map((r) => <ReleaseCard key={r.id} r={r} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
