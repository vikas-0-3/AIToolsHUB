import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import ReviewForm from "@/components/ReviewForm";
import AdSlot from "@/components/AdSlot";
import { reportReview, toggleSave, voteReview } from "./actions";
import { btn, card } from "@/lib/ui";
import ToolImage from "@/components/ToolImage";
import Avatar from "@/components/Avatar";
import { Radar } from "@/components/Charts";
import { CRITERIA } from "@/lib/criteria";

async function getTool(slug: string) {
  const { data } = await supabaseServer().from("tools").select("*").eq("slug", slug).eq("status", "approved").maybeSingle();
  return data;
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const t = await getTool(params.slug);
  if (!t) return { title: "Tool not found", robots: { index: false } };
  return { title: `${t.name}: features, pricing and alternatives`, description: t.tagline, alternates: { canonical: `/tools/${t.slug}` },
    openGraph: { title: t.name, description: t.tagline }, robots: t.is_seed ? { index: false } : undefined };
}
type SP = { sort?: string; rating?: string; from?: string; to?: string };
export default async function ToolPage({ params, searchParams }: { params: { slug: string }; searchParams: SP }) {
  const t = await getTool(params.slug);
  if (!t) notFound();
  const sb = supabaseServer();
  await sb.rpc("bump_tool_view", { p_slug: t.slug });
  const { data: sub } = t.submitted_by ? await sb.from("public_profiles").select("display_name,avatar_url").eq("id", t.submitted_by).maybeSingle() : { data: null };
  const { data: { user } } = await sb.auth.getUser();
  const [{ data: all }, { data: alts }, { data: saved }] = await Promise.all([
    sb.from("reviews").select("id,user_id,rating,body,created_at,scores,review_votes(count)").eq("tool_id", t.id).eq("status", "published"),
    sb.from("tools").select("slug,name").eq("status", "approved").eq("category_id", t.category_id).neq("id", t.id).limit(4),
    user ? sb.from("saved_tools").select("tool_id").eq("tool_id", t.id).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  const votes = (r: any) => r.review_votes?.[0]?.count ?? 0;
  const { data: pn } = all?.length ? await sb.from("public_profiles").select("id,display_name,avatar_url").in("id", [...new Set(all.map((r: any) => r.user_id))]) : { data: [] as any[] };
  const profs = new Map<string, any>((pn ?? []).map((p: any) => [p.id, p]));
  const count = all?.length ?? 0;
  const avg = count ? all!.reduce((a: number, r: any) => a + r.rating, 0) / count : 0;
  let list = [...(all ?? [])];
  if (searchParams.rating) list = list.filter((r: any) => r.rating === Number(searchParams.rating));
  const d = /^\d{4}-\d{2}-\d{2}$/;
  if (d.test(searchParams.from ?? "")) list = list.filter((r: any) => r.created_at >= searchParams.from!);
  if (d.test(searchParams.to ?? "")) list = list.filter((r: any) => r.created_at < new Date(+new Date(searchParams.to!) + 86400000).toISOString());
  const cmp: Record<string, (a: any, b: any) => number> = {
    oldest: (a, b) => +new Date(a.created_at) - +new Date(b.created_at), high: (a, b) => b.rating - a.rating,
    low: (a, b) => a.rating - b.rating, helpful: (a, b) => votes(b) - votes(a) };
  list.sort(cmp[searchParams.sort ?? ""] ?? ((a, b) => +new Date(b.created_at) - +new Date(a.created_at)));
  const avgs = CRITERIA.map(([k, l]) => { const v = (all ?? []).map((r: any) => r.scores?.[k]).filter(Boolean) as number[]; return { k, l, n: v.length, avg: v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0 }; }).filter((a) => a.n);
  const ld: any = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: t.name, description: t.tagline, url: t.website_url, applicationCategory: "AI tool" };
  if (count) ld.aggregateRating = { "@type": "AggregateRating", ratingValue: avg.toFixed(1), reviewCount: count };
  const L = ({ title, items }: { title: string; items: string[] }) => items?.length ? <section className={`rounded-2xl border p-4 shadow-pop ${title === "Pros" ? "bg-emerald-400/10" : title === "Cons" ? "bg-rose-400/10" : "bg-white"}`}><h2 className="mb-1 text-lg">{title}</h2><ul className="list-disc pl-5 text-sm">{items.map((i) => <li key={i}>{i}</li>)}</ul></section> : null;
  return (
    <article className="space-y-5 py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500"><Link href="/">Home</Link> / <Link href="/tools">Tools</Link> / {t.name}</nav>
      <div className="flex items-center gap-4"><ToolImage src={t.image_url} site={t.website_url} name={t.name} size={72} /><h1 className="text-4xl font-bold sm:text-5xl">{t.name}</h1></div>
      <p className="flex items-center gap-2 text-sm text-slate-600"><Avatar url={sub?.avatar_url} name={sub?.display_name ?? "A"} size={24} />{sub ? `Added by ${sub.display_name}` : "Curated by AI Tools Hub"}</p>
      {t.is_seed && <p className="rounded bg-amber-50 p-2 text-sm">Sample entry for development. Not a real listing.</p>}
      <p>{t.description}</p>
      <p className="capitalize">Pricing: {t.pricing}{count > 0 && ` · Community rating: ${avg.toFixed(1)}/5 (${count})`}</p>
      <L title="Features" items={t.features} /><L title="Use cases" items={t.use_cases} /><L title="Pros" items={t.pros} /><L title="Cons" items={t.cons} />
      <div className="flex flex-wrap gap-2">
        <a href={t.website_url} rel="nofollow noopener noreferrer" target="_blank" className={btn}>Visit official website</a>
        <Link href={`/compare?tools=${t.slug}`} className="rounded border px-4 py-2">Compare</Link>
        <form action={toggleSave}><input type="hidden" name="tool_id" value={t.id} /><input type="hidden" name="slug" value={t.slug} />
          <button className="rounded border px-4 py-2">{saved ? "Saved ✓ (remove)" : "Save"}</button></form>
      </div>
      {alts?.length ? <section><h2 className="font-semibold">Alternatives</h2><div className="flex flex-wrap gap-2">{alts.map((a: any) => <Link key={a.slug} className="text-brand underline" href={`/tools/${a.slug}`}>{a.name}</Link>)}</div></section> : null}
      <section className={`${card} grid gap-6 md:grid-cols-2`}><div><h2 className="mb-3 text-lg">Rated by the community</h2>
        {avgs.length ? <ul className="space-y-3">{avgs.map((a) => <li key={a.k} className="text-sm"><div className="flex justify-between"><span>{a.l}</span><span>{a.avg.toFixed(1)} <span className="text-slate-500">({a.n})</span></span></div>
          <div className="h-2 rounded-full bg-white/10"><div className="bar h-2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" style={{ width: `${(a.avg / 5) * 100}%` }} /></div></li>)}</ul>
          : <p className="text-sm text-slate-500">No criteria ratings yet. Be the first to rate cost, usability, support and more.</p>}</div>
        {avgs.length >= 3 && <Radar axes={avgs.map((a) => a.l)} series={[{ name: t.name, values: avgs.map((a) => a.avg) }]} />}</section>
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTING} />
      <section className="space-y-3"><h2 className="text-xl font-semibold">Reviews</h2>
        <form className="flex flex-wrap gap-2 text-sm" aria-label="Filter reviews">
          <select name="sort" defaultValue={searchParams.sort ?? "newest"} aria-label="Sort reviews" className="rounded border p-1">
            <option value="newest">Newest</option><option value="oldest">Oldest</option><option value="high">Highest rated</option><option value="low">Lowest rated</option><option value="helpful">Most helpful</option></select>
          <select name="rating" defaultValue={searchParams.rating ?? ""} aria-label="Filter by rating" className="rounded border p-1">
            <option value="">All ratings</option>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
          <label className="text-xs">From <input type="date" name="from" defaultValue={searchParams.from} className="rounded border p-1" /></label><label className="text-xs">To <input type="date" name="to" defaultValue={searchParams.to} className="rounded border p-1" /></label><button className="rounded border px-3">Apply</button></form>
        {list.length === 0 && <p className="text-slate-600">No reviews yet. Be the first to share your experience.</p>}
        {list.map((r: any) => (
          <div key={r.id} className={card}>
            <p className="flex flex-wrap items-center gap-2 font-medium"><Avatar url={profs.get(r.user_id)?.avatar_url} name={profs.get(r.user_id)?.display_name ?? "M"} size={24} /><span className="text-lg text-tangerine">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span> <span className="text-xs text-slate-500">{new Date(r.created_at).toLocaleDateString("en-IN")} · {profs.get(r.user_id)?.display_name ?? "Member"}</span></p>
            <p className="mt-1 whitespace-pre-line text-sm">{r.body}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <form action={voteReview}><input type="hidden" name="review_id" value={r.id} /><input type="hidden" name="slug" value={t.slug} /><button className="underline">Helpful ({votes(r)})</button></form>
              <form action={reportReview} className="flex gap-1"><input type="hidden" name="review_id" value={r.id} /><input type="hidden" name="slug" value={t.slug} />
                <input name="reason" required minLength={3} placeholder="Report reason" aria-label="Report reason" className="rounded border px-1" /><button className="underline">Report</button></form>
            </div></div>))}
        {user ? <ReviewForm toolId={t.id} slug={t.slug} /> : <p className="text-sm"><Link className="text-brand underline" href={`/login?next=/tools/${t.slug}`}>Sign in</Link> to write a review, vote or save this tool.</p>}
      </section>
    </article>
  );
}
