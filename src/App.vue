<script setup lang="ts">
import 'primeicons/primeicons.css'
import Titlebar from './components/Titlebar.vue'
</script>

<template>
  <Titlebar />
  <div class="ribbon"></div>
  <div class="content"></div>
  <div class="player"></div>
</template>

<style lang="scss">
:root {
  font-size: 14px;
}
body {
  margin: 0;
  padding: 0.5rem;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
