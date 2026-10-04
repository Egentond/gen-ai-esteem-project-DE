import { samplePool, type PoolBrand } from "@/content/sample-brands";
import type Anthropic from "@anthropic-ai/sdk";
import { getClient, profileBrand, rankCandidates, MODEL, type BrandProfile } from "./llm";
import { filterCandidates, quoteAppears, thinInputCheck, type FounderInput, type RemovedCandidate } from "./rules";

export type Match = {
  id: string;
  brand_name: string;
  website: string;
  category: string;
  product: string;
  fit: "high" | "medium";
  reasons: { point: string; founder_quote: string; partner_quote: string }[];
  suggested_format: string;
  format_why: string;
};

export type MatchResult =
  | { status: "needs_detail"; missing: string[]; caughtBy: "rules" | "model" }
  | {
      status: "ok";
      profile: BrandProfile;
      matches: Match[];
      removedByRules: RemovedCandidate[];
      removedByModel: RemovedCandidate[];
      model: string;
      ms: number;
    }
  | { status: "error"; message: string };

const MAX_MATCHES = 3;
const fitRank = { high: 0, medium: 1, low: 2 } as const;

/**
 * The whole slice: rules check → model profile → rules filter → model ranking → evidence check → top 3.
 */
export async function findMatches(
  founder: FounderInput,
  pool: PoolBrand[] = samplePool,
  client: Anthropic | null = getClient(),
): Promise<MatchResult> {
  const started = Date.now();

  // 1. Too thin to match? Ask for more instead of guessing. No model call needed.
  const thin = thinInputCheck(founder);
  if (!thin.ok) return { status: "needs_detail", missing: thin.missing, caughtBy: "rules" };

  const ai = client;
  if (!ai) {
    return { status: "error", message: "Matching isn't switched on yet. Add ANTHROPIC_API_KEY to .env.local and restart" };
  }

  try {
    // 2. Profile the founder's brand. The model can also say "not enough detail".
    const profile = await profileBrand(ai, founder);
    if (!profile.enough_detail) {
      return { status: "needs_detail", missing: profile.missing.length ? profile.missing : ["More about who your customer is."], caughtBy: "model" };
    }

    // 3. Rules remove own brand, same category and big size gaps.
    const { kept, removed: removedByRules } = filterCandidates(founder, pool);
    if (kept.length === 0) {
      return { status: "ok", profile, matches: [], removedByRules, removedByModel: [], model: MODEL, ms: Date.now() - started };
    }

    // 4. Model rates every remaining candidate.
    const ranked = await rankCandidates(ai, founder, profile, kept);

    // 5. Keep only non-competing, medium-or-better matches whose reasons quote real text.
    const byId = new Map(kept.map((c) => [c.id, c]));
    const founderText = [founder.audience, founder.dream_partner ?? ""].join(" ");
    const removedByModel: RemovedCandidate[] = [];
    const matches: Match[] = [];

    for (const r of ranked.candidates) {
      const c = byId.get(r.id);
      if (!c) continue; // model invented an id
      if (r.competes) {
        removedByModel.push({ id: c.id, brand_name: c.brand_name, reason: `Competitor: ${r.competes_reason}` });
        continue;
      }
      if (r.fit === "low") continue;

      const partnerText = `${c.audience} ${c.product}`;
      const grounded = r.reasons.filter((x) => quoteAppears(x.founder_quote, founderText) && quoteAppears(x.partner_quote, partnerText));
      if (grounded.length === 0) {
        removedByModel.push({ id: c.id, brand_name: c.brand_name, reason: "Dropped: none of the model's reasons quoted the applications accurately." });
        continue;
      }

      matches.push({
        id: c.id,
        brand_name: c.brand_name,
        website: c.website,
        category: c.category,
        product: c.product,
        fit: r.fit,
        reasons: grounded,
        suggested_format: r.suggested_format,
        format_why: r.format_why,
      });
    }

    matches.sort((a, b) => fitRank[a.fit] - fitRank[b.fit] || b.reasons.length - a.reasons.length);

    return {
      status: "ok",
      profile,
      matches: matches.slice(0, MAX_MATCHES),
      removedByRules,
      removedByModel,
      model: MODEL,
      ms: Date.now() - started,
    };
  } catch (err) {
    console.error("[loopedy] Matching failed:", err);
    return { status: "error", message: "Matching failed on our side. Please try again in a moment." };
  }
}
