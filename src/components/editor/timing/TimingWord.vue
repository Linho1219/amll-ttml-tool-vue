<template>
  <div class="tword">
    <Timestamp begin v-model="props.word.startTime" />
    <span class="tword-text">{{ props.word.word }}</span>
    <Timestamp end v-model="props.word.endTime" />
  </div>
</template>

<script setup lang="ts">
import type { LyricLine, LyricWord } from '@/stores/core'
import Timestamp from './Timestamp.vue'

const props = defineProps<{
  word: LyricWord
}>()
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
}
.tword-text {
  text-align: center;
  font-size: 1.5rem;
}
</style>
