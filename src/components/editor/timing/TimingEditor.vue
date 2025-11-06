<template>
  <div class="editor timing" selection-root>
    <VList
      :data="coreStore.lyricLines"
      class="editor-scroller"
      #default="{ item: line, index: lineIndex }"
      ref="vscroll"
    >
      <div :key="line.id" class="line-item-shell">
        <Line :line="line" :index="lineIndex">
          <template v-for="word in line.words" :key="word.id">
            <Word
              :word="word"
              :parent="line"
              :parent-index="lineIndex"
              v-if="word.word.trim()"
              @need-scroll="handleScrollTo"
            />
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
import { onMounted, useTemplateRef } from 'vue'
import { useRuntimeStore } from '@/stores/runtime'

const coreStore = useCoreStore()
const runtimeStore = useRuntimeStore()

const vscroll = useTemplateRef('vscroll')
function handleScrollTo(lineIndex: number) {
  vscroll.value?.scrollToIndex(lineIndex, { align: 'center' })
}
onMounted(() => {
  if (runtimeStore.selectedWords.size > 1) runtimeStore.clearWordSelection()
  if (runtimeStore.selectedLines.size) {
    const firstLine = runtimeStore.getFirstSelectedLine()!
    const lineIndex = coreStore.lyricLines.indexOf(firstLine)
    if (lineIndex !== -1) handleScrollTo(lineIndex)
  }
})
</script>

<style lang="scss">
.editor-scroller {
  height: 100%;
}
</style>
