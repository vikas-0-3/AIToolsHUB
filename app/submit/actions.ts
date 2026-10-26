"use server";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { toolSchema, slugify } from "@/lib/validation";
import { safeUrl } from "@/lib/safeUrl";

type S = { error?: string } | null;
export async function submitTool(_: S, form: FormData): Promise<S> {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login?next=/submit");

  // Honeypot: bots fill hidden fields.
  if (form.get("company_site")) return { error: "Submission rejected." };

  const parsed = toolSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const t = parsed.data;

  // Rate limit: max 5 submissions per user per hour (DB-backed, no paid service).
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await sb.from("tools").select("id", { count: "exact", head: true }).eq("submitted_by", user.id).gte("created_at", since);
  if ((count ?? 0) >= 5) return { error: "Limit reached. Try again in an hour." };

  // Duplicate detection by URL or slug.
  const slug = slugify(t.name);
  const { data: dup } = await sb.from("tools").select("slug").or(`website_url.eq.${t.website_url},slug.eq.${slug}`).limit(1);
  if (dup?.length) return { error: "This tool already exists or is awaiting review." };

  let image_url: string | null = null;
  const file = form.get("image_file"); const imgUrl = String(form.get("image_url") ?? "").trim();
  if (file instanceof File && file.size > 0) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 2_000_000) return { error: "Image must be PNG, JPG or WebP under 2 MB." };
    const path = `${user.id}/${crypto.randomUUID()}.${file.type.split("/")[1].replace("jpeg", "jpg")}`;
    const { error: upErr } = await sb.storage.from("tool-images").upload(path, file, { contentType: file.type });
    if (upErr) return { error: "Image upload failed. Try a smaller file or paste a URL instead." };
    image_url = sb.storage.from("tool-images").getPublicUrl(path).data.publicUrl;
  } else if (imgUrl) {
    const u = safeUrl(imgUrl);
    if (!u || !u.startsWith("https://")) return { error: "Image URL must be a public https link." };
    image_url = u;
  }
  const { error } = await sb.from("tools").insert({ ...t, slug, image_url, submitted_by: user.id, status: "pending", is_seed: false });
  if (error) return { error: "Could not save your submission. Please try again." };
  redirect("/submit?done=1");
}
