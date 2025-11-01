<template>
  <div class="editor timing">
    <RecycleScroller
      class="editor-scroller"
      :items="coreStore.lyricLines"
      :item-size="rem(5)"
      v-slot="{ item: line, index: lineIndex }"
    >
      {{ line.words.map((words) => words.word).join('') }}
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { useCoreStore } from '@/stores/core'
import { RecycleScroller } from 'vue-virtual-scroller'

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
