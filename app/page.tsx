import { Hero } from '@/components/airpr/hero'
import { LatestReleases } from '@/components/airpr/latest-releases'
import { getPressReleases } from '@/lib/news'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const releases = await getPressReleases()
  return (
    <main>
      <div hidden data-page="home" />
      <Hero />
      <LatestReleases items={releases.slice(0, 3)} />
    </main>
  )
}
