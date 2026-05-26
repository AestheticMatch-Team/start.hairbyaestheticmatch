import { createBrowserClient } from "@supabase/ssr";

/** Browser Supabase client (messaging app project — same as aestheticmatchfinal). */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_MESSAGING_APP_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_MESSAGING_APP_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing env: NEXT_PUBLIC_MESSAGING_APP_SUPABASE_URL and NEXT_PUBLIC_MESSAGING_APP_SUPABASE_ANON_KEY",
    );
  }

  return createBrowserClient(url, anonKey);
}
