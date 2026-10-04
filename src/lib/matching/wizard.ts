import type { PoolBrand } from "@/content/sample-brands";
import type { BrandProfile, RankOutput } from "./llm";
import type { FounderInput } from "./rules";

/**
 * Wizard of Oz mode.
 *
 * Stands in for the two model calls with simple keyword logic, so the prototype can be
 * clicked through end to end without an API key. Everything around it (thin-input rule,
 * category and size rules, quote check, top 3, interested/skip) is the real code.
 *
 * On by default when ANTHROPIC_API_KEY isn't set. Force it with LOOPEDY_WIZARD=1.
 */

export const WIZARD_LABEL = "Wizard of Oz mode (AI step simulated)";

export function wizardOn() {
  return process.env.LOOPEDY_WIZARD === "1" || !process.env.ANTHROPIC_API_KEY;
}

const STOP = new Set(
  "about after also and are around back been buy buys care cares does every find for from have into just like lots more most mostly much only other over really than that the their them then they they'll this those very want wants what when which while who will with would year years your actually works things look good last times week will".split(
    " ",
  ),
);

/** Demographic words count for less, since half the pool says "women". */
const WEAK = new Set(["women", "men", "mostly", "people", "customers"]);

/** Price words help as a tiebreaker but say nothing about who the customer is. */
const PRICE = new Set(["premium", "price", "luxury", "budget"]);

/** Product words per category, used to spot competitors that filed under a different category. */
const PRODUCT_FAMILIES: Record<string, string[]> = {
  skin: ["skin", "serum", "moistur", "cleanser", "face", "faces", "ceramide", "spf", "toner"],
  drink: ["tea", "coffee", "kombucha", "juice", "drink", "beverage"],
  apparel: ["leggings", "apparel", "clothing", "clothes", "bras", "wear", "pyjamas"],
  home: ["candle", "candles", "decor", "cleaning", "diffuser"],
  pet: ["dog", "cat", "pet", "treats"],
  jewellery: ["jewellery", "jewelry", "necklace", "earrings", "rings"],
};

const CATEGORY_FAMILY: Record<string, string> = {
  Skincare: "skin",
  "Beauty & cosmetics": "skin",
  "Food & beverage": "drink",
  "Health & nutrition": "drink",
  Activewear: "apparel",
  "Fashion & apparel": "apparel",
  "Home & living": "home",
  "Pets & animals": "pet",
  "Jewellery & accessories": "jewellery",
};

const VALUE_WORDS = [
  "clean",
  "non-toxic",
  "organic",
  "natural",
  "wellness",
  "sustainable",
  "fragrance-free",
  "premium",
  "gifts",
  "ingredients",
  "eco-conscious",
  "local",
  "budget",
];

const tokens = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9'\- ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP.has(w) && !/^\d+$/.test(w));

/** A few words of the original text around a keyword, copied exactly so the quote check passes. */
function phraseAround(text: string, word: string) {
  const words = text.split(/\s+/);
  const i = words.findIndex((w) => w.toLowerCase().replace(/[^a-z0-9'\-]/g, "") === word);
  if (i === -1) return word;
  return words
    .slice(Math.max(0, i - 2), i + 3)
    .join(" ")
    .replace(/[.,;:!?]+$/, "");
}

/** Shared words that make a good, readable reason, with how to say them. */
const INTERESTS: Record<string, string> = {
  pilates: "are into Pilates",
  yoga: "are into yoga",
  barre: "are into barre",
  wellness: "are into wellness",
  creators: "follow wellness creators",
  clean: "want clean products",
  "non-toxic": "want non-toxic products",
  organic: "buy organic",
  natural: "prefer natural products",
  ingredients: "care what goes into their products",
  label: "read every label",
  "fragrance-free": "avoid fragrance",
  irritated: "have easily irritated skin",
  sensitive: "have sensitive skin",
  gifts: "buy a lot of gifts",
  gift: "buy a lot of gifts",
  sleep: "care about their sleep",
  repeat: "buy again and again",
  "eco-conscious": "try to cut down on waste",
  students: "are students",
  dogs: "are dog people",
  dog: "are dog people",
  trail: "spend time outdoors",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function wizardProfile(f: FounderInput): Promise<BrandProfile> {
  await sleep(600);
  const text = f.audience.toLowerCase();
  const firstSentence = f.audience.split(/(?<=[.!?])\s/)[0].replace(/\.$/, "");
  const price_tier = /premium|pay more|luxury|invest/.test(text)
    ? "premium"
    : /budget|cheap|price sensitive|affordable/.test(text)
      ? "budget"
      : "mid";
  return {
    enough_detail: true,
    missing: [],
    product: f.category === "Other" ? "Products" : f.category,
    customer: firstSentence,
    price_tier,
    values: VALUE_WORDS.filter((v) => text.includes(v)).slice(0, 4),
  };
}

export async function wizardRank(f: FounderInput, candidates: PoolBrand[]): Promise<RankOutput> {
  await sleep(900);
  const founderWords = new Set(tokens(f.audience));
  const family = PRODUCT_FAMILIES[CATEGORY_FAMILY[f.category] ?? ""] ?? [];

  return {
    candidates: candidates.map((c) => {
      const productText = c.product.toLowerCase();
      const hit = family.find((w) => productText.includes(w));
      const shared = [...new Set(tokens(`${c.audience} ${c.product}`))].filter((w) => founderWords.has(w));
      const customerWords = shared.filter((w) => !WEAK.has(w) && !PRICE.has(w));
      const score = shared.reduce((s, w) => s + (WEAK.has(w) || PRICE.has(w) ? 0.5 : 1), 0);
      // No real customer overlap means no match, however similar the price.
      const fit = customerWords.length === 0 ? "low" : score >= 3 ? "high" : score >= 2 ? "medium" : "low";
      const readable = customerWords.filter((w) => w in INTERESTS);
      const strong = (readable.length ? readable : customerWords).slice(0, 2);
      const both = f.formats.filter((x) => c.formats.includes(x));
      const format = (both[0] ?? c.formats[0] ?? "Email & SMS cross-sell") as RankOutput["candidates"][number]["suggested_format"];

      return {
        id: c.id,
        competes: Boolean(hit),
        competes_reason: hit ? `They sell ${c.product.toLowerCase()}, which your customer could buy instead of yours.` : "",
        fit,
        reasons: strong.map((w) => ({
          point: w in INTERESTS ? `Both of your customers ${INTERESTS[w]}.` : "You describe your customers in a very similar way.",
          founder_quote: phraseAround(f.audience, w),
          partner_quote: phraseAround(`${c.audience} ${c.product}`, w),
        })),
        suggested_format: format,
        format_why: both.length
          ? "You both said you'd be up for this one."
          : "It's the format they're most open to, and it's easy to start with.",
      };
    }),
  };
}
