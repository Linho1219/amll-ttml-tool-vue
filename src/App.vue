<script setup lang="ts">
import 'primeicons/primeicons.css'
import '@/styles/common.scss'
import '@/styles/ribbon.scss'
import Titlebar from './components/Titlebar.vue'
import Ribbon from './components/ribbon/Ribbon.vue'
import Player from './components/player/Player.vue'
</script>

<template>
  <Titlebar />
  <Ribbon />
  <div class="content" style="flex:1"></div>
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
