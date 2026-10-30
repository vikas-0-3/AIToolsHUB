import type { Metadata } from "next";
import Doc from "@/components/Doc";
import { SITE, UPDATED } from "@/lib/site";
export const metadata: Metadata = { title: "Editorial and review policy", description: `How ${SITE} lists, checks, rates and corrects information about AI tools.`, alternates: { canonical: "/editorial-policy" } };
export default function Editorial() {
  return (
    <Doc title="Editorial and review policy" updated={UPDATED}>
      <p>This page explains how {SITE} decides what to list, how information is checked, and how ratings and reviews work.</p>
      <h2>Independence</h2>
      <p>We do not accept payment for listings, rankings or positive coverage. Submitting a tool is free for everyone, and approval depends only on whether the listing is accurate and useful. If we ever add affiliate links or sponsorships, we will label them clearly.</p>
      <h2>How tools are listed</h2>
      <ul><li>Tools come from our own research and from user submissions. Every submission is reviewed by a person before it is published.</li><li>We check that the tool exists, that the website link works, and that the description is accurate.</li><li>Duplicate, misleading or low-quality submissions are rejected.</li></ul>
      <h2>How we check information</h2>
      <p>Descriptions, features and pricing are checked against the tool’s official website. Tool pages show a “last verified” date once we have completed that check. AI tools change quickly, so always confirm current pricing and features on the official site. Some drafts may be prepared with AI assistance and are reviewed by a person before publication.</p>
      <h2>Ratings and reviews</h2>
      <ul><li>Ratings and reviews are written by registered users with a confirmed email address. We do not claim they come from verified customers.</li><li>Each user can review a tool once. We never create, buy or edit reviews to change a rating.</li><li>Reviews can be reported. We remove spam, abuse, advertising, personal information and content that breaks our terms.</li></ul>
      <h2>How comparisons work</h2>
      <p>The compare page places two to four tools side by side using the information on their pages and the community’s average ratings for each criterion. Rows that differ are highlighted. Criteria averages are only shown when enough ratings exist.</p>
      <h2>Corrections</h2>
      <p>If you spot an error, tell us on the <a href="/contact">contact page</a>. We will review it and update the listing, normally within a few business days.</p>
    </Doc>
  );
}
