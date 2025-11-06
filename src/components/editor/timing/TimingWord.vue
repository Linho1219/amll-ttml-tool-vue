<template>
  <div
    class="tword"
    @mousedown="handleMouseDown"
    :class="{ selected: isSelected, active: isActive }"
  >
    <Timestamp class="tword-timestamp" begin v-model="props.word.startTime" />
    <span class="tword-text">
      <i
        v-if="props.word.bookmarked"
        class="pi pi-bookmark-fill"
        style="color: var(--p-button-text-warn-color)"
      ></i>
      {{ props.word.word }}
    </span>
    <Timestamp class="tword-timestamp" end v-model="props.word.endTime" />
  </div>
</template>

<script setup lang="ts">
import type { LyricLine, LyricWord } from '@/stores/core'
import Timestamp from './Timestamp.vue'
import { useRuntimeStore } from '@/stores/runtime'
import { computed, watch } from 'vue'
import { useStaticStore } from '@/stores/static'
import { useConfigStore } from '@/stores/config'

const props = defineProps<{
  word: LyricWord
  parent: LyricLine
  parentIndex: number
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
    (props.word.startTime || props.word.endTime) &&
    audio.progressRef.value - configStore.globalLatency >= props.word.startTime &&
    audio.progressRef.value - configStore.globalLatency <= props.word.endTime,
)

const emit = defineEmits<{
  (e: 'needScroll', parentIndex: number): void
}>()
watch([isActive, () => configStore.scrollWithPlayback], () => {
  if (props.parent.background) return
  if (isActive.value && configStore.scrollWithPlayback) emit('needScroll', props.parentIndex)
})
// watch([isSelected, () => configStore.scrollWithPlayback], () => {
//   if (isSelected.value && !configStore.scrollWithPlayback) emit('needScroll', props.parentIndex)
// })
</script>

<style lang="scss">
.tword {
  height: var(--word-height);
  display: flex;
  flex-direction: column;
  align-items: center;
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
