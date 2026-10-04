# Loopedy — landing page

Landing page for Loopedy, the brand co-op that matches non-competing DTC brands with overlapping audiences. The main call to action is a brand application form that saves to Supabase.

**Stack:** Next.js (App Router, TypeScript) · Tailwind CSS v4 · Zod · Supabase · deploy on Vercel.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Until Supabase is set up, form submissions are printed in the terminal instead of saved.

## Where things live

| To change…                        | Edit                                   |
| --------------------------------- | -------------------------------------- |
| Any text on the page, FAQ, form dropdown options | `src/content/site.ts`   |
| Colours and fonts                 | `src/app/globals.css` (`@theme` block) and `src/app/layout.tsx` |
| Section order / add or remove a section | `src/app/page.tsx`               |
| A section's layout                | `src/components/sections/*.tsx`        |
| Form fields and validation        | `src/components/application-form.tsx`, `src/lib/application.ts` |
| What happens on submit            | `src/app/actions.ts`                   |
| Database table                    | `supabase/schema.sql`                  |

Adding a form field: add it to the schema in `src/lib/application.ts`, to `formDataToApplication` in the same file, to the form component, and as a column in Supabase.

## Set up Supabase

1. Create a project at supabase.com.
2. Open **SQL Editor**, paste in `supabase/schema.sql`, and run it.
3. Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API).
4. Restart `npm run dev`. New applications appear in **Table Editor → applications**. Use the `status` and `notes` columns to track matching.

The service role key is only used on the server (in the Server Action) and never reaches the browser. Don't prefix it with `NEXT_PUBLIC_`.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it at vercel.com/new (framework is detected automatically).
3. Add the two environment variables under **Settings → Environment Variables**.
4. Add your domain under **Settings → Domains**, and check `site.url` and `site.contactEmail` in `src/content/site.ts`.

In production, if the Supabase variables are missing the form shows an error rather than silently dropping applications.

## Loopedy Match (class prototype, first working slice)

A founder fills in the application at **/match** and gets up to three non-competing partner brands, each with reasons and a suggested collab. They can mark each one Interested or Skip.

How it works (`src/lib/matching/`):

1. **Thin-input rule.** Very short or "everyone" style customer descriptions get a request for more detail. No model call.
2. **Profile.** The model turns the application into a short profile and can also say there isn't enough detail.
3. **Rules filter.** Removes your own brand, brands in the same category and big size gaps.
4. **Ranking.** The model rates every remaining brand (high, medium or low), flags competitors and has to quote both applications word for word in each reason.
5. **Evidence check.** Reasons whose quotes don't appear in the real text are thrown out. Competitors and low fits are dropped and the top three are shown.

**Wizard of Oz mode.** With no `ANTHROPIC_API_KEY` set (or with `LOOPEDY_WIZARD=1`), steps 2 and 4 are simulated with keyword logic in `src/lib/matching/wizard.ts`, so the whole flow can be clicked through for free. Everything else is the real code. The results page footer says which mode ran.

The candidate pool is 16 made-up brands in `src/content/sample-brands.ts`. Interested/Skip choices save to the `match_feedback` table (see `supabase/schema.sql`), or print in the terminal if Supabase isn't set up.

To use the real model, set `ANTHROPIC_API_KEY` in `.env.local` (optional). Then:

```bash
npm run dev          # open http://localhost:3000/match (test cases are one click at the top)
npm run test:slice   # runs the three test cases and writes docs/test-results.md
```

Known limitations are in `docs/first-working-slice.md`.

## Ideas for later

- Email notification on each new application (e.g. Resend) inside `submitApplication`.
- Analytics: `@vercel/analytics` is a one-line add in `layout.tsx`.
- The matching app itself (brand profiles, swipe-to-match, auto-intro emails) can grow in this same project under new routes like `src/app/(app)/…`, reusing the Supabase setup.
