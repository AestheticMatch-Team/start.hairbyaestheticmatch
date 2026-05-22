'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { UnfoldMore } from '../Icons'
import styles from './LanderHero.module.scss'

interface Props {
  beforeSrc?: string
  afterSrc?: string
  beforeAlt?: string
  afterAlt?: string
  priority?: boolean
}

export default function ComparisonSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Before',
  afterAlt = 'After',
  priority = false,
}: Props) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const move = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const { left, width } = containerRef.current.getBoundingClientRect()
    setPosition(Math.max(5, Math.min(95, ((clientX - left) / width) * 100)))
  }, [])

  return (
    <div
      ref={containerRef}
      className={styles.panel}
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        move(e.clientX)
      }}
      onPointerMove={(e) => {
        if (dragging.current) move(e.clientX)
      }}
      onPointerUp={() => {
        dragging.current = false
      }}
    >
      {afterSrc ? (
        <Image src={afterSrc} alt={afterAlt} fill className={styles.panelPhoto} priority={priority} />
      ) : (
        <div className={styles.panelGradient} />
      )}

      <div
        className={styles.beforeClip}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {beforeSrc ? (
          <Image src={beforeSrc} alt={beforeAlt} fill className={styles.panelPhoto} />
        ) : (
          <div className={styles.panelGradient} />
        )}
      </div>

      <span className={styles.labelBefore}>BEFORE</span>
      <span className={styles.labelAfter}>AFTER</span>

      <div className={styles.dividerWrap} style={{ left: `${position}%` }}>
        <div className={styles.dividerLine} />
        <div className={[styles.arrowButton, styles.arrowButtonDesktop].join(' ')}>
          <UnfoldMore size={40} />
        </div>
        <div className={[styles.arrowButton, styles.arrowButtonMobile].join(' ')}>
          <UnfoldMore size={20} />
        </div>
        <div className={styles.dividerLine} />
      </div>
    </div>
  )
}
