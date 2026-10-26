"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { CRITERIA } from "@/lib/criteria";
type S = { error?: string; ok?: boolean } | null;
const uuid = z.string().uuid();
const schema = z.object({ tool_id: uuid, slug: z.string().max(80), rating: z.coerce.number().int().min(1).max(5), body: z.string().trim().min(20).max(3000) });

export async function postReview(_: S, form: FormData): Promise<S> {
  const slug = String(form.get("slug") ?? "");
  const { sb, user } = await requireUser(`/tools/${slug}`);
  if (!user.email_confirmed_at) return { error: "Confirm your email before reviewing." };
  if (form.get("company_site")) return { error: "Rejected." };
  const p = schema.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Pick a rating and write at least 20 characters." };
  if ((p.data.body.match(/https?:\/\//gi) ?? []).length > 1) return { error: "Reviews can include at most one link." };
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await sb.from("reviews").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since);
  if ((count ?? 0) >= 5) return { error: "Review limit reached. Try again later." };
  const scores: Record<string, number> = {};
  for (const [k] of CRITERIA) { const n = Number(form.get(`score_${k}`)); if (Number.isInteger(n) && n >= 1 && n <= 5) scores[k] = n; }
  const { error } = await sb.from("reviews").insert({ tool_id: p.data.tool_id, user_id: user.id, rating: p.data.rating, body: p.data.body, scores });
  if (error) return { error: error.code === "23505" ? "You already reviewed this tool." : "Could not save your review." };
  revalidatePath(`/tools/${p.data.slug}`);
  return { ok: true };
}
export async function voteReview(form: FormData) {
  const slug = String(form.get("slug") ?? ""); const id = uuid.safeParse(form.get("review_id"));
  const { sb, user } = await requireUser(`/tools/${slug}`);
  if (!id.success) return;
  const { data: r } = await sb.from("reviews").select("user_id").eq("id", id.data).single();
  if (!r || r.user_id === user.id) return;
  await sb.from("review_votes").insert({ review_id: id.data, user_id: user.id });
  revalidatePath(`/tools/${slug}`);
}
export async function reportReview(form: FormData) {
  const slug = String(form.get("slug") ?? ""); const id = uuid.safeParse(form.get("review_id"));
  const reason = z.string().trim().min(3).max(300).safeParse(form.get("reason"));
  const { sb, user } = await requireUser(`/tools/${slug}`);
  if (!id.success || !reason.success) return;
  await sb.from("reports").insert({ review_id: id.data, reporter_id: user.id, reason: reason.data });
}
export async function toggleSave(form: FormData) {
  const slug = String(form.get("slug") ?? ""); const id = uuid.safeParse(form.get("tool_id"));
  const { sb, user } = await requireUser(`/tools/${slug}`);
  if (!id.success) return;
  const { data } = await sb.from("saved_tools").select("tool_id").eq("tool_id", id.data).eq("user_id", user.id).maybeSingle();
  if (data) await sb.from("saved_tools").delete().eq("tool_id", id.data).eq("user_id", user.id);
  else await sb.from("saved_tools").insert({ tool_id: id.data, user_id: user.id });
  revalidatePath("/", "layout");
}
