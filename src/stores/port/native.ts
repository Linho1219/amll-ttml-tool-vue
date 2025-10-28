import { useCoreStore, type Comment, type LyricLine, type TTMLMetadata } from '@/stores/core'
import { useRuntimeStore } from '@/stores/runtime'
import { parse, stringify } from 'flatted'

interface NativeDataOutput {
  createdAt: number
  lastModified: number
  metadata: TTMLMetadata[]
  lyricLines: LyricLine[]
  comments: Comment[]
}

export function exportToNativeFormat(): string {
  const coreStore = useCoreStore()
  const outputData: NativeDataOutput = {
    createdAt: coreStore.createdAt,
    lastModified: Date.now(),
    metadata: coreStore.metadata,
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
  coreStore.metadata.splice(0, coreStore.metadata.length, ...inputData.metadata)
  coreStore.lyricLines.splice(0, coreStore.lyricLines.length, ...inputData.lyricLines)
  coreStore.comments.splice(0, coreStore.comments.length, ...inputData.comments)
}
