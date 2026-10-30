import type { Metadata } from "next";
import Doc from "@/components/Doc";
import { EMAIL, SITE, UPDATED } from "@/lib/site";
export const metadata: Metadata = { title: "Privacy policy", description: `How ${SITE} collects, uses and protects your information, including cookies and Google AdSense.`, alternates: { canonical: "/privacy" } };
export default function Privacy() {
  return (
    <Doc title="Privacy policy" updated={UPDATED}>
      <p>This policy explains what information {SITE} collects, how we use it and the choices you have. By using the site you agree to this policy.</p>
      <h2>Information we collect</h2>
      <ul><li><b>Account data:</b> your email address, a display name and an optional profile image link, when you create an account.</li><li><b>Content you post:</b> tools you submit, ratings, reviews, helpful votes, reports and saved tools.</li><li><b>Usage data:</b> an anonymous visitor counter and the number of times each tool page is viewed. We do not store your name or email with this data.</li><li><b>Technical data:</b> standard server logs such as IP address and browser type, kept by our hosting providers for security and reliability.</li></ul>
      <h2>How we use it</h2>
      <p>To run your account, publish your submissions and reviews, prevent spam and abuse, understand how the site is used, and keep the service secure. We do not sell your personal information.</p>
      <h2>Cookies</h2>
      <ul><li><b>Essential cookies</b> keep you signed in and remember an anonymous visitor ID.</li><li><b>Advertising cookies</b> are set by Google AdSense only if you accept them in our cookie banner. You can decline and still use the whole site.</li></ul>
      <h2>Google AdSense and advertising</h2>
      <p>We use Google AdSense to show ads. Google and its partners use cookies to serve ads based on your visits to this and other websites. You can manage personalised ads at <a href="https://adssettings.google.com" rel="noopener noreferrer">Google Ad Settings</a>, learn how Google uses data at <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>, or opt out of some third-party vendors at <a href="https://www.aboutads.info" rel="noopener noreferrer">aboutads.info</a>.</p>
      <h2>Service providers</h2>
      <p>We use Supabase to store account and site data, Vercel to host the site, and Google for advertising. These providers process data on our behalf under their own privacy terms.</p>
      <h2>Your choices and rights</h2>
      <p>You can edit your display name and profile image in your account. You can ask us to delete your account and the content you posted, or to give you a copy of your data, by contacting us.</p>
      <h2>Children</h2>
      <p>{SITE} is not directed at children under 13 and we do not knowingly collect their information.</p>
      <h2>Changes</h2>
      <p>We may update this policy and will change the date above when we do.</p>
      <h2>Contact</h2>
      <p>{EMAIL ? <>Questions? Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</> : <>Questions? Use our <a href="/contact">contact page</a>.</>}</p>
    </Doc>
  );
}
