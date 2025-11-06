import { coreCreate } from '@/stores/core'
import { importPersist, type Persist } from '.'

export function parsePlainText(plain: string): Persist {
  const lines = plain
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) =>
      coreCreate.newLine({ words: [coreCreate.newWord({ word: l, startTime: 0, endTime: 0 })] }),
    )
  return { metadata: {}, lyricLines: lines }
}

export const importPlainText = (s: string) => importPersist(parsePlainText(s))
