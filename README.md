# Hair affiliate app (`start.hairbyaestheticmatch.com`)

Partner-facing Next.js app: **full hair funnel** (lander through dashboard) on `start.`*, with **backend** in `aestheticmatchfinal`.



## Architecture

- **This app:** UI on `start.hairbyaestheticmatch.com`
- **Backend:** `aestheticmatchfinal` on the hair host — proxied via `next.config.ts`:
  - `/api/`* → `HAIR_BACKEND_ORIGIN`
  - `/auth/*` → same (magic links, OAuth)

## Local development

```bash
# Terminal 1 — affiliate app (port 3000)
cd hair-start-lander
cp .env.example .env.local
# HAIR_BACKEND_ORIGIN=http://hair.localhost:3001
# NEXT_PUBLIC_LANDER_ORIGIN=http://localhost:3000
npm install && npm run dev

# Terminal 2 — main app / hair backend (port 3001)
cd aestheticmatchfinal && npm run dev

```

Open [http://localhost:3000](http://localhost:3000) (affiliate funnel).

**Proxy note:** `/api/*` and most `/auth/*` routes proxy to `HAIR_BACKEND_ORIGIN` (main on **3001**). `**/auth/session-bridge` is local** (sets Supabase cookies on the affiliate host after signup). Supabase redirect URLs: `http://localhost:3000/auth/callback/hair` and allow `http://localhost:3000/auth/session-bridge` in redirect URLs if needed.

## Env

See `.env.example`. Key vars:

- `HAIR_BACKEND_ORIGIN` — API/auth rewrite target
- `NEXT_PUBLIC_LANDER_ORIGIN` — this deploy’s public URL
- `NEXT_PUBLIC_AFFILIATE_PARTNER` — Monday status + Stripe
- `NEXT_PUBLIC_MESSAGING_APP_SUPABASE_URL` / `NEXT_PUBLIC_MESSAGING_APP_SUPABASE_ANON_KEY` — session on this host (lander avatar / log out)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — paywall Elements
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — pre-quiz city (optional)

## Funnel routes


| Route                                           |
| ----------------------------------------------- |
| `/` lander                                      |
| `/get-started`                                  |
| `/pre-quiz`                                     |
| `/paywall`                                      |
| `/post-checkout`                                |
| `/post-quiz`, `/post-quiz-loading`              |
| `/image-upload`                                 |
| `/dashboard-muted`, `/dashboard-muted/settings` |
| `/terms`, `/privacy`, `/medical-disclaimer`     |


Context APIs (in `aestheticmatchfinal`): `GET /api/hair/post-checkout-context`, `post-quiz-context`, `image-upload-context`, `dashboard-muted-context`, `dashboard-settings-context`.

## Deploy (Vercel)

1. Project root: `**hair-start-lander`**
2. Domain: `start.hairbyaestheticmatch.com` 

## UI parity with main hair funnel

Funnel UI is copied from `aestheticmatchfinal` (same components + SCSS). Affiliate-only changes:

- `@/lib/*` instead of `@/utils/*`
- Context APIs instead of server Supabase on pages
- `funnelStepHref()` for in-funnel navigation

## Attribution

`affiliate_partner` (default `start`) flows to Monday status + Stripe metadata; ad UTMs pass through only when present in the URL.



