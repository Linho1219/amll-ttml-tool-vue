<template>
  <div
    class="winsert-indicator"
    :class="{
      dragging: runtimeStore.isDraggingWord,
      dragover,
      floatup,
      zerowidth: props.index === 0,
    }"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  ></div>
</template>

<script setup lang="ts">
import { newWord, useCoreStore, type LyricLine } from '@/stores/core'
import { useRuntimeStore } from '@/stores/runtime'
import { sortWords } from '@/utils/selection'
import { ref, watch } from 'vue'
const runtimeStore = useRuntimeStore()
const coreStore = useCoreStore()
const dragover = ref(false)
const props = defineProps<{ parent: LyricLine; index: number }>()

const floatup = ref(false)
watch(
  () => runtimeStore.isDraggingWord,
  (val) => setTimeout(() => (floatup.value = val), 200),
)

function handleDragOver(_e: DragEvent) {
  if (!runtimeStore.isDraggingWord) return
  dragover.value = true
  runtimeStore.canDrop = true
}
function handleDragLeave() {
  dragover.value = false
  runtimeStore.canDrop = false
}
function handleDrop(e: DragEvent) {
  if (!runtimeStore.isDraggingWord) return
  dragover.value = false
  runtimeStore.canDrop = false
  const pendingWords = sortWords(...runtimeStore.selectedWords)
  runtimeStore.selectedLines.clear()
  runtimeStore.selectedLines.add(props.parent)
  if (e.ctrlKey || e.metaKey) {
    const duplicatedWords = pendingWords.map((word) => coreStore.newWord(props.parent, word))
    props.parent.words.splice(props.index, 0, ...duplicatedWords)
    runtimeStore.selectedWords.clear()
    duplicatedWords.forEach((word) => runtimeStore.selectedWords.add(word))
    runtimeStore.lastTouchedLine = props.parent
    runtimeStore.lastTouchedWord = duplicatedWords[duplicatedWords.length - 1]!
  } else {
    const placeholder = newWord(props.parent)
    props.parent.words.splice(props.index, 0, placeholder)
    pendingWords.forEach((word) => {
      word.parentLine.words.splice(word.parentLine.words.indexOf(word), 1)
      word.parentLine = props.parent
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
    margin: -0.1rem -0.5rem;
    padding: 0.1rem 0.5rem;
    z-index: -1;
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
