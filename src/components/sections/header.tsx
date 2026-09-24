import { nav } from "@/content/site";
import { ButtonLink, Container, Logo } from "@/components/ui";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" aria-label="Loopedy home">
          <Logo />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-[15px] font-medium text-muted hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>
        <ButtonLink href="#apply" className="px-4 py-2 text-sm">
          Apply
        </ButtonLink>
      </Container>
    </header>
  );
}
