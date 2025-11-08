<template>
  <RibbonGroup label="标记" more>
    <Button
      icon="pi pi-bookmark"
      :label="bookmarkAdd ? '添加书签' : '移除书签'"
      :disabled="actionDisabled"
      size="small"
      severity="secondary"
      @click="bookmarkClick"
    />
    <Button icon="pi pi-comment" label="添加批注" size="small" disabled severity="secondary" />
    <Button
      icon="pi pi-eraser"
      label="移除全部"
      size="small"
      severity="secondary"
      @click="removeAllMarks"
    />
  </RibbonGroup>
</template>

<script setup lang="ts">
import { Button } from 'primevue'
import RibbonGroup from '../RibbonGroupShell.vue'
import { useRuntimeStore } from '@/stores/runtime'
import { computed } from 'vue'
import { useGlobalKeyboard } from '@/utils/hotkey'
import { useCoreStore } from '@/stores/core'
const runtimeStore = useRuntimeStore()

const focusingSet = computed(() =>
  runtimeStore.selectedWords.size > 0 ? runtimeStore.selectedWords : runtimeStore.selectedLines,
)
const bookmarkAdd = computed(
  () => actionDisabled.value || [...focusingSet.value].some((item) => !item.bookmarked),
)
function bookmarkClick() {
  if (bookmarkAdd.value) focusingSet.value.forEach((item) => (item.bookmarked = true))
  else focusingSet.value.forEach((item) => (item.bookmarked = false))
}
const actionDisabled = computed(
  () => !runtimeStore.selectedLines.size && !runtimeStore.selectedWords.size,
)
useGlobalKeyboard('bookmark', () => bookmarkClick())

const coreStore = useCoreStore()
function removeAllMarks() {
  coreStore.lyricLines.forEach((line) => {
    line.bookmarked = false
    line.words.forEach((word) => (word.bookmarked = false))
  })
}
</script>
