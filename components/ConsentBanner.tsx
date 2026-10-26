"use client";
import { useEffect, useState } from "react";
// Loads AdSense only after the visitor accepts. Renders nothing if AdSense isn't configured.
export default function ConsentBanner({ pub }: { pub?: string }) {
  const [state, setState] = useState<"unknown" | "yes" | "no">("unknown");
  const load = () => {
    if (!pub || document.getElementById("adsense-js")) return;
    const s = document.createElement("script"); s.id = "adsense-js"; s.async = true; s.crossOrigin = "anonymous";
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(pub)}`;
    s.onload = () => document.querySelectorAll("ins.adsbygoogle").forEach(() => { try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); } catch {} });
    document.head.appendChild(s);
  };
  useEffect(() => { try { const v = localStorage.getItem("ad-consent"); if (v === "yes" || v === "no") { setState(v); if (v === "yes") load(); } } catch {} }, []); // eslint-disable-line
  if (!pub || state !== "unknown") return null;
  const choose = (v: "yes" | "no") => { try { localStorage.setItem("ad-consent", v); } catch {} setState(v); if (v === "yes") load(); };
  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-50 border-t bg-white p-4 text-sm">
      <p className="mx-auto max-w-6xl">We use cookies for ads (Google AdSense). Ads only load if you accept. The site works the same either way.</p>
      <div className="mx-auto mt-2 flex max-w-6xl gap-2"><button onClick={() => choose("yes")} className="rounded bg-brand px-3 py-1 text-white">Accept</button><button onClick={() => choose("no")} className="rounded border px-3 py-1">Decline</button></div>
    </div>
  );
}
