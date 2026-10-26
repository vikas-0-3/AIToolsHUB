import Link from "next/link";
import ToolImage from "./ToolImage";
import SaveButton from "./SaveButton";
type T = { id?: string; slug: string; name: string; tagline: string; pricing: string; is_seed?: boolean; image_url?: string | null; website_url?: string | null };
export default function ToolCard({ t }: { t: T }) {
  return (
    <div className="card-pop group relative flex h-full gap-3">
      <ToolImage src={t.image_url} site={t.website_url} name={t.name} size={48} />
      <div className="min-w-0 flex-1">
        <Link href={`/tools/${t.slug}`} className="font-display font-semibold leading-tight after:absolute after:inset-0 after:content-['']">{t.name}</Link>
        {t.is_seed && <span className="chip ml-2">sample</span>}
        <p className="mt-1 text-sm text-slate-600">{t.tagline}</p>
        <span className={`chip mt-2 price-${t.pricing}`}>{t.pricing}</span>
      </div>
      {t.id && <SaveButton id={t.id} slug={t.slug} />}
    </div>
  );
}
