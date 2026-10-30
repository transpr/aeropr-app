import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import './addon.css'
import { SiteHeader } from '@/components/airpr/site-header'
import LocaleSwitcher from './LocaleSwitcher'
import { getLocale } from '../lib/i18n'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' })

export const metadata: Metadata = {
  title: 'AirPR — Aerospace press releases, monitored and verified',
  description:
    'AirPR monitors, normalizes and distributes official press releases from airlines, airports, manufacturers and industry organizations.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#082545',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable} bg-background`}>
      <body className="antialiased">
        <div className="legacy-header-wrap">
          <SiteHeader />
        </div>
        {children}
        <footer className="site-footer">
          <div className="container">
            AirPR aggregates official press releases. Each item links back to its original source.{' '}
            <a href="/sources">Sources &amp; method</a>. <LocaleSwitcher locale={locale} />
          </div>
        </footer>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
