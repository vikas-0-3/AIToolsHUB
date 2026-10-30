import Link from "next/link";
import ToolImage from "./ToolImage";
import SaveButton from "./SaveButton";
import Avatar from "./Avatar";
export default function ToolRow({ t }: { t: any }) {
  return (
    <div className="card-pop group relative flex items-center gap-4 !p-3">
      <ToolImage src={t.image_url} site={t.website_url} name={t.name} size={44} />
      <div className="min-w-0 flex-1">
        <Link href={`/tools/${t.slug}`} className="font-display font-semibold after:absolute after:inset-0 after:content-['']">{t.name}</Link>
        <p className="truncate text-sm text-slate-600">{t.tagline}</p>
        <div className="mt-1 hidden flex-wrap gap-1 sm:flex">{(t.features ?? []).slice(0, 4).map((f: string) => <span key={f} className="chip normal-case text-slate-600">{f}</span>)}</div>
      </div>
      <div className="hidden shrink-0 items-center gap-4 text-sm text-slate-600 sm:flex">
        <span className="flex items-center gap-2"><Avatar url={t.owner?.avatar_url} name={t.owner?.display_name ?? "A"} size={24} /><span className="max-w-[110px] truncate">{t.owner?.display_name ?? "AIToolsBuddy"}</span></span>
      </div>
      <span className={`chip price-${t.pricing}`}>{t.pricing}</span>
      {t.id && <div className="relative z-10 flex shrink-0 flex-col items-center">
        <SaveButton id={t.id} slug={t.slug} />
        <span className="text-[10px] leading-3 text-slate-500" title="Times saved">{t.saves ?? 0}</span>
      </div>}
    </div>
  );
}
