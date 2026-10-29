"use client";
import { useRouter } from "next/navigation";
import { LANGS, LANG_LABELS, type Lang } from "../lib/i18n";

export default function LangSwitcher({ current }: { current: Lang }) {
  const router = useRouter();
  return (
    <select
      className="lang-select"
      value={current}
      aria-label="Language"
      onChange={async (e) => {
        await fetch("/api/lang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: e.target.value }),
        });
        router.refresh();
      }}
    >
      {LANGS.map((l) => (
        <option key={l} value={l}>{LANG_LABELS[l]}</option>
      ))}
    </select>
  );
}
