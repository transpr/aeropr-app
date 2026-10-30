import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PressRelease } from '@/lib/news'
import { SourceMark } from './source-mark'

export function NewsListItem({
  item,
  selected,
  onSelect,
}: {
  item: PressRelease
  selected: boolean
  onSelect: () => void
}) {
  return (
    <li
      className={cn(
        'relative flex gap-5 border-b border-line px-6 py-6 transition-colors last:border-b-0',
        selected ? 'bg-[#F5F8FD]' : 'hover:bg-[#FAFBFD]',
      )}
    >
      {selected && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-electric" />}
      <div className="hidden pt-1 sm:block">
        <SourceMark label={item.sourceShort} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[12px] text-subtle">{item.source}</p>
          {item.isNew && (
            <span className="shrink-0 rounded-[4px] bg-[#E8F1FF] px-1.5 py-0.5 text-[11px] font-medium text-electric">
              New
            </span>
          )}
        </div>
        <h3 className="mt-1.5 text-pretty text-[15px] font-medium leading-[1.45] text-navy">
          <button
            type="button"
            onClick={onSelect}
            className="text-left after:absolute after:inset-0 focus-visible:outline-none"
          >
            {item.headline}
          </button>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.6] text-[#4A5A6E]">{item.excerpt}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
          <span className="text-subtle">
            {item.date} <span aria-hidden="true">·</span> {item.source}
          </span>
          <span className="relative z-10 flex items-center gap-5">
            <button
              type="button"
              onClick={onSelect}
              className="font-medium text-electric hover:text-bluejay"
            >
              Read on AirPR
            </button>
            <a
              href={item.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-[#4A5A6E] hover:text-navy"
            >
              Read original
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </span>
        </div>
      </div>
    </li>
  )
}
