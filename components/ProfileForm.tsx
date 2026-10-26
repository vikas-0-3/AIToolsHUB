"use client";
import { useFormState } from "react-dom";
import { updateProfile } from "@/app/account/actions";
import { btn, input } from "@/lib/ui";
export default function ProfileForm({ name, avatar }: { name: string; avatar?: string | null }) {
  const [s, action] = useFormState(updateProfile, null);
  return (
    <form action={action} className="flex max-w-sm flex-wrap items-end gap-2">
      <label className="flex-1 text-sm">Display name (shown on your reviews)<input name="display_name" defaultValue={name} required minLength={2} maxLength={30} className={input} /></label>
      <label className="w-full text-sm">Profile image URL (https, optional)<input name="avatar_url" defaultValue={avatar ?? ""} className={input} /></label>
      <button className={btn}>Save</button>
      {s?.error && <p role="alert" className="w-full text-sm text-red-700">{s.error}</p>}
      {s?.ok && <p role="status" className="w-full text-sm text-green-700">Saved.</p>}
    </form>
  );
}
