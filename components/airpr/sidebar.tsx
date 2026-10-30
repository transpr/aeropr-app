import Link from 'next/link'
import {
  Building2,
  Code2,
  Factory,
  Newspaper,
  PlaneTakeoff,
  Rss,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/news'
import { Logo } from './logo'

export type Filter = 'all' | Category

export const filterItems: { value: Filter; label: string; icon: LucideIcon }[] = [
  { value: 'all', label: 'All news', icon: Newspaper },
  { value: 'airlines', label: 'Airlines', icon: PlaneTakeoff },
  { value: 'airports', label: 'Airports', icon: Building2 },
  { value: 'manufacturers', label: 'Manufacturers', icon: Factory },
  { value: 'organizations', label: 'Organizations', icon: Users },
]

function NavButton({
  active,
  icon: Icon,
  children,
  onClick,
}: {
  active?: boolean
  icon: LucideIcon
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-9 w-full items-center gap-3 rounded-[7px] px-3 text-left text-[13px] transition-colors',
        active ? 'bg-[#0D3A70] text-white' : 'text-white/75 hover:bg-white/[0.06] hover:text-white',
      )}
    >
      <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      {children}
    </button>
  )
}

export function Sidebar({ filter, onFilterChange }: { filter: Filter; onFilterChange: (f: Filter) => void }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col bg-gradient-to-b from-navy to-structural px-3 py-6 lg:flex">
      <Link href="/" aria-label="AirPR home" className="px-3">
        <Logo variant="white" finClassName="h-[22px]" />
      </Link>
      <nav aria-label="Categories" className="mt-10">
        <ul className="flex flex-col gap-1">
          {filterItems.map((item) => (
            <li key={item.value}>
              <NavButton
                icon={item.icon}
                active={filter === item.value}
                onClick={() => onFilterChange(item.value)}
              >
                {item.label}
              </NavButton>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mx-3 my-6 h-px bg-white/10" />
      <NavButton icon={Settings}>Settings</NavButton>
      <ul className="mt-auto flex flex-col gap-1">
        <li>
          <NavButton icon={Rss}>RSS</NavButton>
        </li>
        <li>
          <NavButton icon={Code2}>API &amp; Webhooks</NavButton>
        </li>
      </ul>
    </aside>
  )
}
