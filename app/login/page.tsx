import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { safeNext } from "@/lib/auth";
export const metadata: Metadata = { title: "Sign in", robots: { index: false } };
export default function Login({ searchParams }: { searchParams: { next?: string } }) {
  return <div className="py-8"><h1 className="mb-4 text-center text-2xl font-bold">Sign in or create an account</h1><AuthForm next={safeNext(searchParams.next)} /></div>;
}
