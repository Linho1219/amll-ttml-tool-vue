import { useRuntimeStore } from '../stores/runtime'
import type { LyricWord } from '../stores/core'

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

export function applyWordSelectToLine(words: Set<LyricWord>) {
  const runtimeStore = useRuntimeStore()
  const parentLines = new Set([...words.values()].map((w) => w.parentLine))
  runtimeStore.selectedLines.clear()
  parentLines.forEach((line) => runtimeStore.selectedLines.add(line))
}
