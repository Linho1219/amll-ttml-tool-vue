import { ref } from 'vue'
import { defineStore } from 'pinia'
export enum View {
  Content,
  Timing,
  Preview,
}
export const useConfigStore = defineStore('config', () => {
  const globalLatency = ref(0)
  const hltLineTimeConflicts = ref(false)
  const hltWordTimeConflicts = ref(false)
  const scrollWithPlayback = ref(false)
  const swapTranslateRoman = ref(false)

  return {
    globalLatency,
    hltLineTimeConflicts,
    swapTranslateRoman,
    hltWordTimeConflicts,
    scrollWithPlayback,
  }
})
