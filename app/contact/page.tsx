import type { Metadata } from "next";
import Doc from "@/components/Doc";
import { EMAIL, SITE, UPDATED } from "@/lib/site";
export const metadata: Metadata = { title: `Contact ${SITE}`, description: `How to contact ${SITE} for corrections, removals and general questions.`, alternates: { canonical: "/contact" } };
export default function Contact() {
  return (
    <Doc title="Contact us" updated={UPDATED}>
      <p>We read every message. You can write to us about:</p>
      <ul><li>Corrections to a tool’s description, pricing or features.</li><li>Requests to update or remove a listing you own.</li><li>Problems with your account or a review.</li><li>Privacy questions or requests to delete your data.</li><li>General feedback and suggestions.</li></ul>
      <h2>Email</h2>
      {EMAIL ? <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p> : <p>Our contact email is being set up. Please check back soon.</p>}
      <p>We aim to reply within a few business days. To report a specific review, use the Report button on that review.</p>
    </Doc>
  );
}
