<template>
  <div
    class="linsert-indicator"
    :class="{
      dragging: runtimeStore.isDragging,
      dragover,
      floatup,
    }"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  ></div>
</template>
<script setup lang="ts">
import { useCoreStore, type LyricLine } from '@/stores/core'
import { useRuntimeStore } from '@/stores/runtime'
import { useStaticStore } from '@/stores/static'
import { sortLines, sortWords } from '@/utils/selection'
import { ref, watch } from 'vue'
const runtimeStore = useRuntimeStore()
const coreStore = useCoreStore()
const staticStore = useStaticStore()
const dragover = ref(false)
const props = defineProps<{ index: number }>()

const floatup = ref(false)
watch(
  () => runtimeStore.isDragging,
  (val) => setTimeout(() => (floatup.value = val), 200),
)

function handleDragOver(_e: DragEvent) {
  dragover.value = true
  runtimeStore.canDrop = true
}
function handleDragLeave() {
  dragover.value = false
  runtimeStore.canDrop = false
}
function handleDrop(e: DragEvent) {
  dragover.value = false
  runtimeStore.canDrop = false
  if (runtimeStore.isDraggingLine) {
    const pendingLines = sortLines(...runtimeStore.selectedLines)
    if (e.ctrlKey || e.metaKey) {
      const duplicatedLines = pendingLines.map((oldLine) => {
        const newLine = coreStore.newLine({
          ...oldLine,
          words: oldLine.words.map(coreStore.newWord),
        })
        return newLine
      })
      coreStore.lyricLines.splice(props.index, 0, ...duplicatedLines)
      runtimeStore.selectLine(...duplicatedLines)
      staticStore.touchLineOnly(duplicatedLines.at(-1)!)
    } else {
      const placeholder = coreStore.newLine()
      coreStore.lyricLines.splice(props.index, 0, placeholder)
      coreStore.deleteLine(...pendingLines)
      const insertIndex = coreStore.lyricLines.indexOf(placeholder)
      coreStore.lyricLines.splice(insertIndex, 1, ...pendingLines)
      runtimeStore.selectLine(...pendingLines)
    }
  }
  if (runtimeStore.isDraggingWord) {
    const pendingWords = sortWords(...runtimeStore.selectedWords)
    const isCopy = e.ctrlKey || e.metaKey
    const newLine = coreStore.newLine({ words: pendingWords })
    if (isCopy) newLine.words = pendingWords.map(coreStore.newWord)
    else coreStore.deleteWord(...pendingWords)
    coreStore.lyricLines.splice(props.index, 0, newLine)
    if (isCopy) runtimeStore.selectLineWord(newLine, ...newLine.words)
    else runtimeStore.applyWordSelectToLine()
    staticStore.touchLineWord(newLine, newLine.words.at(-1)!)
  }
}
</script>

<style lang="scss">
.linsert-indicator {
  box-sizing: content-box;
  height: 0.8rem;
  position: relative;
  &.dragging {
    z-index: -1;
    margin: -1rem;
    padding: 1rem;
  }
  &.floatup {
    z-index: 1;
  }
  &.dragover {
    &::after {
      visibility: visible;
    }
  }
  &::after {
    visibility: hidden;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0;
    margin: auto 0.2rem;
    box-shadow: 0 0 0 0.08rem var(--p-primary-color);
  }
}
</style>
