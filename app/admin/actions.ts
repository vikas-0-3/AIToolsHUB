"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/validation";
const uuid = z.string().uuid();
export async function setToolStatus(form: FormData) {
  const { sb } = await requireAdmin();
  const id = uuid.safeParse(form.get("id")); const status = z.enum(["approved", "rejected", "pending"]).safeParse(form.get("status"));
  if (id.success && status.success) await sb.from("tools").update({ status: status.data }).eq("id", id.data);
  revalidatePath("/admin"); revalidatePath("/tools");
}
export async function moderateReview(form: FormData) {
  const { sb } = await requireAdmin();
  const rid = uuid.safeParse(form.get("review_id")); const pid = uuid.safeParse(form.get("report_id"));
  if (rid.success && form.get("hide")) await sb.from("reviews").update({ status: "hidden" }).eq("id", rid.data);
  if (pid.success) await sb.from("reports").delete().eq("id", pid.data);
  revalidatePath("/admin");
}
export async function addCategory(form: FormData) {
  const { sb } = await requireAdmin();
  const name = z.string().trim().min(2).max(40).safeParse(form.get("name"));
  if (name.success) await sb.from("categories").insert({ name: name.data, slug: slugify(name.data) });
  revalidatePath("/admin");
}
export async function setUserState(form: FormData) {
  const { sb, user } = await requireAdmin();
  const id = uuid.safeParse(form.get("id")); const op = z.enum(["suspend", "unsuspend", "make_admin", "remove_admin"]).safeParse(form.get("op"));
  if (!id.success || !op.success || id.data === user.id) return;
  const patch = { suspend: { suspended: true }, unsuspend: { suspended: false }, make_admin: { role: "admin" }, remove_admin: { role: "user" } }[op.data];
  await sb.from("profiles").update(patch).eq("id", id.data);
  if (op.data === "suspend") await sb.from("reviews").update({ status: "hidden" }).eq("user_id", id.data);
  revalidatePath("/admin");
}
