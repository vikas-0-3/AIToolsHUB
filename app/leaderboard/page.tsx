import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, Eye, Star, Users } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import ToolImage from "@/components/ToolImage";
import Avatar from "@/components/Avatar";
export const metadata: Metadata = { title: "Leaderboard: top rated, most saved and most viewed AI tools", description: "See which AI tools and reviewers lead the community." };
type Row = { key: string; href?: string; icon: React.ReactNode; name: string; meta: string };
function Board({ title, Icon, rows }: { title: string; Icon: any; rows: Row[] }) {
  const medal = ["bg-amber-400 text-ink", "bg-slate-300 text-ink", "bg-orange-400 text-ink"];
  return (
    <section className="card-pop !p-5"><h2 className="mb-3 flex items-center gap-2 text-lg"><Icon size={18} className="text-brand" />{title}</h2>
      {rows.length ? <ol className="space-y-2">{rows.map((r, i) => (
        <li key={r.key} className="flex items-center gap-3"><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${medal[i] ?? "bg-white/10"}`}>{i + 1}</span>{r.icon}
          {r.href ? <Link href={r.href} className="flex-1 truncate font-medium hover:text-brand">{r.name}</Link> : <span className="flex-1 truncate font-medium">{r.name}</span>}<span className="text-sm text-slate-600">{r.meta}</span></li>))}</ol>
        : <p className="text-sm text-slate-500">Nothing here yet.</p>}</section>
  );
}
export default async function Leaderboard() {
  const sb = supabaseServer();
  const [{ data: rv }, { data: sv }, { data: vw }] = await Promise.all([
    sb.from("reviews").select("tool_id,user_id,rating").eq("status", "published").limit(5000),
    sb.rpc("tool_save_counts"),
    sb.from("tools").select("id,slug,name,image_url,website_url,view_count").eq("status", "approved").order("view_count", { ascending: false }).limit(10),
  ]);
  const by = new Map<string, { s: number; n: number }>(), rc = new Map<string, number>();
  (rv ?? []).forEach((r: any) => { const a = by.get(r.tool_id) ?? { s: 0, n: 0 }; a.s += r.rating; a.n++; by.set(r.tool_id, a); rc.set(r.user_id, (rc.get(r.user_id) ?? 0) + 1); });
  const top = [...by].map(([id, a]) => ({ id, score: (a.s + 6) / (a.n + 2), avg: a.s / a.n, n: a.n })).sort((a, b) => b.score - a.score).slice(0, 10);
  const saved = [...((sv as any[]) ?? [])].sort((a, b) => Number(b.n) - Number(a.n)).slice(0, 10);
  const ids = [...new Set([...top.map((t) => t.id), ...saved.map((s) => s.tool_id)])];
  const people = [...rc].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const [{ data: ts }, { data: pp }] = await Promise.all([
    ids.length ? sb.from("tools").select("id,slug,name,image_url,website_url").in("id", ids).eq("status", "approved") : Promise.resolve({ data: [] as any[] }),
    people.length ? sb.from("public_profiles").select("id,display_name,avatar_url").in("id", people.map((p) => p[0])) : Promise.resolve({ data: [] as any[] }),
  ]);
  const tm = new Map((ts ?? []).map((t: any) => [t.id, t])), pm = new Map((pp ?? []).map((p: any) => [p.id, p]));
  const tr = (t: any, meta: string): Row => ({ key: t.id, href: `/tools/${t.slug}`, icon: <ToolImage src={t.image_url} site={t.website_url} name={t.name} size={32} />, name: t.name, meta });
  return (
    <div className="space-y-6"><h1 className="text-3xl">Leaderboard</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Board title="Top rated" Icon={Star} rows={top.filter((t) => tm.has(t.id)).map((t) => tr(tm.get(t.id), `${t.avg.toFixed(1)} ★ · ${t.n}`))} />
        <Board title="Most saved" Icon={Bookmark} rows={saved.filter((s) => tm.has(s.tool_id)).map((s) => tr(tm.get(s.tool_id), `${s.n} saves`))} />
        <Board title="Most viewed" Icon={Eye} rows={(vw ?? []).filter((t: any) => t.view_count > 0).map((t: any) => tr(t, `${t.view_count} views`))} />
        <Board title="Top reviewers" Icon={Users} rows={people.map(([id, n]) => { const p: any = pm.get(id); return { key: id, icon: <Avatar url={p?.avatar_url} name={p?.display_name ?? "M"} size={32} />, name: p?.display_name ?? "Member", meta: `${n} reviews` }; })} />
      </div>
      <p className="text-sm text-slate-500">Top rated uses a weighted average, so one 5-star review doesn’t beat many good ones.</p></div>
  );
}
