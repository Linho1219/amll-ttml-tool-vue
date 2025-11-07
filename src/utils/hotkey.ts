export type HotkeyCmd =
  | 'switchToContent'
  | 'switchToTiming'
  | 'switchToPreview'
  | 'goPrevLine'
  | 'goNextLine'
  | 'goPrevWord'
  | 'goNextWord'
  | 'goPrevWordnPlay'
  | 'goNextWordnPlay'
  | 'markBegin'
  | 'markEndBegin'
  | 'markEnd'
  | 'playPauseAudio'
  | 'seekBackward'
  | 'seekForward'
  | 'volumeUp'
  | 'volumeDown'

export interface HotKey {
  key: string
  ctrl: boolean
  alt: boolean
  shift: boolean
}

export function isHotkeyMatch(a: HotKey, b: HotKey) {
  return a.key === b.key && a.ctrl === b.ctrl && a.alt === b.alt && a.shift === b.shift
}

const keyBlockList = new Set([
  'Meta',
  'CapsLock',
  'Tab',
  'Control',
  'Shift',
  'Alt',
  'Meta',
  'Unidentified',
])
export function parseKeyEvent(e: KeyboardEvent): HotKey | null {
  if (keyBlockList.has(e.key)) return null
  const key = e.key.toUpperCase()
  return {
    key,
    ctrl: e.ctrlKey || e.metaKey,
    alt: e.altKey,
    shift: e.shiftKey,
  }
}

const keyRewrites: Record<string, string> = {
  ' ': '空格',
  Escape: 'Esc',
  ArrowLeft: '←',
  ArrowRight: '→',
  ArrowUp: '↑',
  ArrowDown: '↓',
}
export function hotkeyToString(hotkey: HotKey, isMac: boolean = false) {
  const parts: string[] = []
  if (hotkey.ctrl) parts.push(isMac ? '⌘' : 'Ctrl')
  if (hotkey.alt) parts.push(isMac ? '⌥' : 'Alt')
  if (hotkey.shift) parts.push(isMac ? '⇧' : 'Shift')
  const key = keyRewrites[hotkey.key] ?? hotkey.key
  parts.push(key)
  return parts.join(isMac ? '' : '+')
}
