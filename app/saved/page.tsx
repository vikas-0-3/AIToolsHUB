import type { Metadata } from "next";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import { requireUser } from "@/lib/auth";
export const metadata: Metadata = { title: "Saved tools", robots: { index: false } };
export default async function Saved() {
  const { sb, user } = await requireUser("/saved");
  const { data } = await sb.from("saved_tools").select("tools(id,slug,name,tagline,pricing,is_seed,image_url,website_url)").eq("user_id", user.id);
  const tools = (data ?? []).map((r: any) => r.tools).filter(Boolean);
  return (
    <div className="space-y-5"><h1 className="text-3xl">Saved tools</h1>
      {tools.length ? <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{tools.map((t: any) => <li key={t.slug}><ToolCard t={t} /></li>)}</ul>
        : <p className="text-slate-600">Nothing saved yet. Tap the bookmark on any tool. <Link className="text-brand underline" href="/tools">Discover tools</Link></p>}</div>
  );
}
