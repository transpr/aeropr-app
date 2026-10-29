// Organization metadata: official domains (for favicons) and joint-release detection.

export interface OrgMeta {
  domain: string;
}

export const ORG_META: Record<string, OrgMeta> = {
  "IATA": { domain: "iata.org" },
  "Air France": { domain: "airfrance.com" },
  "KLM": { domain: "klm.com" },
  "Air France-KLM": { domain: "airfranceklm.com" },
  "Iberia": { domain: "iberia.es" },
  "SNCF": { domain: "sncf.com" },
  "Lufthansa": { domain: "lufthansa.com" },
  "Lufthansa Group": { domain: "lufthansagroup.com" },
  "IAG": { domain: "iag.com" },
  "British Airways": { domain: "britishairways.com" },
  "easyJet": { domain: "easyjet.com" },
  "Ryanair": { domain: "ryanair.com" },
  "Airbus": { domain: "airbus.com" },
  "Boeing": { domain: "boeing.com" },
  "Emirates": { domain: "emirates.com" },
  "EASA": { domain: "easa.europa.eu" },
  "FAA": { domain: "faa.gov" },
  "European Commission": { domain: "ec.europa.eu" },
};

export function slugify(s: string): string {
  return s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Favicon of the official domain — no logo files to host, no copyright issues. */
export function faviconUrl(domain: string, size = 64): string {
  return "https://www.google.com/s2/favicons?sz=" + size + "&domain=" + encodeURIComponent(domain);
}

export function orgDomain(orgName: string, sourceUrl?: string | null): string {
  const meta = ORG_META[orgName];
  if (meta) return meta.domain;
  if (sourceUrl) {
    try {
      return new URL(sourceUrl).hostname.replace(/^www\./, "");
    } catch { /* fall through */ }
  }
  return slugify(orgName) + ".com";
}

/** Detect whether the release mentions other known organizations (joint release). */
export function detectCoEmitters(
  r: { org_name: string; title?: string | null; body?: string | null; body_en?: string | null },
): string[] {
  const hay = (
    (r.title ?? "") + "\n" +
    (r.body ?? "").slice(0, 600) + " " +
    (r.body_en ?? "").slice(0, 600)
  ).toLowerCase();
  const found: string[] = [];
  for (const name of Object.keys(ORG_META)) {
    if (name === r.org_name) continue;
    // "Air France" should not be flagged as co-emitter of "Air France-KLM", and vice versa.
    if (r.org_name.includes(name) || name.includes(r.org_name)) continue;
    const re = new RegExp("\\b" + name.toLowerCase() + "\\b");
    if (re.test(hay)) found.push(name);
  }
  return found.slice(0, 3);
}
