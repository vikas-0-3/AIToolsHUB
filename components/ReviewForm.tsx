"use client";
import { useFormState } from "react-dom";
import { postReview } from "@/app/tools/[slug]/actions";
import { btn, input } from "@/lib/ui";
import { CRITERIA } from "@/lib/criteria";
import StarInput from "./StarInput";
export default function ReviewForm({ toolId, slug }: { toolId: string; slug: string }) {
  const [s, action] = useFormState(postReview, null);
  if (s?.ok) return <p role="status" className="text-green-700">Thanks, your review is published.</p>;
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="tool_id" value={toolId} /><input type="hidden" name="slug" value={slug} />
      <label className="block text-sm">Rating<select name="rating" className={input} defaultValue="5">{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} out of 5</option>)}</select></label>
      <fieldset className="space-y-1 rounded-xl border p-3"><legend className="px-1 text-sm">Rate any of these (optional)</legend><div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">{CRITERIA.map(([k, l]) => <StarInput key={k} name={`score_${k}`} label={l} />)}</div></fieldset>
      <label className="block text-sm">Your review<textarea name="body" rows={4} className={input} placeholder="What did you use it for, and how did it work?" /></label>
      <div className="hidden" aria-hidden="true"><input name="company_site" tabIndex={-1} autoComplete="off" /></div>
      {s?.error && <p role="alert" className="text-sm text-red-700">{s.error}</p>}
      <button className={btn}>Post review</button>
    </form>
  );
}
