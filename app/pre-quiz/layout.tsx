import { Instrument_Serif, Manrope } from "next/font/google";

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

export default function PreQuizLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${instrumentSerif.variable} ${manrope.variable}`}>{children}</div>;
}
