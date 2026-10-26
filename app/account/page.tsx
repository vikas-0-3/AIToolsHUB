import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { card } from "@/lib/ui";
import ProfileForm from "@/components/ProfileForm";
export const metadata: Metadata = { title: "My account", robots: { index: false } };
export default async function Account() {
  const { sb, user } = await requireUser("/account");
  const [{ data: mine }, { data: revs }, { data: saved }] = await Promise.all([
    sb.from("tools").select("name,slug,status").eq("submitted_by", user.id).order("created_at", { ascending: false }),
    sb.from("reviews").select("id,rating,body,tools(name,slug)").eq("user_id", user.id).order("created_at", { ascending: false }),
    sb.from("saved_tools").select("tools(name,slug)").eq("user_id", user.id),
  ]);
  const { data: me } = await sb.from("profiles").select("display_name,avatar_url").eq("id", user.id).single();
  return (
    <div className="space-y-6 py-6"><h1 className="text-2xl font-bold">My account</h1>
      <form action="/auth/signout" method="post"><button className="rounded-xl border px-4 py-2 text-sm font-semibold">Sign out</button></form><p className="text-sm text-slate-600">Signed in as {user.email}</p>
      <section className={card}><h2 className="mb-2 font-semibold">Settings</h2><ProfileForm name={me?.display_name ?? ""} avatar={me?.avatar_url} /></section>
      <section className={card}><h2 className="font-semibold">My submissions</h2>{mine?.length ? <ul>{mine.map((t: any) => <li key={t.slug} className="text-sm">{t.status === "approved" ? <Link className="text-brand underline" href={`/tools/${t.slug}`}>{t.name}</Link> : t.name} <span className="text-slate-500">({t.status})</span></li>)}</ul> : <p className="text-sm">None yet. <Link className="text-brand underline" href="/submit">Submit a tool</Link></p>}</section>
      <section className={card}><h2 className="font-semibold">My reviews</h2>{revs?.length ? <ul className="space-y-1">{revs.map((r: any) => <li key={r.id} className="text-sm">{r.tools?.name}: {r.rating}/5, {r.body.slice(0, 80)}…</li>)}</ul> : <p className="text-sm">No reviews yet.</p>}</section>
      <section className={card}><h2 className="font-semibold">Saved tools</h2>{saved?.length ? <ul>{saved.map((s: any) => <li key={s.tools?.slug}><Link className="text-brand underline text-sm" href={`/tools/${s.tools?.slug}`}>{s.tools?.name}</Link></li>)}</ul> : <p className="text-sm">Nothing saved yet.</p>}</section>
    </div>
  );
}
