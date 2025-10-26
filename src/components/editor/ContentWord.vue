<template>
  <div
    class="lword"
    ref="wordTop"
    :class="{
      selected: isSelected,
      removing: isSelected && runtimeStore.isDragging && !runtimeStore.isDraggingCopy,
    }"
    @mousedown.stop
    @click.stop
  >
    <div class="lword-drag-ghost" ref="dragGhostEl"></div>
    <div
      class="lword-head"
      draggable="true"
      @mousedown="handleMousedown"
      @click="handleClick"
      @dblclick="handleDbClick"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <i v-if="props.word.bookmarked" class="lword-head-bookmark pi pi-bookmark-fill"></i>
      <i v-else class="lword-head-bars pi pi-bars"></i>
      <div style="flex: 1">&ZeroWidthSpace;</div>
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
        @keydown="handleKeydown"
        @focus="handleFocus"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFocus } from '@vueuse/core'
import InputText from '@/components/repack/InputText.vue'
import { computed, nextTick, onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue'
import { useCoreStore, type LyricLine, type LyricWord } from '@/stores/core'
import { useRuntimeStore } from '@/stores/runtime'
import { applyWordSelectToLine, forceOutsideBlur, sortIndex } from '@/utils/selection'
import { digit2Sup } from '@/utils/toSupSub'
const runtimeStore = useRuntimeStore()
const coreStore = useCoreStore()
const props = defineProps<{
  word: LyricWord
  index: number
}>()

// Input Element
const inputComponent = useTemplateRef('wordInputComponent')
const inputEl = shallowRef<HTMLInputElement | null | undefined>(null)
const { focused } = useFocus(inputEl)
onMounted(() => (inputEl.value = inputComponent.value?.input))

// Selection
const isSelected = computed(() => runtimeStore.selectedWords.has(props.word))
let leftForClick = false
function handleMousedown(e: MouseEvent) {
  leftForClick = false
  if (e.ctrlKey || e.metaKey) {
    forceOutsideBlur()
    runtimeStore.lastTouchedLine = props.word.parentLine
    runtimeStore.lastTouchedWord = props.word
    if (!runtimeStore.selectedWords.has(props.word)) {
      runtimeStore.selectedWords.add(props.word)
      applyWordSelectToLine(runtimeStore.selectedWords)
    } else leftForClick = true
  } else if (e.shiftKey && runtimeStore.lastTouchedWord) {
    forceOutsideBlur()
    const lastTouchedWord = runtimeStore.lastTouchedWord
    runtimeStore.lastTouchedLine = props.word.parentLine
    runtimeStore.lastTouchedWord = props.word
    if (lastTouchedWord.parentLine !== props.word.parentLine) {
      runtimeStore.selectedWords.clear()
      runtimeStore.selectedLines.clear()
      const [start, end] = sortIndex(
        coreStore.lyricLines.indexOf(lastTouchedWord.parentLine),
        coreStore.lyricLines.indexOf(props.word.parentLine),
      )
      coreStore.lyricLines
        .slice(start, end + 1)
        .forEach((line) => runtimeStore.selectedLines.add(line))
    } else {
      const [start, end] = sortIndex(
        lastTouchedWord.parentLine.words.indexOf(lastTouchedWord),
        props.index,
      )
      const affectedWords = props.word.parentLine.words.slice(start, end + 1)
      if (runtimeStore.selectedWords.has(props.word))
        affectedWords.forEach((w) => runtimeStore.selectedWords.delete(w))
      else affectedWords.forEach((w) => runtimeStore.selectedWords.add(w))
    }
  } else {
    if (runtimeStore.selectedWords.has(props.word)) return
    forceOutsideBlur()
    runtimeStore.lastTouchedLine = props.word.parentLine
    runtimeStore.lastTouchedWord = props.word
    runtimeStore.selectedWords.clear()
    runtimeStore.selectedWords.add(props.word)
    if (
      runtimeStore.selectedLines.size !== 1 ||
      !runtimeStore.selectedLines.has(props.word.parentLine)
    ) {
      runtimeStore.selectedLines.clear()
      runtimeStore.selectedLines.add(props.word.parentLine)
    }
  }
}
function handleClick(e: MouseEvent) {
  if (leftForClick && (e.ctrlKey || e.metaKey)) {
    runtimeStore.selectedWords.delete(props.word)
    applyWordSelectToLine(runtimeStore.selectedWords)
  }
  leftForClick = false
}
function handleDbClick() {
  inputEl.value?.select()
}
function handleFocus(_e: FocusEvent) {
  if (runtimeStore.selectedWords.has(props.word) && runtimeStore.selectedWords.size === 1) return
  forceOutsideBlur()
  runtimeStore.lastTouchedLine = props.word.parentLine
  runtimeStore.lastTouchedWord = props.word
  runtimeStore.selectedWords.clear()
  runtimeStore.selectedWords.add(props.word)
  applyWordSelectToLine(runtimeStore.selectedWords)
}
const dragGhostEl = useTemplateRef('dragGhostEl')
function handleDragStart(e: DragEvent) {
  runtimeStore.lastTouchedLine = props.word.parentLine
  runtimeStore.lastTouchedWord = props.word
  runtimeStore.isDragging = true
  runtimeStore.canDrop = false
  if (!e.dataTransfer) return
  e.dataTransfer.setDragImage(dragGhostEl.value!, 0, 0)
  e.dataTransfer.effectAllowed = 'copyMove'
  if (e.ctrlKey || e.metaKey) {
    e.dataTransfer.dropEffect = 'copy'
    runtimeStore.isDraggingCopy = true
  } else {
    e.dataTransfer.dropEffect = 'move'
    runtimeStore.isDraggingCopy = false
  }
}
function handleDragEnd(_e: DragEvent) {
  runtimeStore.isDragging = false
  runtimeStore.isDraggingCopy = false
}

// Placeholder and input width control
const placeholder = computed(() => {
  if (focused.value) return ''
  const word = props.word.word
  if (!word) return '/'
  if (word.match(/^\s+$/)) {
    if (word.length === 1) return '␣'
    const upperCount = [...word.length.toString()].map(digit2Sup).join('')
    return `␣${upperCount}`
  }
})
const widthController = computed(() => {
  const word = props.word.word
  if (!word) return '/'
  if (word === ' ') return '␣'
  return placeholder.value || word
})

// Hotkeys
function handleKeydown(event: KeyboardEvent) {
  console.log(event.code)
  if (!inputEl.value || !focused.value) return
  const el = inputEl.value
  switch (event.code) {
    case 'Backspace':
      if (props.word.word || props.index === 0) return
      event.preventDefault()
      nextTick(() => {
        const lastWord = props.word.parentLine.words[props.index - 1]
        if (!lastWord) return
        runtimeStore.wordHooks.get(lastWord)?.focusInput(-1)
      })
      props.word.parentLine.words.splice(props.index, 1)
      return
    case 'Enter':
      event.preventDefault()
      el.blur()
      return
    case 'ArrowLeft':
      if (el.selectionStart !== 0) return
      event.preventDefault()
      nextTick(() => {
        const prevWord = props.word.parentLine.words[props.index - 1]
        if (!prevWord) return
        runtimeStore.wordHooks.get(prevWord)?.focusInput(-1)
      })
      return
    case 'ArrowRight':
      if (el.selectionStart !== el.value.length) return
      event.preventDefault()
      nextTick(() => {
        const nextWord = props.word.parentLine.words[props.index + 1]
        if (!nextWord) return
        runtimeStore.wordHooks.get(nextWord)?.focusInput(1)
      })
      return
  }
}

// Register hooks
const wordTop = useTemplateRef('wordTop')
onMounted(() => {
  runtimeStore.wordHooks.set(props.word, {
    scrollTo: () => wordTop.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    setHighlight: (_highlight: boolean) => {
      // to do
    },
    focusInput: (position = 0) => {
      focused.value = true
      if (!inputEl.value) return
      switch (position) {
        case -1:
          inputEl.value.setSelectionRange(inputEl.value.value.length, inputEl.value.value.length)
          break
        case 0:
          inputEl.value.select()
          break
        case 1:
          inputEl.value.setSelectionRange(0, 0)
          break
      }
    },
  })
})
onUnmounted(() => {
  runtimeStore.wordHooks.delete(props.word)
})
</script>

<style lang="scss">
.lword {
  height: var(--content-word-height);
  display: flex;
  flex-direction: column;
  --p-inputtext-lg-font-size: 1.3rem;
  --w-bg-color: var(--l-border-color);
  position: relative;
  transition:
    transform 0.1s,
    opacity 0.1s;
  &.selected {
    --w-bg-color: var(--p-primary-color);
    color: var(--p-primary-contrast-color);
  }
  &.removing {
    opacity: 0.5;
    transform: scale(0.9);
  }
}
.lword-head {
  flex: 1;
  display: flex;
  align-items: center;
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
.lword-input.lword-input {
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
.lword-drag-ghost {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}
</style>
