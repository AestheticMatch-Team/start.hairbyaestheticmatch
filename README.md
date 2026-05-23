# Hair Start Lander (affiliate)

Standalone marketing site for **`start.hairbyaestheticmatch.com`**. Affiliates can fork this repo and edit copy/layout without access to the main AestheticMatch backend.

## What this repo contains

- Main hair lander UI (`components/lander/*`, assets in `public/hair-lander/`)
- **No** API routes, Supabase, Stripe, or auth

## Funnel handoff

Every **Get Started** CTA links to the production hair funnel with first-touch UTMs:

`https://hairbyaestheticmatch.com/get-started?utm_source=start&utm_medium=affiliate&utm_campaign=hair_lander`

Configure via `.env` (see `.env.example`).

Signup, paywall, quiz, and payments run only on the main hair app.

## ClickFlare direct tracking

By default, this affiliate lander loads ClickFlare Direct tracking and Get
Started CTAs use `https://go.consumerwatchtoday.com/cf/click`. The active
ClickFlare campaign is:

```bash
NEXT_PUBLIC_CLICKFLARE_CAMPAIGN_ID=6a122a576fdcf70012dc7ab0
NEXT_PUBLIC_CLICKFLARE_DIRECT_TRACKING=true
NEXT_PUBLIC_CLICKFLARE_USE_CLICK_URLS=true
NEXT_PUBLIC_CLICKFLARE_TRACKING_ORIGIN=https://go.consumerwatchtoday.com
NEXT_PUBLIC_CLICKFLARE_CONTAINER_ID=<container-id>
NEXT_PUBLIC_CLICKFLARE_CTA_ID=
```

Configure the ClickFlare offer URL to point at the production funnel, including
affiliate UTMs and a ClickFlare click ID parameter, for example:

`https://www.hairbyaestheticmatch.com/get-started?utm_source=nick_affiliate&utm_medium=affiliate&utm_campaign=hair_lander&utm_content={cf_click_id}&cf_click_id={cf_click_id}`

If ClickFlare does not replace macros in the selected Direct setup, keep
`cf_click_id` in a normal URL parameter that prod can store, or add a small
client handoff script that reads `window.clickflare.tracking_params.click_id`.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Deploy (Vercel)

1. Create a new GitHub repo from this directory and push.
2. Import the repo in Vercel (separate project from `aestheticmatchfinal`).
3. Set environment variables from `.env.example`.
4. Add domain **`start.hairbyaestheticmatch.com`** to this Vercel project (DNS CNAME).
5. Ensure **`start.hairbyaestheticmatch.com` is not** attached to the main `aestheticmatchfinal` deployment.

## Syncing lander changes from the main app

When the canonical lander changes in `aestheticmatchfinal`:

```bash
# From monorepo root
rsync -a aestheticmatchfinal/components/lander/ hair-start-lander/components/lander/
rsync -a aestheticmatchfinal/public/hair-lander/ hair-start-lander/public/hair-lander/
# Re-apply affiliate-specific files (do not overwrite):
#   components/lander/HairGetStartedLink.tsx
#   components/lander/LanderNav/LanderNavCta.tsx
#   components/lander/LanderNav/index.tsx
#   components/lander/LanderHero/index.tsx
#   components/lander/LanderFooter/index.tsx
```

## Attribution

- `utm_source` (default `start`) is stored on signup in the main app and flows to Monday / Stripe reporting.
- To white-label another affiliate later, fork this repo and change `NEXT_PUBLIC_UTM_*` (and optionally the Vercel domain).
