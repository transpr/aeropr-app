import type { Lang } from "./i18n";

// Controlled vocabulary: internal category slugs -> editorial display labels, per language.
export const CATEGORY_LABELS: Record<Lang, Record<string, string>> = {
  en: { greve: "Strike", resultats: "Results", commande: "Order", "nouvelle-route": "New route", reseau: "Network", co2: "CO₂ / Environment", "materiaux-roulants": "Rolling stock", incident: "Incident", regulation: "Regulation", finance: "Finance", mro: "Maintenance", alliance: "Alliance" },
  fr: { greve: "Grève", resultats: "Résultats", commande: "Commande", "nouvelle-route": "Nouvelle route", reseau: "Réseau", co2: "CO₂ / Environnement", "materiaux-roulants": "Matériel roulant", incident: "Incident", regulation: "Régulation", finance: "Finance", mro: "Maintenance", alliance: "Alliance" },
  it: { greve: "Sciopero", resultats: "Risultati", commande: "Ordine", "nouvelle-route": "Nuova rotta", reseau: "Rete", co2: "CO₂ / Ambiente", "materiaux-roulants": "Materiale rotabile", incident: "Incidente", regulation: "Regolamentazione", finance: "Finanza", mro: "Manutenzione", alliance: "Alleanza" },
  de: { greve: "Streik", resultats: "Ergebnisse", commande: "Bestellung", "nouvelle-route": "Neue Route", reseau: "Netzwerk", co2: "CO₂ / Umwelt", "materiaux-roulants": "Rollmaterial", incident: "Vorfall", regulation: "Regulierung", finance: "Finanzen", mro: "Wartung", alliance: "Allianz" },
  es: { greve: "Huelga", resultats: "Resultados", commande: "Pedido", "nouvelle-route": "Nueva ruta", reseau: "Red", co2: "CO₂ / Medio ambiente", "materiaux-roulants": "Material rodante", incident: "Incidente", regulation: "Regulación", finance: "Finanzas", mro: "Mantenimiento", alliance: "Alianza" },
  pt: { greve: "Greve", resultats: "Resultados", commande: "Encomenda", "nouvelle-route": "Nova rota", reseau: "Rede", co2: "CO₂ / Ambiente", "materiaux-roulants": "Material circulante", incident: "Incidente", regulation: "Regulação", finance: "Finanças", mro: "Manutenção", alliance: "Aliança" },
};

const LOCALES: Record<Lang, string> = { en: "en-GB", fr: "fr-FR", it: "it-IT", de: "de-DE", es: "es-ES", pt: "pt-PT" };

export function categoryLabel(slug: string, lang: Lang): string {
  return CATEGORY_LABELS[lang][slug] ?? CATEGORY_LABELS.en[slug] ?? slug;
}

export function formatDate(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleDateString(LOCALES[lang], {
    day: "2-digit", month: "short", year: "numeric",
  });
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
