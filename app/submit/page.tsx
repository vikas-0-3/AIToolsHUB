import type { Metadata } from "next";
import SubmitForm from "@/components/SubmitForm";
import { requireUser } from "@/lib/auth";
export const metadata: Metadata = { title: "Submit an AI tool", robots: { index: false } };
export default async function Submit({ searchParams }: { searchParams: { done?: string } }) {
  const { sb } = await requireUser("/submit");
  const { data: cats } = await sb.from("categories").select("id,name").order("name");
  return (
    <div className="space-y-4 py-6"><h1 className="text-2xl font-bold">Submit an AI tool</h1>
      <p className="text-sm text-slate-600">Free for everyone. An admin reviews each submission before it is published.</p>
      {searchParams.done && <p role="status" className="rounded bg-green-50 p-3 text-sm">Thanks! Your tool is awaiting review. Track it in your account.</p>}
      <SubmitForm categories={cats ?? []} /></div>
  );
}
