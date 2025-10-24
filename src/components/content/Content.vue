<template>
  <div class="content" selection-root @mousedown.self="clearSelection">
    <LineShell
      v-for="(line, lineIndex) in coreStore.lyricLines"
      :key="lineIndex"
      :line="line"
      :index="lineIndex"
    >
      <template v-for="(word, wordIndex) in line.words">
        <Word :word="word" :index="wordIndex" />
      </template>
      <Button icon="pi pi-plus" severity="secondary" @click="appendWord(line)" />
    </LineShell>
  </div>
</template>

<script setup lang="ts">
import { useCoreStore, type LyricLine } from '@/stores/core'
import LineShell from './LineShell.vue'
import { useRuntimeStore } from '@/stores/runtime'
import Word from './ContentWord.vue'
import { Button } from 'primevue'
import { nextTick } from 'vue'
import { clearSelection } from '@/stores/selection'

const coreStore = useCoreStore()
const runtimeStore = useRuntimeStore()

function appendWord(line: LyricLine) {
  line.words.push(coreStore.newWord(line))
  nextTick(() => {
    const newWord = line.words.at(-1)
    if (!newWord) return
    runtimeStore.wordHooks.get(newWord)?.focusInput()
  })
}
</script>

<style lang="scss">
.content {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
</style>
