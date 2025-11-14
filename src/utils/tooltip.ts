import { usePreferenceStore } from '@/stores/preference'
import { hotkeyToString, type HotkeyCmd } from './hotkey'

function getHotkeyStr(hotkeyCmd: HotkeyCmd) {
  const preferenceStore = usePreferenceStore()
  const hotkey = preferenceStore.hotkeyMap[hotkeyCmd][0]
  if (!hotkey) return undefined
  const hotkeyStr = hotkeyToString(hotkey, preferenceStore.isMac)
  return hotkeyStr
}

export function tipHotkey(label: string | undefined, hotkeyCmd: HotkeyCmd) {
  const hotkeyStr = getHotkeyStr(hotkeyCmd)
  if (!hotkeyStr) return label
  return {
    content: /* html */ `${label ?? ''} <span class="tooltip-hotkey">${hotkeyStr}</span>`,
    html: true,
  }
}

export function tipDesc(label: string, desc: string, hotkeyCmd?: HotkeyCmd) {
  const hotkeyStr = hotkeyCmd ? getHotkeyStr(hotkeyCmd) : ''
  return {
    content: /* html */ `
      <div class="tooltip-headline">
        <div class="tooltip-title">${label}</div>
        <span class="tooltip-hotkey">${hotkeyStr}</span>
      </div>
      <div class="tooltip-desc">${desc}</div>
    `,
    html: true,
    placement: 'bottom',
  }
}
