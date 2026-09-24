import { collabs, fairness } from "@/content/site";
import { Container, Section, SectionHeading } from "@/components/ui";

const tints = ["bg-butter", "bg-lilac", "bg-mint", "bg-lilac", "bg-mint", "bg-butter"];

export function Collabs() {
  return (
    <Section id="collabs" className="bg-paper">
      <Container>
        <SectionHeading eyebrow={collabs.eyebrow} title={collabs.title} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collabs.items.map((item, i) => (
            <div key={item.title} className="rounded-3xl border border-line p-6">
              <span className={`block h-2 w-10 rounded-full ${tints[i % tints.length]}`} aria-hidden="true" />
              <h3 className="font-display mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function Fairness() {
  return (
    <Section>
      <Container>
        <div className="grid items-center gap-10 rounded-[2rem] bg-lilac/45 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <SectionHeading eyebrow={fairness.eyebrow} title={fairness.title} body={fairness.body} />
          <div className="rounded-3xl bg-paper p-6">
            <p className="text-sm font-semibold text-muted">What we match on</p>
            <ul className="mt-4 space-y-3">
              {fairness.criteria.map((c) => (
                <li key={c} className="flex items-center gap-3 font-medium">
                  <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-coral" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
