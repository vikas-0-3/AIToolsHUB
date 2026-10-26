"use client";
import { useState } from "react";
import { Star } from "lucide-react";
export default function StarInput({ name, label }: { name: string; label: string }) {
  const [v, setV] = useState(0);
  return (
    <div className="flex items-center justify-between gap-2 text-sm"><span>{label}</span>
      <span className="flex"><input type="hidden" name={name} value={v} />
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-label={`${label}: ${n} of 5`} aria-pressed={v === n} onClick={() => setV(v === n ? 0 : n)} className="p-0.5 transition hover:scale-125">
            <Star size={18} className={n <= v ? "fill-amber-400 text-amber-400" : "text-slate-500"} /></button>))}</span></div>
  );
}
