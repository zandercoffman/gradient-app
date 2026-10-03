import type { SavedSetup, StudioPersistedState } from './types'

const STUDIO_STATE_KEY = 'shader-gradient-studio/state/v1'
const SAVED_SETUPS_KEY = 'shader-gradient-studio/setups/v1'

const parse = <T>(value: string | null): T | null => {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export const loadStudioState = (): StudioPersistedState | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return parse<StudioPersistedState>(localStorage.getItem(STUDIO_STATE_KEY))
}

export const saveStudioState = (state: StudioPersistedState) => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(STUDIO_STATE_KEY, JSON.stringify(state))
}

export const loadSavedSetups = (): SavedSetup[] => {
  if (typeof window === 'undefined') {
    return []
  }

  const setups = parse<SavedSetup[]>(localStorage.getItem(SAVED_SETUPS_KEY))
  return Array.isArray(setups) ? setups : []
}

export const saveSavedSetups = (setups: SavedSetup[]) => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(SAVED_SETUPS_KEY, JSON.stringify(setups))
}
