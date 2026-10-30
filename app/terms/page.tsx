import type { Metadata } from "next";
import Doc from "@/components/Doc";
import { SITE, UPDATED } from "@/lib/site";
export const metadata: Metadata = { title: "Terms and conditions", description: `The terms for using ${SITE}.`, alternates: { canonical: "/terms" } };
export default function Terms() {
  return (
    <Doc title="Terms and conditions" updated={UPDATED}>
      <p>By using {SITE} you agree to these terms. If you do not agree, please do not use the site.</p>
      <h2>Using the site</h2>
      <p>You may browse, search and compare tools for free. You must provide accurate information when you register and keep your login secure. You are responsible for activity on your account.</p>
      <h2>Your content</h2>
      <p>You keep ownership of the tools, ratings and reviews you post, and you give us a non-exclusive licence to display them on the site. You must have the right to post what you submit.</p>
      <h2>Rules</h2>
      <ul><li>No fake, paid, copied or misleading reviews or ratings, and no reviewing your own tool.</li><li>No spam, advertising, hate, harassment, illegal content or personal data about others.</li><li>No attempts to break, overload or scrape the site in ways that harm it.</li><li>No artificial clicks or impressions on advertisements.</li></ul>
      <p>We may remove content or suspend accounts that break these rules.</p>
      <h2>Information about tools</h2>
      <p>Tool details, pricing and features are provided for general information and can change without notice. We try to keep them accurate but cannot guarantee it. Confirm details on the official website before you buy or rely on a tool. Ratings and reviews are opinions of individual users, not of {SITE}.</p>
      <h2>Third-party links and ads</h2>
      <p>The site links to third-party websites and shows advertisements. We do not control or endorse those sites or advertisers and are not responsible for their content or practices.</p>
      <h2>Disclaimer and liability</h2>
      <p>The site is provided “as is” without warranties. To the extent permitted by law, {SITE} is not liable for losses arising from your use of the site or reliance on its content.</p>
      <h2>Changes and governing law</h2>
      <p>We may update these terms and will change the date above when we do. These terms are governed by the laws of India.</p>
      <h2>Contact</h2>
      <p>Questions about these terms? Visit our <a href="/contact">contact page</a>.</p>
    </Doc>
  );
}
