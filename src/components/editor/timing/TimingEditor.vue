<template>
  <div class="editor timing"></div>
</template>

<script setup lang="ts">
import { useCoreStore } from '@/stores/core'

const coreStore = useCoreStore()
const rem = (v: number) => v * 14
</script>

<style lang="scss">
.editor.timing {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
