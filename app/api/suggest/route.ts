import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
const hits = new Map<string, { n: number; t: number }>();
export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  const now = Date.now(); const h = hits.get(ip);
  if (hits.size > 5000) hits.clear();
  if (!h || now - h.t > 60_000) hits.set(ip, { n: 1, t: now });
  else if (++h.n > 60) return NextResponse.json([], { status: 429 });
  const q = (new URL(req.url).searchParams.get("q") ?? "").replace(/[%_,()*:"\\]/g, "").trim().slice(0, 40);
  if (q.length < 2) return NextResponse.json([]);
  const { data } = await supabaseServer().from("tools").select("name,slug").eq("status", "approved").or(`name.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%`).limit(6);
  return NextResponse.json(data ?? []);
}
