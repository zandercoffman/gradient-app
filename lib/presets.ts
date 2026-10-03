import type { GradientSettings } from './types'

export type BuiltinPreset = {
  id: string
  name: string
  settings: GradientSettings
}

export const defaultSettings: GradientSettings = {
  colors: ['#ff5e3a', '#5f5cff', '#12c2e9'],
  brightness: 1,
  grain: true,
  grainIntensity: 0.18,
  wireframe: false,
  animationSpeed: 0.35,
  camera: { x: 0, y: 90, z: 3.2 },
  lightAngle: 0,
}

export const builtInPresets: BuiltinPreset[] = [
  {
    id: 'sunset-warp',
    name: 'Sunset Warp',
    settings: {
      colors: ['#ff8a00', '#e52e71', '#5f5cff'],
      brightness: 1.1,
      grain: true,
      grainIntensity: 0.24,
      wireframe: false,
      animationSpeed: 0.4,
      camera: { x: -20, y: 105, z: 3.8 },
      lightAngle: -20,
    },
  },
  {
    id: 'mint-orbit',
    name: 'Mint Orbit',
    settings: {
      colors: ['#00c9a7', '#70e1f5', '#f9f871'],
      brightness: 0.95,
      grain: false,
      grainIntensity: 0,
      wireframe: false,
      animationSpeed: 0.28,
      camera: { x: 20, y: 80, z: 2.9 },
      lightAngle: 35,
    },
  },
  {
    id: 'wire-nebula',
    name: 'Wire Nebula',
    settings: {
      colors: ['#8e2de2', '#4a00e0', '#00f2fe'],
      brightness: 1.15,
      grain: true,
      grainIntensity: 0.1,
      wireframe: true,
      animationSpeed: 0.5,
      camera: { x: 30, y: 120, z: 4.2 },
      lightAngle: 15,
    },
  },
]
