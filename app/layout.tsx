import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { t } from "../lib/i18n";
import { getLang } from "../lib/lang";
import LangSwitcher from "./LangSwitcher";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "AeroPR — Aviation press release monitoring",
  description:
    "Official releases from airlines, airports, manufacturers and industry organizations. Original publication dates and source links preserved.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang === "pt" ? "pt" : lang} data-brand="aeropr">
      <body className={inter.variable + " " + plexMono.variable}>
        <header className="site-header">
          <div className="container inner">
            <a className="logo" href="/" aria-label="AeroPR home">
              <span className="dot" /><span className="dot dot2" /> AeroPR
            </a>
            <nav className="nav" aria-label="Main">
              <a href="/press">{t(lang, "nav_press")}</a>
              <a href="/sources">{t(lang, "nav_sources")}</a>
              <a href="/feeds">{t(lang, "nav_feeds")}</a>
              <a href="/api/releases?sector=air&limit=10">{t(lang, "nav_api")}</a>
              <LangSwitcher current={lang} />
            </nav>
          </div>
        </header>
        <main data-brand="aeropr">{children}</main>
        <footer className="site-footer">
          <div className="container">
            {t(lang, "footer_note")}
            <a href="/sources"> {t(lang, "nav_sources")}</a>.
          </div>
        </footer>
      </body>
    </html>
  );
}
