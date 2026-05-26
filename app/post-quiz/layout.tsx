import { Instrument_Serif, Manrope } from "next/font/google";
import "@/components/lander/styles/globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export default function PostQuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${instrumentSerif.variable} ${manrope.variable}`}>{children}</div>
  );
}
