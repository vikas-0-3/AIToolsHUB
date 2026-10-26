import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";
export const safeNext = (n?: string | null) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/account");
export async function requireUser(next = "/account") {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(safeNext(next))}`);
  return { sb, user };
}
export async function requireAdmin() {
  const { sb, user } = await requireUser("/admin");
  const { data } = await sb.from("profiles").select("role").eq("id", user.id).single();
  if (data?.role !== "admin") redirect("/");
  return { sb, user };
}
