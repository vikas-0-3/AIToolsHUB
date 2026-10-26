"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { safeUrl } from "@/lib/safeUrl";
type S = { error?: string; ok?: boolean } | null;
const name = z.string().trim().min(2).max(30).regex(/^[\p{L}\p{N} ._-]+$/u);
export async function updateProfile(_: S, form: FormData): Promise<S> {
  const { sb, user } = await requireUser("/account");
  const p = name.safeParse(form.get("display_name"));
  if (!p.success) return { error: "Use 2–30 letters, numbers, spaces, dots, dashes or underscores." };
  const av = String(form.get("avatar_url") ?? "").trim(); let avatar_url: string | null = null;
  if (av) { const u = safeUrl(av); if (!u || !u.startsWith("https://")) return { error: "Avatar must be a public https image URL." }; avatar_url = u; }
  const { error } = await sb.from("profiles").update({ display_name: p.data, avatar_url }).eq("id", user.id);
  if (error) return { error: "Could not save. Try again." };
  revalidatePath("/account");
  return { ok: true };
}
