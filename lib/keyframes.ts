import type { AnimatableSettings, GradientSettings, Keyframe } from './types'

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const lerp = (start: number, end: number, t: number) => start + (end - start) * t

const normalizeHex = (value: string) => {
  const clean = value.replace('#', '').trim()
  if (clean.length === 3) {
    return clean
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
  }

  return clean.padEnd(6, '0').slice(0, 6)
}

const hexToRgb = (hex: string) => {
  const normalized = normalizeHex(hex)
  const int = Number.parseInt(normalized, 16)

  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  }
}

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b]
    .map((part) => clamp(Math.round(part), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`

const interpolateColor = (start: string, end: string, t: number) => {
  const from = hexToRgb(start)
  const to = hexToRgb(end)

  return rgbToHex({
    r: lerp(from.r, to.r, t),
    g: lerp(from.g, to.g, t),
    b: lerp(from.b, to.b, t),
  })
}

export const toAnimatableSettings = (
  settings: GradientSettings,
): AnimatableSettings => ({
  colors: settings.colors,
  brightness: settings.brightness,
  animationSpeed: settings.animationSpeed,
  camera: settings.camera,
  lightAngle: settings.lightAngle,
  grainIntensity: settings.grainIntensity,
})

const interpolateSettings = (
  from: AnimatableSettings,
  to: AnimatableSettings,
  t: number,
): AnimatableSettings => ({
  colors: [
    interpolateColor(from.colors[0], to.colors[0], t),
    interpolateColor(from.colors[1], to.colors[1], t),
    interpolateColor(from.colors[2], to.colors[2], t),
  ],
  brightness: lerp(from.brightness, to.brightness, t),
  animationSpeed: lerp(from.animationSpeed, to.animationSpeed, t),
  camera: {
    x: lerp(from.camera.x, to.camera.x, t),
    y: lerp(from.camera.y, to.camera.y, t),
    z: lerp(from.camera.z, to.camera.z, t),
  },
  lightAngle: lerp(from.lightAngle, to.lightAngle, t),
  grainIntensity: lerp(from.grainIntensity, to.grainIntensity, t),
})

const sortByTime = (keyframes: Keyframe[]) =>
  [...keyframes].sort((a, b) => a.time - b.time)

export const sampleKeyframes = ({
  keyframes,
  time,
  fallback,
}: {
  keyframes: Keyframe[]
  time: number
  fallback: GradientSettings
}): GradientSettings => {
  if (!keyframes.length) {
    return fallback
  }

  const sorted = sortByTime(keyframes)
  const first = sorted[0]
  const last = sorted[sorted.length - 1]

  if (!first || !last) {
    return fallback
  }

  if (time <= first.time) {
    return { ...fallback, ...first.settings }
  }

  if (time >= last.time) {
    return { ...fallback, ...last.settings }
  }

  const nextIndex = sorted.findIndex((keyframe) => keyframe.time >= time)
  if (nextIndex <= 0) {
    return { ...fallback, ...sorted[0].settings }
  }

  const previous = sorted[nextIndex - 1]
  const next = sorted[nextIndex]
  const window = next.time - previous.time || 1
  const t = clamp((time - previous.time) / window, 0, 1)

  return {
    ...fallback,
    ...interpolateSettings(previous.settings, next.settings, t),
  }
}
