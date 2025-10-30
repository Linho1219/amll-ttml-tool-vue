<template>
  <div class="spectrogram" ref="spectrogramEl">
    <span class="spectrogram-tooltip">等待频谱图装载…</span>
  </div>
</template>

<script setup lang="ts">
import { useRuntimeStore } from '@/stores/runtime'
import { ms2str } from '@/utils/timeModel'
import { useCssVar, useElementSize } from '@vueuse/core'
import { onMounted, ref, useTemplateRef } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.esm.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'
import SpectrogramPlugin from './spectrogramPlugin/index.ts'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.js'
const spectrogramEl = useTemplateRef('spectrogramEl')
const primaryColor = useCssVar('--p-primary-color')
const { height: spectrogramHeight } = useElementSize(spectrogramEl)
const audio = useRuntimeStore().getAudio()

const wsInstance = ref<WaveSurfer | null>(null)
const rgInstance = ref<RegionsPlugin | null>(null)
onMounted(() => {
  if (!spectrogramEl.value) return
  const spectrogramHeightRatio = 0.8
  const regions = RegionsPlugin.create()
  rgInstance.value = regions
  wsInstance.value = WaveSurfer.create({
    media: audio.audioEl,
    container: spectrogramEl.value,
    height: spectrogramHeight.value * (1 - spectrogramHeightRatio),
    waveColor: primaryColor.value,
    progressColor: primaryColor.value,
    cursorColor: primaryColor.value,
    dragToSeek: true,
    normalize: true,
    cursorWidth: 0,
    barHeight: 0.8,
    sampleRate: 44100,
    minPxPerSec: 100,
    plugins: [
      ZoomPlugin.create({
        scale: 0.4,
        maxZoom: 300,
      }),
      SpectrogramPlugin.create({
        labels: false,
        height: spectrogramHeight.value * spectrogramHeightRatio,
        fftSamples: 1024,
        noverlap: 512,
        frequencyMin: 1000,
        frequencyMax: 22050,
        minFreqThresOfMaxMagnitude: 8000,
        gain: 9,
        logRatio: 0.3,
        noiseFloor: 2e-3,
        windowFunc: 'hann',
      }),
      HoverPlugin.create({
        formatTimeCallback: (v) => ms2str(v * 1000),
        lineColor: primaryColor.value,
        lineWidth: 1,
        labelBackground: 'transparent',
        labelPreferLeft: false,
      }),
      regions,
    ],
  })
})
</script>

<style lang="scss">
.spectrogram {
  cursor: text;
  height: 12.5rem;
  position: relative;
  ::part(canvases) {
    opacity: 0.6;
  }
  ::part(progress) {
    opacity: 0.9;
  }
  ::part(cursor) {
    box-shadow:
      0 0 0 1px var(--p-primary-color),
      0 0 0 3px #0002;
    will-change: left;
  }
  ::part(hover-label) {
    padding: 0 0.5rem;
    font-size: 1rem;
    line-height: 2.5rem;
    transition: none;
    font-family: var(--font-monospace);
    text-shadow: 0 0 5px var(--p-form-field-background);
  }
  ::part(region) {
    box-shadow: 0 0 0 2px var(--p-primary-color);
    margin: 0 1px;
    background-color: var(--p-primary-color);
    border-radius: 0;
  }
  ::part(region-handle) {
    display: none;
  }
  ::part(region-content) {
    color: white;
    text-shadow: #0004 0 0 2px;
    background-color: #0003;
    margin-top: 2.5rem !important;
  }
}
.spectrogram-tooltip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.6;
}
</style>
