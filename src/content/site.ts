/**
 * All landing page copy lives here.
 * Edit text in this file — the components just render it.
 */

export const site = {
  name: "Loopedy",
  url: "https://www.loopedy.com",
  contactEmail: "hello@loopedy.com", // TODO: confirm this inbox exists
  tagline: "Grow with the brands your customers already love.",
  description:
    "Loopedy pairs non-competing DTC brands with overlapping audiences for collabs that pay off on both sides.",
};

export const nav = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Collabs", href: "#collabs" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  eyebrow: "The brand co-op for DTC founders",
  title: "Grow with the brands your customers already love.",
  body: "Loopedy matches you with non-competing brands that sell to the same people you do. Swap audiences through gift-with-purchase, email cross-sells and giveaways, instead of both paying Meta to reach the same customer.",
  primaryCta: { label: "Apply to be matched", href: "#apply" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  note: "We're hand-matching a small group of brands right now.",
};

export const problem = {
  eyebrow: "The problem",
  title: "You're paying to reach a customer another brand already has.",
  points: [
    {
      title: "Same customer, paid for twice",
      body: "Your customer also buys from a handful of brands that don't compete with you. Each of you pays Meta separately to find them.",
    },
    {
      title: "Collabs are hard to set up",
      body: "Finding a partner with the right audience, price point and positioning takes a lot of cold DMs, and most never go anywhere.",
    },
    {
      title: "Value is rarely equal",
      body: "When one brand is much bigger, a straight list swap feels lopsided, so good partnerships stall before they start.",
    },
  ],
};

export const steps = {
  eyebrow: "How it works",
  title: "From application to a live collab, without the cold outreach.",
  items: [
    {
      title: "Tell us about your brand",
      body: "A two-minute application: what you sell, who buys it, and what kind of collab you'd be up for.",
    },
    {
      title: "We find your match",
      body: "We look for brands with a similar customer, price point and positioning, but a different product. No competitors.",
    },
    {
      title: "Meet and plan the collab",
      body: "We make the intro and help you both agree on a format, what each side puts in, and what each side gets out.",
    },
    {
      title: "Run it and measure it",
      body: "Launch the collab and track what it brought in on both sides, so you know whether to do it again.",
    },
  ],
};

export const collabs = {
  eyebrow: "Collab formats",
  title: "Pick the format that fits your brands.",
  items: [
    {
      title: "Gift-with-purchase swap",
      body: "Your product goes in their boxes, theirs goes in yours. Costed as marketing spend, not discounts.",
    },
    {
      title: "Email & SMS cross-sell",
      body: "Each brand features the other to its list, with an offer made for that audience.",
    },
    {
      title: "Joint giveaway",
      body: "Pool products into one prize and grow both followings from the same campaign.",
    },
    {
      title: "Shared gift vouchers",
      body: "Hand your customers a voucher for your partner, and they do the same for you.",
    },
    {
      title: "Co-branded bundle",
      body: "A limited bundle that sells both products to both audiences.",
    },
    {
      title: "Joint events",
      body: "Pop-ups, live sessions or community events co-hosted with a partner brand.",
    },
  ],
};

export const fairness = {
  eyebrow: "Fair on both sides",
  title: "Bigger brand, smaller brand, it still has to work for both.",
  body: "We match on fit first. When one side brings a much bigger audience, we balance it, for example with a fee for each new customer the smaller brand receives, so neither side feels short-changed.",
  criteria: ["Customer demographics", "Price point", "Brand positioning", "Audience size", "Non-competing products"],
};

export const faq = [
  {
    q: "What does it cost?",
    a: "Nothing while we're running the pilot. We want to prove the collabs are worth it before we talk about pricing.",
  },
  {
    q: "Will you match me with a competitor?",
    a: "No. We only match brands that sell different products to a similar customer.",
  },
  {
    q: "Do I have to share my customer list?",
    a: "No. Most formats, like gift-with-purchase or a cross-sell email, never involve handing data to the other brand. You stay in control of your list.",
  },
  {
    q: "What size brands is this for?",
    a: "DTC brands with an engaged customer base, from early-stage to well established. Size differences are fine, we balance the value.",
  },
  {
    q: "How long until I get matched?",
    a: "We review every application by hand and reach out once we have a partner we think is a strong fit.",
  },
];

export const apply = {
  eyebrow: "Apply",
  title: "Find your first partner brand.",
  body: "Tell us a bit about your brand. We read every application and reach out personally when we have a strong match.",
  success: {
    title: "Thanks, you're on our list.",
    body: "We'll review your brand and get in touch by email when we have a match we think you'll like.",
  },
};

/** Options for the application form. Edit freely — values are stored as-is. */
export const formOptions = {
  categories: [
    "Beauty & cosmetics",
    "Skincare",
    "Fragrance",
    "Jewellery & accessories",
    "Fashion & apparel",
    "Activewear",
    "Health & nutrition",
    "Food & beverage",
    "Pets & animals",
    "Home & living",
    "Bed & bath",
    "Baby & kids",
    "Outdoor & sport",
    "Other",
  ],
  monthlyOrders: ["Under 100", "100–500", "500–2,000", "2,000–10,000", "10,000+"],
  roles: ["Founder / co-founder", "Marketing", "Partnerships", "Other"],
  formats: collabs.items.map((c) => c.title),
};
