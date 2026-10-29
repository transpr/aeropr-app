import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "AeroPR — Aviation press release monitoring",
  description:
    "Official releases from airlines, airports, manufacturers and industry organizations. Original publication dates and source links preserved.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-brand="aeropr">
      <body className={`${inter.variable} ${plexMono.variable}`}>
        <header className="site-header">
          <div className="container inner">
            <a className="logo" href="/" aria-label="AeroPR home">
              <span className="dot" /><span className="dot dot2" /> AeroPR
            </a>
            <nav className="nav" aria-label="Main">
              <a href="/press">Press releases</a>
              <a href="/sources">Sources</a>
              <a href="/feeds">RSS feeds</a>
              <a href="/api/releases?sector=air&amp;limit=10">API</a>
            </nav>
          </div>
        </header>
        <main data-brand="aeropr">{children}</main>
        <footer className="site-footer">
          <div className="container">
            AeroPR aggregates official press releases. Each item links back to its original source.
            <a href="/sources"> Sources &amp; method</a>.
          </div>
        </footer>
      </body>
    </html>
  );
}
