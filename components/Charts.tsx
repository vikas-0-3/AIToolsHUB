const COL = ["#9b8cff", "#22d3ee", "#f472b6", "#fbbf24"];
export function Radar({ axes, series }: { axes: string[]; series: { name: string; values: number[] }[] }) {
  const n = axes.length, c = 170, R = 105;
  const pt = (i: number, v: number) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / n; return [c + Math.cos(a) * R * v / 5, c + Math.sin(a) * R * v / 5]; };
  return (
    <figure>
      <svg viewBox="0 0 340 340" role="img" aria-label="Radar chart of criteria ratings" className="mx-auto w-full max-w-sm">
        {[1, 2, 3, 4, 5].map((r) => <polygon key={r} points={axes.map((_, i) => pt(i, r).join(",")).join(" ")} fill="none" stroke="rgba(255,255,255,.12)" />)}
        {axes.map((a, i) => { const [x, y] = pt(i, 5.9); return <text key={a} x={x} y={y} fontSize="11" fill="#aab2cf" textAnchor="middle" dominantBaseline="middle">{a}</text>; })}
        {series.map((s, j) => <polygon key={s.name} className="radar-poly" points={s.values.map((v, i) => pt(i, v).join(",")).join(" ")} fill={COL[j % 4]} fillOpacity=".22" stroke={COL[j % 4]} strokeWidth="2" />)}
      </svg>
      <figcaption className="flex flex-wrap justify-center gap-3 text-xs">{series.map((s, j) => <span key={s.name}><i className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: COL[j % 4] }} />{s.name}</span>)}</figcaption>
    </figure>
  );
}
export function Bars({ rows }: { rows: { name: string; value: number }[] }) {
  return (
    <ul className="space-y-3">{rows.map((r, i) => (
      <li key={r.name} className="text-sm"><div className="flex justify-between"><span>{r.name}</span><span>{r.value ? r.value.toFixed(1) : "No ratings"}</span></div>
        <div className="h-3 rounded-full bg-white/10"><div className="bar h-3 rounded-full" style={{ width: `${(r.value / 5) * 100}%`, background: COL[i % 4] }} /></div></li>))}</ul>
  );
}
