import {
  useCoreStore,
  type Comment,
  type LyricLine,
  type Metadata,
  type MetadataKey,
} from '@/stores/core'
import { useRuntimeStore } from '../../stores/runtime'
import { parse, stringify } from 'flatted'

interface NativeDataOutput {
  createdAt: number
  lastModified: number
  metadata: Record<MetadataKey, string[]>
  lyricLines: LyricLine[]
  comments: Comment[]
}

export function stringifyNative(): string {
  const coreStore = useCoreStore()
  const outputData: NativeDataOutput = {
    createdAt: coreStore.createdAt,
    lastModified: Date.now(),
    metadata: [...coreStore.metadata].reduce(
      (obj, [key, value]) => ((obj[key] = value), obj),
      {} as Record<MetadataKey, string[]>,
    ),
    lyricLines: coreStore.lyricLines,
    comments: coreStore.comments,
  }
  return stringify(outputData)
}

export function importFromNativeFormat(data: string): void {
  const coreStore = useCoreStore()
  const runtimeStore = useRuntimeStore()
  const inputData: NativeDataOutput = parse(data)
  runtimeStore.clearSelection()
  coreStore.createdAt = inputData.createdAt
  coreStore.metadata.clear()
  for (const key in inputData.metadata) {
    const k = key as MetadataKey
    coreStore.metadata.set(k, inputData.metadata[k]!)
  }
  coreStore.lyricLines.splice(0, coreStore.lyricLines.length, ...inputData.lyricLines)
  coreStore.comments.splice(0, coreStore.comments.length, ...inputData.comments)
}
