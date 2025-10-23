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
  return { currentView, isContentView, isTimingView, isPreviewView, selectedLines, selectedWords }
})
