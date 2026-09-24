import { site } from "@/content/site";
import { Container, Logo } from "@/components/ui";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col items-start justify-between gap-4 text-sm text-muted sm:flex-row sm:items-center">
        <Logo />
        <p>
          Questions?{" "}
          <a href={`mailto:${site.contactEmail}`} className="font-medium text-ink underline underline-offset-4">
            {site.contactEmail}
          </a>
        </p>
        <p>© {new Date().getFullYear()} {site.name}</p>
      </Container>
    </footer>
  );
}
