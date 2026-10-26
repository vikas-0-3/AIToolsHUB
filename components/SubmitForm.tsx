"use client";
import { useFormState, useFormStatus } from "react-dom";
import { submitTool } from "@/app/submit/actions";
import { btn, input } from "@/lib/ui";
function Go() { const { pending } = useFormStatus(); return <button disabled={pending} className={btn}>{pending ? "Submitting…" : "Submit for review"}</button>; }
export default function SubmitForm({ categories }: { categories: { id: number; name: string }[] }) {
  const [s, action] = useFormState(submitTool, null);
  const F = ({ n, label, area, hint }: { n: string; label: string; area?: boolean; hint?: string }) => (
    <label className="block text-sm">{label}{hint && <span className="text-slate-500"> ({hint})</span>}
      {area ? <textarea name={n} rows={5} className={input} /> : <input name={n} className={input} />}</label>);
  return (
    <form action={action} className="max-w-2xl space-y-3">
      <F n="name" label="Tool name" /><F n="tagline" label="One-line summary" hint="10–160 characters" />
      <F n="description" label="Description" area hint="at least 50 characters" /><F n="website_url" label="Official website URL" />
      <label className="block text-sm">Category<select name="category_id" required className={input}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label className="block text-sm">Pricing<select name="pricing" className={input}><option value="free">Free</option><option value="freemium">Freemium</option><option value="paid">Paid</option></select></label>
      <F n="features" label="Features" hint="comma separated" /><F n="use_cases" label="Use cases" hint="comma separated" /><F n="platforms" label="Platforms" hint="Web, iOS, API…" />
      <F n="pros" label="Pros" hint="comma separated" /><F n="cons" label="Cons" hint="comma separated" />
      <label className="block text-sm">Tool logo or image <span className="text-slate-500">(PNG, JPG or WebP, up to 2 MB)</span><input type="file" name="image_file" accept="image/png,image/jpeg,image/webp" className={input} /></label>
      <F n="image_url" label="…or paste an image URL" hint="https only" />
      <div className="hidden" aria-hidden="true"><input name="company_site" tabIndex={-1} autoComplete="off" /></div>
      {s?.error && <p role="alert" className="text-sm text-red-700">{s.error}</p>}
      <Go />
    </form>
  );
}
