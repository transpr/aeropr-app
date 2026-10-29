import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const lang = typeof body.lang === "string" ? body.lang : "";
  const res = NextResponse.json({ ok: true });
  if (["en", "fr", "it", "de", "es", "pt"].includes(lang)) {
    res.cookies.set("lang", lang, { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" });
  }
  return res;
}
