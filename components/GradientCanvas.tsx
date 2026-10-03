'use client'

import { useEffect, useRef } from 'react'
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'
import type { GradientSettings } from '@/lib/types'

/*
Research summary (source: shadergradient README + @shadergradient/react dist/index.d.mts):
- Install command/package:
  npm i @shadergradient/react @react-three/fiber three three-stdlib camera-controls
  npm i -D @types/three
- Components exported by @shadergradient/react: ShaderGradientCanvas, ShaderGradient
- Prop mapping used by this studio:
  - Three colors: color1, color2, color3 (string hex values like "#ff5e3a")
  - Animation on/off: animate with 'on' | 'off'
  - Animation speed: uSpeed (number)
  - Grain on/off: grain with 'on' | 'off'
  - Grain intensity: grainBlending (number)
  - Wireframe on/off: wireframe (boolean)
  - Brightness: brightness (number)
  - Camera position/orientation: cAzimuthAngle, cPolarAngle, cDistance (numbers)
  - Light angle/direction: no direct light-angle vector prop is exposed in GradientT; closest exposed controls are lightType/envPreset.
    This app maps the requested lightAngle field to cAzimuthAngle as the closest real equivalent.
- Imperative/ref API: no documented imperative ref API for frame updates is exported; updates are done by changing props.
- SSR/bundler caveats:
  - In Next.js App Router, render this component client-side only and import with next/dynamic { ssr: false }.
  - README compatibility matrix requires React 19 + @react-three/fiber v9 for Next.js App Router.
*/

type GradientCanvasProps = {
  settings: GradientSettings
  isPlaying: boolean
  onCanvasReady: (canvas: HTMLCanvasElement | null) => void
}

export function GradientCanvas({
  settings,
  isPlaying,
  onCanvasReady,
}: GradientCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const syncCanvas = () => {
      onCanvasReady(container.querySelector('canvas'))
    }

    syncCanvas()

    const observer = new MutationObserver(syncCanvas)
    observer.observe(container, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      onCanvasReady(null)
    }
  }, [onCanvasReady])

  return (
    <div ref={containerRef} className="absolute inset-0">
      <ShaderGradientCanvas
        style={{ position: 'absolute', inset: 0 }}
        pixelDensity={1.5}
        fov={45}
        preserveDrawingBuffer
      >
        <ShaderGradient
          animate={isPlaying ? 'on' : 'off'}
          type="plane"
          shader="defaults"
          color1={settings.colors[0]}
          color2={settings.colors[1]}
          color3={settings.colors[2]}
          brightness={settings.brightness}
          grain={settings.grain ? 'on' : 'off'}
          grainBlending={settings.grainIntensity}
          wireframe={settings.wireframe}
          uSpeed={settings.animationSpeed}
          cAzimuthAngle={settings.camera.x + settings.lightAngle}
          cPolarAngle={settings.camera.y}
          cDistance={settings.camera.z}
          lightType="3d"
          control="props"
        />
      </ShaderGradientCanvas>
    </div>
  )
}
