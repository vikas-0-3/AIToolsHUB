import type { Metadata } from "next";
import Link from "next/link";
import { Sora, DM_Sans } from "next/font/google";
import { LogOut, Sparkles } from "lucide-react";
import "./globals.css";
import { supabaseServer } from "@/lib/supabase/server";
import ConsentBanner from "@/components/ConsentBanner";
import NavLinks from "@/components/NavLinks";
import SiteFooter from "@/components/SiteFooter";

const display = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "ToolsBuddy: find and compare AI tools", template: "%s | ToolsBuddy" },
  description: "Browse, filter and compare AI tools. Free to use, free to submit.",
  openGraph: { type: "website", siteName: "ToolsBuddy" },
  themeColor: "#090d18",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: { user } } = await supabaseServer().auth.getUser();
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="mx-auto flex max-w-[1400px]">
          <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col justify-between border-r p-4 md:flex">
            <div>
              <Link href="/" className="flex items-center gap-2 px-2 font-display text-lg font-bold">
                <span aria-hidden className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white"><Sparkles size={18} /></span>ToolsBuddy</Link>
              <nav className="mt-8 space-y-1" aria-label="Main"><NavLinks signedIn={!!user} /></nav>
            </div>
            <div>
              {user && <form action="/auth/signout" method="post"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 transition hover:bg-white/5 hover:text-white"><LogOut size={18} />Sign out</button></form>}
              <p className="px-3 pt-3 text-xs text-slate-500">Free to browse and submit. Reviews come from real people.</p>
            </div>
          </aside>
          <main className="min-w-0 flex-1 p-4 pb-28 md:p-8">
            {children}
            <SiteFooter />
          </main>
        </div>
        <nav className="fixed inset-x-3 bottom-3 z-40 flex rounded-2xl border bg-[#12172a]/90 shadow-pop backdrop-blur-xl md:hidden" aria-label="Mobile"><NavLinks signedIn={!!user} mobile /></nav>
        <ConsentBanner pub={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID} />
      </body>
    </html>
  );
}
