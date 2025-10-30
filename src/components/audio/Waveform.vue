<template>
  <div class="waveform" ref="waveformEl"></div>
</template>

<script setup lang="ts">
import { useRuntimeStore } from '@/stores/runtime'
import { ms2str } from '@/utils/timeModel'
import { useCssVar, useElementSize } from '@vueuse/core'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.esm.js'
const audio = useRuntimeStore().getAudio()
const waveformEl = useTemplateRef('waveformEl')
const primaryColor = useCssVar('--p-primary-color')
const { height: waveformHeight } = useElementSize(waveformEl)
const wsInstance = ref<WaveSurfer | null>(null)
onMounted(() => {
  if (!waveformEl.value) return
  wsInstance.value = WaveSurfer.create({
    media: audio.audioEl,
    container: waveformEl.value,
    height: waveformHeight.value,
    hideScrollbar: true,
    waveColor: primaryColor.value,
    progressColor: primaryColor.value,
    plugins: [
      HoverPlugin.create({
        formatTimeCallback: (v) => ms2str(v * 1000),
      }),
    ],
  })
})
onUnmounted(() => {
  wsInstance.value?.destroy()
})
</script>

<style lang="scss">
.waveform {
  flex: 1;
  background-color: var(--p-button-secondary-background);
  border-radius: var(--p-border-radius-md);
  overflow: hidden;
  cursor: text;
  ::part(canvases) {
    opacity: 0.3;
  }
  ::part(progress) {
    background-color: color-mix(in srgb, var(--p-primary-color), transparent 70%);
    opacity: 0.6;
  }
  ::part(cursor) {
    display: none;
  }
  ::part(hover) {
    display: flex;
    align-items: center;
  }
  ::part(hover-label) {
    padding: 0 0.5rem;
    font-size: 1rem;
    transition: none;
    font-family: var(--font-monospace);
    text-shadow: 0 0 5px var(--p-form-field-background);
  }
}
</style>
