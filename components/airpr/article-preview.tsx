import Image from 'next/image'
import { Download, ExternalLink, Share2 } from 'lucide-react'
import type { PressRelease } from '@/lib/news'
import { SourceMark } from './source-mark'

export function ArticlePreview({ article }: { article: PressRelease }) {
  const meta = [
    { term: 'Source', value: article.source },
    { term: 'Original date', value: article.date },
    { term: 'Type', value: article.type },
  ]
  const actions = [
    { label: 'Share', icon: Share2, href: undefined },
    { label: 'Download', icon: Download, href: undefined },
    { label: 'View source', icon: ExternalLink, href: article.originalUrl },
  ]

  return (
    <article
      aria-labelledby={`preview-${article.id}`}
      className="overflow-hidden rounded-[9px] border border-line bg-white shadow-[0_1px_3px_rgba(8,37,69,0.05)]"
    >
      {article.image && (
        <div className="relative aspect-[16/8] bg-[#EAF2FB]">
          <Image src={article.image} alt="" fill sizes="360px" className="object-cover" />
        </div>
      )}
      <div className="px-6 pb-6 pt-5">
        <div className="flex items-center gap-2.5">
          <SourceMark label={article.sourceShort} size="sm" />
          <span className="text-[13px] font-medium text-navy">{article.source}</span>
          <time className="ml-auto text-[12px] text-subtle">{article.date}</time>
        </div>
        <h2
          id={`preview-${article.id}`}
          className="mt-4 text-pretty text-[20px] font-semibold leading-[1.3] tracking-[-0.015em] text-navy"
        >
          {article.headline}
        </h2>
        <p className="mt-4 text-pretty text-[14px] leading-[1.65] text-[#4A5A6E]">{article.excerpt}</p>

        <dl className="mt-7 grid grid-cols-[110px_1fr] gap-y-2.5 text-[13px]">
          {meta.map((m) => (
            <div key={m.term} className="contents">
              <dt className="text-subtle">{m.term}</dt>
              <dd className="text-navy">{m.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5">
          {actions.map(({ label, icon: Icon, href }) => {
            const className =
              'inline-flex items-center gap-1.5 text-[13px] text-[#4A5A6E] transition-colors hover:text-electric'
            const content = (
              <>
                <Icon className="size-4 text-electric" strokeWidth={1.75} aria-hidden="true" />
                {label}
              </>
            )
            return href ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {content}
              </a>
            ) : (
              <button key={label} type="button" className={className}>
                {content}
              </button>
            )
          })}
        </div>
      </div>
    </article>
  )
}
