import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import SearchBox from "@/components/SearchBox";
import ToolCard from "@/components/ToolCard";
import ToolRow from "@/components/ToolRow";
import AdSlot from "@/components/AdSlot";

const PAGE = 12;
type SP = { q?: string; category?: string; pricing?: string; feature?: string; freeplan?: string; sort?: string; view?: string; page?: string };
export const metadata: Metadata = { title: "AI tools directory", description: "Search, filter and sort AI tools by category, pricing and features.", alternates: { canonical: "/tools" } };
const sorts: [string, string][] = [["newest", "Newest"], ["oldest", "Oldest"], ["popular", "Most viewed"], ["name", "Name A–Z"], ["name_desc", "Name Z–A"]];

export default async function Tools({ searchParams: sp }: { searchParams: SP }) {
  const sb = supabaseServer();
  const page = Math.max(1, Number(sp.page) || 1), list = sp.view === "list";
  const [{ data: cats }, { data: fe }] = await Promise.all([sb.from("categories").select("slug,name").order("name"), sb.from("tools").select("features").eq("status", "approved")]);
  const freq = new Map<string, number>(); (fe ?? []).forEach((r: any) => (r.features ?? []).forEach((f: string) => freq.set(f, (freq.get(f) ?? 0) + 1)));
  const features = [...freq].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([f]) => f).sort();
  let q = sb.from("tools").select("id,slug,name,tagline,pricing,features,is_seed,image_url,website_url,categories!inner(slug)", { count: "exact" }).eq("status", "approved");
  const s = (sp.q ?? "").replace(/[%_,()*:"\\]/g, "").trim().slice(0, 60);
  if (s) q = q.or(`name.ilike.%${s}%,tagline.ilike.%${s}%,description.ilike.%${s}%`);
  if (sp.category) q = q.eq("categories.slug", sp.category);
  if (["free", "freemium", "paid"].includes(sp.pricing ?? "")) q = q.eq("pricing", sp.pricing!);
  if (sp.freeplan) q = q.neq("pricing", "paid");
  if (sp.feature && features.includes(sp.feature)) q = q.contains("features", [sp.feature]);
  q = sp.sort === "oldest" ? q.order("created_at") : sp.sort === "popular" ? q.order("view_count", { ascending: false }) : sp.sort === "name" ? q.order("name") : sp.sort === "name_desc" ? q.order("name", { ascending: false }) : q.order("created_at", { ascending: false });
  const { data, count, error } = await q.range((page - 1) * PAGE, page * PAGE - 1);
  const pages = Math.ceil((count ?? 0) / PAGE);
  const href = (o: Record<string, string>) => `/tools?${new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([, v]) => v)), ...o })}`;
  const sel = "rounded-xl border p-2 text-sm";
  return (
    <div className="space-y-5">
      <h1 className="text-3xl">Discover AI tools</h1>
      <form className="card-pop grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="search">
        <div className="sm:col-span-2"><SearchBox defaultValue={sp.q} placeholder="Search names, descriptions, anything" className="rounded-xl border p-2" /></div>
        <select name="category" defaultValue={sp.category ?? ""} aria-label="Category" className={sel}><option value="">All categories</option>{cats?.map((c: any) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        <select name="pricing" defaultValue={sp.pricing ?? ""} aria-label="Pricing" className={sel}><option value="">Any pricing</option><option value="free">Free</option><option value="freemium">Freemium</option><option value="paid">Paid</option></select>
        <select name="feature" defaultValue={sp.feature ?? ""} aria-label="Feature" className={sel}><option value="">Any feature</option>{features.map((f) => <option key={f}>{f}</option>)}</select>
        <select name="sort" defaultValue={sp.sort ?? "newest"} aria-label="Sort by" className={sel}>{sorts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="freeplan" value="1" defaultChecked={!!sp.freeplan} className="accent-violet-500" />Has a free plan</label>
        <input type="hidden" name="view" value={sp.view ?? "grid"} />
        <button className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2 text-white"><SlidersHorizontal size={16} />Apply</button>
      </form>
      <div className="flex items-center justify-between text-sm text-slate-600"><span>{count ?? 0} tools</span>
        <span className="flex gap-1"><Link href={href({ view: "grid", page: "1" })} aria-label="Card view" className={`rounded-lg p-2 ${!list ? "bg-white/10 text-white" : ""}`}><LayoutGrid size={18} /></Link>
          <Link href={href({ view: "list", page: "1" })} aria-label="List view" className={`rounded-lg p-2 ${list ? "bg-white/10 text-white" : ""}`}><List size={18} /></Link></span></div>
      {error ? <p role="alert" className="text-red-400">Could not load tools. Please refresh.</p>
        : !data?.length ? <p>No tools match. <Link className="text-brand underline" href="/tools">Clear filters</Link></p>
        : list ? <ul className="space-y-2">{data.map((t: any) => <li key={t.slug}><ToolRow t={t} /></li>)}</ul>
        : <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.map((t: any) => <li key={t.slug}><ToolCard t={t} /></li>)}</ul>}
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTING} />
      {pages > 1 && <nav className="flex items-center gap-4" aria-label="Pagination">{page > 1 && <Link rel="prev" href={href({ page: String(page - 1) })}>Previous</Link>}<span>Page {page} of {pages}</span>{page < pages && <Link rel="next" href={href({ page: String(page + 1) })}>Next</Link>}</nav>}
    </div>
  );
}
