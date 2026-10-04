import type { Application } from "@/lib/application";

/**
 * Seeded pool of sample brands for the first working slice.
 * These are made up for testing. Real applications will replace them once
 * there are enough in Supabase.
 */
export type PoolBrand = Pick<
  Application,
  "brand_name" | "website" | "category" | "monthly_orders" | "audience" | "formats"
> & { id: string; product: string };

export const samplePool: PoolBrand[] = [
  {
    id: "studio-form",
    brand_name: "Studio Form",
    website: "https://studioform.example",
    category: "Activewear",
    monthly_orders: "500–2,000",
    product: "Pilates and barre leggings, sports bras and grip socks",
    audience:
      "Women 28 to 40 who go to boutique Pilates and barre classes three times a week. They care about clean, low-tox products, follow wellness creators and will pay more for things that look good and last.",
    formats: ["Gift-with-purchase swap", "Email & SMS cross-sell", "Joint giveaway"],
  },
  {
    id: "dorm-glow",
    brand_name: "Dorm Glow",
    website: "https://dormglow.example",
    category: "Home & living",
    monthly_orders: "500–2,000",
    product: "Cheap soy candles and LED fairy lights",
    audience:
      "College students 18 to 22 decorating dorm rooms on a tight budget. Mostly buy around back-to-school and holidays, find us on TikTok, very price sensitive.",
    formats: ["Joint giveaway", "Shared gift vouchers"],
  },
  {
    id: "barrier-lab",
    brand_name: "Barrier Lab",
    website: "https://barrierlab.example",
    category: "Beauty & cosmetics",
    monthly_orders: "500–2,000",
    product: "Ceramide serums and moisturisers for sensitive, reactive faces",
    audience:
      "Women 27 to 40 with sensitive or reactive faces who read every ingredient list, avoid fragrance, and want a short routine that repairs their moisture barrier. Premium price point.",
    formats: ["Email & SMS cross-sell", "Co-branded bundle"],
  },
  {
    id: "stillwater-tea",
    brand_name: "Stillwater Tea",
    website: "https://stillwatertea.example",
    category: "Food & beverage",
    monthly_orders: "100–500",
    product: "Organic loose-leaf herbal teas for sleep and stress",
    audience:
      "Women 30 to 45 into slow mornings, yoga and wellness routines. Buy organic, care about ingredients, gift tea to friends. Mid to premium price.",
    formats: ["Gift-with-purchase swap", "Co-branded bundle", "Email & SMS cross-sell"],
  },
  {
    id: "linen-and-rest",
    brand_name: "Linen & Rest",
    website: "https://linenandrest.example",
    category: "Bed & bath",
    monthly_orders: "100–500",
    product: "Washed linen pyjamas and pillowcases",
    audience:
      "Professional women 30 to 50 who invest in their sleep and home. Natural fabrics, neutral colours, premium price, lots of gift purchases for mothers and friends.",
    formats: ["Shared gift vouchers", "Co-branded bundle", "Email & SMS cross-sell"],
  },
  {
    id: "pawsome-bites",
    brand_name: "Pawsome Bites",
    website: "https://pawsomebites.example",
    category: "Pets & animals",
    monthly_orders: "2,000–10,000",
    product: "Single-ingredient dog treats",
    audience:
      "Dog owners in their 30s who treat their dog like family, buy natural pet food and post their dog on Instagram. Mixed men and women, suburban.",
    formats: ["Joint giveaway", "Gift-with-purchase swap"],
  },
  {
    id: "gainz-bar",
    brand_name: "Gainz Bar",
    website: "https://gainzbar.example",
    category: "Health & nutrition",
    monthly_orders: "2,000–10,000",
    product: "High-protein snack bars",
    audience:
      "Men 18 to 30 who lift weights, track macros and follow gym influencers. Buy in bulk and look for the best protein per dollar.",
    formats: ["Joint giveaway", "Email & SMS cross-sell"],
  },
  {
    id: "little-sprout",
    brand_name: "Little Sprout",
    website: "https://littlesprout.example",
    category: "Baby & kids",
    monthly_orders: "500–2,000",
    product: "Organic cotton baby clothes",
    audience:
      "New and expecting parents, mostly mothers 28 to 38, who want organic, non-toxic fabrics for their baby. Shop baby registries and gift for baby showers.",
    formats: ["Gift-with-purchase swap", "Shared gift vouchers"],
  },
  {
    id: "trailhead-socks",
    brand_name: "Trailhead Socks",
    website: "https://trailheadsocks.example",
    category: "Outdoor & sport",
    monthly_orders: "100–500",
    product: "Merino trail running socks",
    audience:
      "Trail runners and hikers 25 to 45, mostly men, who sign up for ultra races and care about gear that lasts. Premium price, very loyal once they find a sock that works.",
    formats: ["Joint giveaway", "Co-branded bundle"],
  },
  {
    id: "fine-line-jewellery",
    brand_name: "Fine Line",
    website: "https://fineline.example",
    category: "Jewellery & accessories",
    monthly_orders: "500–2,000",
    product: "Minimal gold-vermeil everyday jewellery",
    audience:
      "Women 25 to 38 with a clean, minimal style who buy small treats for themselves and gifts for friends. Follow lifestyle and wellness creators on Instagram.",
    formats: ["Joint giveaway", "Shared gift vouchers", "Email & SMS cross-sell"],
  },
  {
    id: "mossy-home",
    brand_name: "Mossy Home",
    website: "https://mossyhome.example",
    category: "Home & living",
    monthly_orders: "100–500",
    product: "Refillable plant-based cleaning sprays",
    audience:
      "Eco-conscious households, mostly women 30 to 50, who want non-toxic cleaning products and less plastic. Subscribe for refills.",
    formats: ["Gift-with-purchase swap", "Email & SMS cross-sell"],
  },
  {
    id: "pixel-grip",
    brand_name: "Pixel Grip",
    website: "https://pixelgrip.example",
    category: "Other",
    monthly_orders: "2,000–10,000",
    product: "Controller grips and gaming accessories",
    audience:
      "Teenage and young adult gamers, mostly boys 14 to 24, who watch Twitch streamers and buy cheap upgrades for their setup.",
    formats: ["Joint giveaway"],
  },
  {
    id: "noon-kombucha",
    brand_name: "Noon Kombucha",
    website: "https://noonkombucha.example",
    category: "Food & beverage",
    monthly_orders: "Under 100",
    product: "Small-batch kombucha delivered locally",
    audience:
      "Health-conscious 25 to 40 year olds in the city who go to yoga and farmers markets and like supporting local makers.",
    formats: ["Joint events", "Joint giveaway"],
  },
  {
    id: "silk-hour",
    brand_name: "Silk Hour",
    website: "https://silkhour.example",
    category: "Bed & bath",
    monthly_orders: "10,000+",
    product: "Mulberry silk eye masks and scrunchies",
    audience:
      "Women 22 to 40 who care about skin and hair, buy beauty sleep products and treat themselves. Very big Instagram and TikTok following.",
    formats: ["Gift-with-purchase swap", "Co-branded bundle", "Joint giveaway"],
  },
  {
    id: "fresh-face-co",
    brand_name: "Fresh Face Co",
    website: "https://freshface.example",
    category: "Skincare",
    monthly_orders: "100–500",
    product: "Natural cleansers and face oils",
    audience:
      "Women 25 to 40 looking for a simple natural skincare routine with clean ingredients. Mid-premium price.",
    formats: ["Email & SMS cross-sell", "Gift-with-purchase swap"],
  },
];
