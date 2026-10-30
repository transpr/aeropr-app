'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PressRelease } from '@/lib/news'
import { Sidebar, filterItems, type Filter } from './sidebar'
import { NewsListItem } from './news-list-item'
import { ArticlePreview } from './article-preview'
import { Logo } from './logo'

export function NewsDashboard({
  releases,
  initialArticleId,
}: {
  releases: PressRelease[]
  initialArticleId?: string
}) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | undefined>(
    releases.some((p) => p.id === initialArticleId) ? initialArticleId : releases[0]?.id,
  )

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return releases.filter(
      (p) =>
        (filter === 'all' || p.category === filter) &&
        (!q || `${p.headline} ${p.source} ${p.excerpt}`.toLowerCase().includes(q)),
    )
  }, [releases, filter, query])

  const selected = releases.find((p) => p.id === selectedId) ?? releases[0]
  const title = filterItems.find((f) => f.value === filter)?.label ?? 'All news'

  return (
    <div className="flex min-h-dvh bg-offwhite">
      <Sidebar filter={filter} onFilterChange={setFilter} />

      <div className="min-w-0 flex-1">
        <header className="flex h-14 items-center bg-gradient-to-r from-navy to-structural px-5 lg:hidden">
          <Link href="/" aria-label="AirPR home">
            <Logo variant="white" />
          </Link>
        </header>

        <main className="mx-auto flex max-w-[1240px] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section aria-labelledby="news-heading" className="min-w-0 flex-1 rounded-[9px] border border-line bg-white shadow-[0_1px_3px_rgba(8,37,69,0.04)]">
            <div className="border-b border-line px-6 pb-5 pt-6">
              <h1 id="news-heading" className="text-[24px] font-semibold tracking-[-0.02em] text-navy">
                {title}
              </h1>
              <div className="relative mt-5">
                <label htmlFor="news-search" className="sr-only">
                  Search press releases
                </label>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <input
                  id="news-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search press releases..."
                  className="h-10 w-full rounded-[7px] border border-line bg-white pl-9 pr-3 text-[14px] text-navy placeholder:text-subtle focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/15"
                />
              </div>
              <div className="-mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1 lg:hidden">
                {filterItems.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    aria-pressed={filter === f.value}
                    className={cn(
                      'h-8 shrink-0 rounded-[7px] border px-3 text-[13px] transition-colors',
                      filter === f.value
                        ? 'border-navy bg-navy text-white'
                        : 'border-line text-[#4A5A6E] hover:text-navy',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {items.length > 0 ? (
              <ul>
                {items.map((item) => (
                  <NewsListItem
                    key={item.id}
                    item={item}
                    selected={!!selected && item.id === selected.id}
                    onSelect={() => setSelectedId(item.id)}
                  />
                ))}
              </ul>
            ) : (
              <p className="px-6 py-16 text-center text-[14px] text-subtle">
                No press releases match your search.
              </p>
            )}
          </section>

          {selected && (
            <aside aria-label="Article preview" className="hidden w-[360px] shrink-0 xl:block">
              <div className="sticky top-8">
                <ArticlePreview article={selected} />
              </div>
            </aside>
          )}
        </main>
      </div>
    </div>
  )
}
