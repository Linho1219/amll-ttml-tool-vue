import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { LyricLine, LyricWord } from './core'
export enum View {
  Content,
  Timing,
  Preview,
}
export const useRuntimeStore = defineStore('runtime', () => {
  const currentView = ref(View.Content)
  const selectedLines = reactive(new Set<LyricLine>())
  const selectedWords = reactive(new Set<LyricWord>())
  return { currentView, selectedLines, selectedWords }
})
