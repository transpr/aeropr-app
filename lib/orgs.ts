export interface OrgInfo { name: string; slug: string; domain: string; aliases: string[] }

export function slugifyName(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function org(name: string, domain: string, aliases: string[] = []): OrgInfo {
  return { name, slug: slugifyName(name), domain, aliases };
}

// Registry of known organizations: used for logos, per-org pages and joint-statement detection.
export const ORGS: OrgInfo[] = [
  org("IATA", "iata.org", ["International Air Transport Association"]),
  org("ICAO", "icao.int", ["International Civil Aviation Organization"]),
  org("Airbus", "airbus.com"),
  org("Boeing", "boeing.com"),
  org("ATR", "atraircraft.com"),
  org("Embraer", "embraer.com"),
  org("Air France", "airfrance.com"),
  org("KLM", "klm.com"),
  org("Air France-KLM", "airfranceklm.com", ["AF-KLM", "Air France KLM"]),
  org("IAG", "iagroup.com", ["International Airlines Group"]),
  org("British Airways", "britishairways.com"),
  org("Iberia", "iberia.com"),
  org("Vueling", "vueling.com"),
  org("Aer Lingus", "aerlingus.com"),
  org("Lufthansa", "lufthansa.com"),
  org("Lufthansa Group", "lufthansagroup.com"),
  org("Ryanair", "ryanair.com"),
  org("easyJet", "easyjet.com"),
  org("Wizz Air", "wizzair.com"),
  org("SAS", "flysas.com", ["Scandinavian Airlines"]),
  org("Turkish Airlines", "turkishairlines.com"),
  org("Emirates", "emirates.com"),
  org("Qatar Airways", "qatarairways.com"),
  org("Etihad Airways", "etihad.com"),
  org("Singapore Airlines", "singaporeair.com"),
  org("Air Canada", "aircanada.com"),
  org("American Airlines", "aa.com"),
  org("Delta Air Lines", "delta.com"),
  org("United Airlines", "united.com"),
  org("LATAM", "latam.com"),
  org("Avianca", "avianca.com"),
  org("Aéroports de Paris", "adp.fr", ["Aeroports de Paris", "Groupe ADP", "ADP"]),
  org("Heathrow", "heathrow.com"),
  org("Fraport", "fraport.com"),
  org("Aena", "aena.es"),
  org("ACI", "aci.aero", ["Airports Council International"]),
  org("EUROCONTROL", "eurocontrol.int", ["Eurocontrol"]),
  org("EASA", "easa.europa.eu", ["European Union Aviation Safety Agency"]),
  org("FAA", "faa.gov", ["Federal Aviation Administration"]),
  org("A4E", "a4e.eu", ["Airlines for Europe"]),
  org("SNCF", "sncf.com", ["Société nationale des chemins de fer français"]),
  org("SNCF Réseau", "sncf-reseau.com"),
  org("Deutsche Bahn", "deutschebahn.com"),
  org("Trenitalia", "trenitalia.com"),
  org("Renfe", "renfe.com"),
  org("ÖBB", "oebb.at"),
  org("Alstom", "alstom.com"),
  org("Stadler Rail", "stadlerrail.com", ["Stadler"]),
  org("Hitachi Rail", "hitachirail.com"),
  org("CAF", "caf.net", ["Construcciones y Auxiliar de Ferrocarriles"]),
  org("Talgo", "talgo.com"),
  org("UIC", "uic.org", ["International Union of Railways"]),
  org("ERA", "era.europa.eu", ["European Union Agency for Railways"]),
];

const LOOKUP = new Map<string, OrgInfo>();
for (const o of ORGS) {
  LOOKUP.set(o.name.toLowerCase(), o);
  for (const a of o.aliases) LOOKUP.set(a.toLowerCase(), o);
}

export function findOrgByName(name: string): OrgInfo | undefined {
  return LOOKUP.get(name.trim().toLowerCase());
}

export function orgByDbName(name: string): OrgInfo {
  return findOrgByName(name) ?? { name, slug: slugifyName(name), domain: "", aliases: [] };
}

export function findOrgBySlug(slug: string): OrgInfo | undefined {
  return ORGS.find((o) => o.slug === slug);
}

export function logoUrl(o: OrgInfo): string {
  return "https://www.google.com/s2/favicons?sz=64&domain=" + o.domain;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const PATTERNS: { name: string; re: RegExp }[] = ORGS.flatMap((o) =>
  [o.name, ...o.aliases].map((n) => ({ name: o.name, re: new RegExp("\\b" + escapeRe(n) + "\\b", "i") })),
);

/** Detect organization names mentioned in a text (excluding the primary emitter). */
export function detectOrgsInText(text: string, exclude?: string): string[] {
  const seen = new Set<string>();
  for (const p of PATTERNS) {
    if (exclude && p.name === exclude) continue;
    if (p.re.test(text)) seen.add(p.name);
  }
  return [...seen];
}
