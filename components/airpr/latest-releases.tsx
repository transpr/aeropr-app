import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PressRelease } from '@/lib/news'
import { SourceMark } from './source-mark'

export function LatestReleases({ items }: { items: PressRelease[] }) {
  return (
    <section id="sources" aria-labelledby="latest-heading" className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-12 lg:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 id="latest-heading" className="text-[26px] font-semibold tracking-[-0.02em] text-navy lg:text-[28px]">
              Latest releases
            </h2>
            <p className="mt-2 text-[15px] text-subtle">
              Official statements, attributed to their original source.
            </p>
          </div>
          <Link
            href="/news"
            className="hidden items-center gap-1.5 text-[14px] font-medium text-electric hover:text-bluejay sm:inline-flex"
          >
            View all news
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/news?article=${item.id}`}
                className="flex h-full flex-col rounded-[9px] border border-line bg-white p-6 shadow-[0_1px_2px_rgba(8,37,69,0.04)] transition-colors hover:border-[#CFDAE6]"
              >
                <div className="flex items-center gap-3">
                  <SourceMark label={item.sourceShort} size="sm" />
                  <span className="text-[13px] font-medium text-navy">{item.source}</span>
                  <span className="ml-auto text-[12px] text-subtle">{item.date}</span>
                </div>
                <h3 className="mt-5 text-pretty text-[17px] font-semibold leading-[1.35] text-navy">
                  {item.headline}
                </h3>
                <p className="mt-3 line-clamp-3 text-[14px] leading-[1.6] text-[#4A5A6E]">{item.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
