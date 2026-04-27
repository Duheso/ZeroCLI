import * as React from 'react'
import { useState, useEffect } from 'react'
import { Box, Text } from '../../ink.js'

// ─── Color helpers (mirror de StartupScreen.ts) ───────────────────────────────

type RGB = [number, number, number]

const ESC = '\x1b['
const RESET = `${ESC}0m`
const rgb = (r: number, g: number, b: number) => `${ESC}38;2;${r};${g};${b}m`

function lerp(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

function gradAt(stops: RGB[], t: number): RGB {
  const c = Math.max(0, Math.min(1, t))
  const s = c * (stops.length - 1)
  const i = Math.floor(s)
  if (i >= stops.length - 1) return stops[stops.length - 1]!
  return lerp(stops[i]!, stops[i + 1]!, s - i)
}

const PURPLE_CYAN: RGB[] = [
  [160, 32, 240],
  [120, 60, 250],
  [70, 120, 255],
  [0, 180, 255],
  [0, 240, 240],
]
const WHITE: RGB = [255, 255, 255]

function paintLine(text: string, lineT: number, wavePos: number): string {
  const len = text.length
  let out = ''
  for (let i = 0; i < len; i++) {
    const charT = len > 1 ? lineT * 0.5 + (i / (len - 1)) * 0.5 : lineT
    const base = gradAt(PURPLE_CYAN, charT)
    const wave = (i / Math.max(1, len - 1)) - wavePos
    const shimmer = Math.max(0, Math.sin(wave * Math.PI * 3)) ** 4
    const [r, g, b] = lerp(base, WHITE, shimmer * 0.88)
    out += `${rgb(r, g, b)}${text[i]}`
  }
  return out + RESET
}

// ─── Logo lines ───────────────────────────────────────────────────────────────

const LOGO_LINES = [
  `  ███████╗███████╗██████╗  ██████╗     ██████╗██╗     ██╗`,
  `  ╚══███╔╝██╔════╝██╔══██╗██╔═══██╗   ██╔════╝██║     ██║`,
  `    ███╔╝ █████╗  ██████╔╝██║   ██║   ██║     ██║     ██║`,
  `   ███╔╝  ██╔══╝  ██╔══██╗██║   ██║   ██║     ██║     ██║`,
  `  ███████╗███████╗██║  ██║╚██████╔╝██╗╚██████╗███████╗██║`,
  `  ╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝ ╚═════╝╚══════╝╚═╝`,
]

const TOTAL = LOGO_LINES.length
const SWEEP_FRAMES = 40 // frames per full sweep
const FPS_MS = 40       // ~25 fps
const ANIM_DURATION_MS = 3000 // stop after 3 seconds

// ─── Component ────────────────────────────────────────────────────────────────

export function ShimmerLogo() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), FPS_MS)
    const stop = setTimeout(() => clearInterval(id), ANIM_DURATION_MS)
    return () => {
      clearInterval(id)
      clearTimeout(stop)
    }
  }, [])

  const globalWave = ((frame % SWEEP_FRAMES) / SWEEP_FRAMES) * 1.5 - 0.25

  return (
    <Box flexDirection="column" marginTop={1} marginBottom={1}>
      {LOGO_LINES.map((line, li) => {
        const lineT = TOTAL > 1 ? li / (TOTAL - 1) : 0
        // diagonal: wave shifts right per row
        const lineWave = globalWave - (li / Math.max(1, TOTAL - 1)) * 0.28
        return <Text key={li}>{paintLine(line, lineT, lineWave)}</Text>
      })}
    </Box>
  )
}
