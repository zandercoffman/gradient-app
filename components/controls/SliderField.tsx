type SliderFieldProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

export function SliderField({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
}: SliderFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <div className="flex items-center justify-between text-zinc-300">
        <span>{label}</span>
        <span className="font-mono text-xs text-zinc-400">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}
