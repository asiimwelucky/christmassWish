'use client'

import { useId, useSyncExternalStore } from 'react'

/**
 * Gradient ids must be unique per instance: several arrangements of the same
 * flower share one document, and a duplicate `url(#gold)` reference silently
 * resolves to whichever definition the parser met first.
 */
export function useFloralUid(prefix: string): string {
  const raw = useId()
  return `${prefix}-${raw.replace(/[^a-zA-Z0-9]/g, '')}`
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(onChange: () => void): () => void {
  const mq = window.matchMedia(REDUCED_MOTION)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches
}

function getReducedMotionOnServer(): boolean {
  return false
}

/**
 * Hydration always reports "motion allowed" so the client tree matches the
 * prerendered HTML; the store re-renders once the real preference is read.
 */
export function useFloralReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  )
}
