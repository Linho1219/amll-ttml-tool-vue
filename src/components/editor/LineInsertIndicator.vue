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
import { newWord, newLine, useCoreStore, type LyricLine } from '@/stores/core'
import { useRuntimeStore } from '@/stores/runtime'
import { sortLines, sortWords } from '@/utils/selection'
import { ref, watch } from 'vue'
const runtimeStore = useRuntimeStore()
const coreStore = useCoreStore()
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
        const newLine = coreStore.newLine(oldLine)
        newLine.words = oldLine.words.map((oldWord) => coreStore.newWord(newLine, oldWord))
        return newLine
      })
      coreStore.lyricLines.splice(props.index, 0, ...duplicatedLines)
      runtimeStore.selectedLines.clear()
      duplicatedLines.forEach((line) => runtimeStore.selectedLines.add(line))
      runtimeStore.lastTouchedLine = duplicatedLines[duplicatedLines.length - 1]!
      runtimeStore.lastTouchedWord = null
    } else {
      const placeholder = newLine()
      coreStore.lyricLines.splice(props.index, 0, placeholder)
      pendingLines.forEach((line) => {
        coreStore.lyricLines.splice(coreStore.lyricLines.indexOf(line), 1)
      })
      const insertIndex = coreStore.lyricLines.indexOf(placeholder)
      coreStore.lyricLines.splice(insertIndex, 1, ...pendingLines)
    }
  }
  if (runtimeStore.isDraggingWord) {
    const pendingWords = sortWords(...runtimeStore.selectedWords)
    if (e.ctrlKey || e.metaKey) {
      const newLine = coreStore.newLine()
      newLine.words = pendingWords.map((word) => coreStore.newWord(newLine, word))
      coreStore.lyricLines.splice(props.index, 0, newLine)
      runtimeStore.selectedWords.clear()
      newLine.words.forEach((word) => runtimeStore.selectedWords.add(word))
      runtimeStore.selectedLines.clear()
      runtimeStore.selectedLines.add(newLine)
      runtimeStore.lastTouchedLine = newLine
      runtimeStore.lastTouchedWord = newLine.words[newLine.words.length - 1]!
    } else {
      pendingWords.forEach((word) =>
        word.parentLine.words.splice(word.parentLine.words.indexOf(word), 1),
      )
      const newLine = coreStore.newLine({ words: pendingWords })
      pendingWords.forEach((word) => (word.parentLine = newLine))
      coreStore.lyricLines.splice(props.index, 0, newLine)
      runtimeStore.selectedLines.clear()
      runtimeStore.selectedLines.add(newLine)
    }
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
