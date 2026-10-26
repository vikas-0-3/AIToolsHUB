"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
type Item = { name: string; slug: string };
export default function SearchBox({ defaultValue = "", className = "", placeholder = "Search tools", id }: { defaultValue?: string; className?: string; placeholder?: string; id?: string }) {
  const [q, setQ] = useState(defaultValue); const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false); const [active, setActive] = useState(-1);
  const list = useId(); const router = useRouter();
  useEffect(() => {
    if (q.trim().length < 2) { setItems([]); return; }
    const c = new AbortController();
    const t = setTimeout(async () => { try { const r = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`, { signal: c.signal }); if (r.ok) { setItems(await r.json()); setActive(-1); } } catch {} }, 200);
    return () => { clearTimeout(t); c.abort(); };
  }, [q]);
  const show = open && q.trim().length >= 2;
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (!items.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % items.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a <= 0 ? items.length - 1 : a - 1)); }
    if (e.key === "Enter" && active >= 0) { e.preventDefault(); router.push(`/tools/${items[active].slug}`); }
  };
  return (
    <div className="relative w-full">
      <input id={id} name="q" value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} onKeyDown={onKey}
        role="combobox" aria-label="Search tools" aria-expanded={show && items.length > 0} aria-controls={list} aria-autocomplete="list" autoComplete="off" placeholder={placeholder} className={`w-full ${className}`} />
      {show && (
        <ul id={list} role="listbox" className="absolute z-10 mt-1 w-full rounded border bg-white text-sm shadow">
          {items.length === 0 ? <li className="p-2 text-slate-500">No matching tools. Press Enter to search the directory.</li>
            : items.map((s, i) => <li key={s.slug} role="option" aria-selected={i === active} className={i === active ? "bg-blue-50" : ""}><Link href={`/tools/${s.slug}`} className="block p-2">{s.name}</Link></li>)}
        </ul>)}
    </div>
  );
}
