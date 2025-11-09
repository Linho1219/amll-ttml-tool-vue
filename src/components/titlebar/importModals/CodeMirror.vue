<template>
  <div class="codemirror-shell" ref="shellEl"></div>
</template>

<script setup lang="ts">
import { basicSetup } from 'codemirror'
import { Decoration, EditorView, lineNumbers, ViewPlugin, ViewUpdate } from '@codemirror/view'
import { onMounted, onUnmounted, ref, shallowRef, useTemplateRef, watch, type Ref } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import { vsCodeLight } from '@fsegurai/codemirror-theme-vscode-light'
import { vsCodeDark } from '@fsegurai/codemirror-theme-vscode-dark'

const [contentUpstream] = defineModel<string>('content')
const [scrollTopUpstream] = defineModel<number>('scrollTop')
const scrollTopRef = ref<number>(scrollTopUpstream.value ?? 0)
const [currentLineUpstream] = defineModel<number>('currentLine')
const currentLineRef = ref<number>(currentLineUpstream.value ?? 1)

const props = defineProps<{
  extensions?: any[]
  showLineNumbers?: boolean
}>()

const isDark = usePreferredDark()

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
        currentLineRef.value = line.number
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
onMounted(() => {
  if (!shellEl.value) return
  editorInstance.value = new EditorView({
    doc: contentUpstream.value,
    parent: shellEl.value,
    extensions: [
      isDark.value ? vsCodeDark : vsCodeLight,
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return
        const val = update.state.doc.toString()
        contentUpstream.value = val
      }),
      EditorView.domEventHandlers({
        scroll: (_event, view) => {
          scrollTopRef.value = view.scrollDOM.scrollTop
        },
      }),
      highlightCurrentLine(),
      props.showLineNumbers ? lineNumbers() : null,
      ...(props.extensions || []),
    ].filter(Boolean),
  })
  editorInstance.value
})
onUnmounted(() => {
  editorInstance.value?.destroy()
})

watch(contentUpstream, (newVal) => {
  if (!editorInstance.value) return
  const currentDoc = editorInstance.value.state.doc.toString()
  if (newVal !== currentDoc) {
    editorInstance.value.dispatch({
      changes: { from: 0, to: currentDoc.length, insert: newVal },
    })
  }
})
watch(scrollTopUpstream, (newVal) => {
  if (!editorInstance.value || newVal === undefined) return
  if (scrollTopRef.value === newVal) return
  const el = editorInstance.value.scrollDOM
  if (Math.abs(el.scrollTop - newVal) > 1) {
    el.scrollTop = newVal
    scrollTopRef.value = newVal
  }
})
watch(scrollTopRef, (newVal) => {
  if (newVal !== scrollTopUpstream.value) {
    scrollTopUpstream.value = newVal
  }
})
watch(currentLineUpstream, (newVal) => {
  if (!editorInstance.value || newVal === undefined) return
  if (currentLineRef.value === newVal) return
  const line = editorInstance.value.state.doc.line(newVal)
  editorInstance.value.dispatch({
    selection: { anchor: line.from },
    scrollIntoView: true,
  })
})
watch(currentLineRef, (newVal) => {
  if (newVal !== currentLineUpstream.value) {
    currentLineUpstream.value = newVal
  }
})
</script>

<style lang="scss">
.codemirror-shell {
  .cm-editor {
    height: 100%;
    width: 100%;
  }
  .cm-scroller {
    font-family: var(--font-monospace);
    font-size: 1.2rem;
    line-height: 1.6;
  }
  .cm-lineNumbers {
    font-size: 1.2rem;
  }
  .cm-current-line-highlight {
    background-color: #f002;
  }
}
</style>
