<template>
  <div
    class="editor-shell"
    @mousedown.self="handleMouseDown"
    @dragover="handleDragOver"
    @contextmenu="handleContext"
  >
    <div class="editor" selection-root>
      <LineInsertIndicator :index="0" />
      <template v-for="(line, lineIndex) in coreStore.lyricLines" :key="line.id">
        <LineLazyShell>
          <Line :line="line" :index="lineIndex">
            <WordInsertIndicator :index="0" :parent="line" />
            <template v-for="(word, wordIndex) in line.words" :key="word.id">
              <Word :word="word" :index="wordIndex" :parent="line" :line-index="lineIndex" />
              <WordInsertIndicator :index="wordIndex + 1" :parent="line" />
            </template>
            <Button
              class="add-word-button"
              icon="pi pi-plus"
              severity="secondary"
              @click="appendWord(line)"
            />
          </Line>
        </LineLazyShell>
        <LineInsertIndicator :index="lineIndex + 1" />
      </template>
    </div>
    <ContextMenu ref="menu" :model="contextMenuItems" />
  </div>
  <DragGhost v-if="runtimeStore.isDragging" />
</template>

<script setup lang="ts">
import { useCoreStore, type LyricLine } from '@/stores/core'
import Line from './Line.vue'
import LineLazyShell from './LineLazyShell.vue'
import { useRuntimeStore } from '@/stores/runtime'
import Word from './ContentWord.vue'
import { Button, ContextMenu } from 'primevue'
import { nextTick, ref, useTemplateRef } from 'vue'
import { forceOutsideBlur } from '@/utils/selection'
import WordInsertIndicator from './WordInsertIndicator.vue'
import LineInsertIndicator from './LineInsertIndicator.vue'
import DragGhost from './DragGhost.vue'
import type { MenuItem } from 'primevue/menuitem'
import { useStaticStore } from '@/stores/static'

const coreStore = useCoreStore()
const runtimeStore = useRuntimeStore()
const staticStore = useStaticStore()

function appendWord(line: LyricLine) {
  const newWord = coreStore.newWord(line)
  line.words.push(newWord)
  runtimeStore.selectLineWord(line, newWord)
  nextTick(() => staticStore.wordHooks.get(newWord.id)?.focusInput())
}
function handleMouseDown(e: MouseEvent) {
  if (e.ctrlKey || e.metaKey) return
  forceOutsideBlur()
  staticStore.lastTouchedLine = staticStore.lastTouchedWord = null
  runtimeStore.clearSelection()
}
function handleDragOver(e: DragEvent) {
  if (!runtimeStore.isDragging) return
  if (!e.dataTransfer) return
  if (e.ctrlKey || e.metaKey) {
    e.dataTransfer.dropEffect = 'copy'
    runtimeStore.isDraggingCopy = true
  } else {
    e.dataTransfer.dropEffect = 'move'
    runtimeStore.isDraggingCopy = false
  }
}

const menu = useTemplateRef('menu')
const closeContext = () => menu.value?.hide()
function handleContext(e: MouseEvent) {
  if (runtimeStore.closeContext && runtimeStore.closeContext !== closeContext)
    runtimeStore.closeContext()
  if (!runtimeStore.isContentView) return
  menu.value?.show(e)
  runtimeStore.closeContext = closeContext
}
const contextMenuItems = ref<MenuItem[]>([
  {
    label: '插入新行',
    icon: 'pi pi-plus',
    command: () => {
      const newLine = coreStore.newLine()
      coreStore.lyricLines.push(newLine)
      runtimeStore.selectLine(newLine)
    },
  },
])
</script>

<style lang="scss">
.editor-shell {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  --content-word-height: 4.8rem;
}
.add-word-button {
  height: var(--content-word-height);
}
</style>
