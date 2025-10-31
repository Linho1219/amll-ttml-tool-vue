import {
  computed,
  reactive,
  ref,
  shallowReactive,
  shallowRef,
  type Ref,
  type ShallowRef,
} from 'vue'
import { defineStore } from 'pinia'
import { useCoreStore, type LyricLine, type LyricWord } from './core'
export enum View {
  Content,
  Timing,
  Preview,
}
export const useRuntimeStore = defineStore('runtime', () => {
  // View
  const currentView = ref(View.Content)
  const isContentView = computed(() => currentView.value === View.Content)
  const isTimingView = computed(() => currentView.value === View.Timing)
  const isPreviewView = computed(() => currentView.value === View.Preview)

  // Selection & drag
  const selectedLines = shallowReactive(new Set<LyricLine>())
  const selectedWords = shallowReactive(new Set<LyricWord>())

  const isDragging = ref(false)
  const isDraggingCopy = ref(false)
  const canDrop = ref(false)
  const isDraggingWord = computed(() => isDragging.value && selectedWords.size > 0)
  const isDraggingLine = computed(
    () => isDragging.value && selectedWords.size === 0 && selectedLines.size > 0,
  )

  // Context menu hook
  const closeContext = ref<null | (() => void)>(null)

  // Options
  const globalLatency = ref(0)
  const hltLineTimeConflicts = ref(false)
  const hltWordTimeConflicts = ref(false)
  const scrollWithPlayback = ref(false)
  const swapTranslateRoman = ref(false)

  return {
    currentView,
    isContentView,
    isTimingView,
    isPreviewView,
    selectedLines: selectedLines as ReadonlySet<LyricLine>,
    selectedWords: selectedWords as ReadonlySet<LyricWord>,
    clearSelection,
    clearWordSelection,
    selectLine,
    selectWord,
    selectLineWord,
    applyWordSelectToLine,
    addWordToSelection,
    addLineToSelection,
    removeWordFromSelection,
    removeLineFromSelection,
    isDragging,
    isDraggingCopy,
    canDrop,
    isDraggingWord,
    isDraggingLine,
    closeContext,
    globalLatency,
    hltLineTimeConflicts,
    swapTranslateRoman,
    hltWordTimeConflicts,
    scrollWithPlayback,
  }

  function clearSelection() {
    selectedLines.clear()
    selectedWords.clear()
  }
  function clearWordSelection() {
    selectedWords.clear()
  }
  function selectWord(...words: LyricWord[]) {
    if (words.length === 1 && selectedWords.has(words[0]!)) {
      applyWordSelectToLine()
      return
    }
    clearWordSelection()
    words.forEach((word) => selectedWords.add(word))
    applyWordSelectToLine()
  }
  function selectLine(...lines: LyricLine[]) {
    if (lines.length === 1 && selectedLines.has(lines[0]!)) {
      clearWordSelection()
      return
    }
    clearSelection()
    lines.forEach((line) => selectedLines.add(line))
  }
  function selectLineWord(line: LyricLine, ...words: LyricWord[]) {
    clearSelection()
    selectedLines.add(line)
    words.forEach((word) => selectedWords.add(word))
  }
  function addWordToSelection(...words: LyricWord[]) {
    words.forEach((word) => selectedWords.add(word))
    applyWordSelectToLine()
  }
  function addLineToSelection(...lines: LyricLine[]) {
    lines.forEach((line) => selectedLines.add(line))
    clearWordSelection()
  }
  function removeWordFromSelection(...words: LyricWord[]) {
    words.forEach((word) => selectedWords.delete(word))
    applyWordSelectToLine()
  }
  function removeLineFromSelection(...lines: LyricLine[]) {
    lines.forEach((line) => selectedLines.delete(line))
    clearWordSelection()
  }
  function applyWordSelectToLine() {
    selectedLines.clear()
    if (selectedWords.size === 0) return
    const coreStore = useCoreStore()
    for (const line of coreStore.lyricLines)
      for (const word of line.words) if (selectedWords.has(word)) selectedLines.add(line)
  }
})
