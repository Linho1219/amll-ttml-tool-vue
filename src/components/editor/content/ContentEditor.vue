<template>
  <div
    class="editor content"
    @mousedown="handleMouseDown"
    @dragover="handleDragOver"
    @contextmenu="handleContext"
    selection-root
  >
    <DynamicScroller class="editor-scroller" :items="coreStore.lyricLines" :min-item-size="130">
      <template v-slot="{ item: line, index: lineIndex, active }">
        <DynamicScrollerItem
          :item="line"
          :active="active"
          :size-dependencies="[line.words]"
          :watch-data="true"
          :data-index="lineIndex"
        >
          <LineInsertIndicator v-if="lineIndex === 0" :index="0" />
          <Line :line="line" :index="lineIndex" :key="line.id" @contextmenu="handleContext">
            <WordInsertIndicator :index="0" :parent="line" />
            <template v-for="(word, wordIndex) in line.words" :key="word.id">
              <Word
                :word="word"
                :index="wordIndex"
                :parent="line"
                :line-index="lineIndex"
                @contextmenu="handleContext"
              />
              <WordInsertIndicator :index="wordIndex + 1" :parent="line" />
            </template>
            <Button
              class="add-word-button"
              icon="pi pi-plus"
              severity="secondary"
              @click="appendWord(line)"
            />
          </Line>
          <LineInsertIndicator :index="lineIndex + 1" />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
    <ContextMenu ref="menu" :model="menuItems" />
  </div>
  <DragGhost v-if="runtimeStore.isDragging" />
</template>

<script setup lang="ts">
import { useCoreStore, type LyricLine } from '@/stores/core'
import Line from './ContentLine.vue'
// import LineLazyShell from './LineLazyShell.vue'
import { useRuntimeStore } from '@/stores/runtime'
import Word from './ContentWord.vue'
import { Button, ContextMenu } from 'primevue'
import { computed, nextTick, ref, shallowRef, useTemplateRef } from 'vue'
import { forceOutsideBlur } from '@/utils/selection'
import WordInsertIndicator from './WordInsertIndicator.vue'
import LineInsertIndicator from './LineInsertIndicator.vue'
import DragGhost from './DragGhost.vue'
import type { MenuItem } from 'primevue/menuitem'
import { useStaticStore } from '@/stores/static'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'

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

let contextLineIndex: undefined | number = undefined
let contextWordIndex: undefined | number = undefined

const menu = useTemplateRef('menu')

const blankMenuItems: MenuItem[] = [
  {
    label: '插入新行',
    icon: 'pi pi-plus',
    command: () => {
      const newLine = coreStore.newLine()
      coreStore.lyricLines.push(newLine)
      runtimeStore.selectLine(newLine)
    },
  },
]
const lineMenuItems: MenuItem[] = [
  {
    label: '在前插入行',
    icon: 'pi pi-arrow-up',
    command: () => {
      if (contextLineIndex === undefined) return
      const newLine = coreStore.newLine()
      coreStore.lyricLines.splice(contextLineIndex, 0, newLine)
      runtimeStore.selectLine(newLine)
    },
  },
  {
    label: '在后插入行',
    icon: 'pi pi-arrow-down',
    command: () => {
      if (contextLineIndex === undefined) return
      const newLine = coreStore.newLine()
      coreStore.lyricLines.splice(contextLineIndex + 1, 0, newLine)
      runtimeStore.selectLine(newLine)
    },
  },
  {
    label: '克隆行',
    icon: 'pi pi-clone',
    command: () => {
      if (contextLineIndex === undefined) return
      const line = coreStore.lyricLines[contextLineIndex]!
      const duplicate = coreStore.newLine({
        ...line,
        words: line.words.map(coreStore.newWord),
      })
      coreStore.lyricLines.splice(contextLineIndex + 1, 0, duplicate)
    },
  },
  {
    label: '删除行',
    icon: 'pi pi-trash',
    command: () => {
      if (contextLineIndex === undefined) return
      coreStore.lyricLines.splice(contextLineIndex, 1)
    },
  },
]
const wordMenuItems: MenuItem[] = [
  {
    label: '在前插入词',
    icon: 'pi pi-arrow-left',
    command: () => {
      if (contextLineIndex === undefined || contextWordIndex === undefined) return
      const parent = coreStore.lyricLines[contextLineIndex]!
      const newWord = coreStore.newWord()
      parent.words.splice(contextWordIndex, 0, newWord)
      runtimeStore.selectLineWord(parent, newWord)
      nextTick(() => staticStore.wordHooks.get(newWord.id)?.focusInput())
    },
  },
  {
    label: '在后插入词',
    icon: 'pi pi-arrow-right',
    command: () => {
      if (contextLineIndex === undefined || contextWordIndex === undefined) return
      const parent = coreStore.lyricLines[contextLineIndex]!
      const newWord = coreStore.newWord()
      parent.words.splice(contextWordIndex + 1, 0, newWord)
      runtimeStore.selectLineWord(parent, newWord)
      nextTick(() => staticStore.wordHooks.get(newWord.id)?.focusInput())
    },
  },
  {
    label: '在此拆分行',
    icon: 'pi pi-code',
    command: () => {
      if (contextLineIndex === undefined || contextWordIndex === undefined) return
      const parent = coreStore.lyricLines[contextLineIndex]!
      const wordsToMove = parent.words.splice(contextWordIndex)
      if (wordsToMove.length === 0) return
      const newLine = coreStore.newLine({ ...parent, words: wordsToMove })
      coreStore.lyricLines.splice(contextLineIndex + 1, 0, newLine)
      runtimeStore.selectLineWord(newLine, wordsToMove[0]!)
    },
  },
  {
    label: '删除单词',
    icon: 'pi pi-trash',
    command: () => {
      if (contextLineIndex === undefined || contextWordIndex === undefined) return
      const parent = coreStore.lyricLines[contextLineIndex]!
      parent.words.splice(contextWordIndex, 1)
    },
  },
]
const menuItems = shallowRef<MenuItem[]>(blankMenuItems)

function handleContext(e: MouseEvent, lineIndex?: number, wordIndex?: number) {
  contextLineIndex = lineIndex
  contextWordIndex = wordIndex
  if (lineIndex !== undefined && wordIndex !== undefined) menuItems.value = wordMenuItems
  else if (lineIndex !== undefined) menuItems.value = lineMenuItems
  else menuItems.value = blankMenuItems
  menu.value?.show(e)
}
</script>

<style lang="scss">
.editor.content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  --content-word-height: 4.8rem;
}
.editor-scroller {
  height: 100%;
}
.add-word-button {
  height: var(--content-word-height);
}
</style>
