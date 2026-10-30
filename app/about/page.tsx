import type { Metadata } from "next";
import Doc from "@/components/Doc";
import { SITE, UPDATED } from "@/lib/site";
export const metadata: Metadata = { title: `About ${SITE}`, description: `${SITE} is an independent directory that helps you find, compare and choose AI tools.`, alternates: { canonical: "/about" } };
export default function About() {
  return (
    <Doc title={`About ${SITE}`} updated={UPDATED}>
      <p>{SITE} is an independent directory that helps people find, compare and choose AI tools. Each listing explains what a tool does, who it suits, what it costs and where it falls short, so you can decide without reading a dozen marketing pages.</p>
      <h2>What we do</h2>
      <p>We list tools for writing, images, video, audio, coding, research, productivity, marketing and more. Tool pages summarise features, pros and cons, pricing and alternatives. Registered users can rate tools on cost, usability, simplicity, features, support, quality, speed and privacy, and the compare page turns those ratings into charts.</p>
      <h2>What makes us different</h2>
      <ul><li>Ratings by criteria, not just one overall score.</li><li>Side-by-side comparisons of two to four tools, with charts.</li><li>Free to browse and free to submit a tool. We do not sell listings or rankings.</li></ul>
      <h2>Our principles</h2>
      <ul><li><b>Independence:</b> no tool can pay to be listed higher.</li><li><b>Honesty:</b> we never create fake reviews or ratings. Every rating comes from a registered user.</li><li><b>Accuracy:</b> we show when a tool’s details were last verified and correct mistakes quickly.</li></ul>
      <p>Read how we work in our <a href="/editorial-policy">editorial policy</a>, or reach us on the <a href="/contact">contact page</a>.</p>
    </Doc>
  );
}
