"use client";
import { useFormState } from "react-dom";
import { requestReset, updatePassword } from "@/app/login/actions";
import { btn, input } from "@/lib/ui";
function Shell({ action, field, label, button }: { action: any; field: "email" | "password"; label: string; button: string }) {
  const [s, a] = useFormState(action, null) as unknown as [{ error?: string; message?: string } | null, any]; 
  return (
    <form action={a} className="mx-auto max-w-sm space-y-3">
      <label className="block text-sm">{label}<input name={field} type={field} required minLength={field === "password" ? 8 : undefined} autoComplete={field === "password" ? "new-password" : "email"} className={input} /></label>
      {s?.error && <p role="alert" className="text-sm text-red-400">{s.error}</p>}{s?.message && <p role="status" className="text-sm text-emerald-400">{s.message}</p>}
      <button className={btn}>{button}</button>
    </form>
  );
}
export const ForgotForm = () => <Shell action={requestReset} field="email" label="Your account email" button="Send reset link" />;
export const ResetForm = () => <Shell action={updatePassword} field="password" label="New password (8+ characters)" button="Save new password" />;
