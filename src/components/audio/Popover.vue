<template>
  <div class="audio-popover-pane">
    <span class="audio-popover-label">音量</span>
    <InputNumber class="monospace" :min="0" size="small" placeholder="0" />
    <Button
      class="audio-popover-reset-button"
      icon="pi pi-refresh"
      severity="secondary"
      variant="text"
      size="small"
    />
  </div>
</template>

<script setup lang="ts">
import type { AudioCtrl } from '@/utils/audio'
import { Button, InputNumber } from 'primevue';

const props = defineProps<{ audio: AudioCtrl }>()
</script>

<style lang="scss">
.audio-popover-pane {
  // test
  position: fixed;
  width: 15rem;
  bottom: 5rem;
  left: 5rem;

  display: grid;
}
</style>
