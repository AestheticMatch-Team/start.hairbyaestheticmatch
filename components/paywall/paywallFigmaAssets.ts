/** Local assets under `public/paywall/` (exported from Figma [paywall design](https://www.figma.com/design/ZXs0A2OcqRWN0uzcPGw7VV/MCP-Access?node-id=183-59)). */
/** Per-procedure before/after for “See what your results could look like” ([183-58](https://www.figma.com/design/ZXs0A2OcqRWN0uzcPGw7VV/MCP-Access?node-id=183-58)). */
export const paywallProcedureBeforeAfter = {
  Facelift: {
    before: "/paywall/results/facelift-before.png",
    after: "/paywall/results/facelift-after.png",
  },
  Rhinoplasty: {
    before: "/paywall/results/rhinoplasty-before.png",
    after: "/paywall/results/rhinoplasty-after.png",
  },
  Necklift: {
    before: "/paywall/results/necklift-before.png",
    after: "/paywall/results/necklift-after.png",
  },
  Blepharoplasty: {
    before: "/paywall/results/blepharoplasty-before.png",
    after: "/paywall/results/blepharoplasty-after.png",
  },
  "Body Lift": {
    before: "/paywall/results/body-lift-before.png",
    after: "/paywall/results/body-lift-after.png",
  },
  "Breast Augmentation": {
    before: "/paywall/results/breast-augmentation-before.png",
    after: "/paywall/results/breast-augmentation-after.png",
  },
  "Tummy Tuck": {
    before: "/paywall/results/tummy-tuck-before.png",
    after: "/paywall/results/tummy-tuck-after.png",
  },
  "Breast Reduction": {
    before: "/paywall/results/breast-reduction-before.png",
    after: "/paywall/results/breast-reduction-after.png",
  },
} as const;

export const paywallFigma = {
  bgEllipse: "/paywall/bg-ellipse.svg",
  beforeImage: "/paywall/results/facelift-before.png",
  afterImage: "/paywall/results/facelift-after.png",
  reportCover: "/paywall/report-cover.png",
  iconAddCircle: "/paywall/icon-add-circle.svg",
  iconClock: "/paywall/icon-clock.svg",
  iconProfile: "/paywall/icon-profile.svg",
  iconTickCircle: "/paywall/icon-tick-circle.svg",
  iconLayer: "/paywall/icon-layer.svg",
  trustTick: "/paywall/trust-tick.svg",
  trustSecurity: "/paywall/trust-security.svg",
  trustLock: "/paywall/trust-lock.svg",
  check: "/paywall/check.svg",
} as const;
