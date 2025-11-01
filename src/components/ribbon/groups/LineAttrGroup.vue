<template>
  <RibbonGroup label="行属性">
    <div class="hflex" style="align-items: center; gap: 1rem">
      <div class="kvgrid">
        <Checkbox
          inputId="ribbon-duetline"
          value="duetline"
          size="small"
          :disabled="lineSelectedEmpty"
          :indeterminate="duetIndeterminate"
          v-model="duetChecked"
          binary
        />
        <label for="ribbon-duetline">对唱行</label>
        <Checkbox
          inputId="ribbon-bgline"
          value="bgline"
          size="small"
          :disabled="lineSelectedEmpty"
          :indeterminate="backgroundIndeterminate"
          v-model="backgroundChecked"
          binary
        />
        <label for="ribbon-bgline">背景行</label>
        <Checkbox
          inputId="ribbon-ignoretime"
          value="ignoretime"
          size="small"
          :disabled="lineSelectedEmpty"
          :indeterminate="lineSelectedEmpty"
          binary
        />
        <label for="ribbon-ignoretime">忽略打轴</label>
      </div>
      <div class="kvgrid">
        <span>开始时间</span>
        <InputText
          class="timeinput"
          placeholder="00:00.000"
          size="small"
          :disabled="lineSelectedEmpty"
          v-model.lazy="lineStartTime"
          autoselect
        />
        <span>结束时间</span>
        <InputText
          class="timeinput"
          placeholder="00:00.000"
          size="small"
          :disabled="lineSelectedEmpty"
          v-model.lazy="lineEndTime"
          autoselect
        />
        <span>持续时长</span>
        <InputNumber
          class="durationinput"
          size="small"
          placeholder="0"
          :disabled="lineSelectedEmpty"
          v-model="lineDuration"
          :invalid="(lineDuration ?? 0) < 0"
        />
      </div>
    </div>
  </RibbonGroup>
</template>

<script setup lang="ts">
import { Checkbox, InputNumber } from 'primevue'
import RibbonGroup from '../RibbonGroupShell.vue'
import { useRuntimeStore } from '@/stores/runtime'
import { computed } from 'vue'
import { attrCheckbox, itemTimeInput } from '../common'
import InputText from '@/components/repack/InputText.vue'

const runtimeStore = useRuntimeStore()

const lineSelectedEmpty = computed(() => runtimeStore.selectedLines.size === 0)

const { checked: backgroundChecked, indeterminate: backgroundIndeterminate } = attrCheckbox(
  runtimeStore.selectedLines,
  'background',
)
const { checked: duetChecked, indeterminate: duetIndeterminate } = attrCheckbox(
  runtimeStore.selectedLines,
  'duet',
)

const {
  startTime: lineStartTime,
  endTime: lineEndTime,
  duration: lineDuration,
} = itemTimeInput(runtimeStore.selectedLines)
</script>
