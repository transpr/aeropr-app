import { REGISTRY, REGISTRY_STATS } from "../../lib/registry";
import { t } from "../../lib/dictionaries";
import { getLocale, type Locale } from "../../lib/i18n";

export const dynamic = "force-dynamic";

const TYPE_ORDER = ["airline", "airport", "oem", "mro", "fuel", "regulator", "alliance", "mixed"];
const TYPE_LABELS: Record<Locale, Record<string, string>> = {
  en: { airline: "Airlines", airport: "Airports & groups", oem: "Manufacturers & engines", mro: "MRO", fuel: "Fuel & SAF", regulator: "Regulators & safety boards", alliance: "Alliances", mixed: "Industry organizations" },
  fr: { airline: "Compagnies aériennes", airport: "Aéroports & groupes", oem: "Constructeurs & motoristes", mro: "MRO", fuel: "Carburant & SAF", regulator: "Régulateurs & organismes d'enquête", alliance: "Alliances", mixed: "Organisations du secteur" },
  es: { airline: "Aerolíneas", airport: "Aeropuertos y grupos", oem: "Fabricantes y motores", mro: "MRO", fuel: "Combustible y SAF", regulator: "Reguladores", alliance: "Alianzas", mixed: "Organizaciones del sector" },
  de: { airline: "Fluggesellschaften", airport: "Flughäfen & Gruppen", oem: "Hersteller & Triebwerke", mro: "MRO", fuel: "Treibstoff & SAF", regulator: "Regulierungsbehörden", alliance: "Allianzen", mixed: "Branchenorganisationen" },
  it: { airline: "Compagnie aeree", airport: "Aeroporti e gruppi", oem: "Costruttori e motori", mro: "MRO", fuel: "Carburante e SAF", regulator: "Regolatori", alliance: "Alleanze", mixed: "Organizzazioni di settore" },
  pt: { airline: "Companhias aéreas", airport: "Aeroportos e grupos", oem: "Fabricantes e motores", mro: "MRO", fuel: "Combustível e SAF", regulator: "Reguladores", alliance: "Alianças", mixed: "Organizações do setor" },
};

function collator(locale: string) {
  return new Intl.Collator(locale, { sensitivity: "base" });
}

export default async function SourcesPage() {
  const locale = await getLocale();
  const c = collator(locale);
  const byType = TYPE_ORDER
    .map((type) => ({ type, rows: REGISTRY.filter((r) => r.type === type) }))
    .filter((g) => g.rows.length > 0)
    .map((g) => ({ ...g, rows: [...g.rows].sort((a, b) => c.compare(a.name, b.name)) }));

  return (
    <div className="container">
      <div className="page-head">
        <h1>{t(locale, "sources_title")}</h1>
      </div>
      <p className="sources-intro">
        {t(locale, "sources_intro")}
      </p>
      <div className="sources-stats">
        <div className="stat"><strong>{REGISTRY_STATS.total}</strong><span>{t(locale, "sources_total")}</span></div>
        <div className="stat"><strong>{REGISTRY_STATS.airlines}</strong><span>{t(locale, "sources_airlines")}</span></div>
        <div className="stat"><strong>{REGISTRY_STATS.direct}</strong><span>{t(locale, "sources_direct")}</span></div>
        <div className="stat"><strong>{REGISTRY_STATS.groups}</strong><span>{t(locale, "sources_groups")}</span></div>
      </div>
      {byType.map((g) => (
        <section key={g.type} className="sources-group">
          <h2>
            {TYPE_LABELS[locale]?.[g.type] ?? g.type}
            <span className="count"> · {g.rows.length}</span>
          </h2>
          <ul className="sources-list">
            {g.rows.map((r) => (
              <li key={r.slug} className="source-item">
                <a href={"/press?org=" + encodeURIComponent(r.name)}>{r.name}</a>
                {r.group && <span className="src-group">{r.group}</span>}
                {r.layer === "direct" && <span className="src-layer direct">direct</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
