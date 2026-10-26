import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { card, input } from "@/lib/ui";
import { addCategory, moderateReview, setToolStatus, setUserState } from "./actions";
export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export default async function Admin() {
  const { sb, user } = await requireAdmin();
  const [{ data: tools }, { data: reports }, { data: cats }, { data: users }] = await Promise.all([
    sb.from("tools").select("id,name,status,website_url,is_seed").order("created_at", { ascending: false }).limit(60),
    sb.from("reports").select("id,reason,review_id,reviews(id,body,status)").order("created_at", { ascending: false }).limit(40),
    sb.from("categories").select("id,name").order("name"),
    sb.from("profiles").select("id,display_name,role,suspended,created_at").order("created_at", { ascending: false }).limit(100),
  ]);
  const S = ({ id, status, label }: { id: string; status: string; label: string }) => (
    <form action={setToolStatus}><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={status} /><button className="rounded border px-2 py-0.5 text-xs">{label}</button></form>);
  return (
    <div className="space-y-6 py-6"><h1 className="text-2xl font-bold">Admin dashboard</h1>
      <section className={card}><h2 className="mb-2 font-semibold">Tools and submissions</h2>
        <ul className="space-y-2">{tools?.map((t: any) => (
          <li key={t.id} className="flex flex-wrap items-center gap-2 text-sm"><span className="font-medium">{t.name}</span><span className="text-slate-500">{t.status}{t.is_seed && " · sample"}</span>
            <a className="text-brand underline" href={t.website_url} target="_blank" rel="nofollow noopener noreferrer">site</a>
            {t.status !== "approved" && <S id={t.id} status="approved" label="Approve" />}{t.status !== "rejected" && <S id={t.id} status="rejected" label="Reject" />}</li>))}</ul></section>
      <section className={card}><h2 className="mb-2 font-semibold">Reported reviews</h2>{!reports?.length && <p className="text-sm">No open reports.</p>}
        {reports?.map((r: any) => (
          <form key={r.id} action={moderateReview} className="mb-2 text-sm"><input type="hidden" name="report_id" value={r.id} /><input type="hidden" name="review_id" value={r.review_id} />
            <p>Reason: {r.reason}</p><p className="text-slate-600">{r.reviews?.body?.slice(0, 160)} ({r.reviews?.status})</p>
            <button name="hide" value="1" className="mr-2 rounded border px-2 py-0.5">Hide review</button><button className="rounded border px-2 py-0.5">Dismiss report</button></form>))}</section>
      <section className={card}><h2 className="mb-2 font-semibold">Categories</h2><p className="mb-2 text-sm">{cats?.map((c: any) => c.name).join(", ")}</p>
        <form action={addCategory} className="flex gap-2"><input name="name" required aria-label="New category" className={input} /><button className="rounded border px-3">Add</button></form></section>
      <section className={card}><h2 className="mb-2 font-semibold">Users</h2>
        <ul className="space-y-2">{users?.map((u: any) => (
          <li key={u.id} className="flex flex-wrap items-center gap-2 text-sm"><span className="font-medium">{u.display_name}</span>
            <span className="text-slate-500">{u.role}{u.suspended && " · suspended"} · joined {new Date(u.created_at).toLocaleDateString("en-IN")}</span>
            {u.id !== user.id && <form action={setUserState} className="flex gap-1"><input type="hidden" name="id" value={u.id} />
              <button name="op" value={u.suspended ? "unsuspend" : "suspend"} className="rounded border px-2 py-0.5 text-xs">{u.suspended ? "Unsuspend" : "Suspend"}</button>
              <button name="op" value={u.role === "admin" ? "remove_admin" : "make_admin"} className="rounded border px-2 py-0.5 text-xs">{u.role === "admin" ? "Remove admin" : "Make admin"}</button></form>}</li>))}</ul>
        <p className="mt-2 text-xs text-slate-500">Suspending a user blocks new reviews and submissions and hides their existing reviews.</p></section>
    </div>
  );
}
