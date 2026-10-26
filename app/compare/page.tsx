import type { Metadata } from "next";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { card } from "@/lib/ui";
import ToolPicker from "@/components/ToolPicker";
import { Bars, Radar } from "@/components/Charts";
import { CRITERIA } from "@/lib/criteria";

export const metadata: Metadata = { title: "Compare AI tools side by side", description: "Compare pricing, features, use cases and ratings of 2 to 4 AI tools.", alternates: { canonical: "/compare" } };
export default async function Compare({ searchParams }: { searchParams: { tools?: string | string[] } }) {
  const sb = supabaseServer();
  const slugs = [...new Set([searchParams.tools ?? []].flat().flatMap((s) => s.split(",")).map((s) => s.trim()).filter(Boolean))].slice(0, 4);
  const [{ data: pick }, { data: tools }] = await Promise.all([
    sb.from("tools").select("slug,name").eq("status", "approved").order("name").limit(200),
    slugs.length ? sb.from("tools").select("*").eq("status", "approved").in("slug", slugs) : Promise.resolve({ data: [] as any[] }),
  ]);
  const ids = (tools ?? []).map((t: any) => t.id);
  const { data: rs } = ids.length ? await sb.from("reviews").select("tool_id,rating,scores").in("tool_id", ids).eq("status", "published") : { data: [] as any[] };
  const rating = (id: string) => { const r = (rs ?? []).filter((x: any) => x.tool_id === id); return r.length ? `${(r.reduce((a: number, x: any) => a + x.rating, 0) / r.length).toFixed(1)}/5 (${r.length})` : "No reviews yet"; };
  const join = (a?: string[]) => (a?.length ? a.join(", ") : "—");
  const rows: [string, (t: any) => string][] = [
    ["Pricing", (t) => t.pricing], ["Free plan", (t) => (t.pricing === "paid" ? "No" : "Yes")], ["Community rating", (t) => rating(t.id)],
    ["Features", (t) => join(t.features)], ["Use cases", (t) => join(t.use_cases)], ["Platforms", (t) => join(t.platforms)], ["Pros", (t) => join(t.pros)], ["Cons", (t) => join(t.cons)]];
  const ok = (tools?.length ?? 0) >= 2;
  const per = (tools ?? []).map((t: any) => { const r = (rs ?? []).filter((x: any) => x.tool_id === t.id);
    return { name: t.name, r, avg: (k: string) => { const v = r.map((x: any) => x.scores?.[k]).filter(Boolean) as number[]; return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0; } }; });
  const axes = CRITERIA.filter(([k]) => per.some((p) => p.avg(k) > 0));
  const charts = (
    <div className="grid gap-4 md:grid-cols-2">
      <section className={card}><h2 className="mb-3 text-lg">Overall rating</h2><Bars rows={per.map((p) => ({ name: p.name, value: p.r.length ? p.r.reduce((a: number, x: any) => a + x.rating, 0) / p.r.length : 0 }))} /></section>
      <section className={card}><h2 className="mb-3 text-lg">Criteria ratings</h2>{axes.length >= 3 ? <Radar axes={axes.map(([, l]) => l)} series={per.map((p) => ({ name: p.name, values: axes.map(([k]) => p.avg(k)) }))} /> : <p className="text-sm text-slate-500">Not enough criteria ratings yet.</p>}</section>
    </div>);
  return (
    <div className="space-y-5 py-6"><h1 className="text-2xl font-bold">Compare AI tools</h1>
      <ToolPicker tools={pick ?? []} initial={slugs} />
      {!ok ? <p className="text-slate-600">Select at least two tools to see them side by side.</p> : (<>{charts}
        <div className="overflow-x-auto"><table className="w-full min-w-[600px] border-collapse bg-white text-sm">
          <thead><tr><th className="border p-2 text-left">&nbsp;</th>{tools!.map((t: any) => <th key={t.id} className="border p-2 text-left"><Link className="text-brand underline" href={`/tools/${t.slug}`}>{t.name}</Link></th>)}</tr></thead>
          <tbody>{rows.map(([label, get]) => { const v = tools!.map(get); const diff = new Set(v).size > 1;
            return <tr key={label} className={diff ? "bg-blue-50" : ""}><th scope="row" className="border p-2 text-left align-top">{label}{diff && <span className="ml-1 text-xs text-brand">differs</span>}</th>
              {v.map((x: string, i: number) => <td key={i} className="border p-2 align-top capitalize">{x}</td>)}</tr>; })}</tbody></table>
          <p className="mt-2 text-xs text-slate-500">Highlighted rows show where the tools differ.</p></div></>)}
    </div>
  );
}
