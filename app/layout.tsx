import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "@/components/lander/styles/globals.css";
import ClickflareDirectTracking from "@/components/lander/ClickflareDirectTracking";
import { landerOrigin } from "@/lib/funnel";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope-lander",
});

const TITLE = "The Smarter Approach to Hair Loss | AestheticMatch";
const DESCRIPTION =
  "A personalized report on what's driving your hair loss and whether topicals, medication, or surgery fits. Includes visualizations, transparent pricing, and a vetted surgeon shortlist. Reviewed 1:1 with a concierge.";

export const metadata: Metadata = {
  metadataBase: new URL(landerOrigin()),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml", sizes: "any" }],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "AestheticMatch Hair",
    images: [{ url: "/og.jpg", width: 2400, height: 1260, type: "image/jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} ${manrope.variable}`}>
        {children}
        <ClickflareDirectTracking />
      </body>
    </html>
  );
}
