<template>
  <div class="titlebar">
    <div class="leftbar">
      <Button label="打开" icon="pi pi-folder-open" severity="secondary" />
      <Button icon="pi pi-cog" variant="text" severity="secondary" />
      <Button icon="pi pi-undo" variant="text" severity="secondary" />
      <Button icon="pi pi-refresh" variant="text" severity="secondary" disabled />
    </div>
    <div class="centerbar">
      <SelectButton v-model="viewHandler" :options="viewOptions" optionLabel="name" size="large" />
    </div>
    <div class="rightbar">
      <SplitButton
        label="保存"
        icon="pi pi-save"
        :model="[{ label: '另存为', icon: 'pi pi-file-export' }]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { View } from '@/stores/runtime'
import { Button, SelectButton, SplitButton } from 'primevue'
import { useRuntimeStore } from '@/stores/runtime'
import { computed } from 'vue'

const runtimeStore = useRuntimeStore()
const viewOptions = [
  { name: '内容', value: View.Content },
  { name: '时轴', value: View.Timing },
  { name: '预览', value: View.Preview },
]
const viewHandler = computed({
  get: () => viewOptions.find((v) => v.value === runtimeStore.currentView),
  set: (val: (typeof viewOptions)[number]) => {
    runtimeStore.currentView = val.value
  },
})
</script>

<style lang="scss">
.titlebar {
  display: flex;
  .leftbar,
  .rightbar {
    flex: 1;
    display: flex;
    gap: 0.3rem;
  }
  .leftbar {
    justify-content: flex-start;
  }
  .rightbar {
    justify-content: flex-end;
  }
}
</style>
