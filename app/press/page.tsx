import ReleaseCard from "../ReleaseCard";
import { getLatest, type Release } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function PressPage() {
  let releases: Release[] = [];
  try { releases = await getLatest("air", 60); } catch { releases = []; }
  return (
    <section className="section">
      <div className="container">
        <h2 style={{ fontSize: 28 }}>Press releases</h2>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: 20 }}>
          Latest official announcements, normalized from the original newsrooms.
        </p>
        {releases.length === 0 ? (
          <p style={{ color: "var(--color-text-secondary)" }}>No releases collected yet.</p>
        ) : (
          <div className="grid">
            {releases.map((r) => <ReleaseCard key={r.id} r={r} />)}
          </div>
        )}
      </div>
    </section>
  );
}
