// Legacy /release/{id} URLs → 301 to canonical /{source}/{date}/{slug}.
import { notFound, permanentRedirect } from "next/navigation";
import { getReleaseById } from "../../../lib/supabase";
import { releaseUrl } from "../../../lib/releaseUrl";

export const dynamic = "force-dynamic";

export default async function ReleaseRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await getReleaseById(id).catch(() => null);
  if (!r) notFound();
  permanentRedirect(releaseUrl(r));
}
