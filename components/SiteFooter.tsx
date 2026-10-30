import Link from "next/link";
import { SITE } from "@/lib/site";

const linkGroups = [
  {
    title: "Explore",
    links: [["/", "Home"], ["/tools", "Discover tools"], ["/compare", "Compare tools"], ["/leaderboard", "Leaderboard"]],
  },
  {
    title: "Contribute",
    links: [["/submit", "Submit a tool"], ["/about", "About us"], ["/contact", "Contact"]],
  },
  {
    title: "Policies",
    links: [["/editorial-policy", "Editorial policy"], ["/privacy", "Privacy policy"], ["/terms", "Terms of service"]],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-slate-400">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
        <div>
          <Link href="/" className="font-display text-base font-bold text-white">{SITE}</Link>
          <p className="mt-2 max-w-xs leading-6">Find and compare AI tools for the work you want to do.</p>
        </div>
        {linkGroups.map(({ title, links }) => (
          <div key={title}>
            <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-slate-300">{title}</h2>
            <nav aria-label={title} className="mt-3 flex flex-col items-start gap-2.5">
              {links.map(([href, label]) => <Link key={href} href={href} className="transition hover:text-white">{label}</Link>)}
            </nav>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t border-white/10 pt-4 text-xs leading-5 text-slate-500">
        © {new Date().getFullYear()} {SITE}. An independent AI tools directory. Tool details can change, so confirm them on each official site.
      </div>
    </footer>
  );
}
