export const exportVideo = async ({
  canvas,
  durationSeconds,
  fps = 30,
  mimeType = 'video/webm;codecs=vp9',
}: {
  canvas: HTMLCanvasElement
  durationSeconds: number
  fps?: number
  mimeType?: string
}) => {
  const stream = canvas.captureStream(fps)

  const safeMimeType = MediaRecorder.isTypeSupported(mimeType)
    ? mimeType
    : 'video/webm'

  const chunks: BlobPart[] = []

  return await new Promise<Blob>((resolve, reject) => {
    const recorder = new MediaRecorder(stream, {
      mimeType: safeMimeType,
      videoBitsPerSecond: 8_000_000,
    })

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    recorder.onerror = () => reject(new Error('Video recording failed.'))

    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: safeMimeType }))
    }

    recorder.start()

    window.setTimeout(() => {
      recorder.stop()
      stream.getTracks().forEach((track) => track.stop())
    }, durationSeconds * 1000)
  })
}
