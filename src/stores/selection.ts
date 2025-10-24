import { useRuntimeStore } from './runtime'
import type { LyricLine, LyricWord } from './core'

// Don't useRuntimeStore now: Pinia isn't ready yet

export function clearSelection() {
  const runtimeStore = useRuntimeStore()
  forceRibbonBlur()
  runtimeStore.selectedLines.clear()
  runtimeStore.selectedWords.clear()
}

export function justSelect(word: LyricWord): void
export function justSelect(line: LyricLine): void
export function justSelect(item: LyricWord | LyricLine) {
  const runtimeStore = useRuntimeStore()
  forceRibbonBlur()
  if (isWord(item)) {
    if (runtimeStore.selectedWords.has(item)) return
    runtimeStore.selectedWords.clear()
    runtimeStore.selectedWords.add(item)
    runtimeStore.selectedLines.clear()
    runtimeStore.selectedLines.add(item.parentLine)
  } else {
    runtimeStore.selectedWords.clear()
    if (runtimeStore.selectedLines.has(item)) return
    runtimeStore.selectedLines.clear()
    runtimeStore.selectedLines.add(item)
  }
}

export function toggleSelect(word: LyricWord): void
export function toggleSelect(line: LyricLine): void
export function toggleSelect(item: LyricWord | LyricLine) {
  const runtimeStore = useRuntimeStore()
  forceRibbonBlur()
  if (isWord(item)) {
    if (runtimeStore.selectedWords.has(item)) runtimeStore.selectedWords.delete(item)
    else runtimeStore.selectedWords.add(item)
  } else {
    runtimeStore.selectedWords.clear()
    if (runtimeStore.selectedLines.has(item)) runtimeStore.selectedLines.delete(item)
    else runtimeStore.selectedLines.add(item)
  }
}

const isWord = (item: LyricWord | LyricLine): item is LyricWord => 'parentLine' in item
export function forceRibbonBlur() {
  const focusedInput = document.activeElement
  const isInputElement = (el: Element | null): el is HTMLInputElement =>
    el !== null && el.tagName === 'INPUT'
  if (!isInputElement(focusedInput)) return
  const selectionRoot = document.querySelector('[selection-root]')
  if (selectionRoot?.contains(focusedInput)) return
  focusedInput.blur()
}
