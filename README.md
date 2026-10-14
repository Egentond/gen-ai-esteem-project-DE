# Loopedy Match

Loopedy matches small DTC brands with non-competing brands that already sell to the same customer, so they can run collabs (gift-with-purchase swaps, email cross-sells, joint giveaways) instead of both paying for ads to reach her.

This repo holds the Loopedy landing page and the first working slice of **Loopedy Match**, the part that finds the partners. It's my semester project for ESTM 60244.

**Live demo:** [Try the Loopedy Match prototype](https://claude.ai/artifact/2Lc7H5mE5YNC6EGaevFbgf)

## What the slice does

A founder fills in the Loopedy application on the new /match page and gets back up to three partner brands that sell something different to the same kind of customer. Each match shows why the two brands fit, quoting both applications, plus a suggested collab format. The founder marks each one Interested or Skip and that choice is saved. That is the full loop from my problem framing, working end to end in the same Next.js app as the landing page.

Behind the form there are five steps. A simple rule catches applications that are too thin to match on. The model then builds a short profile of the brand and can also say there isn't enough detail. Plain rules remove the founder's own brand, brands in the same category and pairs with a big size gap. The model rates every brand left over, flags competitors and has to back each reason with exact quotes from both applications. Finally the code checks those quotes really appear in the text, drops anything that doesn't, and shows the top three. The pool is 16 sample brands I set up, some placed on purpose to trip it up.

**Wizard of Oz mode.** The prototype runs without an API key. In that mode the two AI steps are faked with simple keyword matching and a list of product words per category, so the flow can be clicked through for free. Everything else is the real code, and adding a key swaps in the real model with no other changes. The results page says which mode ran.

## Three test cases

All three are in the repo and run with `npm run test:slice`, which also writes the full output to docs/test-results.md. They're one click on the /match page too.

| Test | Input | Passes when | Result |
| --- | --- | --- | --- |
| 1. Clear fit | Clean skincare brand whose customer goes to Pilates and yoga | Studio Form (Pilates apparel) is matched. Dorm Glow (student candles) and both skincare brands are not. | Pass. Matched Studio Form, Stillwater Tea and Fine Line. |
| 2. Competitor trap | Fragrance-free skincare for sensitive faces | Barrier Lab is kept out. It sells sensitive skin serums but filed under a different category in different words, so only the model can catch it. | Pass. Barrier Lab flagged as a competitor. Matched Gentle Wash instead. |
| 3. Thin input | "we sell cool stuff to everyone" | The app asks for more detail and shows no matches. | Pass. Caught by the rule before any model call. |

These results are from Wizard of Oz mode, so tests 1 and 2 show the pipeline and rules working around a simulated AI step. I also checked the filtering code with a fake model response. A competitor flagged by the model was removed, I threw out a reason with a made up quote, a low fit was dropped and I ignored an invented brand.

## Known limitations

- The AI step is simulated by default. Keyword matching only links brands that use the same words, which is the exact problem the real model is meant to solve.
- The 16 candidate brands are made up and live in the code. Real applications in Supabase aren't matched against each other yet.
- Every candidate goes into one ranking prompt. Fine for 16 brands, but slow and expensive at a few hundred, so it would need a cheaper pre-filter first.
- It's one-sided. The founder sees partners but the partner is never asked, so there's no mutual opt-in or contact sharing yet.
- The model isn't deterministic, so the same application can get slightly different matches between runs. I haven't measured how much yet.
- The category rule only catches exact matches. A competitor in a neighbouring category, or one that picks Other, relies entirely on the model.
- The quote check proves the words exist, not that the argument is good. A reason can quote real text and still be weak.
- The thin input rule is just a word count and a list of vague words. A long but empty description gets past it and relies on the model.
- The size rule drops pairs more than two order buckets apart, even though a per-customer fee could make some of those work.
- There are no accounts, so feedback is tied to an email nobody has verified.

## AI use record

I used Claude to lay out the job-to-be-done for this assignment and clean up and advise on code that built the slice described above. It helped me come up with useful test cases, and figure out possible edge cases that may come up in testing. Assisted in writing the code. The parts that need the most watching are the competitor check and how consistent the ratings are between runs.

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
