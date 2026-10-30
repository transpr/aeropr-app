import type { Metadata } from 'next'
import { NewsDashboard } from '@/components/airpr/news-dashboard'
import { getPressReleases } from '@/lib/news'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'All news — AirPR',
  description: 'Official press releases from airlines, airports, manufacturers and industry organizations.',
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ article?: string }>
}) {
  const { article } = await searchParams
  const releases = await getPressReleases()
  return (
    <>
      <div hidden data-page="news" />
      <NewsDashboard releases={releases} initialArticleId={article} />
    </>
  )
}
