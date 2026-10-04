import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { formOptions } from "@/content/site";
import type { PoolBrand } from "@/content/sample-brands";
import type { FounderInput } from "./rules";

export const MODEL = process.env.LOOPEDY_MODEL || "claude-sonnet-5-5";

let client: Anthropic | null = null;
export function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic();
  return client;
}

/* ---------- Step 1: profile the founder's brand ---------- */

export const profileSchema = z.object({
  enough_detail: z.boolean(),
  missing: z.array(z.string()),
  product: z.string(),
  customer: z.string(),
  price_tier: z.enum(["budget", "mid", "premium", "unclear"]),
  values: z.array(z.string()),
});
export type BrandProfile = z.infer<typeof profileSchema>;

const PROFILE_SYSTEM = `You turn a DTC brand's partner application into a short profile used to find collab partners.

Rules:
- Use only what the application says. Do not guess at facts it doesn't state.
- "product" is what the brand actually sells, in a few words.
- "customer" is one sentence on who buys it (age, lifestyle, what they care about).
- "values" are 2-4 short phrases the customer cares about, taken from the text.
- Set enough_detail to false if the customer description is too vague to tell who the customer is
  (for example "everyone", "people who like nice things"). Then list in "missing" what to ask the founder for.
- If enough_detail is true, "missing" is an empty list.`;

export async function profileBrand(ai: Anthropic, founder: FounderInput): Promise<BrandProfile> {
  const msg = await ai.messages.parse({
    model: MODEL,
    max_tokens: 1000,
    system: PROFILE_SYSTEM,
    messages: [{ role: "user", content: formatFounder(founder) }],
    output_config: { format: zodOutputFormat(profileSchema) },
  });
  if (!msg.parsed_output) throw new Error("Profile step returned no structured output.");
  return msg.parsed_output;
}

/* ---------- Step 2: rate every remaining candidate ---------- */

const formatEnum = z.enum(formOptions.formats as [string, ...string[]]);

export const rankSchema = z.object({
  candidates: z.array(
    z.object({
      id: z.string(),
      competes: z.boolean(),
      competes_reason: z.string(),
      fit: z.enum(["high", "medium", "low"]),
      reasons: z.array(
        z.object({
          point: z.string(),
          founder_quote: z.string(),
          partner_quote: z.string(),
        }),
      ),
      suggested_format: formatEnum,
      format_why: z.string(),
    }),
  ),
});
export type RankOutput = z.infer<typeof rankSchema>;

const RANK_SYSTEM = `You match a DTC founder with partner brands for audience-sharing collabs (gift-with-purchase swaps, email cross-sells, giveaways and so on).

A good partner sells a DIFFERENT product to the SAME kind of customer at a similar price point and positioning.

For every candidate:
1. competes: true if the candidate sells something the founder's customer would buy INSTEAD of the founder's product,
   even if the two brands describe it in different words or picked different categories
   (e.g. "barrier-repair serums" competes with "clean moisturisers"). Explain in competes_reason.
2. fit: "high" only if the customers clearly overlap AND the price point fits. "medium" for partial overlap. "low" otherwise.
   Customer overlap matters most. A shared product category with a different customer is still "low".
3. reasons: 1-3 short reasons. Each reason MUST include an exact quote copied word for word from the founder's
   customer description (founder_quote) and from the candidate's customer description (partner_quote) that support it.
   Copy the quote exactly, a few words is enough. Never paraphrase inside a quote.
4. suggested_format: pick the collab format that fits best, preferring formats both brands said they'd do. Say why in format_why.

Return every candidate id you were given, exactly once. Write reasons in plain, friendly English for a busy founder.`;

export async function rankCandidates(
  ai: Anthropic,
  founder: FounderInput,
  profile: BrandProfile,
  candidates: PoolBrand[],
): Promise<RankOutput> {
  const list = candidates
    .map(
      (c) =>
        `<candidate id="${c.id}">\nBrand: ${c.brand_name}\nCategory: ${c.category}\nSells: ${c.product}\nOrders/month: ${c.monthly_orders ?? "unknown"}\nCustomer: ${c.audience}\nOpen to: ${c.formats.join(", ") || "anything"}\n</candidate>`,
    )
    .join("\n\n");

  const msg = await ai.messages.parse({
    model: MODEL,
    max_tokens: 6000,
    system: RANK_SYSTEM,
    messages: [
      {
        role: "user",
        content: `<founder>\n${formatFounder(founder)}\n</founder>\n\n<founder_profile>\nSells: ${profile.product}\nCustomer: ${profile.customer}\nPrice tier: ${profile.price_tier}\nValues: ${profile.values.join(", ")}\n</founder_profile>\n\n<candidates>\n${list}\n</candidates>`,
      },
    ],
    output_config: { format: zodOutputFormat(rankSchema) },
  });
  if (!msg.parsed_output) throw new Error("Ranking step returned no structured output.");
  return msg.parsed_output;
}

function formatFounder(f: FounderInput) {
  return [
    `Brand: ${f.brand_name}`,
    `Website: ${f.website}`,
    `Category: ${f.category}`,
    `Orders/month: ${f.monthly_orders ?? "not given"}`,
    `Customer description: ${f.audience}`,
    `Open to: ${f.formats.length ? f.formats.join(", ") : "not given"}`,
    f.dream_partner ? `Dream partner: ${f.dream_partner}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
