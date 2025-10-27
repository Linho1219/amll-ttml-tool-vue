<script setup lang="ts">
import 'primeicons/primeicons.css'
import '@/styles/common.scss'
import '@/styles/ribbon.scss'
import Titlebar from './components/Titlebar.vue'
import Ribbon from './components/ribbon/Ribbon.vue'
import Content from './components/editor/Editor.vue'
import Player from './components/audio/Player.vue'
import { useRuntimeStore } from './stores/runtime'
const runtimeStore = useRuntimeStore()
import editHistory from './dataTransfer/editHistory'
editHistory.init()
</script>

<template>
  <Titlebar />
  <Ribbon v-if="!runtimeStore.isPreviewView" />
  <Content />
  <Player />
</template>

<style lang="scss">
:root {
  font-size: 14px;
}
#app {
  margin: 0;
  padding: 0.5rem;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
