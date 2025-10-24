<template>
  <Ribbon>
    <RibbonGroup label="内容处理">
      <Button
        icon="pi pi-arrow-up-right-and-arrow-down-left-from-center"
        label="全文分词"
        size="small"
        severity="secondary"
      />
      <Button icon="pi pi-arrows-h" label="行分词" size="small" severity="secondary" />
      <Button icon="pi pi-search" label="查找替换" size="small" severity="secondary" />
    </RibbonGroup>
    <RibbonGroup label="行属性">
      <div class="hflex" style="align-items: center; gap: 1rem">
        <div class="kvgrid">
          <Checkbox
            inputId="ribbon-duetline"
            value="duetline"
            size="small"
            :disabled="lineSelectedEmpty"
            :indeterminate="isDuetIndeterminate"
            v-model="isDuetChecked"
            binary
          />
          <label for="ribbon-duetline">对唱行</label>
          <Checkbox
            inputId="ribbon-bgline"
            value="bgline"
            size="small"
            :disabled="lineSelectedEmpty"
            :indeterminate="isBGIndeterminate"
            v-model="isBGChecked"
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
            :invalid="(wordDuration ?? 0) < 0"
          />
        </div>
      </div>
    </RibbonGroup>
    <RibbonGroup label="词属性">
      <div class="hflex" style="align-items: center; gap: 1rem">
        <div class="kvgrid">
          <span>开始时间</span>
          <InputText
            class="timeinput"
            placeholder="00:00.000"
            size="small"
            :disabled="wordSelectedEmpty"
            v-model.lazy="wordStartTime"
          />
          <span>结束时间</span>
          <InputText
            class="timeinput"
            placeholder="00:00.000"
            size="small"
            :disabled="wordSelectedEmpty"
            v-model.lazy="wordEndTime"
          />
          <span>持续时长</span>
          <InputNumber
            class="durationinput"
            size="small"
            placeholder="0"
            :disabled="wordSelectedEmpty"
            v-model="wordDuration"
            :invalid="(wordDuration ?? 0) < 0"
          />
        </div>
        <div class="vflex" style="gap: 0.5rem; width: 10rem">
          <span style="text-align: center">占位拍 0 / 0</span>
          <div class="hflex">
            <InputGroup>
              <InputNumber
                class="monospace"
                showButtons
                :min="0"
                size="small"
                placeholder="0"
                :disabled="wordSelectedEmpty"
              />
              <InputGroupAddon class="placeholderbeat-applytoall-addon">
                <Button
                  class="placeholderbeat-applytoall"
                  icon="pi pi-angle-double-right"
                  severity="secondary"
                  variant="text"
                  size="small"
                  fluid
                  :disabled="wordSelectedEmpty"
                />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <Slider :step="20" style="margin: 0.5rem" :disabled="wordSelectedEmpty" />
        </div>
      </div>
    </RibbonGroup>
    <RibbonGroup label="时移">
      <Button icon="pi pi-wave-pulse" label="延迟测试" size="small" severity="secondary" />
      <div class="hflex" style="align-items: center; gap: 0.5rem">
        <span>延迟</span>
        <InputNumber
          class="durationinput"
          :useGrouping="false"
          style="width: 0; flex: 1"
          fluid
          size="small"
          placeholder="0"
          v-model="runtimeStore.globalLatency"
        />
      </div>
      <Button icon="pi pi-sliders-h" label="批量时移" size="small" severity="secondary" />
    </RibbonGroup>
    <RibbonGroup label="审校" more>
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
          inputId="ribbon-sensitive"
          value="sensitive"
          size="small"
          binary
          v-model="runtimeStore.scrollWithPlayback"
        />
        <label for="ribbon-sensitive">随播放自动滚动</label>
      </div>
    </RibbonGroup>
    <RibbonGroup label="标记" more>
      <Button icon="pi pi-bookmark" label="添加书签" size="small" severity="secondary" />
      <Button icon="pi pi-comment" label="添加批注" size="small" severity="secondary" />
      <Button icon="pi pi-eraser" label="移除全部" size="small" severity="secondary" />
    </RibbonGroup>
  </Ribbon>
</template>

<script setup lang="ts">
import { Button, Checkbox, InputGroup, InputGroupAddon, InputNumber, Slider } from 'primevue'
import InputText from '@/components/repack/InputText.vue'
import Ribbon from './RibbonShell.vue'
import RibbonGroup from './RibbonGroupShell.vue'
import { useRuntimeStore } from '@/stores/runtime'
import { useCoreStore, type LyricLine } from '@/stores/core'
import { computed, ref } from 'vue'
import { ms2str, str2ms } from '@/utils/timeModel'

const runtimeStore = useRuntimeStore()
const coreStore = useCoreStore()

const lineSelectedEmpty = computed(() => runtimeStore.selectedLines.size === 0)
const wordSelectedEmpty = computed(() => runtimeStore.selectedWords.size === 0)

type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never
}[keyof T]
function attrCheckbox<T extends Object>(itemSet: Set<T>, attr: BooleanKeys<T>) {
  const indeterminate = ref(true)
  const checked = computed<boolean>({
    get() {
      if (itemSet.size === 0) {
        indeterminate.value = true
        return false
      }
      let first = itemSet.values().next().value![attr] as boolean
      if (itemSet.size === 1) {
        indeterminate.value = false
        return first
      }
      for (const item of itemSet)
        if (item[attr] !== first) {
          indeterminate.value = true
          return false
        }
      indeterminate.value = false
      return first
    },
    set(value) {
      itemSet.forEach((item) => ((item[attr] as boolean) = value))
      indeterminate.value = false
    },
  })
  return { checked, indeterminate }
}
const { checked: isBGChecked, indeterminate: isBGIndeterminate } = attrCheckbox(
  runtimeStore.selectedLines,
  'isBG',
)
const { checked: isDuetChecked, indeterminate: isDuetIndeterminate } = attrCheckbox(
  runtimeStore.selectedLines,
  'isDuet',
)

function itemTimeInput<T extends { startTime: number; endTime: number }>(itemSet: Set<T>) {
  const setOnlyOne = computed(() => itemSet.size === 1)
  const setFirstItem = computed(() => itemSet.values().next().value)
  const getTimeComputed = (timeKey: 'startTime' | 'endTime') =>
    computed<string | null | undefined>({
      get() {
        if (!setFirstItem.value) return '' // empty set
        if (setOnlyOne.value) return ms2str(setFirstItem.value[timeKey])
        const firstTime = setFirstItem.value![timeKey]
        for (const item of itemSet) if (item[timeKey] !== firstTime) return ''
        return ms2str(firstTime)
      },
      set(value) {
        if (typeof value !== 'string') return
        const ms = str2ms(value)
        if (ms === null) return
        itemSet.forEach((item) => (item[timeKey] = ms))
      },
    })
  const startTime = getTimeComputed('startTime')
  const endTime = getTimeComputed('endTime')
  const duration = computed<number | undefined>({
    get() {
      if (!setFirstItem.value) return undefined
      const calcDuration = (item: T) => item.endTime - item.startTime
      const firstDuration = calcDuration(setFirstItem.value)
      if (setOnlyOne.value) return firstDuration
      for (const item of itemSet) if (calcDuration(item) !== firstDuration) return undefined
      return firstDuration
    },
    set(ms) {
      if (typeof ms !== 'number') return
      itemSet.forEach((item) => (item.endTime = item.startTime + ms))
    },
  })
  return { startTime, endTime, duration }
}
const {
  startTime: lineStartTime,
  endTime: lineEndTime,
  duration: lineDuration,
} = itemTimeInput(runtimeStore.selectedLines)
const {
  startTime: wordStartTime,
  endTime: wordEndTime,
  duration: wordDuration,
} = itemTimeInput(runtimeStore.selectedWords)
</script>

<style lang="scss" scoped>
.placeholderbeat-applytoall-addon {
  z-index: 1;
  &:has(.placeholderbeat-applytoall:focus-visible) {
    outline: var(--p-button-focus-ring-width) var(--p-button-focus-ring-style)
      var(--p-button-secondary-focus-ring-color);
    outline-offset: var(--p-button-focus-ring-offset);

    box-shadow: var(--p-button-secondary-focus-ring-shadow);
  }
}
</style>
