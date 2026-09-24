import { apply } from "@/content/site";
import { Container, Section, SectionHeading } from "@/components/ui";
import { ApplicationForm } from "@/components/application-form";

export function Apply() {
  return (
    <Section id="apply" className="bg-paper">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={apply.eyebrow} title={apply.title} body={apply.body} />
        </div>
        <ApplicationForm />
      </Container>
    </Section>
  );
}
