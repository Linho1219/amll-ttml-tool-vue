<template>
  <div class="drag-indicator" :style="{ transform: `translate(${pointerX}px, ${pointerY}px)` }">
    test123
  </div>
</template>
<script setup lang="ts">
import { usePointer } from '@vueuse/core'

const { x: pointerX, y: pointerY } = usePointer()
</script>

<style lang="scss">
.drag-indicator {
  position: fixed;
  top: 0;
  left: 0;
  will-change: transform;
}
</style>
