import { getStartedHref } from "@/lib/funnel";

type Props = {
  className?: string;
  children: React.ReactNode;
};

/** Get Started with affiliate UTMs — external hair host, or local `/get-started` when hosted funnel is enabled. */
export default function HairGetStartedLink({ className, children }: Props) {
  return (
    <a href={getStartedHref()} className={className}>
      {children}
    </a>
  );
}
