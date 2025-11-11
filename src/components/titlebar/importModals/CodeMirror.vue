<template>
  <div class="codemirror-shell" ref="shellEl"></div>
</template>

<script setup lang="ts">
import { type Extension, Compartment, EditorState } from '@codemirror/state'
import {
  Decoration,
  EditorView,
  lineNumbers,
  ViewPlugin,
  ViewUpdate,
  drawSelection,
  keymap,
  crosshairCursor,
  rectangularSelection,
} from '@codemirror/view'
import { nextTick, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { highlightSelectionMatches } from '@codemirror/search'

const [content] = defineModel<string>('content')
const [scrollTop] = defineModel<number>('scrollTop')
const [currentLine] = defineModel<number>('currentLine')

const props = defineProps<{
  extensions?: Extension[]
  showLineNumbers?: boolean
  highlightPattern?: { cycleLength: number; map: Record<number, string> }
}>()

function highlightCurrentLine() {
  return ViewPlugin.fromClass(
    class {
      decorations
      constructor(view: EditorView) {
        this.decorations = this.getDeco(view)
      }
      update(update: ViewUpdate) {
        if (update.selectionSet || update.docChanged || update.viewportChanged) {
          this.decorations = this.getDeco(update.view)
        }
      }
      getDeco(view: EditorView) {
        const pos = view.state.selection.main.head
        const line = view.state.doc.lineAt(pos)
        currentLine.value = line.number
        return Decoration.set([
          Decoration.line({ attributes: { class: 'cm-current-line-highlight' } }).range(line.from),
        ])
      }
    },
    { decorations: (v) => v.decorations },
  )
}

const shellEl = useTemplateRef('shellEl')
const editorInstance = shallowRef<EditorView | null>(null)
const highlightCompartment = new Compartment()
onMounted(() => {
  if (!shellEl.value) return
  editorInstance.value = new EditorView({
    doc: content.value,
    parent: shellEl.value,
    extensions: [
      highlightCurrentLine(),
      drawSelection(),
      rectangularSelection(),
      crosshairCursor(),
      highlightSelectionMatches(),
      history(),
      EditorState.allowMultipleSelections.of(true),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return
        const val = update.state.doc.toString()
        content.value = val
      }),
      EditorView.domEventHandlers({
        scroll: (_event, view) => {
          scrollTop.value = view.scrollDOM.scrollTop
        },
      }),
      props.showLineNumbers ? lineNumbers() : null,
      highlightCompartment.of([]),
      ...(props.extensions || []),
    ].filter((e) => !!e),
  })
  editorInstance.value
})
onUnmounted(() => {
  nextTick(() => editorInstance.value?.destroy())
})

watch(content, (newVal) => {
  if (!editorInstance.value) return
  const currentDoc = editorInstance.value.state.doc.toString()
  if (newVal !== currentDoc) {
    editorInstance.value.dispatch({
      changes: { from: 0, to: currentDoc.length, insert: newVal },
    })
  }
})
watch(scrollTop, (newVal) => {
  if (!editorInstance.value || newVal === undefined) return
  const el = editorInstance.value.scrollDOM
  if (el.scrollTop === newVal) return
  if (Math.abs(el.scrollTop - newVal) > 1) {
    el.scrollTop = newVal
    scrollTop.value = newVal
  }
})
watch(currentLine, (newVal) => {
  if (!editorInstance.value || newVal === undefined) return
  const currentLine = editorInstance.value.state.doc.lineAt(
    editorInstance.value.state.selection.main.head,
  ).number
  const maxLine = editorInstance.value.state.doc.lines
  if (newVal > maxLine) newVal = maxLine
  if (currentLine === newVal) return
  const line = editorInstance.value.state.doc.line(newVal)
  editorInstance.value.dispatch({
    selection: { anchor: line.from },
    scrollIntoView: true,
  })
})

function createCycleHighlightExtension(pattern: {
  cycleLength: number
  map: Record<number, string>
}) {
  const nonMatchClass = 'cm-cycle-highlight-else'
  return ViewPlugin.fromClass(
    class {
      decorations
      constructor(view: EditorView) {
        this.decorations = this.buildDeco(view)
      }
      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = this.buildDeco(update.view)
        }
      }
      buildDeco(view: EditorView) {
        const builder = []
        const { cycleLength, map } = pattern
        for (const { from, to } of view.visibleRanges) {
          let line = view.state.doc.lineAt(from)
          while (line.from < to) {
            const cls = map[(line.number - 1) % cycleLength]
            if (cls) builder.push(Decoration.line({ attributes: { class: cls } }).range(line.from))
            else
              builder.push(
                Decoration.line({ attributes: { class: nonMatchClass } }).range(line.from),
              )
            if (line.to >= to) break
            line = view.state.doc.line(line.number + 1)
          }
        }
        return Decoration.set(builder)
      }
    },
    { decorations: (v) => v.decorations },
  )
}

watch(
  () => props.highlightPattern,
  (pattern) => {
    if (!editorInstance.value) return
    const extension = pattern ? createCycleHighlightExtension(pattern) : []
    editorInstance.value.dispatch({
      effects: highlightCompartment.reconfigure(extension),
    })
  },
  { immediate: true, deep: true },
)
</script>

<style lang="scss">
.codemirror-shell {
  background-color: var(--p-form-field-background);
  border: 1px solid var(--p-form-field-border-color);
  border-radius: var(--p-form-field-border-radius);
  overflow: hidden;
  .cm-editor {
    height: 100%;
    width: 100%;
    &.cm-focused {
      outline: none;
    }
  }
  .cm-content {
    padding-bottom: 5rem;
  }
  .cm-scroller {
    font-family: var(--font-monospace);
    font-size: 1rem;
  }
  .cm-current-line-highlight {
    box-shadow: 0 0 0 0.15rem inset color-mix(in srgb, var(--p-primary-color), transparent 50%);
  }
  .cm-gutters {
    opacity: 0.8;
    background-color: var(--p-button-secondary-background);
    border-color: var(--p-content-border-color);
    color: var(--p-button-secondary-color);
  }
  .cm-cursor {
    border-color: color-mix(in srgb, currentColor 20%, var(--p-primary-color) 80%);
    border-width: 2px;
  }
  .cm-selectionBackground {
    background-color: color-mix(in srgb, var(--p-primary-color), transparent 60%) !important;
    .cm-focused > .cm-scroller > .cm-selectionLayer & {
      filter: none;
    }
  }
  .cm-selectionMatch {
    background-color: color-mix(in srgb, currentColor 20%, transparent 80%);
  }
}
</style>
