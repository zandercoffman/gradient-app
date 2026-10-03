import { useState } from 'react'

type ExportMenuProps = {
  duration: number
  disabled?: boolean
  onExportPng: () => void
  onExportVideo: (duration: number) => Promise<void>
}

export function ExportMenu({
  duration,
  disabled,
  onExportPng,
  onExportVideo,
}: ExportMenuProps) {
  const [videoDuration, setVideoDuration] = useState(duration)
  const [isExporting, setIsExporting] = useState(false)

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-950/90 p-3 backdrop-blur">
      <h3 className="mb-2 font-semibold">Export</h3>
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          className="rounded bg-cyan-500 px-3 py-1 text-sm font-medium text-zinc-900 disabled:opacity-40"
          onClick={onExportPng}
          disabled={disabled || isExporting}
        >
          Export PNG
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-zinc-400">Video duration (seconds)</label>
        <input
          type="number"
          min={1}
          max={60}
          step={0.5}
          value={videoDuration}
          onChange={(event) => setVideoDuration(Number(event.target.value))}
          className="h-9 rounded border border-zinc-700 bg-zinc-900 px-2 text-sm"
        />
        <button
          type="button"
          className="rounded bg-amber-500 px-3 py-1 text-sm font-medium text-zinc-900 disabled:opacity-40"
          onClick={async () => {
            setIsExporting(true)
            try {
              await onExportVideo(videoDuration)
            } finally {
              setIsExporting(false)
            }
          }}
          disabled={disabled || isExporting}
        >
          {isExporting ? 'Recording...' : 'Export Video'}
        </button>
      </div>
    </section>
  )
}
