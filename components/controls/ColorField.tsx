import type { ChangeEvent } from 'react'

type ColorFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const handleHexInput = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-20 text-zinc-300">{label}</span>
      <input
        type="color"
        value={value}
        onChange={handleHexInput}
        className="h-9 w-9 rounded border border-zinc-700 bg-transparent"
      />
      <input
        type="text"
        value={value}
        onChange={handleHexInput}
        className="h-9 flex-1 rounded border border-zinc-700 bg-zinc-900 px-2 font-mono text-xs"
      />
    </label>
  )
}
