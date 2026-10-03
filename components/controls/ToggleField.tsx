type ToggleFieldProps = {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}

export function ToggleField({ label, checked, onChange }: ToggleFieldProps) {
  return (
    <label className="flex items-center justify-between gap-2 rounded border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm">
      <span className="text-zinc-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full border transition ${
          checked
            ? 'border-emerald-400 bg-emerald-500/40'
            : 'border-zinc-600 bg-zinc-800'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
            checked ? 'left-5' : 'left-0.5'
          }`}
        />
      </button>
    </label>
  )
}
