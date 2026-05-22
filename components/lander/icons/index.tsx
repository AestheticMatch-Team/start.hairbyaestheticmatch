// Tabler icon SVG components used in the lander

export function IconBrandSafari({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9"/>
      <path d="m16.5 7.5-3.926 5.266L7.5 16.5l3.926-5.266z"/>
    </svg>
  )
}

export function IconFileUnknown({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
      <path d="M12 17v.01"/>
      <path d="M10 13a2 2 0 1 1 4 0c0 .591-.417 1.318-.816 1.632L12 16"/>
    </svg>
  )
}

export function IconMessageCircle({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 20l1.3-3.9A9 9 0 1 1 21 12a9 9 0 0 1-8.685 6.61L3 20"/>
    </svg>
  )
}

export function IconChecklist({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9.615 20H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"/>
      <path d="M11 17h9"/>
      <path d="M15 13l2 2 4-4"/>
      <path d="M9 8h4"/>
      <path d="M9 12h2"/>
    </svg>
  )
}

export function IconAlertTriangle({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m10.363 3.591-6.8 11.947A1.914 1.914 0 0 0 5.227 18.5h13.546a1.914 1.914 0 0 0 1.666-2.962l-6.8-11.947a1.914 1.914 0 0 0-3.276 0z"/>
      <path d="M12 10v4"/>
      <path d="M12 16v.01"/>
    </svg>
  )
}

export function IconMap2({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 18.5 8 15.5l-5 1.5V5l5-2 4 3 5-2 4 2v7"/>
      <path d="M8 15.5V3"/>
      <path d="M13 6v5.5"/>
      <circle cx="17" cy="17" r="3"/>
      <path d="m20.2 20.2 1.8 1.8"/>
    </svg>
  )
}
