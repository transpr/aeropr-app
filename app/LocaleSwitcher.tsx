"use client";
import { LOCALES, LOCALE_NAMES, type Locale } from "../lib/dictionaries";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  return (
    <select
      className="locale-switch"
      aria-label="Language"
      value={locale}
      onChange={(e) => {
        document.cookie = "locale=" + e.target.value + "; path=/; max-age=31536000";
        location.reload();
      }}
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>{LOCALE_NAMES[l]}</option>
      ))}
    </select>
  );
}
