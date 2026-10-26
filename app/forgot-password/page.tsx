import type { Metadata } from "next";
import { ForgotForm } from "@/components/ResetForms";
export const metadata: Metadata = { title: "Forgot password", robots: { index: false } };
export default function Page() { return <div className="py-8"><h1 className="mb-4 text-center text-2xl">Reset your password</h1><ForgotForm /></div>; }
