<template>
  <div class="lword" ref="wordTop" :class="{ selected: isSelected }" @mousedown.stop>
    <div class="lword-head" @mousedown.stop="onWordSelect">
      <i v-if="props.word.bookmarked" class="lword-head-bookmark pi pi-bookmark-fill"></i>
      <i v-else class="lword-head-bars pi pi-bars"></i>
      <div style="flex: 1">&#x200B;</div>
      <div v-if="props.word.placeholdingBeat" class="lword-head-placeholding-beat">
        {{ props.word.placeholdingBeat }}
      </div>
    </div>
    <div class="lword-input-shell" :class="{ focused: focused }">
      <div class="lword-input-widthcontrol lword-input-alike">
        {{ widthController }}
      </div>
      <div class="lword-input-placeholder lword-input-alike">
        {{ placeholder }}
      </div>
      <InputText
        ref="wordInputComponent"
        class="lword-input"
        v-model="props.word.word"
        size="large"
        @keydown="handleKeypress"
        @focus="handleInputFocus"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFocus } from '@vueuse/core'
import InputText from '@/components/repack/InputText.vue'
import { computed, nextTick, onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue'
import type { LyricWord } from '@/stores/core'
import { useRuntimeStore } from '@/stores/runtime'
import { justSelect, toggleSelect } from '@/stores/selection'
const runtimeStore = useRuntimeStore()
const props = defineProps<{
  word: LyricWord
  index: number
}>()

// Input Element
const wordInputComponent = useTemplateRef('wordInputComponent')
const wordInputEl = shallowRef<HTMLInputElement | null | undefined>(null)
const { focused } = useFocus(wordInputEl)
onMounted(() => (wordInputEl.value = wordInputComponent.value?.input))

// Selection
const isSelected = computed(() => runtimeStore.selectedWords.has(props.word))
function onWordSelect(e?: MouseEvent) {
  if (e?.metaKey || e?.ctrlKey) toggleSelect(props.word)
  else justSelect(props.word)
}
function handleInputFocus() {
  justSelect(props.word)
}

// Placeholder and input width control
const placeholder = computed(() => {
  if (focused.value) return ''
  const word = props.word.word
  if (!word) return '/'
  if (word.match(/^\s+$/)) {
    if (word.length === 1) return '␣'
    const upperCount = word.length
      .toString()
      .split('')
      .map((num) => toSup[num])
      .join('')
    return `␣${upperCount}`
  }
})
const widthController = computed(() => {
  const word = props.word.word
  if (!word) return '/'
  if (word === ' ') return '␣'
  return placeholder.value || word
})
const toSup: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
}

// Hotkeys
function handleKeypress(event: KeyboardEvent) {
  if (!focused.value) return
  if (event.code === 'Backspace' && !props.word.word && props.index > 0) {
    event.preventDefault()
    props.word.parentLine.words.splice(props.index, 1)
    const lastWord = props.word.parentLine.words[props.index - 1]
    if (!lastWord) return
    nextTick(() => runtimeStore.wordHooks.get(lastWord)?.focusInput())
  }
  console.log(event.code)
}

// Register hooks
const wordTop = useTemplateRef('wordTop')
onMounted(() => {
  runtimeStore.wordHooks.set(props.word, {
    scrollTo: () => wordTop.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    setHighlight: (_highlight: boolean) => {
      // to do
    },
    focusInput: () => {
      focused.value = true
      wordInputEl.value?.select()
      console.log(wordInputEl.value)
    },
  })
})
onUnmounted(() => {
  runtimeStore.wordHooks.delete(props.word)
})
</script>

<style lang="scss" scoped>
.lword {
  --p-inputtext-lg-font-size: 1.3rem;
  --w-bg-color: var(--l-border-color);
  &.selected {
    --w-bg-color: var(--p-primary-color);
    color: var(--p-primary-contrast-color);
  }
}
.lword-head {
  display: flex;
  align-items: baseline;
  padding: 0.2rem;
  font-size: 1rem;
  cursor: move;
  background-color: var(--w-bg-color);
  border-top-left-radius: var(--p-inputtext-border-radius);
  border-top-right-radius: var(--p-inputtext-border-radius);
  font-family: var(--font-monospace);
}
.lword-head-bookmark {
  font-size: 0.8rem;
  color: var(--p-button-text-warn-color);
  .lword.selected & {
    color: inherit;
  }
}
.lword-head-bars {
  font-size: 0.8rem;
  transform: scaleX(0.8);
  opacity: 0.4;
}
.lword-head-placeholding-beat {
  font-weight: bold;
}
.lword-input-shell {
  --p-inputtext-lg-padding-x: 0.6rem;
  --p-inputtext-lg-padding-y: 0.5rem;
  position: relative;
  background-color: var(--p-inputtext-background);
  border-bottom-left-radius: var(--p-inputtext-border-radius);
  border-bottom-right-radius: var(--p-inputtext-border-radius);
  font-size: var(--p-inputtext-lg-font-size);
  .lword.selected & {
    background-color: color-mix(
      in srgb,
      var(--p-primary-color) 10%,
      var(--p-inputtext-background) 90%
    );
  }
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
}
.lword-input {
  background: transparent;
  transition: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  .lword.selected & {
    border-color: var(--p-primary-color);
  }
}
.lword-input-placeholder {
  color: var(--p-inputtext-placeholder-color);
  font-weight: 300;
}
</style>
