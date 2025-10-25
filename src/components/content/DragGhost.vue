<template>
  <div
    class="drag-ghost"
    :style="{
      transform: `translate(${pointerX}px, ${pointerY}px)`,
      visibility: !pointerX && !pointerY ? 'hidden' : 'visible',
    }"
  >
    <div class="word-drag-ghost" v-if="runtimeStore.isDraggingWord">
      <i class="pi" :class="runtimeStore.isDraggingCopy ? 'pi-clone' : 'pi-arrow-right'"></i>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRuntimeStore } from '@/stores/runtime'
import { useMouse } from '@vueuse/core'

const { x: pointerX, y: pointerY } = useMouse()
const runtimeStore = useRuntimeStore()
</script>

<style lang="scss">
.drag-ghost {
  position: fixed;
  top: 0;
  left: 0;
  will-change: transform;
  margin-top: 0.5rem;
  margin-left: 0.8rem;
}
.word-drag-ghost {
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 1.3rem;
  background-color: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  opacity: 0.8;
}
</style>
