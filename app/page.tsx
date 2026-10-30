import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Eye,
  FlaskConical,
  Image as ImageIcon,
  Code,
  Mic,
  MessageSquare,
  MessagesSquare,
  Palette,
  PenLine,
  Sparkles,
  Star,
  Trophy,
  Users,
  Video,
  Zap,
} from "lucide-react";
import CountUp from "@/components/CountUp";
import SearchBox from "@/components/SearchBox";
import ToolCard from "@/components/ToolCard";
import { supabaseServer } from "@/lib/supabase/server";
import ToolRow from "@/components/ToolRow";
import { toolMeta } from "@/lib/toolMeta";
import { LayoutGrid, List } from "lucide-react";

const icons: Record<string, any> = {
  chat: MessageSquare,
  research: FlaskConical,
  writing: PenLine,
  productivity: Zap,
  image: ImageIcon,
  design: Palette,
  video: Video,
  audio: Mic,
  coding: Code,
};
export default async function Home({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const sb = supabaseServer();
  const cols =
    "id,slug,name,tagline,pricing,is_seed,image_url,website_url,submitted_by,features";
  const [
    { data: popular },
    { data: recent },
    { data: cats },
    { count },
    { data: st },
  ] = await Promise.all([
    sb
      .from("tools")
      .select(cols)
      .eq("status", "approved")
      .order("view_count", { ascending: false })
      .limit(6),
    sb
      .from("tools")
      .select(cols)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6),
    sb.from("categories").select("slug,name").order("name"),
    sb
      .from("tools")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
    sb.rpc("site_counts"),
  ]);
  const list = searchParams.view !== "grid";
  const [pop, rec] = await Promise.all([
    toolMeta(popular ?? []),
    toolMeta(recent ?? []),
  ]);
  const Grid = ({ items }: { items: any[] }) =>
    items.length ? (
      list ? (
        <ul className="space-y-2">
          {items.map((t) => (
            <li key={t.slug}>
              <ToolRow t={t} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((t) => (
            <li key={t.slug}>
              <ToolCard t={t} />
            </li>
          ))}
        </ul>
      )
    ) : (
      <p className="card-pop">
        Nothing here yet.{" "}
        <Link className="font-semibold text-brand underline" href="/submit">
          Submit the first tool.
        </Link>
      </p>
    );
  const perks = [
    [Star, "Rate by criteria"],
    [BarChart3, "Compare with charts"],
    [Sparkles, "Free to submit"],
  ] as const;
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#171c32]/95 via-[#131a2d]/90 to-[#101a2a]/95 p-6 shadow-pop sm:p-12">
        <div
          aria-hidden
          className="orb absolute -right-16 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 opacity-30 blur-3xl"
        />
        <div
          aria-hidden
          className="orb absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-pink opacity-20 blur-3xl"
          style={{ animationDelay: "-3s" }}
        />
        <p className="sticker relative">
          <Sparkles size={14} className="text-brand" />
          {count ?? 0} AI tools and counting
        </p>
        <h1 className="relative mt-4 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
          Find the AI tool that fits, then see it side by side.
        </h1>
        <p className="relative mt-4 max-w-xl text-lg text-slate-300">
          Real reviews, ratings for cost, usability and support, and charts that
          make comparing easy.
        </p>
        <form
          action="/tools"
          role="search"
          className="relative mt-6 flex max-w-2xl gap-2"
        >
          <label htmlFor="q" className="sr-only">
            Search tools
          </label>
          <SearchBox
            id="q"
            placeholder="Search AI tools"
            className="rounded-2xl border p-4 text-lg"
          />
          <button className="rounded-2xl bg-brand px-6 text-lg text-white">
            Search
          </button>
        </form>
        <ul className="relative mt-5 flex flex-wrap gap-2">
          {perks.map(([I, s]) => (
            <li key={s} className="sticker">
              <I size={14} className="text-brand" />
              {s}
            </li>
          ))}
        </ul>
      </section>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(
          [
            [Users, "Visitors", st?.visitors],
            [Eye, "Tool views", st?.tool_views],
            [Boxes, "AI tools", st?.tools ?? count],
            [MessagesSquare, "Reviews", st?.reviews],
          ] as const
        ).map(([I, l, n]) => (
          <div key={l} className="card-pop !p-4">
            <I size={18} className="text-brand" />
            <p className="mt-2 font-display text-3xl font-bold">
              <CountUp to={Number(n ?? 0)} />
            </p>
            <p className="text-sm text-slate-400">{l}</p>
          </div>
        ))}
      </section>
      <Link
        href="/leaderboard"
        className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border bg-gradient-to-r from-violet-600/30 via-blue-500/20 to-cyan-400/20 p-6 transition hover:border-brand"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
          <Trophy className="text-amber-300" />
        </span>
        <span className="flex-1">
          <span className="block font-display text-xl font-semibold">
            See who’s leading the leaderboard
          </span>
          <span className="text-sm text-slate-300">
            Top rated, most saved and most viewed tools, plus top reviewers.
          </span>
        </span>
        <ArrowRight className="transition group-hover:translate-x-1" />
      </Link>
      <section>
        <h2 className="mb-4 text-2xl">Browse by task</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cats?.map((c: any) => {
            const I = icons[c.slug] ?? Sparkles;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="card-pop group flex items-center gap-3 !p-3"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-400/30 text-brand transition group-hover:scale-110">
                  <I size={20} />
                </span>
                <span className="flex-1 font-medium">{c.name}</span>
                <ArrowRight
                  size={16}
                  className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-white"
                />
              </Link>
            );
          })}
        </div>
      </section>
      <div className="flex items-center justify-between border-y border-white/10 py-3">
        <p className="text-sm text-slate-400">Browse tools your way</p>
        <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          <Link
            href="/?view=grid"
            aria-label="Card view"
            aria-current={!list ? "page" : undefined}
            className={`rounded-lg p-2 transition ${!list ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
          >
            <LayoutGrid size={18} />
          </Link>
          <Link
            href="/"
            aria-label="List view"
            aria-current={list ? "page" : undefined}
            className={`rounded-lg p-2 transition ${list ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
          >
            <List size={18} />
          </Link>
        </div>
      </div>
      <section>
        <h2 className="mb-4 text-2xl">Trending</h2>
        <Grid items={pop} />
      </section>
      <section>
        <h2 className="mb-4 text-2xl">Just launched</h2>
        <Grid items={rec} />
      </section>
    </div>
  );
}
