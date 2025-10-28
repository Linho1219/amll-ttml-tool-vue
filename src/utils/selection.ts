import { useRuntimeStore } from '../stores/runtime'
import { useCoreStore, type LyricLine, type LyricWord } from '../stores/core'

// Don't useRuntimeStore now: Pinia isn't ready yet

export function forceOutsideBlur() {
  const focusedInput = document.activeElement
  const isInputElement = (el: Element | null): el is HTMLInputElement =>
    el !== null && el.tagName === 'INPUT'
  if (!isInputElement(focusedInput)) return
  const selectionRoot = document.querySelector('[selection-root]')
  if (selectionRoot?.contains(focusedInput)) return
  focusedInput.blur()
}

export function sortIndex(a: number, b: number): [number, number] {
  if (a < 0 || b < 0) throw new Error('Indices must be non-negative')
  return a < b ? [a, b] : [b, a]
}

export function sortWords(...words: LyricWord[]): LyricWord[] {
  if (words.length <= 1) return words
  const coreStore = useCoreStore()
  const indexMap = new Map<LyricWord, number>()
  let index = 0
  for (const line of coreStore.lyricLines)
    for (const word of line.words) indexMap.set(word, index++)
  return words.sort((a, b) => indexMap.get(a)! - indexMap.get(b)!)
}

export function sortLines(...lines: LyricLine[]): LyricLine[] {
  if (lines.length <= 1) return lines
  const coreStore = useCoreStore()
  const indexMap = new Map<LyricLine, number>()
  coreStore.lyricLines.forEach((line, index) => indexMap.set(line, index))
  return lines.sort((a, b) => indexMap.get(a)! - indexMap.get(b)!)
}
