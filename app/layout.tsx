import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import "./addon.css";
import LocaleSwitcher from "./LocaleSwitcher";
import Logo from "./Logo";
import { t } from "../lib/dictionaries";
import { getLocale } from "../lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "AirPR — Aviation press release monitoring",
  description:
    "Official releases from airlines, airports, manufacturers and industry organizations. Original publication dates and source links preserved.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} data-brand="aeropr">
      <body className={inter.variable + " " + plexMono.variable}>
        <header className="site-header">
          <div className="container inner">
            <a className="logo" href="/" aria-label="AirPR home">
              <Logo height={24} />
            </a>
            <nav className="nav" aria-label="Main">
              <a href="/press">{t(locale, "nav_press")}</a>
              <a href="/sources">{t(locale, "nav_sources")}</a>
              <a href="/feeds">{t(locale, "nav_feeds")}</a>
              <a href="/api/releases?sector=air&amp;limit=10">API</a>
              <LocaleSwitcher locale={locale} />
              <a className="btn-primary cta" href="/feeds">{t(locale, "nav_cta")}</a>
            </nav>
          </div>
        </header>
        <main data-brand="aeropr">{children}</main>
        <footer className="site-footer">
          <div className="container">
            {t(locale, "footer")} <a href="/sources">{t(locale, "footer_sources")}</a>.
          </div>
        </footer>
      </body>
    </html>
  );
}
