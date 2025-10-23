<template>
  <div class="lword">
    <div class="lword-input-shell">
      <div class="lword-input-widthcontrol lword-input-alike">
        {{ placeholder || props.word.word || ' ' }}
      </div>
      <div class="lword-input-placeholder lword-input-alike">
        {{ placeholder }}
      </div>
      <InputText ref="wordInput" class="lword-input" v-model="props.word.word" size="large" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { LyricWord } from '@/stores/core'
import { useFocus, type MaybeElement, type MaybeElementRef } from '@vueuse/core'
import { InputText } from 'primevue'
import { computed, useTemplateRef } from 'vue'

const props = defineProps<{
  word: LyricWord
  index: number
}>()
const wordInput = useTemplateRef('wordInput') as MaybeElementRef<MaybeElement>
const focused = useFocus(wordInput).focused
const placeholder = computed(() => {
  if (focused.value) return ''
  const word = props.word.word
  if (!word) return '空白'
  if (word.match(/^\s+$/)) return '空格×' + word.length
})
</script>
<style lang="scss" scoped>
.lword {
  --p-inputtext-lg-font-size: 1.3rem;
}
.lword-input-shell {
  position: relative;
  min-width: 6rem;
  box-sizing: content-box;
  background: var(--p-inputtext-background);
  border-radius: var(--p-inputtext-border-radius);
  border: 1px solid transparent;
  font-size: var(--p-inputtext-lg-font-size);
}
.lword-input-alike {
  padding: var(--p-inputtext-lg-padding-y) var(--p-inputtext-lg-padding-x);
  border: 1px solid transparent;
  white-space: pre;
}
.lword-input-widthcontrol {
  visibility: hidden;
}
.lword-input,
.lword-input-placeholder {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background: transparent !important;
}
.lword-input-placeholder {
  color: var(--p-inputtext-placeholder-color);
  font-weight: 300;
}
</style>
