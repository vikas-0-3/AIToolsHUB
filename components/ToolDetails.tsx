import Link from "next/link";
import { CalendarCheck, GitCompare, Users, Wallet } from "lucide-react";
import { card } from "@/lib/ui";
export default function ToolDetails({ t, alts }: { t: any; alts: any[] }) {
  const verified = t.last_verified ? new Date(t.last_verified).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
  const H = ({ I, children }: { I?: any; children: React.ReactNode }) => <h2 className="mb-2 flex items-center gap-2 text-lg">{I && <I size={18} className="text-brand" />}{children}</h2>;
  return (
    <div className="space-y-4">
      {t.long_description && <section className={card}><H>About {t.name}</H>{String(t.long_description).split("\n\n").map((p, i) => <p key={i} className="mt-2 text-slate-600 first:mt-0">{p}</p>)}</section>}
      {t.who_for && <section className={card}><H I={Users}>Who should use {t.name}</H><p className="text-slate-600">{t.who_for}</p></section>}
      {t.pricing_details && <section className={card}><H I={Wallet}>Pricing breakdown</H><p className="text-slate-600">{t.pricing_details}</p></section>}
      {alts.length > 0 && <section className={card}><H I={GitCompare}>Compare {t.name} with alternatives</H>
        <ul className="grid gap-1 sm:grid-cols-2">{alts.map((a) => <li key={a.slug}><Link className="text-brand underline" href={`/compare?tools=${t.slug},${a.slug}`}>{t.name} vs {a.name}</Link></li>)}</ul></section>}
      <p className="flex flex-wrap items-center gap-2 text-sm text-slate-500"><CalendarCheck size={16} />{verified ? `Last verified: ${verified}.` : "Details are being reviewed."} Pricing and features change often, so confirm on the{" "}
        <a href={t.website_url} rel="nofollow noopener noreferrer" target="_blank" className="text-brand underline">official website</a>. See our <Link href="/editorial-policy" className="text-brand underline">editorial policy</Link>.</p>
    </div>
  );
}
