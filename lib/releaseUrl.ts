// Canonical release URL: /{source_slug}/{YYYY-MM-DD}/{title-slug}
// Decision (2026-10-29): SEO/AI-friendly paths, one stable URL per release.
// Old /release/{id} URLs 301-redirect to this format.
import type { Release } from "./supabase";

export function slugifyTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export function releaseUrl(r: Pick<Release, "source_slug" | "published_at" | "title">): string {
  const d = (r.published_at ?? "").slice(0, 10) || "unknown-date";
  return "/" + r.source_slug + "/" + d + "/" + slugifyTitle(r.title);
}

export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://airpressrelease.com";

export function releaseAbsoluteUrl(r: Pick<Release, "source_slug" | "published_at" | "title">): string {
  return SITE_ORIGIN + releaseUrl(r);
}
