import Link from "next/link";
import ReleaseRow from "./ReleaseRow";
import { getLatest, type Release } from "../lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  let releases: Release[] = [];
  try { releases = await getLatest("air", {}, 20); } catch { releases = []; }
  return (
    <>
      <section className="hero">
        <div className="container inner">
          <div className="kicker">Aviation press release monitoring</div>
          <h1>Aviation industry announcements, in one searchable feed.</h1>
          <p>
            Official releases from airlines, airports, manufacturers and industry organizations.
            Original publication dates and source links preserved.
          </p>
          <form className="searchbar" action="/press" method="get" role="search">
            <input type="search" name="q" placeholder="Search organizations, topics or keywords…" aria-label="Search releases" />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>
      <section className="container">
        <div className="page-head">
          <h2>Latest releases</h2>
          <span className="count">sorted by original publication date · <Link href="/press">all releases →</Link></span>
        </div>
        <div className="releases">
          {releases.length === 0 ? (
            <p style={{ padding: 20, color: "var(--color-text-secondary)" }}>
              No releases collected yet — the crawler runs every 5 minutes.
            </p>
          ) : releases.map((r) => <ReleaseRow key={r.id} r={r} />)}
        </div>
      </section>
    </>
  );
}
