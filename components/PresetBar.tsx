import type { BuiltinPreset } from '@/lib/presets'

type PresetBarProps = {
  presets: BuiltinPreset[]
  onApplyPreset: (id: string) => void
  onRandomize: () => void
}

export function PresetBar({ presets, onApplyPreset, onRandomize }: PresetBarProps) {
  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-950/90 p-3 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">Presets</h3>
        <button
          type="button"
          onClick={onRandomize}
          className="rounded bg-violet-500 px-3 py-1 text-sm font-medium text-white"
        >
          Randomize
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApplyPreset(preset.id)}
            className="rounded border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-100 hover:border-zinc-500"
          >
            {preset.name}
          </button>
        ))}
      </div>
    </section>
  )
}
