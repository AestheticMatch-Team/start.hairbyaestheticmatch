import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase-auth/server";

export async function getCurrentUser(): Promise<User | null> {
  if (
    !process.env.NEXT_PUBLIC_MESSAGING_APP_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_MESSAGING_APP_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
