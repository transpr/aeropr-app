import { getLatest, type Release } from './supabase'
import { excerpt } from './labels'

export type Category = 'airlines' | 'airports' | 'manufacturers' | 'organizations'

export type PressRelease = {
  id: string
  source: string
  sourceShort: string
  category: Category
  date: string
  isNew: boolean
  headline: string
  excerpt: string
  type: string
  image?: string
  originalUrl: string
}

export const categoryLabels: Record<Category, string> = {
  airlines: 'Airlines',
  airports: 'Airports',
  manufacturers: 'Manufacturers',
  organizations: 'Organizations',
}

// --- Supabase -> v0 PressRelease mapping ---

const TYPE_TO_CATEGORY: Record<string, Category> = {
  airline: 'airlines',
  airport: 'airports',
  oem: 'manufacturers',
}

function sourceShort(name: string): string {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, '').split(/\s+/).filter(Boolean)
  if (words.length === 1) return words[0].slice(0, 7).toUpperCase()
  return words.slice(0, 3).map((w) => w[0]).join('·').toUpperCase()
}

function prettyDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export async function getPressReleases(limit = 200): Promise<PressRelease[]> {
  let rows: Release[] = []
  try {
    rows = await getLatest('air', {}, limit)
  } catch {
    return []
  }
  return rows.map((r) => ({
    id: r.id,
    source: r.org_name,
    sourceShort: sourceShort(r.org_name),
    category: TYPE_TO_CATEGORY[r.source_type] ?? 'organizations',
    date: prettyDate(r.published_at),
    isNew: Date.now() - new Date(r.published_at).getTime() < 24 * 3600 * 1000,
    headline: r.title,
    excerpt: excerpt(r.body_en || r.body, 180),
    type: 'Press release',
    originalUrl: r.source_url,
  }))
}
