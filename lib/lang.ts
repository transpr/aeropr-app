import { cookies } from "next/headers";
import { LANGS, type Lang } from "./i18n";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const v = store.get("lang")?.value;
  return v && (LANGS as readonly string[]).includes(v) ? (v as Lang) : "en";
}
