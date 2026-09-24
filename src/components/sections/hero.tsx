import { hero } from "@/content/site";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1 className="font-display mt-4 text-[2.6rem] leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">{hero.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label} →</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted">
            <span className="inline-block h-2 w-2 rounded-full bg-coral" aria-hidden="true" />
            {hero.note}
          </p>
        </div>
        <MatchIllustration />
      </Container>
    </section>
  );
}

/** Illustrative match card. Brands shown are fictional examples. */
function MatchIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      <div className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-lilac/60 blur-3xl" />
      <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-mint/70 blur-3xl" />

      <div className="relative rounded-3xl border border-line bg-paper p-5 shadow-[0_24px_60px_-30px_rgba(28,26,43,0.35)] sm:p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-muted">Example match</span>
          <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink">Strong fit</span>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3">
          <BrandCard initial="F" name="Fernleaf" category="Clean skincare" color="bg-butter" />
          <BrandCard initial="D" name="Dune & Co." category="Home fragrance" color="bg-lilac" />
          <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-paper bg-coral text-white">
            <svg viewBox="0 0 40 28" className="h-5 w-6" fill="none" stroke="currentColor" strokeWidth="5">
              <circle cx="14" cy="14" r="9.5" />
              <circle cx="26" cy="14" r="9.5" />
            </svg>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-cream p-4">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Shared customer</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["Women 25–40", "Gives gifts often", "$40–80 basket", "Instagram-first"].map((t) => (
              <span key={t} className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium ring-1 ring-line">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-dashed border-line p-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Suggested collab</p>
            <p className="font-display mt-1 font-semibold">Gift-with-purchase swap</p>
          </div>
          <span className="text-2xl">🎁</span>
        </div>
      </div>
    </div>
  );
}

function BrandCard({
  initial,
  name,
  category,
  color,
}: {
  initial: string;
  name: string;
  category: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-line p-4">
      <div className={`font-display flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${color}`}>
        {initial}
      </div>
      <p className="font-display mt-3 font-semibold">{name}</p>
      <p className="text-sm text-muted">{category}</p>
    </div>
  );
}
