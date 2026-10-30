import Link from "next/link";
import { card } from "@/lib/ui";
const blocks = [
  ["What AIToolsBuddy does", "AIToolsBuddy is an independent directory of AI tools. We explain what each tool does, who it suits, what it costs and where it falls short, so you can shortlist quickly instead of reading dozens of sales pages."],
  ["How tools are evaluated", "Each listing is checked against the tool’s official website for what it does, its features and its pricing. Registered users then rate tools on cost, usability, simplicity, features, support, quality, speed and privacy. We never create or buy reviews."],
  ["How comparisons work", "Pick two to four tools and we place them side by side: pricing, free plan, features, use cases, platforms, pros and cons. Rows that differ are highlighted, and community ratings are drawn as charts so trade-offs are easy to see."],
];
export default function HomeAbout() {
  return (
    <section aria-labelledby="how" className="space-y-6">
      <h2 id="how" className="text-2xl">How AIToolsBuddy helps you choose</h2>
      <div className="grid gap-4 md:grid-cols-3">{blocks.map(([h, p]) => <div key={h} className={card}><h3 className="font-display text-lg font-semibold">{h}</h3><p className="mt-2 text-sm text-slate-600">{p}</p></div>)}</div>
      <div className={card}><h3 className="font-display text-lg font-semibold">How to choose the right AI tool</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li><b className="text-white">Start with the job, not the tool.</b> Write down the task, such as drafting emails, editing photos or writing code.</li>
          <li><b className="text-white">Browse by task</b> and shortlist two to four tools that claim to do it.</li>
          <li><b className="text-white">Check the free plan.</b> Most tools limit usage, so test with a real task before paying.</li>
          <li><b className="text-white">Compare side by side</b> on price, features and the criteria that matter to you, such as privacy or ease of use.</li>
          <li><b className="text-white">Read the cons and the official site</b> before committing, because pricing and features change often.</li></ol>
        <p className="mt-3 text-sm text-slate-500">Learn more in our <Link href="/editorial-policy" className="text-brand underline">editorial policy</Link>.</p></div>
    </section>
  );
}
