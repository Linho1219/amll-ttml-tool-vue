import { computed, nextTick, reactive, toRaw, watch } from 'vue'
import {
  useCoreStore,
  type Comment,
  type LyricLine,
  type LyricWord,
  type TTMLMetadata,
} from '../stores/core'
import { useRuntimeStore, type View } from '../stores/runtime'
import cloneDeep from 'lodash-es/cloneDeep'

interface Snapshot {
  timestamp: number
  core: {
    createdAt: number
    metadata: TTMLMetadata[]
    lyricLines: LyricLine[]
    comments: Comment[]
  }
  runtime: {
    currentView: View
    selectedLines: ReadonlySet<LyricLine>
    selectedWords: ReadonlySet<LyricWord>
    lastTouchedLine: LyricLine | null
    lastTouchedWord: LyricWord | null
  }
}

const snapshotList = new Map<number, Snapshot>()
const state = reactive({
  head: -1,
  current: -1,
  tail: 0,
})
const redoable = computed(() => state.current < state.head)
const undoable = computed(() => state.current > state.tail)
const maxLength = 50
let stopRecording = false

let shutdownHook: (() => void) | null = null

function init() {
  state.head = state.current = -1
  state.tail = 0
  stopRecording = false
  snapshotList.clear()
  take()
  const coreStore = useCoreStore()
  shutdownHook = watch(
    coreStore,
    () => {
      if (!stopRecording) nextTick(() => take())
    },
    { deep: true },
  )
}

function take() {
  const runtimeStore = useRuntimeStore()
  const coreStore = useCoreStore()

  const snapshot: Snapshot = cloneDeep({
    timestamp: Date.now(),
    core: {
      createdAt: coreStore.createdAt,
      metadata: toRaw(coreStore.metadata),
      lyricLines: toRaw(coreStore.lyricLines),
      comments: toRaw(coreStore.comments),
    },
    runtime: {
      currentView: toRaw(runtimeStore.currentView),
      selectedLines: toRaw(runtimeStore.selectedLines),
      selectedWords: toRaw(runtimeStore.selectedWords),
      lastTouchedLine: toRaw(runtimeStore.lastTouchedLine),
      lastTouchedWord: toRaw(runtimeStore.lastTouchedWord),
    },
  })
  snapshotList.set(++state.current, snapshot)
  if (state.current < state.head)
    for (let i = state.head; i > state.current; --i) snapshotList.delete(i)
  state.head = state.current
  if (snapshotList.size > maxLength) snapshotList.delete(state.tail++)
}

function wayback(snapshot: Snapshot) {
  stopRecording = true
  const runtimeStore = useRuntimeStore()
  const coreStore = useCoreStore()
  coreStore.createdAt = snapshot.core.createdAt
  coreStore.metadata.splice(0, coreStore.metadata.length, ...snapshot.core.metadata)
  coreStore.lyricLines.splice(0, coreStore.lyricLines.length, ...snapshot.core.lyricLines)
  coreStore.comments.splice(0, coreStore.comments.length, ...snapshot.core.comments)
  runtimeStore.currentView = snapshot.runtime.currentView
  if (snapshot.runtime.selectedWords.size)
    runtimeStore.selectWord(...snapshot.runtime.selectedWords)
  else runtimeStore.selectLine(...snapshot.runtime.selectedLines)
  runtimeStore.lastTouchedLine = snapshot.runtime.lastTouchedLine
  runtimeStore.lastTouchedWord = snapshot.runtime.lastTouchedWord
  setTimeout(() => (stopRecording = false), 0)
}

function undo() {
  if (!undoable.value) return null
  const snapshot = cloneDeep(snapshotList.get(--state.current)!)
  wayback(snapshot)
}

function redo() {
  if (!redoable.value) return null
  const snapshot = cloneDeep(snapshotList.get(++state.current)!)
  wayback(snapshot)
}

function clear() {
  state.head = state.current = -1
  state.tail = 0
  snapshotList.clear()
  take()
}

function shutdown() {
  if (shutdownHook) {
    shutdownHook()
    shutdownHook = null
  }
}

export default {
  init,
  take,
  undo,
  redo,
  clear,
  shutdown,
  redoable,
  undoable,
  state: state as Readonly<typeof state>,
}
