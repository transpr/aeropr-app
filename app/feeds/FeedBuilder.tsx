"use client";
import { useState } from "react";

export default function FeedBuilder({
  orgs,
  categories,
}: {
  orgs: string[];
  categories: [string, string][];
}) {
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [keywords, setKeywords] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const toggle = (list: string[], setList: (v: string[]) => void, v: string) =>
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  async function createFeed() {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector: "air",
          filters: {
            sources: selectedOrgs,
            categories: selectedCats,
            keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create feed");
      setToken(data.token);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel">
      <h3>Build your feed</h3>
      {orgs.length > 0 && (
        <>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "6px 0 8px" }}>Organizations</p>
          <div className="checks">
            {orgs.map((o) => (
              <label key={o}>
                <input type="checkbox" checked={selectedOrgs.includes(o)} onChange={() => toggle(selectedOrgs, setSelectedOrgs, o)} />
                {o}
              </label>
            ))}
          </div>
        </>
      )}
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "14px 0 8px" }}>Topics</p>
      <div className="checks">
        {categories.map(([slug, label]) => (
          <label key={slug}>
            <input type="checkbox" checked={selectedCats.includes(slug)} onChange={() => toggle(selectedCats, setSelectedCats, slug)} />
            {label}
          </label>
        ))}
      </div>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "14px 0 8px" }}>Keywords (comma-separated)</p>
      <div className="searchbar" style={{ marginTop: 0 }}>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="grève, A350, results…"
          aria-label="Keywords"
        />
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={createFeed} disabled={busy} style={{
          padding: "9px 16px", background: "var(--color-accent)", color: "#fff", border: "none",
          borderRadius: "var(--radius-control)", fontWeight: 600, fontSize: 13.5, cursor: busy ? "wait" : "pointer",
        }}>
          {busy ? "Creating…" : "Generate RSS URL"}
        </button>
      </div>
      {error && <p style={{ color: "var(--color-error)", marginTop: 10 }}>{error}</p>}
      {token && (
        <div className="feed-url">
          <a href={`/feed/${token}.xml`}>/feed/{token}.xml</a>
        </div>
      )}
    </div>
  );
}
