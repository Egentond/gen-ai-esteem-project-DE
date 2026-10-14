# Loopedy Match

Loopedy matches small DTC brands with non-competing brands that already sell to the same customer, so they can run collabs (gift-with-purchase swaps, email cross-sells, joint giveaways) instead of both paying for ads to reach her.

This repo holds the first working slice of **Loopedy Match**, the part that finds the partners. It's my semester project for ESTM 60244.

## Try it

**[Open the live prototype](https://claude.ai/artifact/2Lc7H5mE5YNC6EGaevFbgf)**. It runs in the browser, with nothing to install.

1. The form opens with the **Clear fit** test case filled in. Press **Find my matches**.
2. Watch the five steps run, then look at the three partner brands, the reasons behind each one and the suggested collab.
3. Scroll to **Why other brands were left out** to see which brands the rules and the AI step removed, and why.
4. Try the **Competitor trap** and **Thin input** test cases, or press **Try another brand** and describe a brand of your own.

## What the slice does

A founder fills in the Loopedy application on the match page and gets back up to three partner brands that sell something different to the same kind of customer. Each match shows why the two brands fit, quoting both applications, plus a suggested collab format. The founder marks each one Interested or Skip and that choice is saved. That is the full loop from my problem framing, working end to end in the same Next.js app as the landing page.

Behind the form there are five steps. A simple rule catches applications that are too thin to match on. The model then builds a short profile of the brand and can also say there isn't enough detail. Plain rules remove the founder's own brand, brands in the same category and pairs with a big size gap. The model rates every brand left over, flags competitors and has to back each reason with exact quotes from both applications. Finally the code checks those quotes really appear in the text, drops anything that doesn't, and shows the top three. The pool is 16 sample brands I set up, some placed on purpose to trip it up.

**Wizard of Oz mode.** The prototype runs without an API key. In that mode the two AI steps are faked with simple keyword matching and a list of product words per category, so the flow can be clicked through for free. Everything else is the real code, and adding a key swaps in the real model with no other changes. The results page says which mode ran.

## Three test cases

All three are one click at the top of the live demo. They're also defined in `src/content/test-founders.ts`, with a runner in `scripts/test-slice.ts` that checks each one automatically.

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

## Where things are in the code

| What | Where |
| --- | --- |
| The five matching steps | `src/lib/matching/index.ts` |
| Thin-input, category and size rules, and the quote check | `src/lib/matching/rules.ts` |
| Prompts for the real model (steps 2 and 4) | `src/lib/matching/llm.ts` |
| Wizard of Oz stand-in for steps 2 and 4 | `src/lib/matching/wizard.ts` |
| The 16 sample partner brands | `src/content/sample-brands.ts` |
| The three test cases | `src/content/test-founders.ts` |
| Match page and results UI | `src/app/match/`, `src/components/match-client.tsx` |
| Where Interested and Skip choices are stored | `supabase/schema.sql` (`match_feedback` table) |

Built with Next.js (TypeScript), Tailwind CSS, Zod, Supabase and the Anthropic SDK. The repo also contains the Loopedy landing page, which collects brand applications.

## What's next

- Run steps 2 and 4 on the real model and compare its matches with the Wizard of Oz results on the same test cases.
- Match real applications from Supabase instead of the sample pool.
- Ask the partner brand too, and only share contact details when both say Interested.

