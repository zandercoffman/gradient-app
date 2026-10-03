import type { Keyframe } from '@/lib/types'

type TimelineProps = {
  keyframes: Keyframe[]
  duration: number
  currentTime: number
  onScrub: (time: number) => void
  onDurationChange: (value: number) => void
  onAddKeyframe: () => void
  onDeleteKeyframe: (id: string) => void
  onKeyframeTimeChange: (id: string, time: number) => void
}

export function Timeline({
  keyframes,
  duration,
  currentTime,
  onScrub,
  onDurationChange,
  onAddKeyframe,
  onDeleteKeyframe,
  onKeyframeTimeChange,
}: TimelineProps) {
  const sorted = [...keyframes].sort((a, b) => a.time - b.time)

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-950/90 p-4 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Timeline</h3>
        <button
          type="button"
          onClick={onAddKeyframe}
          className="rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white"
        >
          Add Keyframe @ {currentTime.toFixed(2)}s
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-zinc-300">Duration</span>
        <input
          type="range"
          min={2}
          max={30}
          step={0.5}
          value={duration}
          onChange={(event) => onDurationChange(Number(event.target.value))}
          className="flex-1"
        />
        <span className="w-14 text-right text-xs font-mono text-zinc-300">{duration.toFixed(1)}s</span>
      </div>

      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={Math.min(currentTime, duration)}
          onChange={(event) => onScrub(Number(event.target.value))}
          className="w-full"
        />
        <div className="mt-1 text-right font-mono text-xs text-zinc-400">{currentTime.toFixed(2)}s</div>
      </div>

      <div className="max-h-40 space-y-2 overflow-auto pr-1">
        {sorted.length === 0 ? (
          <p className="text-xs text-zinc-400">No keyframes yet. Add one at the current playhead position.</p>
        ) : (
          sorted.map((keyframe) => (
            <div
              key={keyframe.id}
              className="flex items-center gap-2 rounded border border-zinc-700 bg-zinc-900/70 px-2 py-1"
            >
              <span className="text-xs text-zinc-400">{keyframe.id.slice(0, 4)}</span>
              <input
                type="number"
                min={0}
                max={duration}
                step={0.01}
                value={keyframe.time}
                onChange={(event) =>
                  onKeyframeTimeChange(keyframe.id, Number(event.target.value))
                }
                className="h-8 w-24 rounded border border-zinc-700 bg-zinc-950 px-2 text-sm"
              />
              <span className="text-xs text-zinc-500">sec</span>
              <button
                type="button"
                className="ml-auto rounded bg-red-500/20 px-2 py-1 text-xs text-red-300"
                onClick={() => onDeleteKeyframe(keyframe.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
