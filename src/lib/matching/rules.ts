import { formOptions } from "@/content/site";
import type { PoolBrand } from "@/content/sample-brands";
import type { Application } from "@/lib/application";

/**
 * Plain rules that run before the model sees anything.
 * They handle the cases where a rule is more reliable than an LLM.
 */

export type FounderInput = Pick<
  Application,
  "brand_name" | "website" | "category" | "monthly_orders" | "audience" | "formats" | "dream_partner"
>;

export type RemovedCandidate = { id: string; brand_name: string; reason: string };

const VAGUE_AUDIENCE = /\b(everyone|everybody|anyone|anybody|all ages|all people|people in general|general public)\b/i;

/** Max allowed gap between order-volume buckets (e.g. "Under 100" vs "2,000–10,000" is a gap of 3). */
const MAX_SIZE_GAP = 2;

/**
 * Catch applications that are too thin to match on, before spending a model call.
 * The model's own "enough detail" check backs this up for longer but still vague text.
 */
export function thinInputCheck(founder: FounderInput): { ok: true } | { ok: false; missing: string[] } {
  const words = founder.audience.trim().split(/\s+/).filter(Boolean);
  const missing: string[] = [];

  if (words.length < 8) missing.push("A fuller description of your typical customer (age, lifestyle, what they care about).");
  if (VAGUE_AUDIENCE.test(founder.audience) && words.length < 25) {
    missing.push("Who your customer is specifically. \"Everyone\" doesn't give us enough to find a partner with the same customer.");
  }
  if (!founder.category || founder.category === "Other") {
    if (words.length < 15) missing.push("What you sell, so we can rule out competitors.");
  }

  return missing.length ? { ok: false, missing } : { ok: true };
}

function sizeIndex(bucket?: string): number | null {
  if (!bucket) return null;
  const i = formOptions.monthlyOrders.indexOf(bucket);
  return i === -1 ? null : i;
}

function sameSite(a: string, b: string) {
  const host = (u: string) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      return u.toLowerCase();
    }
  };
  return host(a) === host(b);
}

/**
 * Remove candidates a rule can rule out with certainty:
 * the founder's own brand, the same category (direct competitors) and big size gaps.
 */
export function filterCandidates(founder: FounderInput, pool: PoolBrand[]) {
  const kept: PoolBrand[] = [];
  const removed: RemovedCandidate[] = [];
  const founderSize = sizeIndex(founder.monthly_orders);

  for (const c of pool) {
    if (sameSite(founder.website, c.website) || founder.brand_name.trim().toLowerCase() === c.brand_name.toLowerCase()) {
      removed.push({ id: c.id, brand_name: c.brand_name, reason: "This is your own brand." });
      continue;
    }
    if (founder.category && founder.category !== "Other" && c.category === founder.category) {
      removed.push({ id: c.id, brand_name: c.brand_name, reason: `Same category (${c.category}), likely a competitor.` });
      continue;
    }
    const cSize = sizeIndex(c.monthly_orders);
    if (founderSize !== null && cSize !== null && Math.abs(founderSize - cSize) > MAX_SIZE_GAP) {
      removed.push({
        id: c.id,
        brand_name: c.brand_name,
        reason: `Size gap too big (${founder.monthly_orders} vs ${c.monthly_orders} orders/month).`,
      });
      continue;
    }
    kept.push(c);
  }

  return { kept, removed };
}

/** Lowercase, straighten quotes and collapse whitespace so quote checks aren't tripped by formatting. */
export function normalise(s: string) {
  return s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[."',;:!?]+$/g, "")
    .replace(/^["']+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when the model's quote really appears in the source text (so the reason is grounded, not invented). */
export function quoteAppears(quote: string, source: string) {
  const q = normalise(quote);
  return q.length >= 3 && normalise(source).includes(q);
}
