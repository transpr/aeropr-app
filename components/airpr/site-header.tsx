import Link from 'next/link'
import { Search } from 'lucide-react'
import { Logo } from './logo'

const navItems = [
  { label: 'News', href: '/news' },
  { label: 'Sources', href: '#sources' },
  { label: 'About', href: '#about' },
]

export function SiteHeader() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-12">
          <Link href="/" aria-label="AirPR home">
            <Logo finClassName="h-6" className="[&>span]:text-[21px]" />
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[14px] text-navy/80 transition-colors hover:text-navy"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/news"
            aria-label="Search press releases"
            className="flex size-9 items-center justify-center rounded-[7px] text-navy/80 transition-colors hover:bg-white/60 hover:text-navy"
          >
            <Search className="size-[18px]" strokeWidth={1.75} />
          </Link>
          <Link
            href="/news"
            className="inline-flex h-10 items-center rounded-[7px] bg-electric px-[18px] text-[14px] font-medium text-white shadow-[0_1px_2px_rgba(8,37,69,0.12)] transition-colors hover:bg-bluejay"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}
