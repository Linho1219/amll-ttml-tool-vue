import { useCoreStore, type LyricLine, type MetadataKey } from '@/stores/core'
import editHistory from '@/stores/editHistory'
import { useRuntimeStore } from '@/stores/runtime'

export interface Persist {
  metadata: Record<MetadataKey, string[]>
  lyricLines: LyricLine[]
  version?: string
}

export function importPersist(data: Persist) {
  editHistory.shutdown()
  const coreStore = useCoreStore()
  const runtimeStore = useRuntimeStore()
  runtimeStore.clearSelection()
  coreStore.metadata.clear()
  for (const [key, values] of Object.entries(data.metadata)) {
    const k = key as MetadataKey
    coreStore.metadata.set(k, values)
  }
  coreStore.lyricLines.splice(0, coreStore.lyricLines.length, ...data.lyricLines)
  editHistory.init()
}

export function exportPersist(): Persist {
  const coreStore = useCoreStore()
  const outputData: Persist = {
    metadata: [...coreStore.metadata].reduce(
      (obj, [key, value]) => ((obj[key] = value), obj),
      {} as Record<MetadataKey, string[]>,
    ),
    lyricLines: coreStore.lyricLines,
    version: __VERSION__,
  }
  return outputData
}
