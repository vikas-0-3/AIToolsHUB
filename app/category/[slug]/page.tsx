import type { Metadata } from "next";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { card } from "@/lib/ui";
const PAGE = 12;
const getCat = async (slug: string) => (await supabaseServer().from("categories").select("id,slug,name,description").eq("slug", slug).maybeSingle()).data;
const pageNo = (p?: string) => Math.max(1, Number(p) || 1);

export async function generateMetadata({ params, searchParams }: { params: { slug: string }; searchParams: { page?: string } }): Promise<Metadata> {
  const c = await getCat(params.slug);
  if (!c) return { title: "Category not found", robots: { index: false } };
  const { count } = await supabaseServer().from("tools").select("id", { count: "exact", head: true }).eq("status", "approved").eq("category_id", c.id);
  const p = pageNo(searchParams.page);
  return { title: `${c.name} AI tools${p > 1 ? ` (page ${p})` : ""}`, description: c.description ?? `Browse and compare ${c.name.toLowerCase()} AI tools: pricing, features and community reviews.`,
    alternates: { canonical: `/category/${c.slug}${p > 1 ? `?page=${p}` : ""}` }, robots: count ? undefined : { index: false } };
}
export default async function Category({ params, searchParams }: { params: { slug: string }; searchParams: { page?: string } }) {
  const sb = supabaseServer();
  const c = await getCat(params.slug);
  if (!c) notFound();
  const page = pageNo(searchParams.page);
  const [{ data, count }, { data: others }] = await Promise.all([
    sb.from("tools").select("id,slug,name,tagline,pricing,is_seed,image_url,website_url", { count: "exact" }).eq("status", "approved").eq("category_id", c.id).order("name").range((page - 1) * PAGE, page * PAGE - 1),
    sb.from("categories").select("slug,name").neq("id", c.id).order("name"),
  ]);
  const pages = Math.ceil((count ?? 0) / PAGE);
  return (
    <div className="space-y-5 py-6">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500"><Link href="/">Home</Link> / <Link href="/tools">Tools</Link> / {c.name}</nav>
      <h1 className="text-2xl font-bold">{c.name} AI tools</h1>
      {c.description && <p className="text-slate-600">{c.description}</p>}
      {!data?.length ? <p>No approved tools in this category yet. <Link className="text-brand underline" href="/submit">Submit one</Link></p> : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{data.map((t: any) => (
          <li key={t.slug}><ToolCard t={t} /></li>))}</ul>)}
      {pages > 1 && <nav className="flex gap-3" aria-label="Pagination">{page > 1 && <Link rel="prev" href={`/category/${c.slug}?page=${page - 1}`}>Previous</Link>}<span>Page {page} of {pages}</span>{page < pages && <Link rel="next" href={`/category/${c.slug}?page=${page + 1}`}>Next</Link>}</nav>}
      <section><h2 className="mb-2 font-semibold">Other categories</h2><div className="flex flex-wrap gap-2">{others?.map((o: any) => <Link key={o.slug} href={`/category/${o.slug}`} className="rounded-full border bg-white px-3 py-1 text-sm">{o.name}</Link>)}</div></section>
    </div>
  );
}
