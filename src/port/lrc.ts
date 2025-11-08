// Basic LRC parser and stringifier
// LRC is a common lyric format used by many music players
// By 'basic', we mean it only supports line-level timestamps, not word-level timestamps
// For word-level extensions, see LRC A2, etc.

// Format:
// [mm:ss.xx]lyric line1
// [mm:ss.xx]lyric line2
// [mm:ss.xx][mm:ss.xx]lyric line3 (repeat the same line)

// Example:
// [01:56.439]Life goes on, through tides of time
// [02:01.079]Get in the line, to dream alive
// [02:03.552]In our souls, do we know?
// [02:06.103][02:08.916][02:11.135]On the journey

import { coreCreate, type LyricLine } from '@/stores/core'
import { importPersist, type Persist } from '.'

export function parseLRC(lrc: string) {
  const lines = lrc
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
  const lyricLines: LyricLine[] = []
  lines.forEach((lineStr) => {
    if (lineStr.startsWith('#') || lineStr.startsWith('{')) return
    const matchTimestamp = (line: string) => {
      const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$/)
      if (!match) return null
      const [, minStr, secStr, msStr, text] = match
      const minutes = Number(minStr)
      const seconds = Number(secStr)
      const milliseconds = Number(msStr!.padEnd(3, '0'))
      const timeStamp = minutes * 60000 + seconds * 1000 + milliseconds
      return { timeStamp, text: text! }
    }
    const timeStamps: number[] = []
    while (true) {
      const result = matchTimestamp(lineStr)
      if (!result) break
      timeStamps.push(result.timeStamp)
      lineStr = result.text
    }
    if (timeStamps.length === 0) return
    timeStamps.forEach((ts) => {
      lyricLines.push(
        coreCreate.newLine({
          startTime: ts,
          endTime: ts,
          words: [coreCreate.newWord({ word: lineStr, startTime: ts, endTime: ts })],
        }),
      )
    })
  })
  for (let i = lyricLines.length - 1; i > 0; i--) {
    const line = lyricLines[i]!
    const prevLine = lyricLines[i - 1]!
    prevLine.endTime = line.startTime
    prevLine.words[0]!.endTime = line.startTime
  }
  return {
    metadata: {},
    lyricLines,
  }
}

export function stringifyLRC(data: Persist): string {
  const lines = data.lyricLines
  return lines
    .map((line) => {
      const min = Math.floor(line.startTime / 60000)
      const sec = Math.floor((line.startTime % 60000) / 1000)
      const ms = line.startTime % 1000
      const text = line.words.map((w) => w.word).join('')
      return `[${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(
        ms,
      ).padStart(3, '0')}]${text}`
    })
    .join('\n')
}

export const importLRC = (s: string) => importPersist(parseLRC(s))
