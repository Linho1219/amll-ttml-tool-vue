<template>
  <div
    class="lline"
    :class="{
      selected: isSelected,
      removing: isSelected && runtimeStore.isDraggingLine && !runtimeStore.isDraggingCopy,
    }"
    @mousedown="handleMouseDown"
    @click="handleClick"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @contextmenu="handleContext"
  >
    <div class="lline-drag-ghost" ref="dragGhostEl"></div>
    <div class="lline-head" draggable="true">
      <div class="lline-drag-indicator">
        <i class="lline-drag-icon pi pi-bars"></i>
      </div>
      <div class="lline-head-info">
        <Button
          class="lline-tag lline-bookmark"
          severity="warn"
          variant="text"
          :icon="'pi pi-bookmark' + (props.line.bookmarked ? '-fill' : '')"
          :class="{ active: props.line.bookmarked }"
          @click.stop="props.line.bookmarked = !props.line.bookmarked"
        />
        <div class="lline-index">{{ props.index + 1 }}</div>
        <div style="flex: 1"></div>
        <Button
          class="lline-tag lline-tag-duet"
          severity="info"
          variant="text"
          size="small"
          icon="pi pi-align-right"
          :class="{ active: props.line.duet }"
          @click.stop="props.line.duet = !props.line.duet"
        />
        <Button
          class="lline-tag lline-tag-background"
          severity="help"
          variant="text"
          size="small"
          icon="pi pi-expand"
          :class="{ active: props.line.background }"
          @click.stop="props.line.background = !props.line.background"
        />
      </div>
    </div>
    <div class="lline-inner">
      <div
        class="lline-content"
        :class="{
          'content-view': runtimeStore.isContentView,
          'timing-view': runtimeStore.isTimingView,
        }"
      >
        <slot></slot>
      </div>
      <div class="lline-secondary" v-if="runtimeStore.isContentView">
        <template v-for="f in orderedFields" :key="f.key">
          <FloatLabel variant="on">
            <InputText
              fluid
              v-model.lazy="props.line[f.model]"
              @focus="handleFocus"
              @mousedown.stop
              @click.stop
              @dragstart.stop
            />
            <label>{{ f.label }}</label>
          </FloatLabel>
        </template>
      </div>
    </div>
    <ContextMenu ref="menu" :model="contextMenuItems" />
  </div>
</template>

<script setup lang="ts">
import { useCoreStore, type LyricLine } from '@/stores/core'
import { useRuntimeStore } from '@/stores/runtime'
import { forceOutsideBlur, sortIndex } from '@/utils/selection'
import { Button, ContextMenu, FloatLabel } from 'primevue'
import type { MenuItem } from 'primevue/menuitem'
import { computed, ref, useTemplateRef } from 'vue'
import InputText from '../repack/InputText.vue'
import { useStaticStore } from '@/stores/static'

const props = defineProps<{
  line: LyricLine
  index: number
}>()
const runtimeStore = useRuntimeStore()
const coreStore = useCoreStore()
const staticStore = useStaticStore()
const isSelected = computed(() => runtimeStore.selectedLines.has(props.line))

const touch = () => staticStore.touchLineOnly(props.line)
function handleFocus() {
  forceOutsideBlur()
  touch()
  runtimeStore.selectLine(props.line)
}
let leftForClick = false
function handleMouseDown(e: MouseEvent) {
  leftForClick = false
  forceOutsideBlur()
  touch()
  if (e.metaKey || e.ctrlKey) {
    staticStore.lastTouchedLine = props.line
    if (!isSelected.value) {
      runtimeStore.addLineToSelection(props.line)
    } else leftForClick = true
  } else if (e.shiftKey && staticStore.lastTouchedLine) {
    const lastTouchedLine = staticStore.lastTouchedLine
    staticStore.lastTouchedLine = props.line
    const lines = coreStore.lyricLines
    const [start, end] = sortIndex(lines.indexOf(lastTouchedLine), props.index)
    const affectedLines = lines.slice(start, end + 1)
    if (isSelected.value)
      affectedLines.forEach((line) => runtimeStore.removeLineFromSelection(line))
    else affectedLines.forEach((line) => runtimeStore.addLineToSelection(line))
  } else {
    runtimeStore.clearWordSelection()
    if (isSelected.value) return
    runtimeStore.selectLine(props.line)
  }
}
function handleClick(e: MouseEvent) {
  if (leftForClick && (e.ctrlKey || e.metaKey))
    if (isSelected.value) runtimeStore.removeLineFromSelection(props.line)
  leftForClick = false
}
const dragGhostEl = useTemplateRef('dragGhostEl')
function handleDragStart(e: DragEvent) {
  staticStore.touchLineOnly(props.line)
  runtimeStore.isDragging = true
  runtimeStore.canDrop = false
  if (!e.dataTransfer) return
  e.dataTransfer.setDragImage(dragGhostEl.value!, 0, 0)
  e.dataTransfer.effectAllowed = 'copyMove'
  if (e.ctrlKey || e.metaKey) {
    e.dataTransfer.dropEffect = 'copy'
    runtimeStore.isDraggingCopy = true
  } else {
    e.dataTransfer.dropEffect = 'move'
    runtimeStore.isDraggingCopy = false
  }
}
function handleDragEnd(_e: DragEvent) {
  runtimeStore.isDragging = false
  runtimeStore.isDraggingCopy = false
}

const menu = useTemplateRef('menu')
const closeContext = () => menu.value?.hide()
function handleContext(e: MouseEvent) {
  handleFocus()
  if (runtimeStore.closeContext && runtimeStore.closeContext !== closeContext)
    runtimeStore.closeContext()
  if (!runtimeStore.isContentView) return
  menu.value?.show(e)
  runtimeStore.closeContext = closeContext
}
const contextMenuItems: MenuItem[] = [
  {
    label: '在前插入行',
    icon: 'pi pi-arrow-up',
    command: () => {
      const newLine = coreStore.newLine()
      coreStore.lyricLines.splice(props.index, 0, newLine)
      runtimeStore.selectLine(newLine)
    },
  },
  {
    label: '在后插入行',
    icon: 'pi pi-arrow-down',
    command: () => {
      const newLine = coreStore.newLine()
      coreStore.lyricLines.splice(props.index + 1, 0, newLine)
      runtimeStore.selectLine(newLine)
    },
  },
  {
    label: '克隆行',
    icon: 'pi pi-clone',
    command: () => {
      const duplicate = coreStore.newLine({
        ...props.line,
        words: props.line.words.map(coreStore.newWord),
      })
      coreStore.lyricLines.splice(props.index + 1, 0, duplicate)
    },
  },
  {
    label: '删除行',
    icon: 'pi pi-trash',
    command: () => coreStore.lyricLines.splice(props.index, 1),
  },
]

const secondaryFields = [
  {
    key: 'translated',
    label: '行翻译',
    model: 'translatedLyric',
  },
  {
    key: 'roman',
    label: '行音译',
    model: 'romanLyric',
  },
] as const
const orderedFields = computed(() =>
  runtimeStore.swapTranslateRoman ? [...secondaryFields].reverse() : secondaryFields,
)
</script>

<style lang="scss">
.lline {
  min-height: 9.8rem;
  display: flex;
  overflow: hidden;
  border: 2px var(--l-border-color) solid;
  background-color: var(--l-bg-color);
  border-radius: 0.5rem;
  --l-border-color: var(--p-button-secondary-background);
  --l-bg-color: transparent;
  opacity: 0.8;
  transition: transform 0.2s;
  animation: fade 0.2s;
  &:hover,
  &.selected {
    --l-bg-color: var(--p-content-background);
  }
  &.selected {
    --l-border-color: var(--p-button-secondary-hover-background);
    opacity: 1;
  }
  &.removing {
    opacity: 0.5;
    transform: scale(0.98);
  }
}
.lline-head {
  display: flex;
  background-color: var(--l-border-color);
  color: var(--p-button-secondary-color);
  cursor: move;
}
.lline-drag-indicator {
  width: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: right;
}
.lline-drag-icon {
  opacity: 0.5;
  font-size: 0.8rem;
  .lline.selected & {
    opacity: 0.8;
  }
}
.lline-head-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.3rem 0.1rem;
}
.lline-index {
  padding: 0.3rem 0 0.5rem;
  font-size: 1.2rem;
  text-align: center;
  width: 3ch;
  font-family: var(--font-monospace);
}
.lline-bookmark {
  padding-top: 0;
  border-top: none !important;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.lline-tag {
  opacity: 0.3;
  filter: saturate(0);
  .lline.selected & {
    opacity: 0.5;
  }
  &:hover {
    opacity: 1 !important;
    transition: all var(--p-button-transition-duration);
  }
  &.active {
    opacity: 1 !important;
    filter: none;
  }
}

.lline-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.lline-secondary {
  display: flex;
  padding: 0.8rem 0.5rem 0.5rem;
  gap: 0.5rem;
}
.lline-content {
  flex: 1;
  display: flex;
  &.content-view {
    padding: 0.5rem;
    flex-wrap: wrap;
    row-gap: 0.5rem;
    align-content: flex-start;
  }
}
.lline-drag-ghost {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}
</style>
