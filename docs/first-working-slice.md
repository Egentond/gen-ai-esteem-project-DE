# First working slice: Loopedy Match

**Flow:** application form at `/match` → thin-input rule → model builds a profile → rules filter the pool → model rates every candidate and quotes both applications → quote check → top three matches with Interested / Skip saved.

## Wizard of Oz mode

The prototype doesn't need to run the real model. Without an API key, the two AI steps (profiling the brand and rating candidates) are faked by `src/lib/matching/wizard.ts` using shared keywords and a list of product words per category. The thin-input rule, category and size rules, quote check, top 3 and Interested / Skip are all real code either way. Set `ANTHROPIC_API_KEY` to swap in the real model with no other changes.

## Test cases

Defined in `src/content/test-founders.ts`, run with `npm run test:slice`. Results land in `docs/test-results.md`.

| Test | Input | Passes when |
| --- | --- | --- |
| Clear fit | Clean skincare brand, customer into Pilates and yoga | Studio Form (Pilates apparel) is matched. Dorm Glow (student candles), Fresh Face Co and Barrier Lab (skincare) are not. |
| Competitor trap | Fragrance-free skincare for sensitive faces | Barrier Lab is kept out. It sells sensitive-skin serums but filed under "Beauty & cosmetics" with different wording, so only the model can catch it. |
| Thin input | "we sell cool stuff to everyone" | The app asks for more detail and shows no matches. |

## Known limitations

- **Simulated AI by default.** In Wizard of Oz mode the matching is keyword overlap, not understanding. "Pilates" and "barre" only match if both brands use the same word, which is exactly the problem the real model is meant to solve.
- **Fake pool.** The 16 candidate brands are made up and live in code. Real applications from Supabase aren't matched against each other yet.
- **Doesn't scale past a small pool.** Every candidate goes into one ranking prompt. That's fine for 15 brands but slow and expensive at a few hundred. It would need a cheap pre-filter (embeddings or tags) first.
- **One-sided.** The founder sees partners, but the partner is never asked. There's no mutual opt-in or contact sharing yet.
- **Ratings can drift between runs.** The model isn't deterministic, so the same application can get slightly different matches. Not measured yet.
- **Competitor check leans on the model.** The category rule only catches exact category matches. A brand that picks "Other" or a neighbouring category gets through to the model, which is the only thing standing between two competitors.
- **The quote check proves the words exist, not that the logic is right.** A reason can quote real text and still be a weak argument.
- **Thin-input rule is crude.** It's a word count and a list of vague words. A long but empty description passes it and relies on the model's own "not enough detail" check.
- **Size rule is blunt.** It drops pairs more than two order-volume buckets apart, even though a per-customer fee could make some of those work.
- **No accounts.** Feedback is keyed to an email that isn't verified, so anyone could submit as anyone.
- **Real mode needs an Anthropic API key.** Each match costs two model calls.
