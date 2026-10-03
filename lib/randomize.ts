import type { GradientSettings } from './types'

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const random = (min: number, max: number) => Math.random() * (max - min) + min

const randomColor = () => {
  const hue = Math.floor(random(0, 360))
  const saturation = Math.floor(random(65, 95))
  const lightness = Math.floor(random(45, 65))
  return `hsl(${hue} ${saturation}% ${lightness}%)`
}

const toHex = (color: string) => {
  if (typeof window === 'undefined') {
    return '#ffffff'
  }

  const context = document.createElement('canvas').getContext('2d')
  if (!context) {
    return '#ffffff'
  }

  context.fillStyle = color
  const normalized = context.fillStyle

  if (normalized.startsWith('#')) {
    return normalized
  }

  const rgb = normalized.match(/\d+/g)
  if (!rgb || rgb.length < 3) {
    return '#ffffff'
  }

  return `#${rgb
    .slice(0, 3)
    .map((part) => Number(part).toString(16).padStart(2, '0'))
    .join('')}`
}

export const randomizeSettings = (
  current: GradientSettings,
): GradientSettings => {
  const grain = Math.random() > 0.2

  return {
    ...current,
    colors: [toHex(randomColor()), toHex(randomColor()), toHex(randomColor())],
    brightness: clamp(random(0.7, 1.35), 0, 2),
    grain,
    grainIntensity: grain ? clamp(random(0.05, 0.35), 0, 1) : 0,
    wireframe: Math.random() > 0.75,
    animationSpeed: clamp(random(0.15, 0.9), 0, 2),
    camera: {
      x: random(-180, 180),
      y: clamp(random(35, 145), 0, 180),
      z: clamp(random(2.4, 5.2), 1.5, 10),
    },
    lightAngle: random(-180, 180),
  }
}
