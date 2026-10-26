"use client";
import { useEffect, useState } from "react";
export default function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => { let r = 0; const s = performance.now();
    const f = (t: number) => { const p = Math.min(1, (t - s) / 1200); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) r = requestAnimationFrame(f); };
    r = requestAnimationFrame(f); return () => cancelAnimationFrame(r); }, [to]);
  return <>{v.toLocaleString("en-IN")}</>;
}
