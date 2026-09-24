import { steps } from "@/content/site";
import { Container, Section, SectionHeading } from "@/components/ui";

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <Container>
        <SectionHeading eyebrow={steps.eyebrow} title={steps.title} />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.items.map((step, i) => (
            <li key={step.title} className="relative rounded-3xl border border-line bg-paper p-6">
              <span className="font-display flex h-10 w-10 items-center justify-center rounded-full bg-coral text-lg font-bold text-white">
                {i + 1}
              </span>
              <h3 className="font-display mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
