# AI Tools Hub

Next.js (App Router) + TypeScript + Tailwind + Supabase. Free to browse, free to submit. No payments, no paid listings.

## Local setup
1. `npm install`
2. Create a free project at supabase.com.
3. In the SQL editor run `supabase/migrations/0001_init.sql` , `0002_admin.sql` `0003_profiles_suggest.sql` `0004_ratings_images.sql` and `0005_stats_leaderboard.sql` (adds criteria ratings, tool images and the `tool-images` storage bucket), then `supabase/seed.sql` (50 real tools; no reviews are seeded, they must come from real users. Check each tool's pricing before launch, it changes often).
4. `cp .env.example .env.local` and fill the URL and anon key from Project Settings > API.
5. `npm run dev`
6. Make yourself admin: `update profiles set role='admin' where id='<your auth user id>';`

## Deploy (free)
Push to GitHub, import in Vercel, add the same env vars, deploy. Set `NEXT_PUBLIC_SITE_URL` to your domain. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.

## AdSense
Off by default. Set `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` and slot IDs after approval. Add a consent banner before loading the AdSense script.

## Supabase Auth settings
Authentication > URL Configuration: set Site URL to your site URL and add `<site>/auth/callback` to Redirect URLs. Leave email confirmation on: reviews require a confirmed email.

## Status
Built: everything in the brief that fits the free tier, including category pages, search suggestions (`/api/suggest`), display-name settings, admin user management (suspend, promote) and review date-range filters.
Known limits: the suggestion rate limiter is in-memory per server instance; use a shared store if you scale up.

Password reset: also add `<site>/**` (for example `http://localhost:3000/**`) to Redirect URLs so the reset link can land on `/auth/callback?next=/reset-password`.
