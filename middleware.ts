import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
// Keeps the Supabase session cookie fresh.
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (l) => { l.forEach(({ name, value }) => req.cookies.set(name, value)); res = NextResponse.next({ request: req }); l.forEach(({ name, value, options }) => res.cookies.set(name, value, options)); },
    },
  });
  await sb.auth.getUser();
  // Anonymous visitor counter: one tick per new browser, counted on page loads only.
  if (req.method === "GET" && !req.cookies.get("vid") && req.headers.get("accept")?.includes("text/html")) {
    res.cookies.set("vid", crypto.randomUUID(), { maxAge: 31536000, httpOnly: true, sameSite: "lax", path: "/" });
    await sb.rpc("bump_stat", { k: "visitors" });
  }
  return res;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
