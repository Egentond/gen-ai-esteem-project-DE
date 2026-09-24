import type { Metadata } from "next";
// Self-hosted fonts (bundled with the site, no Google Fonts request).
import "@fontsource-variable/inter";
import "@fontsource-variable/bricolage-grotesque";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} | ${site.tagline}`,
  description: site.description,
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
