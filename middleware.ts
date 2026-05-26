import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase-auth/middleware";

/** 50/50 hair paywall price experiment */
function pickHairPriceVariant(): "149" | "79" {
  const buf = new Uint8Array(1);
  crypto.getRandomValues(buf);
  return buf[0] < 128 ? "149" : "79";
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isPageRequest = !pathname.startsWith("/api") && !pathname.startsWith("/_next");

  const rawHairCookie = req.cookies.get("am_hair_price_variant")?.value;
  const existingHairVariant =
    rawHairCookie === "149" || rawHairCookie === "79" ? rawHairCookie : undefined;
  const assignedHairVariant =
    existingHairVariant ?? (isPageRequest ? pickHairPriceVariant() : undefined);

  const response = await updateSession(req);
  if (assignedHairVariant && !existingHairVariant) {
    response.cookies.set("am_hair_price_variant", assignedHairVariant, {
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
      sameSite: "lax",
      httpOnly: false,
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
