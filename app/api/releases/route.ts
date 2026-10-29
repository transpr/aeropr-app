import { NextResponse } from "next/server";
import { getLatest } from "../../lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sector = searchParams.get("sector") ?? "air";
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 200);
  if (!["air", "rail"].includes(sector)) {
    return NextResponse.json({ error: "sector must be air or rail" }, { status: 400 });
  }
  try {
    const releases = await getLatest(sector, limit);
    return NextResponse.json({ sector, count: releases.length, releases });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
