<template>
  <div
    class="winsert-indicator"
    :class="{
      dragging: runtimeStore.isDraggingWord,
      dragover: dragOver,
      zerowidth: props.index === 0,
    }"
    @dragover.prevent="handleDragOver"
    @dragleave="dragOver = false"
    @drop="handleDrop"
  ></div>
</template>

<script setup lang="ts">
import { newWord, useCoreStore, type LyricLine } from '@/stores/core'
import { useRuntimeStore } from '@/stores/runtime'
import { ref } from 'vue'
const runtimeStore = useRuntimeStore()
const coreStore = useCoreStore()
const dragOver = ref(false)
const props = defineProps<{ parent: LyricLine; index: number }>()

function handleDragOver(e: DragEvent) {
  if (!runtimeStore.isDraggingWord) return
  dragOver.value = true
  if (!e.dataTransfer) return
  if (e.ctrlKey || e.metaKey) {
    e.dataTransfer.dropEffect = 'copy'
    runtimeStore.isDraggingCopy = true
  } else {
    e.dataTransfer.dropEffect = 'move'
    runtimeStore.isDraggingCopy = false
  }
}
function handleDrop(e: DragEvent) {
  if (!runtimeStore.isDraggingWord) return
  dragOver.value = false
  const pendingWords = [...runtimeStore.selectedWords].sort((a, b) => {
    if (a.parentLine === b.parentLine) {
      const parentWords = a.parentLine.words
      return parentWords.indexOf(a) - parentWords.indexOf(b)
    } else {
      const parentAIndex = coreStore.lyricLines.indexOf(a.parentLine)
      const parentBIndex = coreStore.lyricLines.indexOf(b.parentLine)
      return parentAIndex - parentBIndex
    }
  })
  if (e.ctrlKey || e.metaKey) {
    const duplicatedWords = pendingWords.map((word) => coreStore.newWord(word.parentLine, word))
    props.parent.words.splice(props.index, 0, ...duplicatedWords)
    runtimeStore.selectedWords.clear()
    duplicatedWords.forEach((word) => runtimeStore.selectedWords.add(word))
  } else {
    const placeholder = newWord(props.parent, { word: '%placeholder' })
    props.parent.words.splice(props.index, 0, placeholder)
    pendingWords.forEach((word) => {
      const parentWords = word.parentLine.words
      parentWords.splice(parentWords.indexOf(word), 1)
    })
    const insertIndex = props.parent.words.indexOf(placeholder)
    props.parent.words.splice(insertIndex, 1, ...pendingWords)
  }
}
</script>

<style lang="scss">
.winsert-indicator {
  box-sizing: content-box;
  width: 0.5rem;
  position: relative;
  &.dragging {
    z-index: 1;
    margin: -0.1rem -0.5rem;
    padding: 0.1rem 0.5rem;
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
    width: 0;
    margin: 0.2rem auto;
    box-shadow: 0 0 0 0.08rem var(--p-primary-color);
    .winsert-indicator.zerowidth & {
      box-shadow: none;
      width: 0.3rem;
    }
  }
  &.zerowidth {
    margin-left: -0.5rem;
    &.dragging {
      z-index: 1;
      margin: -0.1rem -0.5rem;
      padding: 0.1rem 0.5rem 0.1rem 0;
    }
    &::after {
      transform: translateX(-0.2rem);
    }
  }
}
</style>
