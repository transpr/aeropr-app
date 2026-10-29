// On-demand AI translation of press releases into the site locale.
// Pipeline: original body → English body (body_en, filled at crawl time)
// → visitor locale via the Mistral API → cached in Supabase
// (release_translations table — see supabase_translations.sql at repo root).
// Falls back to the best available text if MISTRAL_API_KEY is missing or the
// API fails; cache writes are best-effort (translation still works before
// the table exists, it just is not cached).
import type { Release } from "./supabase";
import type { Locale } from "./dictionaries";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "";
const MODEL = "mistral-small-latest";

const LANG_NAME: Record<string, string> = {
  en: "English", fr: "French", it: "Italian", de: "German", es: "Spanish", pt: "Portuguese",
};

export interface LocalizedRelease {
  title: string;
  body: string;
  /** false = already in this language (original or English), true = AI translation shown. */
  translated: boolean;
}

async function sb(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(SUPABASE_URL + "/rest/v1/" + path, {
    headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY, "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });
  if (!res.ok) throw new Error("Supabase " + path + " -> " + res.status);
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}

async function mistralTranslate(text: string, target: string): Promise<string | null> {
  if (!text.trim() || !MISTRAL_API_KEY) return null;
  try {
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + MISTRAL_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are a professional translator specialised in aviation industry press releases. " +
              "Translate the user's text into " + target + ". Be faithful: keep all numbers, dates, company names, " +
              "flight numbers and technical terms exact. Keep paragraph breaks (a blank line between paragraphs). " +
              "Output ONLY the translation, with no commentary.",
          },
          { role: "user", content: text },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

export async function localizeRelease(r: Release, locale: Locale): Promise<LocalizedRelease> {
  // Already in the visitor's language.
  if (locale === r.language) return { title: r.title, body: r.body, translated: false };
  // English visitor: body_en (filled at crawl time) or the original.
  if (locale === "en") return { title: r.title, body: r.body_en || r.body, translated: false };

  // 1. Cached translation?
  try {
    const rows = await sb(
      "release_translations?release_id=eq." + encodeURIComponent(r.id) +
      "&locale=eq." + locale + "&select=title,body",
    );
    if (rows?.[0]?.body) return { title: rows[0].title || r.title, body: rows[0].body, translated: true };
  } catch { /* table may not exist yet → live translation below */ }

  // 2. Live translation (best available source text: English first).
  const sourceBody = r.body_en || r.body;
  const target = LANG_NAME[locale] ?? locale;
  const [tTitle, tBody] = await Promise.all([
    mistralTranslate(r.title, target),
    mistralTranslate(sourceBody, target),
  ]);
  if (tBody) {
    const out = { title: tTitle || r.title, body: tBody, translated: true };
    // Best-effort cache write (ignore errors — e.g. table not created yet).
    sb("release_translations", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify([{ release_id: r.id, locale, title: out.title, body: out.body, model: MODEL }]),
    }).catch(() => {});
    return out;
  }

  // 3. Degraded: no key / API failure → English if available, else original.
  return { title: r.title, body: sourceBody, translated: false };
}
