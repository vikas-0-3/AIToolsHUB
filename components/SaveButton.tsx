import { Bookmark } from "lucide-react";
import { getSavedIds } from "@/lib/saved";
import { toggleSave } from "@/app/tools/[slug]/actions";
export default async function SaveButton({ id, slug }: { id: string; slug: string }) {
  const saved = (await getSavedIds()).has(id);
  return (
    <form action={toggleSave} className="relative z-10"><input type="hidden" name="tool_id" value={id} /><input type="hidden" name="slug" value={slug} />
      <button aria-label={saved ? "Remove from saved" : "Save tool"} aria-pressed={saved} className="rounded-lg p-1.5 text-slate-500 transition hover:scale-110 hover:text-white">
        <Bookmark size={18} className={saved ? "fill-brand text-brand" : ""} /></button></form>
  );
}
