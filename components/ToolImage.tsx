"use client";
import { useState } from "react";
// Uploaded/linked image first, then the site's favicon, then a gradient letter tile.
export default function ToolImage({ src, site, name, size = 48 }: { src?: string | null; site?: string | null; name: string; size?: number }) {
  const fav = (() => { try { return `https://www.google.com/s2/favicons?sz=128&domain=${new URL(site ?? "").hostname}`; } catch { return ""; } })();
  const list = [src, fav].filter(Boolean) as string[];
  const [i, setI] = useState(0);
  const box = { width: size, height: size };
  if (i >= list.length) return <span aria-hidden style={box} className="grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-bold text-white">{name[0]}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={list[i]} alt="" style={box} loading="lazy" referrerPolicy="no-referrer" onError={() => setI(i + 1)} className="shrink-0 rounded-xl bg-white/10 object-contain p-1" />;
}
