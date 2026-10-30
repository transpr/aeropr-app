import { cn } from '@/lib/utils'

export function SourceMark({ label, size = 'md' }: { label: string; size?: 'sm' | 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center font-bold tracking-[-0.01em] text-structural',
        size === 'md'
          ? 'h-10 w-14 text-[11px]'
          : 'size-6 rounded-[4px] bg-navy text-[6.5px] text-white',
      )}
    >
      {label}
    </span>
  )
}
