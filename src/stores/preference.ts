import { reactive, readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { getDefaultHotkeyMap } from '@/utils/hotkey'

export const usePreferenceStore = defineStore('preference', () => {
  const globalLatency = ref(0)
  const hltLineTimeConflicts = ref(false)
  const hltWordTimeConflicts = ref(false)
  const scrollWithPlayback = ref(false)
  const swapTranslateRoman = ref(false)
  const alwaysIgnoreBackground = ref(false)
  const sidebarWidth = ref(360)
  const hotkeyMap = reactive(getDefaultHotkeyMap())

  const __test_forceMac = false
  const isMac = __test_forceMac || navigator.platform.toLowerCase().includes('mac')

  return {
    globalLatency,
    hltLineTimeConflicts,
    swapTranslateRoman,
    alwaysIgnoreBackground,
    hltWordTimeConflicts,
    scrollWithPlayback,
    sidebarWidth,
    hotkeyMap,
    isMac,
  }
})
