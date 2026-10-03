export type GradientSettings = {
  colors: [string, string, string]
  brightness: number
  grain: boolean
  grainIntensity: number
  wireframe: boolean
  animationSpeed: number
  camera: { x: number; y: number; z: number }
  lightAngle: number
}

export type AnimatableKey =
  | 'colors'
  | 'brightness'
  | 'animationSpeed'
  | 'camera'
  | 'lightAngle'
  | 'grainIntensity'

export type AnimatableSettings = Pick<GradientSettings, AnimatableKey>

export type Keyframe = {
  id: string
  time: number
  settings: AnimatableSettings
}

export type SavedSetup = {
  id: string
  name: string
  settings: GradientSettings
  createdAt: number
}

export type StudioPersistedState = {
  settings: GradientSettings
  keyframes: Keyframe[]
  duration: number
}
