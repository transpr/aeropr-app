// Controlled vocabulary: internal category slugs -> editorial display labels.
export const CATEGORY_LABELS: Record<string, string> = {
  "greve": "Grève",
  "resultats": "Résultats",
  "commande": "Commande",
  "nouvelle-route": "Nouvelle route",
  "reseau": "Réseau",
  "co2": "CO₂ / Environnement",
  "materiaux-roulants": "Matériel roulant",
  "incident": "Incident",
  "regulation": "Régulation",
  "finance": "Finance",
  "mro": "Maintenance",
  "alliance": "Alliance",
};

export function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }).toUpperCase();
}

/** A release whose original date could not be verified (collection-time fallback). */
export function isDateEstimated(r: { published_at: string; created_at?: string | null }): boolean {
  if (!r.created_at) return false;
  return Math.abs(new Date(r.published_at).getTime() - new Date(r.created_at).getTime()) < 5000;
}

/** Trustworthy excerpt: first sentences of the original body. No AI summary. */
export function excerpt(body: string | null | undefined, maxLen = 240): string {
  if (!body) return "";
  const text = body.replace(/\s+/g, " ").trim();
  if (text.length <= maxLen) return text;
  const firstSentences = text.split(/(?<=[.!?])\s/).reduce(
    (acc: string, s: string) => (acc.length + s.length <= maxLen ? acc + " " + s : acc),
    "",
  ).trim();
  return (firstSentences.length > 40 ? firstSentences : text.slice(0, maxLen)).trim();
}
