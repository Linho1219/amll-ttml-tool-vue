<template>
  <div class="spectrogram" ref="spectrogramEl">
    <span class="spectrogram-tooltip">等待频谱图装载…</span>
  </div>
</template>

<script setup lang="ts">
import { useRuntimeStore } from '@/stores/runtime'
import { useCssVar, useElementSize } from '@vueuse/core'
import { onMounted, useTemplateRef } from 'vue'
const spectrogramEl = useTemplateRef('spectrogramEl')
const primaryColor = useCssVar('--p-primary-color')
const { height: spectrogramHeight } = useElementSize(spectrogramEl)
const audio = useRuntimeStore().getAudio()
onMounted(() => {})
</script>

<style lang="scss">
.spectrogram {
  cursor: text;
  height: 12.5rem;
  position: relative;
}
.spectrogram-tooltip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.6;
}
</style>
