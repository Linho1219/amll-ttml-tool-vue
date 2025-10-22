<script setup lang="ts">
import 'primeicons/primeicons.css'
import Titlebar from './components/Titlebar.vue'
import Ribbon from './components/Ribbon.vue'
import RibbonGroup from './components/RibbonGroup.vue'
</script>

<template>
  <Titlebar />
  <Ribbon>
    <RibbonGroup label="分词"> </RibbonGroup>
    <RibbonGroup label="行属性"> </RibbonGroup>
    <RibbonGroup label="词属性"> </RibbonGroup>
  </Ribbon>
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
#app {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
