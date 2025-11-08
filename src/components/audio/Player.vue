<template>
  <Card class="player">
    <template #content>
      <Spectrogram v-if="showSpectrogram" :key="refresher" />
      <div class="player-toolbar">
        <Button icon="pi pi-upload" severity="secondary" @click="() => handleSelectFile()" />
        <Button icon="pi pi-sliders-v" severity="secondary" @click="tooglePopover" />
        <Popover ref="popover"> <PopoverPane /> </Popover>
        <Button
          :icon="playingRef ? 'pi pi-pause' : 'pi pi-play'"
          @click="playingRef = !playingRef"
          :disabled="!activatedRef"
        />
        <div class="audio-progress monospace">
          <div class="audio-progress-primary">{{ ms2str(displayProgress) }}</div>
          <div class="audio-progress-secondary">
            <span class="audio-percentage-text">{{ percentageRef }}%</span>
            <span class="audio-length-text">{{ ms2str(lengthRef) }}</span>
          </div>
        </div>
        <Waveform :audio="audio" :key="refresher" />
        <Button
          icon="pi pi-chart-bar"
          :severity="showSpectrogram ? 'primary' : 'secondary'"
          @click="showSpectrogram = !showSpectrogram"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'
import { Button, Card, Popover } from 'primevue'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import PopoverPane from './Popover.vue'
import Spectrogram from './Spectrogram.vue'
import { ms2str } from '@/utils/timeModel'
import Waveform from './Waveform.vue'
import { useStaticStore } from '@/stores/static'
import { useGlobalKeyboard } from '@/utils/hotkey'

const audio = useStaticStore().audio
const { progressRef, amendmentRef, lengthRef, playingRef, activatedRef } = audio

const { open: handleSelectFile, onChange: onFileChange } = useFileDialog({
  accept: 'audio/*',
  multiple: false,
})
useGlobalKeyboard('chooseMedia', () => handleSelectFile())
useGlobalKeyboard('playPauseAudio', () => {
  if (activatedRef.value) playingRef.value = !playingRef.value
})
useGlobalKeyboard('seekBackward', () => {
  audio.seekBy(-5000)
})
useGlobalKeyboard('seekForward', () => {
  audio.seekBy(5000)
})
useGlobalKeyboard('volumeDown', () => {
  audio.volumeRef.value = Math.max(0, audio.volumeRef.value - 0.1)
})
useGlobalKeyboard('volumeUp', () => {
  audio.volumeRef.value = Math.min(1, audio.volumeRef.value + 0.1)
})

const refresher = ref(Symbol())
onFileChange((files) => {
  const file = files?.[0]
  if (!file) return
  audio.mount(file)
})
audio.audioEl.onloadeddata = () => {
  nextTick(() => {
    refresher.value = Symbol()
  })
}

const displayProgress = computed(() => progressRef.value - amendmentRef.value)
const percentageRef = computed(() => {
  if (lengthRef.value === 0) return 0
  return Math.round((displayProgress.value / lengthRef.value) * 100)
})

const popover = useTemplateRef('popover')
const tooglePopover = (e: MouseEvent) => popover.value?.toggle(e)

const showSpectrogram = ref(false)
</script>

<style lang="scss">
.player {
  border: 1px solid color-mix(in srgb, var(--p-zinc-600), transparent 85%);
  overflow: hidden;
  margin: 0 0.5rem;
  .p-card-body {
    padding: 0;
  }
  .player-toolbar {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
  }
}

.audio-progress {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  text-align: center;
  padding: 0 0.3rem;
  line-height: 1;
  gap: 0.2rem;
  font-size: 0.85rem;
}
.audio-progress-primary {
  font-size: 1.36em;
}
.audio-progress-secondary {
  font-size: 0.9em;
  opacity: 0.7;
  display: flex;
  width: 13.6ch;
  justify-content: space-between;
}
</style>
