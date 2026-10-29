import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "AeroPR — Aviation intelligence · Press releases",
  description:
    "Every aviation announcement. One place. Monitor airline, airport, manufacturer and aviation industry announcements from a single platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-brand="aeropr">
      <body className={`${inter.variable} ${plexMono.variable}`}>
        <header className="site-header">
          <div className="container inner">
            <a className="logo" href="/" aria-label="AeroPR home">
              <span className="dot" /><span className="dot dot2" />
              AeroPR
            </a>
            <nav className="nav">
              <a href="/press">Press releases</a>
              <a href="/sources">Sources</a>
              <a href="/feeds">RSS feeds</a>
              <a href="/api/releases?sector=air">API</a>
            </nav>
          </div>
        </header>
        <main data-brand="aeropr">{children}</main>
        <footer className="site-footer">
          <div className="container">
            AeroPR aggregates official press releases and always links back to the original source.
            <a href="/sources"> Sources &amp; method</a>.
          </div>
        </footer>
      </body>
    </html>
  );
}
