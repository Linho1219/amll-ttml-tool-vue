<template>
  <Card class="player">
    <template #content>
      <Button icon="pi pi-upload" severity="secondary" @click="() => handleSelectFile()" />
      <Button icon="pi pi-sliders-v" severity="secondary" @click="tooglePopover" />
      <Popover ref="popover"> </Popover>
      <Button
        :icon="playingRef ? 'pi pi-pause' : 'pi pi-play'"
        @click="playingRef = !playingRef"
        :disabled="!activatedRef"
      />
      <div style="flex: 1">
        <PopoverPane :audio="audio" />
      </div>
      <Button icon="pi pi-chart-bar" severity="secondary" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useAudioCtrl } from '@/utils/audio'
import { useFileDialog } from '@vueuse/core'
import { Button, Card, InputGroup, InputGroupAddon, InputNumber, Popover } from 'primevue'
import { useTemplateRef } from 'vue'
import PopoverPane from './Popover.vue'

const audio = useAudioCtrl()
const { progressRef, playingRef, volumeRef, activatedRef } = audio
const { open: handleSelectFile, onChange: onFileChange } = useFileDialog({
  accept: 'audio/*',
  multiple: false,
})

onFileChange((files) => {
  const file = files?.[0]
  if (!file) return
  audio.mount(file)
})

const popover = useTemplateRef('popover')
const tooglePopover = (e: MouseEvent) => popover.value?.toggle(e)
</script>

<style lang="scss">
.player {
  border: 1px solid color-mix(in srgb, var(--p-zinc-600), transparent 85%);
  .p-card-body {
    padding: 0.5rem;
  }
  .p-card-content {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
