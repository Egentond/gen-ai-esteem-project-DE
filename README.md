# Loopedy Match

Loopedy matches small DTC brands with non-competing brands that already sell to the same customer, so they can run collabs (gift-with-purchase swaps, email cross-sells, joint giveaways) instead of both paying for ads to reach her.

This repo holds the Loopedy landing page and the first working slice of **Loopedy Match**, the part that finds the partners. It's my semester project for ESTM 60244.

**Live demo:** [Try the Loopedy Match prototype](https://claude.ai/artifact/2Lc7H5mE5YNC6EGaevFbgf)

## What the slice does

A founder fills in a short application about their brand: what they sell, how many orders a month, which collab formats they'd do, and a few sentences about who their customer is. The slice reads that and comes back with up to three partner brands. Each match shows:

- why the two brands fit, quoting the founder's own words and the partner's own words side by side
- how strong the fit is (strong or possible)
- a suggested collab format, preferring one both brands said they'd do
- Interested and Skip buttons, and the choice is saved

Under the matches it lists every brand that was left out and why, so you can see the competitors and poor fits it caught.

If the application is too vague to match on (for example "we sell cool stuff to everyone"), it asks for more detail instead of making up matches.

## How it works

The matching runs in five steps (`src/lib/matching/`). Rules do the parts a rule can be sure about. The AI does the parts that need reading plain English.

1. **Enough detail?** (rule) Very short or "everyone" style descriptions get a request for more detail. Nothing else runs.
2. **Read the brand.** (AI) Turns the application into a short profile: what they sell, who the customer is, price level and what the customer cares about.
3. **Rule out the obvious.** (rule) Removes the founder's own brand, brands in the same category and brands much bigger or smaller than them.
4. **Rate every remaining brand.** (AI) Flags competitors that describe themselves in different words or picked a different category, rates the customer overlap and has to back each reason with exact quotes from both applications.
5. **Check the evidence.** (rule) Throws out any reason whose quotes don't really appear in the applications, drops competitors and low fits, and shows the top three.

**Wizard of Oz mode.** The prototype doesn't need to call a real model. With no `ANTHROPIC_API_KEY` set, steps 2 and 4 are simulated with keyword matching (`src/lib/matching/wizard.ts`), so the whole flow can be clicked through for free. Steps 1, 3 and 5 are the real code either way. Adding a key swaps in Claude for steps 2 and 4 with no other changes. The results page says which mode ran.

The pool of partner brands is 16 made-up brands in `src/content/sample-brands.ts`, some placed on purpose to trip the matcher up.

## Test cases

Defined in `src/content/test-founders.ts`. Each one is a button at the top of `/match` and in the live demo.

| Test | Input | Passes when | Result |
| --- | --- | --- | --- |
| Clear fit | Clean skincare brand whose customer goes to Pilates and yoga | Studio Form (Pilates apparel) is matched. Dorm Glow (student candles) and the skincare brands are not. | Pass |
| Competitor trap | Fragrance-free skincare for sensitive faces | Barrier Lab is kept out. It sells sensitive-skin serums but filed under a different category in different words. | Pass. Matched Gentle Wash, a fragrance-free laundry brand, instead. |
| Thin input | "we sell cool stuff to everyone" | It asks for more detail and shows no matches. | Pass. Stopped at step 1. |

Run them all with `npm run test:slice`. It prints pass or fail for each and writes the full output to `docs/test-results.md`.

## Known limitations

- In Wizard of Oz mode the matching is keyword overlap. Two brands only match if they use the same words, which is the problem the real model is meant to solve.
- The partner brands are made up. Real applications aren't matched against each other yet.
- It's one-sided. The partner brand is never asked, so there's no mutual opt-in yet.
- Every candidate goes into one AI prompt. Fine for 16 brands but not for hundreds.

The full list is in `docs/first-working-slice.md`.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000/match for the prototype (or use **Try the matcher** in the landing page menu). No keys are needed. To use the real model, add `ANTHROPIC_API_KEY` to `.env.local`.

Interested and Skip choices save to the `match_feedback` table in Supabase (`supabase/schema.sql`), or print in the terminal if Supabase isn't set up.

**Stack:** Next.js (App Router, TypeScript), Tailwind CSS v4, Zod, Supabase, Anthropic SDK.

# The landing page

The home page is the Loopedy landing page. Its main call to action is a brand application form that saves to Supabase. Until Supabase is set up, form submissions are printed in the terminal instead of saved.

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

## Ideas for later

- Email notification on each new application (e.g. Resend) inside `submitApplication`.
- Analytics: `@vercel/analytics` is a one-line add in `layout.tsx`.
- The matching app itself (brand profiles, swipe-to-match, auto-intro emails) can grow in this same project under new routes like `src/app/(app)/…`, reusing the Supabase setup.
