<template>
  <div
    class="lline"
    :class="{ selected: isSelected }"
    @mousedown="handleMouseDown"
    @click="handleClick"
  >
    <div class="lline-head">
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
          :class="{ active: props.line.isDuet }"
          @click.stop="props.line.isDuet = !props.line.isDuet"
        />
        <Button
          class="lline-tag lline-tag-background"
          severity="help"
          variant="text"
          size="small"
          icon="pi pi-expand"
          :class="{ active: props.line.isBG }"
          @click.stop="props.line.isBG = !props.line.isBG"
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
        <FloatLabel variant="on">
          <InputText
            fluid
            v-model="props.line.translatedLyric"
            @focus="handleFocus"
            @mousedown.stop
            @click.stop
          />
          <label for="on_label">行翻译</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText
            fluid
            v-model="props.line.romanLyric"
            @focus="handleFocus"
            @mousedown.stop
            @click.stop
          />
          <label for="on_label">行音译</label>
        </FloatLabel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LyricLine } from '@/stores/core'
import { useRuntimeStore } from '@/stores/runtime'
import { forceOutsideBlur } from '@/utils/selection'
import { Button, FloatLabel, InputText } from 'primevue'
import { computed } from 'vue'

const props = defineProps<{
  line: LyricLine
  index: number
}>()
const runtimeStore = useRuntimeStore()
const isSelected = computed(() => runtimeStore.selectedLines.has(props.line))

function handleFocus() {
  forceOutsideBlur()
  runtimeStore.selectedWords.clear()
  if (runtimeStore.selectedLines.has(props.line) && runtimeStore.selectedLines.size == 1) return
  runtimeStore.selectedLines.clear()
  runtimeStore.selectedLines.add(props.line)
}
let leftForClick = false
function handleMouseDown(e: MouseEvent) {
  leftForClick = false
  runtimeStore.selectedWords.clear()
  if (e.metaKey || e.ctrlKey) {
    forceOutsideBlur()
    if (!runtimeStore.selectedLines.has(props.line)) runtimeStore.selectedLines.add(props.line)
    else leftForClick = true
  } else {
    if (runtimeStore.selectedLines.has(props.line)) return
    forceOutsideBlur()
    runtimeStore.selectedLines.clear()
    runtimeStore.selectedLines.add(props.line)
  }
}
function handleClick(e: MouseEvent) {
  if (leftForClick && (e.ctrlKey || e.metaKey)) {
    if (runtimeStore.selectedLines.has(props.line)) runtimeStore.selectedLines.delete(props.line)
  }
  leftForClick = false
}
</script>

<style lang="scss">
.lline {
  // min-height: 10rem;
  display: flex;
  overflow: hidden;
  border: 2px var(--l-border-color) solid;
  background-color: var(--l-bg-color);
  border-radius: 0.5rem;
  --l-border-color: var(--p-button-secondary-background);
  --l-bg-color: transparent;
  opacity: 0.8;
  &:hover,
  &.selected {
    --l-bg-color: var(--p-content-background);
  }
  &.selected {
    --l-border-color: var(--p-button-secondary-hover-background);
    opacity: 1;
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
  font-size: 1.4rem;
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
</style>
