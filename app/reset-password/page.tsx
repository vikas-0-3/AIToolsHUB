import type { Metadata } from "next";
import { ResetForm } from "@/components/ResetForms";
import { requireUser } from "@/lib/auth";
export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };
export default async function Page() { await requireUser("/reset-password"); return <div className="py-8"><h1 className="mb-4 text-center text-2xl">Choose a new password</h1><ResetForm /></div>; }
