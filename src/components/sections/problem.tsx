import { problem } from "@/content/site";
import { Container, Section } from "@/components/ui";

export function Problem() {
  return (
    <Section className="bg-ink text-cream">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-butter uppercase">{problem.eyebrow}</p>
          <h2 className="font-display mt-3 text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
            {problem.title}
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {problem.points.map((p, i) => (
            <div key={p.title} className="rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <span className="font-display text-sm font-semibold text-butter">0{i + 1}</span>
              <h3 className="font-display mt-3 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-cream/70">{p.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
