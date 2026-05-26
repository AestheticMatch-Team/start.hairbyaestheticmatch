import type { NextConfig } from "next";
import { resolveBackendOrigin } from "./lib/resolve-backend-origin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const origin = resolveBackendOrigin();
    return {
      // Local `app/auth/session-bridge` must not proxy — browser needs this app's client JS.
      beforeFiles: [
        { source: "/api/:path*", destination: `${origin}/api/:path*` },
      ],
      afterFiles: [
        // OAuth / magic-link callbacks (server redirects + cookies)
        {
          source: "/auth/callback/:path*",
          destination: `${origin}/auth/callback/:path*`,
        },
        { source: "/auth/login", destination: `${origin}/auth/login` },
        { source: "/auth/signing-in", destination: `${origin}/auth/signing-in` },
        { source: "/auth/error", destination: `${origin}/auth/error` },
      ],
    };
  },
};

export default nextConfig;
