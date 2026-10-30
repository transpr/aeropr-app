import Image from 'next/image'
import { Network, ShieldCheck, Zap } from 'lucide-react'
import { SiteHeader } from './site-header'

const features = [
  { icon: Zap, label: ['Real-time', 'monitoring'] },
  { icon: ShieldCheck, label: ['Verified', 'attribution'] },
  { icon: Network, label: ['RSS, webhooks', 'and API'] },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#EAF2FB]">
      <Image
        src="/images/wing-clouds.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[70%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#F2F7FD] via-[#F2F7FD]/75 to-transparent md:via-[#F2F7FD]/40"
      />
      <SiteHeader />
      <div className="mx-auto max-w-[1280px] px-6 pb-24 pt-16 lg:px-12 lg:pb-32 lg:pt-24">
        <div className="max-w-[560px]">
          <h1 className="text-balance text-[36px] font-semibold leading-[1.12] tracking-[-0.025em] text-navy sm:text-[44px] lg:text-[48px]">
            The latest press releases from the aerospace industry.
          </h1>
          <p className="mt-7 max-w-[500px] text-pretty text-[16px] leading-[1.6] text-navy/85">
            AirPR monitors, normalizes and distributes official press releases from airlines,
            airports, manufacturers and industry organizations.
          </p>
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
            {features.map(({ icon: Icon, label }) => (
              <li key={label[0]} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-structural" strokeWidth={1.75} aria-hidden="true" />
                <span className="text-[15px] leading-[1.4] text-navy">
                  {label[0]}
                  <br />
                  {label[1]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
