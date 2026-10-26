import { cache } from "react";
import { supabaseServer } from "./supabase/server";
// One query per request, shared by every card on the page.
export const getSavedIds = cache(async () => {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return new Set<string>();
  const { data } = await sb.from("saved_tools").select("tool_id").eq("user_id", user.id);
  return new Set<string>((data ?? []).map((r: any) => r.tool_id));
});
