<template>
  <ul class="r-multiinputtext">
    <li class="r-multiinputtext-item"></li>
    <li class="r-multiinputtext-input-shell"></li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const [modelList] = defineModel<string[]>({ required: true })
const internalList = ref<
  {
    value: string
    key: number
    showInput: boolean
  }[]
>([])
const computedList = computed(() => {
  return internalList.value.map((item) => item.value)
})

const areListSame = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}
const getKey = (() => {
  let counter = 0
  return () => counter++
})()

watch(
  modelList,
  (newVal) => {
    if (!newVal) newVal = []
    if (!areListSame(newVal, computedList.value))
      internalList.value = newVal.map((value) => ({
        value,
        key: getKey(),
        showInput: false,
      }))
  },
  { immediate: true },
)
watch(computedList, (newVal) => {
  if (!areListSame(newVal, modelList.value)) modelList.value = newVal
})
</script>
