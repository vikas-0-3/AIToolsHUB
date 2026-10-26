import Link from "next/link";
import ToolImage from "./ToolImage";
import SaveButton from "./SaveButton";
export default function ToolRow({ t }: { t: any }) {
  return (
    <div className="card-pop group relative flex items-center gap-4 !p-3">
      <ToolImage src={t.image_url} site={t.website_url} name={t.name} size={44} />
      <div className="min-w-0 flex-1">
        <Link href={`/tools/${t.slug}`} className="font-display font-semibold after:absolute after:inset-0 after:content-['']">{t.name}</Link>
        <p className="truncate text-sm text-slate-600">{t.tagline}</p>
        <div className="mt-1 hidden flex-wrap gap-1 sm:flex">{(t.features ?? []).slice(0, 4).map((f: string) => <span key={f} className="chip normal-case text-slate-600">{f}</span>)}</div>
      </div>
      <span className={`chip price-${t.pricing}`}>{t.pricing}</span>
      {t.id && <SaveButton id={t.id} slug={t.slug} />}
    </div>
  );
}
