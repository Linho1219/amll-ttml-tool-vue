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
import { useCoreStore, type LyricLine, type LyricWord } from '@/stores/core'
import { VList } from 'virtua/vue'
import Line from './TimingLine.vue'
import Word from './TimingWord.vue'
import { onMounted, useTemplateRef } from 'vue'
import { useRuntimeStore } from '@/stores/runtime'
import { useGlobalKeyboard } from '@/utils/hotkey'
import { useStaticStore } from '@/stores/static'
import { usePreferenceStore } from '@/stores/preference'

const coreStore = useCoreStore()
const runtimeStore = useRuntimeStore()
const staticStore = useStaticStore()

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

function findNextLineWord(
  word: LyricWord,
): [lineIndex: number, line: LyricLine, word: LyricWord] | null {
  let found = false
  for (const [lineIndex, line] of coreStore.lyricLines.entries()) {
    if (!found) {
      const wordIndex = line.words.indexOf(word)
      if (wordIndex === -1) continue
      for (let i = wordIndex + 1; i < line.words.length; i++) {
        const nextWord = line.words[i]!
        if (nextWord.word.trim()) return [lineIndex, line, nextWord]
      }
      found = true
    } else {
      if (line.ignoreInTiming) continue
      if (line.words.length === 0) continue
      return [lineIndex, line, line.words[0]!]
    }
  }
  return null
}

function isWordFirstOfLine(line: LyricLine, word: LyricWord) {
  for (const w of line.words) if (w.word.trim()) return w === word
  return false
}
function isWordLastOfLine(line: LyricLine, word: LyricWord) {
  for (let i = line.words.length - 1; i >= 0; i--) {
    const w = line.words[i]!
    if (w.word.trim()) return w === word
  }
  return false
}

const preferenceStore = usePreferenceStore()
const getAmendedProgress = () => {
  return staticStore.audio.getProgress() - staticStore.audio.amendmentRef.value
}
useGlobalKeyboard('markBegin', () => {
  if (runtimeStore.selectedWords.size !== 1) return
  preferenceStore.scrollWithPlayback = false
  const word = runtimeStore.getFirstSelectedWord()!
  const line = runtimeStore.getFirstSelectedLine()!
  word.startTime = getAmendedProgress()
  if (isWordFirstOfLine(line, word)) line.startTime = word.startTime
  const lineIndex = coreStore.lyricLines.indexOf(runtimeStore.getFirstSelectedLine()!)
  if (lineIndex === -1) return
  handleScrollTo(lineIndex)
})
useGlobalKeyboard('markEnd', () => {
  if (runtimeStore.selectedWords.size !== 1) return
  preferenceStore.scrollWithPlayback = false
  const word = runtimeStore.getFirstSelectedWord()!
  const line = runtimeStore.getFirstSelectedLine()!
  const progress = getAmendedProgress()
  word.endTime = progress
  if (isWordLastOfLine(line, word)) line.endTime = word.endTime
  const next = findNextLineWord(word)
  if (!next) return
  const [nextWordLineIndex, nextWordLine, nextWord] = next
  runtimeStore.selectLineWord(nextWordLine, nextWord)
  handleScrollTo(nextWordLineIndex)
})
useGlobalKeyboard('markEndBegin', () => {
  if (runtimeStore.selectedWords.size !== 1) return
  preferenceStore.scrollWithPlayback = false
  const word = runtimeStore.getFirstSelectedWord()!
  const line = runtimeStore.getFirstSelectedLine()!
  const progress = getAmendedProgress()
  word.endTime = progress
  if (isWordLastOfLine(line, word)) line.endTime = word.endTime
  const next = findNextLineWord(word)
  if (!next) return
  const [nextWordLineIndex, nextWordLine, nextWord] = next
  nextWord.startTime = progress
  if (isWordFirstOfLine(nextWordLine, nextWord)) nextWordLine.startTime = progress
  runtimeStore.selectLineWord(nextWordLine, nextWord)
  handleScrollTo(nextWordLineIndex)
})
</script>

<style lang="scss">
.editor-scroller {
  height: 100%;
}
</style>
