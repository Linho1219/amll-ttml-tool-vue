<template>
  <div
    class="tword"
    @mousedown="handleMouseDown"
    :class="{ selected: isSelected, active: isActive }"
  >
    <Timestamp class="tword-timestamp" begin v-model="props.word.startTime" />
    <span class="tword-text">{{ props.word.word }}</span>
    <Timestamp class="tword-timestamp" end v-model="props.word.endTime" />
  </div>
</template>

<script setup lang="ts">
import type { LyricLine, LyricWord } from '@/stores/core'
import Timestamp from './Timestamp.vue'
import { useRuntimeStore } from '@/stores/runtime'
import { computed } from 'vue'
import { useStaticStore } from '@/stores/static'
import { useConfigStore } from '@/stores/config'

const props = defineProps<{
  word: LyricWord
  parent: LyricLine
}>()
const runtimeStore = useRuntimeStore()
const configStore = useConfigStore()
function handleMouseDown() {
  runtimeStore.selectLineWord(props.parent, props.word)
}
const isSelected = computed(() => {
  return runtimeStore.selectedWords.has(props.word)
})

const audio = useStaticStore().audio
const isActive = computed(
  () =>
    audio.progressRef.value - configStore.globalLatency >= props.word.startTime &&
    audio.progressRef.value - configStore.globalLatency <= props.word.endTime,
)
</script>

<style lang="scss">
.tword {
  height: var(--word-height);
  display: flex;
  flex-direction: column;
  padding: var(--timestamp-space) 0.5rem;
  justify-content: space-between;
  box-shadow:
    -1px -1px 0 var(--tline-border-color),
    inset -1px -1px 0 var(--tline-border-color);
  &.selected {
    box-shadow:
      -1px -1px 0 var(--tline-border-color),
      inset -1px -1px 0 var(--tline-border-color),
      var(--p-primary-color) inset -1px -1px 0 3px,
      var(--p-primary-color) inset 0 0 0 3px;
    .tword-timestamp {
      opacity: 1;
    }
    .tword-text {
      color: color-mix(in srgb, var(--p-primary-color), var(--p-button-text-plain-color) 50%);
    }
  }
  &.active {
    background-color: color-mix(in srgb, var(--p-primary-color), transparent 75%);
  }
}
.tword-timestamp {
  opacity: 0.7;
}
.tword-text {
  text-align: center;
  font-size: 1.5rem;
}
</style>
