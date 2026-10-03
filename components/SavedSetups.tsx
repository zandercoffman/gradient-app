import { useState } from 'react'
import type { SavedSetup } from '@/lib/types'

type SavedSetupsProps = {
  setups: SavedSetup[]
  onSave: (name: string) => void
  onLoad: (id: string) => void
  onDelete: (id: string) => void
}

export function SavedSetups({ setups, onSave, onLoad, onDelete }: SavedSetupsProps) {
  const [name, setName] = useState('')

  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-950/90 p-3 backdrop-blur">
      <h3 className="mb-2 font-semibold">Saved Setups</h3>
      <div className="mb-3 flex gap-2">
        <input
          type="text"
          value={name}
          placeholder="Setup name"
          onChange={(event) => setName(event.target.value)}
          className="h-9 flex-1 rounded border border-zinc-700 bg-zinc-900 px-2 text-sm"
        />
        <button
          type="button"
          className="rounded bg-emerald-500 px-3 py-1 text-sm font-medium text-zinc-900"
          onClick={() => {
            if (!name.trim()) {
              return
            }
            onSave(name.trim())
            setName('')
          }}
        >
          Save
        </button>
      </div>

      <div className="max-h-40 space-y-2 overflow-auto pr-1">
        {setups.length === 0 ? (
          <p className="text-xs text-zinc-400">No saved setups yet.</p>
        ) : (
          setups.map((setup) => (
            <div
              key={setup.id}
              className="flex items-center gap-2 rounded border border-zinc-700 bg-zinc-900/70 px-2 py-1"
            >
              <span className="truncate text-sm text-zinc-200">{setup.name}</span>
              <button
                type="button"
                className="ml-auto rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-300"
                onClick={() => onLoad(setup.id)}
              >
                Load
              </button>
              <button
                type="button"
                className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-300"
                onClick={() => onDelete(setup.id)}
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
