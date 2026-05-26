import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Serif, Manrope } from "next/font/google";
import "@/components/lander/styles/globals.css";
import "@/components/styles/ivy-fonts.css";
import AnalyticsLoader from "@/components/AnalyticsLoader";
import UTMTracker from "@/components/UTMTracker";
import { landerOrigin } from "@/lib/funnel";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

/** Same CSS vars as main app root layout — required by get-started.module.scss */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
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

const loadAnalytics =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ||
  process.env.NEXT_PUBLIC_ENVIRONMENT === "staging";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-5FT2R3TB";
const amplitudeKey = process.env.NEXT_PUBLIC_AMPLITUDE_KEY ?? "2007fcf6bf69c8ec2249ed92427c51b3";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer=window.dataLayer||[];",
          }}
        />
      </head>
      <body
        className={`${instrumentSerif.variable} ${manrope.variable} ${cormorantGaramond.variable}`}
      >
        {loadAnalytics && gtmId ? (
          <noscript>
            <iframe
              title="gtm"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        {loadAnalytics && gtmId ? (
          <AnalyticsLoader gtmId={gtmId} amplitudeKey={amplitudeKey} />
        ) : null}
        {children}
        <UTMTracker />
      </body>
    </html>
  );
}
