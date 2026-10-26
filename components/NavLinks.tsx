"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, GitCompare, Trophy, Bookmark, PlusCircle, User, LogIn } from "lucide-react";
export default function NavLinks({ signedIn, mobile }: { signedIn: boolean; mobile?: boolean }) {
  const p = usePathname();
  const items = [{ h: "/", l: "Home", I: Home }, { h: "/tools", l: "Discover", I: LayoutGrid }, { h: "/compare", l: "Compare", I: GitCompare }, { h: "/leaderboard", l: "Top", I: Trophy },
    { h: "/saved", l: "Saved", I: Bookmark }, { h: "/submit", l: "Submit", I: PlusCircle }, signedIn ? { h: "/account", l: "Account", I: User } : { h: "/login", l: "Sign in", I: LogIn }];
  return <>{items.map(({ h, l, I }) => {
    const on = h === "/" ? p === "/" : p.startsWith(h);
    const cls = mobile ? `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${on ? "text-white" : "text-slate-500"}`
      : `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${on ? "bg-white/10 text-white" : "text-slate-500 hover:bg-white/5 hover:text-white"}`;
    return <Link key={h} href={h} aria-current={on ? "page" : undefined} className={cls}><I size={mobile ? 19 : 18} className="transition group-hover:scale-110" />{l}</Link>;
  })}</>;
}
