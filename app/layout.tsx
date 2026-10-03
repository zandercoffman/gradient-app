import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shader Gradient Studio',
  description: 'Design, animate, and export shader gradients in real time.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  )
}
