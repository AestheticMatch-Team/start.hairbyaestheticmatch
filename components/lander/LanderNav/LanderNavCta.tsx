"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import HairGetStartedLink from "@/components/lander/HairGetStartedLink";
import { createClient } from "@/lib/supabase-auth/client";
import styles from "./LanderNav.module.scss";

function getInitials(user: User): string {
  const meta = user.user_metadata as Record<string, string> | undefined;
  const name = (meta?.full_name || meta?.name || "").trim();
  if (name) {
    const parts = name.split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase() || first.toUpperCase() || "U";
  }
  const email = user.email ?? "";
  return (email[0] ?? "U").toUpperCase();
}

export default function LanderNavCta() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      const supabase = createClient();
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      subscription = sub;
      void supabase.auth.getUser().then(({ data: { user: u } }) => {
        setUser(u ?? null);
      });
    } catch {
      /* missing Supabase env — nav still works without avatar */
    }
    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const res = await fetch("/api/auth/sign-out", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { redirect?: string };
      window.location.href = data.redirect || "/";
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <>
      <HairGetStartedLink className={styles.cta}>Get Started</HairGetStartedLink>
      {user && (
        <div ref={wrapperRef} className={styles.avatarWrap}>
          <button
            type="button"
            className={styles.avatar}
            onClick={() => !signingOut && setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Account menu"
            disabled={signingOut}
          >
            {getInitials(user)}
          </button>
          {open && (
            <div className={styles.avatarMenu} role="menu">
              <button
                type="button"
                className={styles.avatarMenuItem}
                role="menuitem"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? "Logging out…" : "Log out"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
