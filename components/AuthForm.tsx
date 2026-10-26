"use client";
import { useFormState } from "react-dom";
import { authAction } from "@/app/login/actions";
import Link from "next/link";
import { btn, input } from "@/lib/ui";
export default function AuthForm({ next }: { next: string }) {
  const [s, action] = useFormState(authAction, null);
  return (
    <form action={action} className="mx-auto max-w-sm space-y-3">
      <input type="hidden" name="next" value={next} />
      <label className="block text-sm">Email<input name="email" type="email" required autoComplete="email" className={input} /></label>
      <label className="block text-sm">Password (8+ characters)<input name="password" type="password" minLength={8} required autoComplete="current-password" className={input} /></label>
      <Link href="/forgot-password" className="block text-sm text-brand underline">Forgot password?</Link>
      {s?.error && <p role="alert" className="text-sm text-red-700">{s.error}</p>}
      {s?.message && <p role="status" className="text-sm text-green-700">{s.message}</p>}
      <div className="flex gap-2"><button name="mode" value="login" className={btn}>Sign in</button><button name="mode" value="register" className="rounded border px-4 py-2">Create account</button></div>
    </form>
  );
}
