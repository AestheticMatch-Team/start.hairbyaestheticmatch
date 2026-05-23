import { hairGetStartedUrl } from "@/lib/funnel";

type Props = {
  className?: string;
  children: React.ReactNode;
  clickflareCtaId?: number | string;
};

/** Handoff CTA: direct to prod by default, or through ClickFlare when enabled. */
export default function HairGetStartedLink({
  className,
  children,
  clickflareCtaId,
}: Props) {
  return (
    <a href={hairGetStartedUrl(undefined, { clickflareCtaId })} className={className}>
      {children}
    </a>
  );
}
