<template>
  <Titlebar />
  <template v-if="runtimeStore.isPreviewView">
    <main></main>
  </template>
  <template v-else>
    <Ribbon />
    <main>
      <Sidebar v-if="runtimeStore.sidebarShown" />
      <ContentEditor v-if="runtimeStore.isContentView" class="editor" />
      <TimingEditor v-if="runtimeStore.isTimingView" class="editor" />
    </main>
  </template>
  <Player />
</template>

<script setup lang="ts">
import 'primeicons/primeicons.css'
import '@/styles/common.scss'
import '@/styles/fonts/index.scss'
import Titlebar from './components/Titlebar.vue'
import Ribbon from './components/ribbon/Ribbon.vue'
import ContentEditor from './components/editor/content/ContentEditor.vue'
import TimingEditor from './components/editor/timing/TimingEditor.vue'
import Player from './components/audio/Player.vue'
import { useRuntimeStore } from './stores/runtime'
const runtimeStore = useRuntimeStore()
import editHistory from './stores/editHistory'
import { onMounted, onUnmounted } from 'vue'
import { useStaticStore } from './stores/static'
import Sidebar from './components/sidebar/Sidebar.vue'
editHistory.init()

const handleRootKeydown = (e: KeyboardEvent) => {
  if (e.target !== document.body)
    if (e.target instanceof HTMLElement) {
      const tagName = e.target.tagName.toLowerCase()
      if (tagName === 'textarea' || e.target.isContentEditable) return
      if (tagName === 'input' && (<HTMLInputElement>e.target).type === 'text') return
    }
  console.log('Root keydown:', e.key)
  if (e.code === 'Space') {
    e.preventDefault()
    useStaticStore().audio.togglePlay()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleRootKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleRootKeydown)
})
</script>

<style lang="scss">
:root {
  font-size: 14px;
}
#app {
  margin: 0;
  padding: 0.5rem 0;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
main {
  height: 0;
  flex: 1;
  display: flex;
}
.editor {
  flex: 1;
  overflow-x: hidden;
}
</style>
