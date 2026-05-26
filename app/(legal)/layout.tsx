import { Poppins } from "next/font/google";
import "./legal-pages.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <div className={`legalPages ${poppins.className} ${poppins.variable}`}>{children}</div>;
}
