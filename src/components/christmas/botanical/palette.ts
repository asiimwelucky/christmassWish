/**
 * Shared Christmas botanical tokens.
 *
 * Colours are deliberately held as literal hex values instead of CSS custom
 * properties: html2canvas serialises our SVGs into standalone `data:` images,
 * and var() references to :root cannot resolve there.
 */
export const FLORAL = {
  // Poinsettia bracts
  bractRedShadow: '#5C0E08',
  bractRedDeep: '#8A1710',
  bractRed: '#B8241A',
  bractRedBright: '#D93B2C',
  bractRedLight: '#EA6153',

  // White / cream poinsettia
  bractWhiteShadow: '#CFC5B4',
  bractWhiteDeep: '#E7DFD1',
  bractWhite: '#F5EFE4',
  bractWhiteBright: '#FDFAF4',
  bractCream: '#F6E9CE',
  bractCreamBright: '#FBF3E1',

  // Foliage
  leafShadow: '#0A3A20',
  leafDeep: '#10502C',
  leaf: '#186B3A',
  leafBright: '#2A8C4E',
  leafLight: '#4FAA6C',
  mistLEAF: '#3E9B63',

  // Cyathia / true flower
  goldDeep: '#A87B12',
  gold: '#D4AF37',
  goldLight: '#F5D76E',
  goldPale: '#FCEBAF',
  pollen: '#FFF3CC',

  // Christmas rose (hellebore)
  rosePetal: '#FBF7F1',
  rosePetalShade: '#E3DCCF',
  roseVein: '#C9D2BC',
  roseCentre: '#E8DE9A',

  // Berry
  berryDeep: '#6B0F0A',
  berry: '#B01C12',
  berryBright: '#D62E20',
  berryWhite: '#F7F3EA',
  berryWhiteShade: '#D8D2C2',

  // Accents
  ivory: '#FFF8F0',
  snow: '#FFFFFF',
  veinRed: '#6D1209',
  veinGreen: '#0B3B21',
} as const

/**
 * Deterministic variation without Math.random(): cacheComponents is enabled in
 * next.config.ts, so anything called during render must be pure or the
 * prerender errors with `blocking-prerender-random`.
 *
 * Integer hashing rather than the usual sin() trick: V8's transcendental table
 * differs between the Node server and the browser, which produced path strings
 * that drifted in the 11th decimal and failed hydration.
 */
export function floralSeed(seed: number, salt: number): number {
  let h = Math.imul(seed | 0, 374761393) + Math.imul(salt | 0, 668265263)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967295
}

/** Two decimals is invisible on screen and keeps the serialised SVG small. */
export function n(value: number): number {
  return Math.round(value * 100) / 100
}

/** Evenly spread `count` angles in degrees, offset so layers never align. */
export function petalAngles(count: number, offset = 0): number[] {
  return Array.from({ length: count }, (_, i) => (360 / count) * i + offset)
}

/**
 * Serrated poinsettia bract, base at (0,0), tip on -Y, roughly 62 units long
 * and 34 units wide. Returned as a single path so each bract stays cheap.
 */
export function bractPath(length: number, width: number): string {
  const l = length
  const w = n(width / 2)
  return [
    'M0,0',
    `C ${n(-w * 0.34)},${n(-l * 0.09)} ${n(-w * 0.78)},${n(-l * 0.19)} ${n(-w * 0.9)},${n(-l * 0.33)}`,
    `C ${n(-w * 0.98)},${n(-l * 0.44)} ${n(-w * 0.66)},${n(-l * 0.5)} ${n(-w * 0.74)},${n(-l * 0.62)}`,
    `C ${n(-w * 0.8)},${n(-l * 0.73)} ${n(-w * 0.42)},${n(-l * 0.79)} ${n(-w * 0.3)},${n(-l * 0.89)}`,
    `C ${n(-w * 0.2)},${n(-l * 0.95)} ${n(-w * 0.08)},${n(-l * 0.98)} 0,${n(-l)}`,
    `C ${n(w * 0.08)},${n(-l * 0.98)} ${n(w * 0.2)},${n(-l * 0.95)} ${n(w * 0.3)},${n(-l * 0.89)}`,
    `C ${n(w * 0.42)},${n(-l * 0.79)} ${n(w * 0.8)},${n(-l * 0.73)} ${n(w * 0.74)},${n(-l * 0.62)}`,
    `C ${n(w * 0.66)},${n(-l * 0.5)} ${n(w * 0.98)},${n(-l * 0.44)} ${n(w * 0.9)},${n(-l * 0.33)}`,
    `C ${n(w * 0.78)},${n(-l * 0.19)} ${n(w * 0.34)},${n(-l * 0.09)} 0,0`,
    'Z',
  ].join(' ')
}

/** Midrib plus two pairs of lateral veins, drawn as one stroked path. */
export function bractVeinPath(length: number, width: number): string {
  const l = length
  const w = n(width / 2)
  return [
    `M0,${n(-l * 0.04)} L0,${n(-l * 0.93)}`,
    `M0,${n(-l * 0.3)} Q ${n(-w * 0.42)},${n(-l * 0.38)} ${n(-w * 0.62)},${n(-l * 0.5)}`,
    `M0,${n(-l * 0.3)} Q ${n(w * 0.42)},${n(-l * 0.38)} ${n(w * 0.62)},${n(-l * 0.5)}`,
    `M0,${n(-l * 0.58)} Q ${n(-w * 0.32)},${n(-l * 0.66)} ${n(-w * 0.44)},${n(-l * 0.78)}`,
    `M0,${n(-l * 0.58)} Q ${n(w * 0.32)},${n(-l * 0.66)} ${n(w * 0.44)},${n(-l * 0.78)}`,
  ].join(' ')
}

/** Inner highlight sliver that gives each bract a waxy lit edge. */
export function bractHighlightPath(length: number, width: number): string {
  const l = length
  const w = n(width / 2)
  return [
    'M0,0',
    `C ${n(w * 0.1)},${n(-l * 0.2)} ${n(w * 0.24)},${n(-l * 0.5)} ${n(w * 0.16)},${n(-l * 0.82)}`,
    `C ${n(w * 0.12)},${n(-l * 0.9)} ${n(w * 0.04)},${n(-l * 0.95)} 0,${n(-l * 0.99)}`,
    `C ${n(-w * 0.02)},${n(-l * 0.9)} ${n(-w * 0.02)},${n(-l * 0.5)} 0,0`,
    'Z',
  ].join(' ')
}

/**
 * Spiny holly leaf pointing along +X, base at (0,0), tip at (length,0).
 * Four spikes per side keep the silhouette unmistakable at small sizes.
 */
export function hollyLeafPath(length: number, width: number): string {
  const L = n(length)
  const w = n(width / 2)
  const p = (t: number) => n(L * t)
  const up = (t: number, k: number) => n(-w * k)
  const dn = (t: number, k: number) => n(w * k)
  return [
    `M ${p(0.02)},0`,
    `C ${p(0.1)},${up(0, 0.5)} ${p(0.13)},${up(0, 0.62)} ${p(0.18)},${up(0, 0.66)}`,
    `L ${p(0.2)},${up(0, 1)}`,
    `L ${p(0.28)},${up(0, 0.62)}`,
    `L ${p(0.33)},${up(0, 1)}`,
    `L ${p(0.42)},${up(0, 0.6)}`,
    `L ${p(0.48)},${up(0, 0.94)}`,
    `L ${p(0.56)},${up(0, 0.56)}`,
    `L ${p(0.64)},${up(0, 0.84)}`,
    `L ${p(0.72)},${up(0, 0.46)}`,
    `C ${p(0.82)},${up(0, 0.34)} ${p(0.9)},${up(0, 0.16)} ${p(0.98)},0`,
    `C ${p(0.9)},${dn(0, 0.16)} ${p(0.82)},${dn(0, 0.34)} ${p(0.72)},${dn(0, 0.46)}`,
    `L ${p(0.64)},${dn(0, 0.84)}`,
    `L ${p(0.56)},${dn(0, 0.56)}`,
    `L ${p(0.48)},${dn(0, 0.94)}`,
    `L ${p(0.42)},${dn(0, 0.6)}`,
    `L ${p(0.33)},${dn(0, 1)}`,
    `L ${p(0.28)},${dn(0, 0.62)}`,
    `L ${p(0.2)},${dn(0, 1)}`,
    `L ${p(0.18)},${dn(0, 0.66)}`,
    `C ${p(0.13)},${dn(0, 0.62)} ${p(0.1)},${dn(0, 0.5)} ${p(0.02)},0`,
    'Z',
  ].join(' ')
}

/** Smooth oval mistletoe leaf pointing along +X. */
export function mistletoeLeafPath(length: number, width: number): string {
  const L = n(length)
  const w = n(width / 2)
  return [
    'M0,0',
    `C ${n(L * 0.22)},${n(-w)} ${n(L * 0.6)},${n(-w * 0.95)} ${n(L * 0.94)},${n(-w * 0.24)}`,
    `C ${n(L * 0.99)},${n(-w * 0.1)} ${n(L * 0.99)},${n(w * 0.1)} ${n(L * 0.94)},${n(w * 0.24)}`,
    `C ${n(L * 0.6)},${n(w * 0.95)} ${n(L * 0.22)},${n(w)} 0,0`,
    'Z',
  ].join(' ')
}

/** Rounded hellebore petal, base at (0,0), tip on -Y. */
export function rosePetalPath(length: number, width: number): string {
  const l = n(length)
  const w = n(width / 2)
  return [
    'M0,0',
    `C ${n(-w * 0.52)},${n(-l * 0.16)} ${n(-w)},${n(-l * 0.44)} ${n(-w * 0.94)},${n(-l * 0.72)}`,
    `C ${n(-w * 0.88)},${n(-l * 0.93)} ${n(-w * 0.36)},${n(-l * 1.02)} 0,${n(-l)}`,
    `C ${n(w * 0.36)},${n(-l * 1.02)} ${n(w * 0.88)},${n(-l * 0.93)} ${n(w * 0.94)},${n(-l * 0.72)}`,
    `C ${n(w)},${n(-l * 0.44)} ${n(w * 0.52)},${n(-l * 0.16)} 0,0`,
    'Z',
  ].join(' ')
}

/** Four-point sparkle used for the golden dust. */
export function sparklePath(r: number): string {
  const q = n(r * 0.2)
  const R = n(r)
  return [
    `M0,${n(-r)}`,
    `Q ${q},${n(-q)} ${R},0`,
    `Q ${q},${q} 0,${R}`,
    `Q ${n(-q)},${q} ${n(-R)},0`,
    `Q ${n(-q)},${n(-q)} 0,${n(-r)}`,
    'Z',
  ].join(' ')
}

/**
 * Rotation/mirroring expressed in SVG user units rather than CSS.
 *
 * html2canvas serialises our SVGs into standalone `data:` images: a CSS
 * transform on the wrapper is applied by the renderer on top of the already
 * transformed bounding box, which shifts the artwork in the downloaded card.
 */
export function orientationTransform(
  viewWidth: number,
  viewHeight: number,
  opts: { angle?: number; flipX?: boolean; flipY?: boolean } = {}
): string {
  const { angle = 0, flipX = false, flipY = false } = opts
  const cx = viewWidth / 2
  const cy = viewHeight / 2
  return `translate(${cx} ${cy}) rotate(${angle}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1}) translate(${-cx} ${-cy})`
}
