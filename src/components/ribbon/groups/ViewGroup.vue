<template>
  <RibbonGroup label="视图">
    <div class="kvgrid">
      <Checkbox
        inputId="ribbon-hlt-lineoverlap"
        value="hlt-lineoverlap"
        size="small"
        binary
        v-model="runtimeStore.hltLineTimeConflicts"
      />
      <label for="ribbon-hlt-lineoverlap">高亮行时间冲突</label>
      <Checkbox
        inputId="ribbon-hlt-wordoverlap"
        value="hlt-wordoverlap"
        size="small"
        binary
        v-model="runtimeStore.hltWordTimeConflicts"
      />
      <label for="ribbon-hlt-wordoverlap">高亮词时间冲突</label>
      <Checkbox
        inputId="ribbon-auto-scroll"
        value="auto-scroll"
        size="small"
        binary
        v-model="runtimeStore.scrollWithPlayback"
      />
      <label for="ribbon-auto-scroll">随播放自动滚动</label>
      <Checkbox
        inputId="ribbon-swap-translate-roman"
        value="swap-translate-roman"
        size="small"
        binary
        v-model="runtimeStore.swapTranslateRoman"
      />
      <label for="ribbon-swap-translate-roman">交换翻译音译框</label>
    </div>
  </RibbonGroup>
</template>

<script setup lang="ts">
import { useRuntimeStore } from '@/stores/runtime'
import { Checkbox } from 'primevue'
import RibbonGroup from '../RibbonGroupShell.vue'
const runtimeStore = useRuntimeStore()
</script>
