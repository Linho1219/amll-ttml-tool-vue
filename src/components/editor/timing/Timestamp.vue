<template>
  <div class="timestamp" :class="{ begin: props.begin, end: props.end }">
    <div class="timestamp-caption" v-if="!showInput" @dblclick="showInput = true">
      {{ ms2str(upstream) }}
    </div>
    <InputText
      v-else
      class="timestamp-input"
      v-model.lazy="inputModel"
      @blur="showInput = false"
      ref="input"
      size="small"
    />
  </div>
</template>

<script setup lang="ts">
import { ms2str, str2ms } from '@/utils/timeModel'
import InputText from '@/components/repack/InputText.vue'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'

const props = defineProps<{
  begin?: boolean
  end?: boolean
}>()
const upstream = defineModel<number>({ required: true })
const inputModel = computed({
  get: () => ms2str(upstream.value),
  set: (val: string) => {
    const ms = str2ms(val)
    if (ms !== null) upstream.value = ms
  },
})
const input = useTemplateRef('input')
const showInput = ref(false)
watch(showInput, (v) => {
  if (v) nextTick(() => input.value?.input?.select())
})
</script>

<style lang="scss">
.timestamp {
  font-family: var(--font-monospace);
  --p-inputtext-sm-padding-y: 0.3rem;
  --p-inputtext-sm-padding-x: 0.4rem;

  ::selection {
    background-color: color-mix(in srgb, var(--p-inputtext-focus-border-color), transparent 50%);
  }
  &.begin {
    --p-inputtext-background: var(--p-button-outlined-success-active-background);
    --p-inputtext-focus-border-color: var(--p-button-text-success-color);
  }
  &.end {
    --p-inputtext-background: var(--p-button-outlined-danger-active-background);
    --p-inputtext-focus-border-color: var(--p-button-text-danger-color);
  }
}
.timestamp-caption {
  padding-block: var(--p-inputtext-sm-padding-y);
  padding-inline: var(--p-inputtext-sm-padding-x);
  border-radius: var(--p-inputtext-border-radius);
  background: var(--p-inputtext-background);
  border: 1px solid transparent;
}
.timestamp-caption,
.timestamp-input {
  line-height: 1.2;
  box-sizing: content-box;
  width: 9ch;
  color: inherit;
  font-size: inherit;
}
</style>
