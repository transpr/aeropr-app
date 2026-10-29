"use client";

import { useMemo, useState } from "react";
import Logo from "../Logo";

export type NdCategory = "airlines" | "airports" | "manufacturers" | "organizations";
export type NdFilter = "all" | NdCategory;

export type NdItem = {
  id: string;
  href: string;
  headline: string;
  source: string;
  sourceShort: string;
  category: NdCategory;
  date: string;
  isNew: boolean;
  excerpt: string;
  originalUrl: string;
};

export type NdLabels = {
  all: string; airlines: string; airports: string; manufacturers: string; organizations: string;
  searchPh: string; searchLabel: string; noMatch: string; new: string;
  readOn: string; readOriginal: string; settings: string; rss: string; api: string;
  source: string; origDate: string; typeTerm: string; typeValue: string;
  share: string; download: string; viewSource: string;
};

// Lucide outline icons (inline SVG paths, stroke 1.75).
const ICONS: Record<string, string> = {
  all: "<path d='M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2'/><path d='M18 14h-8M18 10h-8M18 18h-8'/>",
  airlines: "<path d='M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z'/>",
  airports: "<rect width='16' height='10' x='4' y='7' rx='2'/><path d='M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 17h20'/>",
  manufacturers: "<path d='M2 20a6 6 0 0 0 12 0v-7a4 4 0 0 1 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4v7M2 20h12'/>",
  organizations: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/>",
  settings: "<path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .55 2.73l.08.06a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.08.06a2 2 0 0 0-.55 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.55-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.08a2 2 0 0 0 .55-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'/><circle cx='12' cy='12' r='3'/>",
  rss: "<path d='M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16'/><circle cx='5' cy='19' r='1'/>",
  api: "<path d='m16 18 6-6-6-6M8 6l-6 6 6 6'/>",
  search: "<circle cx='11' cy='11' r='8'/><path d='m21 21-4.3-4.3'/>",
  arrowUpRight: "<path d='M7 7h10v10M7 17 17 7'/>",
  share: "<circle cx='18' cy='5' r='3'/><circle cx='6' cy='12' r='3'/><circle cx='18' cy='19' r='3'/><path d='M8.6 13.5l6.8 4M15.4 6.5l-6.8 4'/>",
  download: "<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><path d='m7 10 5 5 5-5'/><path d='M12 15V3'/>",
  external: "<path d='M15 3h6v6M10 14 21 3'/><path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/>",
};

function Icon({ d, size = 16, className }: { d: string; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}

function SourceMark({ label, size = "md" }: { label: string; size?: "sm" | "md" }) {
  return (
    <span aria-hidden="true" className={"source-mark" + (size === "sm" ? " sm" : "")}>
      {label}
    </span>
  );
}

function NewsListItem({
  item,
  selected,
  onSelect,
  labels,
}: {
  item: NdItem;
  selected: boolean;
  onSelect: () => void;
  labels: NdLabels;
}) {
  return (
    <li className={"nd-item" + (selected ? " sel" : "")}>
      {selected && <span aria-hidden="true" className="bar" />}
      <div className="nd-mark">
        <SourceMark label={item.sourceShort} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="top">
          <p className="src">{item.source}</p>
          {item.isNew && <span className="newbadge">{labels.new}</span>}
        </div>
        <h3>
          <button type="button" onClick={onSelect}>{item.headline}</button>
        </h3>
        {item.excerpt && <p className="exc">{item.excerpt}</p>}
        <div className="meta">
          <span>{item.date} <span aria-hidden="true">·</span> {item.source}</span>
          <span className="links">
            <a className="read" href={item.href}>{labels.readOn}</a>
            <a className="orig" href={item.originalUrl} target="_blank" rel="noopener noreferrer">
              {labels.readOriginal} <Icon d={ICONS.arrowUpRight} size={14} />
            </a>
          </span>
        </div>
      </div>
    </li>
  );
}

function ArticlePreview({ article, labels }: { article: NdItem; labels: NdLabels }) {
  const meta = [
    { term: labels.source, value: article.source },
    { term: labels.origDate, value: article.date },
    { term: labels.typeTerm, value: labels.typeValue },
  ];
  const actions = [
    { label: labels.share, icon: ICONS.share, href: undefined },
    { label: labels.download, icon: ICONS.download, href: undefined },
    { label: labels.viewSource, icon: ICONS.external, href: article.originalUrl },
  ];
  return (
    <article className="nd-preview">
      <div className="pv-body">
        <div className="pv-src-row">
          <SourceMark label={article.sourceShort} size="sm" />
          <span className="pv-src">{article.source}</span>
          <time className="pv-date">{article.date}</time>
        </div>
        <h2>{article.headline}</h2>
        {article.excerpt && <p className="pv-exc">{article.excerpt}</p>}
        <dl>
          {meta.map((m) => (
            <div key={m.term} style={{ display: "contents" }}>
              <dt>{m.term}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
        <div className="pv-actions">
          {actions.map(({ label, icon, href }) => {
            const content = (<><Icon d={icon} /> {label}</>);
            return href ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">{content}</a>
            ) : (
              <button key={label} type="button">{content}</button>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export default function NewsDashboard({
  items,
  labels,
  initialFilter = "all",
  initialQuery = "",
  initialArticleId,
}: {
  items: NdItem[];
  labels: NdLabels;
  initialFilter?: NdFilter;
  initialQuery?: string;
  initialArticleId?: string;
}) {
  const [filter, setFilter] = useState<NdFilter>(initialFilter);
  const [query, setQuery] = useState(initialQuery);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialArticleId && items.some((i) => i.id === initialArticleId) ? initialArticleId : items[0]?.id,
  );

  const filters: { value: NdFilter; label: string; icon: string }[] = [
    { value: "all", label: labels.all, icon: ICONS.all },
    { value: "airlines", label: labels.airlines, icon: ICONS.airlines },
    { value: "airports", label: labels.airports, icon: ICONS.airports },
    { value: "manufacturers", label: labels.manufacturers, icon: ICONS.manufacturers },
    { value: "organizations", label: labels.organizations, icon: ICONS.organizations },
  ];

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) =>
        (filter === "all" || i.category === filter) &&
        (!q || (i.headline + " " + i.source + " " + i.excerpt).toLowerCase().includes(q)),
    );
  }, [items, filter, query]);

  const selected = items.find((i) => i.id === selectedId) ?? items[0];
  const title = filters.find((f) => f.value === filter)?.label ?? labels.all;

  return (
    <div className="nd-root">
      <aside className="nd-sidebar" aria-label="Categories">
        <a href="/" aria-label="AirPR home" className="nd-logo">
          <Logo variant="white" finHeight={22} />
        </a>
        <nav aria-label="Categories" style={{ marginTop: 40 }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {filters.map((f) => (
              <li key={f.value}>
                <button
                  type="button"
                  onClick={() => setFilter(f.value)}
                  aria-current={filter === f.value ? "page" : undefined}
                  className={"nav-btn" + (filter === f.value ? " on" : "")}
                >
                  <Icon d={f.icon} /> {f.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nd-divider" />
        <button type="button" className="nav-btn">
          <Icon d={ICONS.settings} /> {labels.settings}
        </button>
        <div className="nd-bottom">
          <a href="/feeds" className="nav-btn"><Icon d={ICONS.rss} /> {labels.rss}</a>
          <a href="/api/releases?sector=air&amp;limit=10" className="nav-btn"><Icon d={ICONS.api} /> {labels.api}</a>
        </div>
      </aside>

      <div className="nd-main">
        <header className="nd-mobile-header">
          <a href="/" aria-label="AirPR home"><Logo variant="white" finHeight={20} wordSize={17} /></a>
        </header>

        <main className="nd-page">
          <section className="nd-section" aria-labelledby="news-heading">
            <div className="nd-head">
              <h1 id="news-heading" className="nd-title">{title}</h1>
              <div className="nd-searchwrap">
                <label htmlFor="news-search" className="sr-only">{labels.searchLabel}</label>
                <Icon d={ICONS.search} />
                <input
                  id="news-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={labels.searchPh}
                  className="nd-search"
                />
              </div>
              <div className="nd-pills">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    aria-pressed={filter === f.value}
                    className={"nd-pill" + (filter === f.value ? " on" : "")}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {list.length > 0 ? (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {list.map((item) => (
                  <NewsListItem
                    key={item.id}
                    item={item}
                    selected={!!selected && item.id === selected.id}
                    onSelect={() => setSelectedId(item.id)}
                    labels={labels}
                  />
                ))}
              </ul>
            ) : (
              <p className="nd-empty">{labels.noMatch}</p>
            )}
          </section>

          {selected && (
            <aside className="nd-aside" aria-label="Article preview">
              <div className="nd-sticky">
                <ArticlePreview article={selected} labels={labels} />
              </div>
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}
