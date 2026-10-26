import type { MetadataRoute } from "next";
import { supabaseServer } from "@/lib/supabase/server";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const sb = supabaseServer();
  const [{ data: tools }, { data: cats }] = await Promise.all([
    sb.from("tools").select("slug,created_at").eq("status", "approved").eq("is_seed", false),
    sb.from("categories").select("slug,tools!inner(id)").eq("tools.status", "approved").eq("tools.is_seed", false),
  ]);
  return [{ url: site }, { url: `${site}/tools` }, { url: `${site}/compare` },
    ...(cats ?? []).map((c: any) => ({ url: `${site}/category/${c.slug}` })),
    ...(tools ?? []).map((t: any) => ({ url: `${site}/tools/${t.slug}`, lastModified: t.created_at }))];
}
