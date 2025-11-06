<template>
  <div class="tline" :class="{ ignored: props.line.ignoreInTiming }">
    <div class="tline-head">
      <div class="tline-head-btns">
        <Button
          :severity="props.line.bookmarked ? 'warn' : 'secondary'"
          variant="text"
          size="small"
          :icon="'pi pi-bookmark' + (props.line.bookmarked ? '-fill' : '')"
          :class="{ active: props.line.bookmarked }"
          @click.stop="props.line.bookmarked = !props.line.bookmarked"
        />
        <Button
          :severity="props.line.duet ? 'info' : 'secondary'"
          variant="text"
          size="small"
          icon="pi pi-align-right"
          :class="{ active: props.line.duet }"
          @click.stop="props.line.duet = !props.line.duet"
        />
        <Button
          :severity="props.line.background ? 'help' : 'secondary'"
          variant="text"
          size="small"
          icon="pi pi-expand"
          :class="{ active: props.line.background }"
          @click.stop="props.line.background = !props.line.background"
        />
      </div>
      <div class="tline-head-timestamps">
        <Timestamp begin v-model="props.line.startTime" />
        <span class="tline-index">{{ props.index + 1 }}</span>
        <Timestamp end v-model="props.line.endTime" />
      </div>
    </div>
    <div class="tline-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LyricLine } from '@/stores/core'
import { Button } from 'primevue'
import Timestamp from './Timestamp.vue'

const props = defineProps<{
  index: number
  line: LyricLine
}>()
</script>

<style lang="scss">
.tline {
  box-sizing: content-box;
  display: flex;
  // box-shadow:
  //   -1px -1px 0 var(--tline-border-color),
  //   inset -1px -1px 0 var(--tline-border-color);
  border: 2px solid var(--p-button-secondary-background);
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 0.2rem 0.5rem;
  --timestamp-space: 0.5rem;
  --tline-border-color: var(--p-content-border-color);
  --word-height: 7.5rem;
  &.ignored {
    opacity: 0.5;
  }
}
.tline-head {
  display: flex;
  gap: 0.5rem;
  padding-right: 0.5rem;
  border-right: 1px solid transparent;
  background-color: color-mix(in srgb, var(--p-content-border-color), transparent 70%);
}
.tline-head-btns {
  display: flex;
  flex-direction: column;
  justify-content: center;
  --p-button-text-secondary-color: color-mix(
    in srgb,
    var(--p-form-field-placeholder-color),
    transparent 60%
  );
}
.tline-head-timestamps {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--timestamp-space) 0;
}
.tline-index {
  font-size: 1.3rem;
  text-align: center;
  font-family: var(--font-monospace);
}
.tline-content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -1px;
}
</style>
