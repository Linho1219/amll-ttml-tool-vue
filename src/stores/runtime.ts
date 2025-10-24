import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { LyricLine, LyricWord } from './core'
export enum View {
  Content,
  Timing,
  Preview,
}
export const useRuntimeStore = defineStore('runtime', () => {
  const currentView = ref(View.Content)
  const isContentView = computed(() => currentView.value === View.Content)
  const isTimingView = computed(() => currentView.value === View.Timing)
  const isPreviewView = computed(() => currentView.value === View.Preview)
  const selectedLines = reactive(new Set<LyricLine>())
  const selectedWords = reactive(new Set<LyricWord>())
  const lineHooks = reactive(new Map<LyricLine, LineComponentActions>())
  const wordHooks = reactive(new Map<LyricWord, WordComponentActions>())
  const globalLatency = ref(0)
  const hltLineTimeConflicts = ref(false)
  const hltWordTimeConflicts = ref(false)
  const scrollWithPlayback = ref(true)
  return {
    currentView,
    isContentView,
    isTimingView,
    isPreviewView,
    selectedLines,
    selectedWords,
    lineHooks,
    wordHooks,
    globalLatency,
    hltLineTimeConflicts,
    hltWordTimeConflicts,
    scrollWithPlayback,
  }
})

export interface LineComponentActions {
  scrollTo: () => void
  setHighlight: (highlight: boolean) => void
}
export interface WordComponentActions {
  scrollTo: () => void
  setHighlight: (highlight: boolean) => void
  focusInput: (position?: -1 | 0 | 1) => void
}
