interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function UnfoldMore({
  size = 40,
  color = "#5A7A96",
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.3346 15.0001L20.0013 8.33341L26.668 15.0001M26.668 25.0001L20.0013 31.6667L13.3346 25.0001"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TablerIcon({
  size = 24,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconCurrentLocation(props: IconProps) {
  return (
    <TablerIcon {...props}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="8" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </TablerIcon>
  );
}

export function IconChartHistogram(props: IconProps) {
  return (
    <TablerIcon {...props}>
      <path d="M3 3v18h18" />
      <path d="m20 18-3-6-4 2-4-5-4 4" />
      <path d="M20 12V8h-4" />
    </TablerIcon>
  );
}

export function IconChartBarPopular(props: IconProps) {
  return (
    <TablerIcon {...props}>
      <rect x="3" y="12" width="6" height="9" rx="1" />
      <rect x="9" y="8" width="6" height="13" rx="1" />
      <rect x="15" y="4" width="6" height="17" rx="1" />
    </TablerIcon>
  );
}

export function IconRosetteDiscountCheck(props: IconProps) {
  return (
    <TablerIcon {...props}>
      <path d="M5 7.2A2.2 2.2 0 0 1 7.2 5h1a2.2 2.2 0 0 0 1.55-.64l.7-.7a2.2 2.2 0 0 1 3.12 0l.7.7a2.2 2.2 0 0 0 1.55.64h1A2.2 2.2 0 0 1 19 7.2v1c0 .58.23 1.14.64 1.55l.7.7a2.2 2.2 0 0 1 0 3.12l-.7.7a2.2 2.2 0 0 0-.64 1.55v1a2.2 2.2 0 0 1-2.2 2.2h-1a2.2 2.2 0 0 0-1.55.64l-.7.7a2.2 2.2 0 0 1-3.12 0l-.7-.7a2.2 2.2 0 0 0-1.55-.64h-1A2.2 2.2 0 0 1 5 16.8v-1a2.2 2.2 0 0 0-.64-1.55l-.7-.7a2.2 2.2 0 0 1 0-3.12l.7-.7A2.2 2.2 0 0 0 5 8.2z" />
      <path d="m9 12 2 2 4-4" />
    </TablerIcon>
  );
}

export function IconClipboardText(props: IconProps) {
  return (
    <TablerIcon {...props}>
      <rect x="9" y="3" width="6" height="4" rx="2" />
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </TablerIcon>
  );
}

export function IconFlag(props: IconProps) {
  return (
    <TablerIcon {...props}>
      <path d="M5 5a5 5 0 0 1 7 0 5 5 0 0 0 7 0v9a5 5 0 0 1-7 0 5 5 0 0 0-7 0z" />
      <path d="M5 21V5" />
    </TablerIcon>
  );
}
