import { computed, reactive, ref, watch, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useCoreStore, type LyricLine, type LyricWord } from './core'
import { useAudioCtrl } from '@/utils/audio'
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
  const selectedLines = reactive(new Set<LyricLine>())
  const selectedWords = reactive(new Set<LyricWord>())

  const lastTouchedLine = ref<LyricLine | null>(null)
  const lastTouchedWord = ref<LyricWord | null>(null)
  const isDragging = ref(false)
  const isDraggingCopy = ref(false)
  const canDrop = ref(false)
  const isDraggingWord = computed(() => isDragging.value && selectedWords.size > 0)
  const isDraggingLine = computed(
    () => isDragging.value && selectedWords.size === 0 && selectedLines.size > 0,
  )

  // Component hooks
  const lineHooks = reactive(new WeakMap<LyricLine, LineComponentActions>())
  const wordHooks = reactive(new WeakMap<LyricWord, WordComponentActions>())

  // Context menu hook
  const closeContext = ref<null | (() => void)>(null)

  // Options
  const globalLatency = ref(0)
  const hltLineTimeConflicts = ref(false)
  const hltWordTimeConflicts = ref(false)
  const scrollWithPlayback = ref(false)
  const swapTranslateRoman = ref(false)

  // Audio
  const audio = useAudioCtrl()
  const getAudio = () => audio

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
    applyWordSelectToLine,
    addWordToSelection,
    addLineToSelection,
    removeWordFromSelection,
    removeLineFromSelection,
    lastTouchedLine: lastTouchedLine as Readonly<Ref<LyricLine | null>>,
    lastTouchedWord: lastTouchedWord as Readonly<Ref<LyricWord | null>>,
    touchLineWord,
    touchLineOnly,
    touchClear,
    isDragging,
    isDraggingCopy,
    canDrop,
    isDraggingWord,
    isDraggingLine,
    lineHooks,
    wordHooks,
    closeContext,
    globalLatency,
    hltLineTimeConflicts,
    swapTranslateRoman,
    hltWordTimeConflicts,
    scrollWithPlayback,
    getAudio,
  }

  function clearSelection() {
    selectedLines.clear()
    selectedWords.clear()
  }
  function clearWordSelection() {
    selectedWords.clear()
  }
  function selectWord(...words: LyricWord[]) {
    clearWordSelection()
    words.forEach((word) => selectedWords.add(word))
    applyWordSelectToLine()
  }
  function selectLine(...lines: LyricLine[]) {
    clearSelection()
    lines.forEach((line) => selectedLines.add(line))
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
  function touchLineWord(line: LyricLine, word: LyricWord) {
    lastTouchedLine.value = line
    lastTouchedWord.value = word
  }
  function touchLineOnly(line: LyricLine) {
    lastTouchedLine.value = line
    lastTouchedWord.value = null
  }
  function touchClear() {
    lastTouchedLine.value = null
    lastTouchedWord.value = null
  }
})

export interface LineComponentActions {
  scrollTo: () => void
  setHighlight: (highlight: boolean) => void
}
export interface WordComponentActions {
  scrollTo: () => void
  setHighlight: (highlight: boolean) => void
  focusInput: (position?: number) => void
}
