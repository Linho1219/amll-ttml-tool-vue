import { useAudioCtrl } from '@/utils/audio'
import type { LyricLine, LyricWord } from './core'

const staticStore = {
  lineHooks: new Map<string, LineComponentActions>(),
  wordHooks: new Map<string, WordComponentActions>(),
  audio: useAudioCtrl(),
  lastTouchedLine: null as LyricLine | null,
  lastTouchedWord: null as LyricWord | null,
  touchLineWord,
  touchLineOnly,
  touchClear,
}

export const useStaticStore = () => staticStore

export interface LineComponentActions {
  scrollTo: () => void
  setHighlight: (highlight: boolean) => void
}
export interface WordComponentActions {
  scrollTo: () => void
  setHighlight: (highlight: boolean) => void
  focusInput: (position?: number) => void
}

function touchLineWord(line: LyricLine, word: LyricWord) {
  staticStore.lastTouchedLine = line
  staticStore.lastTouchedWord = word
}
function touchLineOnly(line: LyricLine) {
  staticStore.lastTouchedLine = line
  staticStore.lastTouchedWord = null
}
function touchClear() {
  staticStore.lastTouchedLine = null
  staticStore.lastTouchedWord = null
}
