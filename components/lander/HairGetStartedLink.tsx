import { hairGetStartedUrl } from "@/lib/funnel";

type Props = {
  className?: string;
  children: React.ReactNode;
  clickflareCtaId?: number | string;
};

/** Get Started CTA: local `/get-started` by default, or ClickFlare click URL when enabled. */
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
