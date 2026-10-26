import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth";
export async function GET(req: Request) {
  const u = new URL(req.url);
  const code = u.searchParams.get("code");
  if (code) await supabaseServer().auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(safeNext(u.searchParams.get("next")), u.origin));
}
