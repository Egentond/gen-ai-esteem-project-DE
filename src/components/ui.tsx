import type { ComponentProps, ReactNode } from "react";

/** Small shared building blocks used across sections. */

export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`} {...props} />;
}

export function Section({ className = "", ...props }: ComponentProps<"section">) {
  return <section className={`scroll-mt-20 py-20 sm:py-28 ${className}`} {...props} />;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-sm font-semibold tracking-wide text-coral uppercase ${className}`}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display mt-3 text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {body && <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">{body}</p>}
    </div>
  );
}

const buttonStyles = {
  primary: "bg-coral text-white hover:bg-coral-dark shadow-[0_2px_0_0_var(--color-ink)]",
  secondary: "bg-paper text-ink ring-1 ring-ink/15 hover:ring-ink/40",
  dark: "bg-ink text-cream hover:bg-ink/85",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"a"> & { variant?: keyof typeof buttonStyles }) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  );
}

/** Two interlocking loops — the Loopedy mark. */
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 28" className={className} aria-hidden="true" fill="none">
      <circle cx="14" cy="14" r="10" stroke="var(--color-coral)" strokeWidth="4.5" />
      <circle cx="26" cy="14" r="10" stroke="var(--color-ink)" strokeWidth="4.5" />
      {/* re-draw part of the first loop on top so they look linked */}
      <path d="M20 6 A10 10 0 0 1 24 14" stroke="var(--color-coral)" strokeWidth="4.5" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="font-display text-xl font-bold tracking-tight">Loopedy</span>
    </span>
  );
}
