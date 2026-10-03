import type { GradientSettings } from '@/lib/types'
import { ColorField } from './controls/ColorField'
import { SliderField } from './controls/SliderField'
import { ToggleField } from './controls/ToggleField'

type ControlPanelProps = {
  settings: GradientSettings
  isPlaying: boolean
  onPlayPause: () => void
  onChange: (settings: GradientSettings) => void
}

export function ControlPanel({
  settings,
  isPlaying,
  onPlayPause,
  onChange,
}: ControlPanelProps) {
  return (
    <aside className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-zinc-700 bg-zinc-950/90 p-4 backdrop-blur lg:w-[380px]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Controls</h2>
        <button
          type="button"
          className="rounded bg-emerald-500 px-3 py-1 text-sm font-medium text-zinc-900"
          onClick={onPlayPause}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <ColorField
          label="Color 1"
          value={settings.colors[0]}
          onChange={(value) => onChange({ ...settings, colors: [value, settings.colors[1], settings.colors[2]] })}
        />
        <ColorField
          label="Color 2"
          value={settings.colors[1]}
          onChange={(value) => onChange({ ...settings, colors: [settings.colors[0], value, settings.colors[2]] })}
        />
        <ColorField
          label="Color 3"
          value={settings.colors[2]}
          onChange={(value) => onChange({ ...settings, colors: [settings.colors[0], settings.colors[1], value] })}
        />
      </div>

      <SliderField
        label="Brightness"
        value={settings.brightness}
        min={0}
        max={2}
        onChange={(value) => onChange({ ...settings, brightness: value })}
      />
      <SliderField
        label="Animation Speed"
        value={settings.animationSpeed}
        min={0}
        max={2}
        onChange={(value) => onChange({ ...settings, animationSpeed: value })}
      />

      <ToggleField
        label="Grain"
        checked={settings.grain}
        onChange={(value) =>
          onChange({
            ...settings,
            grain: value,
            grainIntensity: value ? Math.max(settings.grainIntensity, 0.05) : 0,
          })
        }
      />

      <SliderField
        label="Grain Intensity"
        value={settings.grainIntensity}
        min={0}
        max={1}
        onChange={(value) => onChange({ ...settings, grainIntensity: value })}
      />

      <ToggleField
        label="Wireframe"
        checked={settings.wireframe}
        onChange={(value) => onChange({ ...settings, wireframe: value })}
      />

      <SliderField
        label="Camera Azimuth"
        value={settings.camera.x}
        min={-180}
        max={180}
        onChange={(value) => onChange({ ...settings, camera: { ...settings.camera, x: value } })}
      />
      <SliderField
        label="Camera Polar"
        value={settings.camera.y}
        min={0}
        max={180}
        onChange={(value) => onChange({ ...settings, camera: { ...settings.camera, y: value } })}
      />
      <SliderField
        label="Camera Distance"
        value={settings.camera.z}
        min={1.5}
        max={8}
        onChange={(value) => onChange({ ...settings, camera: { ...settings.camera, z: value } })}
      />
      <SliderField
        label="Light Angle"
        value={settings.lightAngle}
        min={-180}
        max={180}
        onChange={(value) => onChange({ ...settings, lightAngle: value })}
      />
    </aside>
  )
}
