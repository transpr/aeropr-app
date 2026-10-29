import { cookies } from "next/headers";
import { LOCALES, type Locale } from "./dictionaries";

export type { Locale };

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const v = store.get("locale")?.value as Locale | undefined;
  return v && (LOCALES as readonly string[]).includes(v) ? v : "en";
}
