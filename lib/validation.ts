import { z } from "zod";
import { safeUrl } from "./safeUrl";

const list = z.string().max(500).transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 12));
export const toolSchema = z.object({
  name: z.string().trim().min(2).max(80),
  tagline: z.string().trim().min(10).max(160),
  description: z.string().trim().min(50).max(4000),
  website_url: z.string().transform((v, ctx) => { const u = safeUrl(v); if (!u) ctx.addIssue({ code: "custom", message: "Enter a public http(s) URL" }); return u ?? ""; }),
  category_id: z.coerce.number().int().positive(),
  pricing: z.enum(["free", "freemium", "paid"]),
  features: list, use_cases: list, platforms: list, pros: list, cons: list,
});
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
