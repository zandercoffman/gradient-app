'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ControlPanel } from '@/components/ControlPanel'
import { ExportMenu } from '@/components/ExportMenu'
import { PresetBar } from '@/components/PresetBar'
import { SavedSetups } from '@/components/SavedSetups'
import { Timeline } from '@/components/Timeline'
import { exportVideo } from '@/lib/exportVideo'
import { sampleKeyframes, toAnimatableSettings } from '@/lib/keyframes'
import { builtInPresets, defaultSettings } from '@/lib/presets'
import { randomizeSettings } from '@/lib/randomize'
import {
  loadSavedSetups,
  loadStudioState,
  saveSavedSetups,
  saveStudioState,
} from '@/lib/storage'
import type { GradientSettings, Keyframe, SavedSetup } from '@/lib/types'

const GradientCanvas = dynamic(
  () => import('@/components/GradientCanvas').then((mod) => mod.GradientCanvas),
  { ssr: false },
)

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const sortKeyframes = (keyframes: Keyframe[]) =>
  [...keyframes].sort((a, b) => a.time - b.time)

const loadInitialStudioState = () => {
  if (typeof window === 'undefined') {
    return {
      settings: defaultSettings,
      keyframes: [] as Keyframe[],
      duration: 8,
    }
  }

  const storedState = loadStudioState()
  if (!storedState) {
    return {
      settings: defaultSettings,
      keyframes: [] as Keyframe[],
      duration: 8,
    }
  }

  return {
    settings: storedState.settings,
    keyframes: sortKeyframes(storedState.keyframes),
    duration: storedState.duration,
  }
}

const loadInitialSetups = () => {
  if (typeof window === 'undefined') {
    return [] as SavedSetup[]
  }

  return loadSavedSetups()
}

export default function Home() {
  const [initialStudioState] = useState(loadInitialStudioState)
  const [settings, setSettings] = useState<GradientSettings>(
    initialStudioState.settings,
  )
  const [keyframes, setKeyframes] = useState<Keyframe[]>(
    initialStudioState.keyframes,
  )
  const [duration, setDuration] = useState(initialStudioState.duration)
  const [savedSetups, setSavedSetups] = useState<SavedSetup[]>(
    loadInitialSetups,
  )
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)

  const keyframesRef = useRef(keyframes)
  const settingsRef = useRef(settings)
  const durationRef = useRef(duration)

  useEffect(() => {
    keyframesRef.current = keyframes
  }, [keyframes])

  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  useEffect(() => {
    durationRef.current = duration
  }, [duration])

  useEffect(() => {
    saveStudioState({ settings, keyframes, duration })
  }, [settings, keyframes, duration])

  useEffect(() => {
    saveSavedSetups(savedSetups)
  }, [savedSetups])

  useEffect(() => {
    if (!isPlaying) {
      return
    }

    let frameId = 0
    let last = performance.now()

    const tick = (now: number) => {
      const delta = (now - last) / 1000
      last = now

      setCurrentTime((previousTime) => {
        const timelineDuration = Math.max(durationRef.current, 0.5)
        const nextTime = (previousTime + delta) % timelineDuration

        if (keyframesRef.current.length > 0) {
          const sampled = sampleKeyframes({
            keyframes: keyframesRef.current,
            time: nextTime,
            fallback: settingsRef.current,
          })
          setSettings((prev) => ({
            ...prev,
            ...sampled,
            grain: prev.grain,
            wireframe: prev.wireframe,
          }))
        }

        return nextTime
      })

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [isPlaying])

  const handleScrub = useCallback((time: number) => {
    const clamped = clamp(time, 0, durationRef.current)
    setCurrentTime(clamped)

    if (keyframesRef.current.length === 0) {
      return
    }

    setSettings((previous) => {
      const sampled = sampleKeyframes({
        keyframes: keyframesRef.current,
        time: clamped,
        fallback: previous,
      })

      return {
        ...previous,
        ...sampled,
        grain: previous.grain,
        wireframe: previous.wireframe,
      }
    })
  }, [])

  const applyPreset = (id: string) => {
    const preset = builtInPresets.find((candidate) => candidate.id === id)
    if (!preset) {
      return
    }

    setSettings(preset.settings)
  }

  const addKeyframe = () => {
    const keyframe: Keyframe = {
      id: crypto.randomUUID(),
      time: Number(currentTime.toFixed(2)),
      settings: toAnimatableSettings(settings),
    }

    setKeyframes((prev) => sortKeyframes([...prev, keyframe]))
  }

  const updateKeyframeTime = (id: string, time: number) => {
    setKeyframes((prev) =>
      sortKeyframes(
        prev.map((keyframe) =>
          keyframe.id === id
            ? { ...keyframe, time: clamp(Number(time.toFixed(2)), 0, duration) }
            : keyframe,
        ),
      ),
    )
  }

  const deleteKeyframe = (id: string) => {
    setKeyframes((prev) => prev.filter((keyframe) => keyframe.id !== id))
  }

  const saveCurrentSetup = (name: string) => {
    setSavedSetups((prev) => [
      {
        id: crypto.randomUUID(),
        name,
        settings,
        createdAt: Date.now(),
      },
      ...prev,
    ])
  }

  const loadSetup = (id: string) => {
    const setup = savedSetups.find((item) => item.id === id)
    if (!setup) {
      return
    }

    setSettings(setup.settings)
  }

  const deleteSetup = (id: string) => {
    setSavedSetups((prev) => prev.filter((item) => item.id !== id))
  }

  const handleExportPng = useCallback(() => {
    if (!canvasElement) {
      return
    }

    canvasElement.toBlob((blob) => {
      if (!blob) {
        return
      }

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `shader-gradient-${Date.now()}.png`
      anchor.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }, [canvasElement])

  const handleExportVideo = useCallback(
    async (durationSeconds: number) => {
      if (!canvasElement) {
        return
      }

      setIsPlaying(true)
      handleScrub(0)

      await new Promise((resolve) => setTimeout(resolve, 100))

      const blob = await exportVideo({
        canvas: canvasElement,
        durationSeconds: clamp(durationSeconds, 1, 60),
        fps: 30,
      })

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `shader-gradient-${Date.now()}.webm`
      anchor.click()
      URL.revokeObjectURL(url)

      setIsPlaying(false)
    },
    [canvasElement, handleScrub],
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <GradientCanvas
        settings={settings}
        isPlaying={isPlaying}
        onCanvasReady={setCanvasElement}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      <main className="relative z-10 grid min-h-screen grid-rows-[1fr_auto] gap-4 p-4 lg:grid-cols-[1fr_400px] lg:grid-rows-1">
        <section className="pointer-events-auto flex flex-col justify-end gap-3">
          <PresetBar
            presets={builtInPresets}
            onApplyPreset={applyPreset}
            onRandomize={() => setSettings((prev) => randomizeSettings(prev))}
          />

          <Timeline
            keyframes={keyframes}
            duration={duration}
            currentTime={currentTime}
            onScrub={handleScrub}
            onDurationChange={(value) => {
              setDuration(value)
              setCurrentTime((current) => clamp(current, 0, value))
            }}
            onAddKeyframe={addKeyframe}
            onDeleteKeyframe={deleteKeyframe}
            onKeyframeTimeChange={updateKeyframeTime}
          />

          <p className="text-xs text-zinc-400">{keyframes.length} keyframes</p>
        </section>

        <aside className="pointer-events-auto flex flex-col gap-3 lg:ml-auto">
          <ControlPanel
            settings={settings}
            onChange={setSettings}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying((playing) => !playing)}
          />

          <SavedSetups
            setups={savedSetups}
            onSave={saveCurrentSetup}
            onLoad={loadSetup}
            onDelete={deleteSetup}
          />

          <ExportMenu
            duration={duration}
            disabled={!canvasElement}
            onExportPng={handleExportPng}
            onExportVideo={handleExportVideo}
          />
        </aside>
      </main>
    </div>
  )
}
