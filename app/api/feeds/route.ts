import { NextResponse } from "next/server";
import { createFeed } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

function makeToken(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let t = "";
  for (let i = 0; i < 16; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sector = body.sector === "rail" ? "rail" : "air";
    const f = body.filters ?? {};
    const filters: Record<string, unknown> = {};
    if (Array.isArray(f.sources) && f.sources.length) filters.sources = f.sources.slice(0, 50);
    if (Array.isArray(f.categories) && f.categories.length) filters.categories = f.categories.slice(0, 20);
    if (Array.isArray(f.keywords) && f.keywords.length) filters.keywords = f.keywords.slice(0, 20);
    const token = makeToken();
    await createFeed({
      token, sector,
      label: "Personalized feed",
      filters,
      plan: "basic",
      delay_hours: 0,
    });
    return NextResponse.json({ token });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
