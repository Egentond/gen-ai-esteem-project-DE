import type { Application } from "@/lib/application";

/**
 * The three test cases for the first working slice.
 * Used by `npm run test:slice` and as "try an example" buttons on /match.
 */
export type TestCase = {
  key: string;
  name: string;
  checks: string;
  founder: Application;
  /** Pool ids that must appear in the matches. */
  mustInclude?: string[];
  /** Pool ids that must NOT appear in the matches. */
  mustExclude?: string[];
  /** True when the slice should ask for more detail instead of matching. */
  expectNeedsDetail?: boolean;
};

export const testCases: TestCase[] = [
  {
    key: "clear-fit",
    name: "Clear fit",
    checks: "A clean-skincare brand gets the Pilates apparel brand, not the student candle brand.",
    founder: {
      brand_name: "Pure Ritual",
      website: "https://pureritual.example",
      contact_name: "Test Founder",
      email: "test+clearfit@loopedy.example",
      role: "Founder / co-founder",
      category: "Skincare",
      monthly_orders: "100–500",
      audience:
        "Women 28 to 40 who care about clean, non-toxic ingredients, go to Pilates and yoga classes and follow wellness creators. They'll pay more for a simple routine that actually works.",
      formats: ["Gift-with-purchase swap", "Email & SMS cross-sell"],
      dream_partner: undefined,
    },
    mustInclude: ["studio-form"],
    mustExclude: ["dorm-glow", "fresh-face-co", "barrier-lab"],
  },
  {
    key: "competitor-trap",
    name: "Competitor trap",
    checks:
      "A skincare brand is never matched with Barrier Lab, a skincare brand that filed under a different category and describes itself in different words.",
    founder: {
      brand_name: "Daily Dew",
      website: "https://dailydew.example",
      contact_name: "Test Founder",
      email: "test+competitor@loopedy.example",
      role: "Founder / co-founder",
      category: "Skincare",
      monthly_orders: "500–2,000",
      audience:
        "Women in their late 20s and 30s with easily irritated faces who check every label, want fragrance-free products and a short routine. Premium price, lots of repeat buyers.",
      formats: ["Email & SMS cross-sell", "Co-branded bundle"],
      dream_partner: undefined,
    },
    mustExclude: ["barrier-lab", "fresh-face-co"],
  },
  {
    key: "thin-input",
    name: "Thin input",
    checks: "A vague application gets asked for more detail instead of confident matches.",
    founder: {
      brand_name: "Cool Co",
      website: "https://coolco.example",
      contact_name: "Test Founder",
      email: "test+thin@loopedy.example",
      role: undefined,
      category: "Other",
      monthly_orders: undefined,
      audience: "we sell cool stuff to everyone",
      formats: [],
      dream_partner: undefined,
    },
    expectNeedsDetail: true,
  },
];
