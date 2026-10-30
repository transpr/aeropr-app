import { useId } from 'react'
import { cn } from '@/lib/utils'

const FIN_PATH = 'M2 78C24 58 40 30 58 13C68 4 84 1.5 100 0L83 44C78 58 68 66 52 70C36 74 18 76.5 2 78Z'
const FACET_PATH = 'M2 78C34 58 68 30 100 0L83 44C78 58 68 66 52 70C36 74 18 76.5 2 78Z'

export function Logo({
  variant = 'color',
  finClassName,
  className,
}: {
  variant?: 'color' | 'white'
  finClassName?: string
  className?: string
}) {
  const id = useId()
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg viewBox="0 0 100 80" aria-hidden="true" className={cn('h-5 w-auto', finClassName)}>
        {variant === 'color' && (
          <defs>
            <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="100" y2="0">
              <stop offset="0" stopColor="#002B5C" />
              <stop offset="0.5" stopColor="#0057D9" />
              <stop offset="1" stopColor="#008BFF" />
            </linearGradient>
            <linearGradient id={id + '-facet'} gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="100" y2="0">
              <stop offset="0" stopColor="#0057D9" />
              <stop offset="0.5" stopColor="#0A7BFF" />
              <stop offset="1" stopColor="#3FB0FF" />
            </linearGradient>
          </defs>
        )}
        <path d={FIN_PATH} fill={variant === 'white' ? '#FFFFFF' : `url(#${id})`} />
        {variant === 'color' && (
          <path d={FACET_PATH} fill={`url(#${id}-facet)`} opacity="0.9" />
        )}
      </svg>
      <span
        className={cn(
          'text-[19px] font-semibold tracking-[-0.02em]',
          variant === 'white' ? 'text-white' : 'text-navy',
        )}
      >
        AirPR
      </span>
    </span>
  )
}
