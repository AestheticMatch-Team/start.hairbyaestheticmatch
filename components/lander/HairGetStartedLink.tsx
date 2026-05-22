import { hairGetStartedUrl } from "@/lib/funnel";

type Props = {
  className?: string;
  children: React.ReactNode;
};

/** Always hands off to the main hair funnel with affiliate UTMs (no local signup). */
export default function HairGetStartedLink({ className, children }: Props) {
  return (
    <a href={hairGetStartedUrl()} className={className}>
      {children}
    </a>
  );
}
