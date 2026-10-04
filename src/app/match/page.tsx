import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Logo } from "@/components/ui";
import { MatchClient } from "@/components/match-client";
import { testCases } from "@/content/test-founders";

export const metadata: Metadata = {
  title: "Find your partner brands · Loopedy",
};

/** Matching can take a couple of model calls. */
export const maxDuration = 60;

export default async function MatchPage({ searchParams }: { searchParams: Promise<{ example?: string }> }) {
  const { example } = await searchParams;
  const preset = testCases.find((t) => t.key === example);

  return (
    <>
      <header className="border-b border-line/70 bg-cream/85">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="Loopedy home">
            <Logo />
          </Link>
          <span className="text-sm font-medium text-muted">Matching prototype</span>
        </Container>
      </header>
      <main className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <Eyebrow>Loopedy Match</Eyebrow>
          <h1 className="font-display mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            Find brands that already sell to your customer.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Tell us about your brand and we&apos;ll suggest up to three non-competing partners, with the reasons behind each one.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Try a test case:</span>
            {testCases.map((t) => (
              <a
                key={t.key}
                href={`/match?example=${t.key}`}
                className={`rounded-full border px-3 py-1.5 font-medium ${example === t.key ? "border-ink bg-ink text-cream" : "border-line bg-paper hover:border-ink/40"}`}
              >
                {t.name}
              </a>
            ))}
          </div>

          <div className="mt-8">
            <MatchClient key={preset?.key ?? "blank"} defaults={preset?.founder} />
          </div>
        </Container>
      </main>
    </>
  );
}
