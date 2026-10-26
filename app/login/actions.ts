"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth";
type S = { error?: string; message?: string } | null;
const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(8).max(72), mode: z.enum(["login", "register"]), next: z.string().optional() });
export async function authAction(_: S, form: FormData): Promise<S> {
  const p = schema.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Enter a valid email and a password of at least 8 characters." };
  const { email, password, mode } = p.data;
  const next = safeNext(p.data.next);
  const sb = supabaseServer();
  if (mode === "register") {
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: `${site}/auth/callback?next=${encodeURIComponent(next)}` } });
    if (error) return { error: "Could not create the account. Try a different email or password." };
    if (!data.session) return { message: "Check your email and click the confirmation link to finish." };
  } else {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { error: "Email or password is incorrect, or the email is not confirmed yet." };
  }
  redirect(next);
}

export async function requestReset(_: S, form: FormData): Promise<S> {
  const email = z.string().trim().email().max(254).safeParse(form.get("email"));
  if (email.success) {
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await supabaseServer().auth.resetPasswordForEmail(email.data, { redirectTo: `${site}/auth/callback?next=/reset-password` });
  }
  return { message: "If that email has an account, a reset link is on its way." };
}
export async function updatePassword(_: S, form: FormData): Promise<S> {
  const pw = z.string().min(8).max(72).safeParse(form.get("password"));
  if (!pw.success) return { error: "Use a password of at least 8 characters." };
  const { error } = await supabaseServer().auth.updateUser({ password: pw.data });
  if (error) return { error: "Could not update the password. Open the reset link again." };
  redirect("/account");
}
