import { supabaseServer } from "./supabase/server";
export async function toolMeta(tools: any[]) {
  const sb = supabaseServer();
  const owners = [...new Set(tools.map((t) => t.submitted_by).filter(Boolean))];
  const [{ data: sv }, { data: pp }] = await Promise.all([
    sb.rpc("tool_save_counts"),
    owners.length ? sb.from("public_profiles").select("id,display_name,avatar_url").in("id", owners) : Promise.resolve({ data: [] as any[] }),
  ]);
  const saves = new Map<string, number>((sv ?? []).map((r: any) => [r.tool_id, Number(r.n)]));
  const people = new Map<string, any>((pp ?? []).map((p: any) => [p.id, p]));
  return tools.map((t) => ({ ...t, saves: saves.get(t.id) ?? 0, owner: people.get(t.submitted_by) ?? null }));
}