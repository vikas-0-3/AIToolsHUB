"use client";
import { useState } from "react";
import { Check, Search, X } from "lucide-react";
export default function ToolPicker({ tools, initial }: { tools: { slug: string; name: string }[]; initial: string[] }) {
  const [sel, setSel] = useState<string[]>(initial); const [q, setQ] = useState("");
  const toggle = (s: string) => setSel((a) => (a.includes(s) ? a.filter((x) => x !== s) : a.length < 4 ? [...a, s] : a));
  const nm = (s: string) => tools.find((t) => t.slug === s)?.name ?? s;
  return (
    <form className="card-pop space-y-3 !p-4" aria-label="Choose tools to compare">
      {sel.map((s) => <input key={s} type="hidden" name="tools" value={s} />)}
      <div className="flex min-h-9 flex-wrap items-center gap-2">
        {sel.length ? sel.map((s) => <button type="button" key={s} onClick={() => toggle(s)} className="inline-flex items-center gap-1 rounded-full bg-brand/20 px-3 py-1 text-sm font-medium transition hover:bg-brand/30">{nm(s)}<X size={14} /></button>)
          : <span className="text-sm text-slate-500">Pick 2 to 4 tools to compare</span>}
        <span className="ml-auto text-xs text-slate-500">{sel.length}/4 selected</span></div>
      <div className="relative"><Search size={16} className="absolute left-3 top-3 text-slate-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter the list" aria-label="Filter tools" className="w-full p-2 pl-9" /></div>
      <ul className="grid max-h-60 gap-1.5 overflow-auto sm:grid-cols-2 lg:grid-cols-3">
        {tools.filter((t) => t.name.toLowerCase().includes(q.toLowerCase())).map((t) => { const on = sel.includes(t.slug); return (
          <li key={t.slug}><button type="button" aria-pressed={on} disabled={!on && sel.length >= 4} onClick={() => toggle(t.slug)}
            className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition disabled:opacity-40 ${on ? "border-brand bg-brand/15" : "hover:bg-white/5"}`}>
            <span className={`grid h-4 w-4 place-items-center rounded border ${on ? "bg-brand text-ink" : ""}`}>{on && <Check size={12} />}</span>{t.name}</button></li>); })}</ul>
      <button disabled={sel.length < 2} className="rounded-xl bg-brand px-4 py-2 text-white disabled:opacity-40">Compare {sel.length >= 2 ? `${sel.length} tools` : ""}</button>
    </form>
  );
}
