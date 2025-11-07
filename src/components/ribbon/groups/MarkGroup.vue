<template>
  <RibbonGroup label="标记" more>
    <Button
      icon="pi pi-bookmark"
      :label="bookmarkAdd ? '添加书签' : '移除书签'"
      size="small"
      severity="secondary"
      @click="bookmarkClick"
    />
    <Button icon="pi pi-comment" label="添加批注" size="small" severity="secondary" />
    <Button icon="pi pi-eraser" label="移除全部" size="small" severity="secondary" />
  </RibbonGroup>
</template>

<script setup lang="ts">
import { Button } from 'primevue'
import RibbonGroup from '../RibbonGroupShell.vue'
import { useRuntimeStore } from '@/stores/runtime'
import { computed } from 'vue'
import globalEmit from '@/utils/mitt'
const runtimeStore = useRuntimeStore()

const focusingSet = computed(() =>
  runtimeStore.selectedWords.size > 0 ? runtimeStore.selectedWords : runtimeStore.selectedLines,
)
const bookmarkAdd = computed(() => [...focusingSet.value].some((item) => !item.bookmarked))
function bookmarkClick() {
  if (bookmarkAdd.value) focusingSet.value.forEach((item) => (item.bookmarked = true))
  else focusingSet.value.forEach((item) => (item.bookmarked = false))
}
globalEmit.on('bookmark', () => bookmarkClick())
</script>
