<template>
  <div class="lline-lazy-shell" ref="shellEl" :style="{ minHeight: shellHeight + 'px' }">
    <div class="lline-lazy-content" ref="contentEl">
      <slot v-if="visible"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementSize, useElementVisibility } from '@vueuse/core'
import { ref, useTemplateRef, watch } from 'vue'

const shellHeight = ref(0)
const shellEl = useTemplateRef('shellEl')
const contentEl = useTemplateRef('contentEl')
const { height: contentHeight } = useElementSize(contentEl)
const visible = useElementVisibility(shellEl, {
  rootMargin: '0px 0px 100px 0px',
})
watch(contentHeight, (h) => {
  if (h) shellHeight.value = h
})
</script>

<style lang="scss">
.lline-lazy-content {
  min-height: 9.8rem;
}
</style>
