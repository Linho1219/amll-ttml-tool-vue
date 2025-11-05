<template>
  <div class="editor timing" selection-root>
    <VList
      :data="coreStore.lyricLines"
      class="editor-scroller"
      #default="{ item: line, index: lineIndex }"
    >
      <div :key="line.id" class="line-item-shell">
        <Line :line="line" :index="lineIndex">
          <template v-for="word in line.words" :key="word.id">
            <Word :word="word" v-if="word.word.trim()" />
          </template>
        </Line>
      </div>
    </VList>
  </div>
</template>

<script setup lang="ts">
import { useCoreStore } from '@/stores/core'
import { VList } from 'virtua/vue'
import Line from './TimingLine.vue'
import Word from './TimingWord.vue'

const coreStore = useCoreStore()
const rem = (v: number) => v * 14
</script>

<style lang="scss">
.editor.timing {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
.editor-scroller {
  height: 100%;
}
</style>
