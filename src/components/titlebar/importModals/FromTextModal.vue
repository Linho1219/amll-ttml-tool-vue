<template>
  <Dialog v-model:visible="visible" modal header="从纯文本导入" class="from-text-modal" maximizable>
    <div class="options"></div>
    <div class="textfields"></div>
    <div class="actions">
      <Button label="取消" icon="pi pi-times" severity="secondary" @click="visible = false" />
      <Button label="导入" icon="pi pi-arrow-right" />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Button, Dialog, IftaLabel, Listbox, Tag, Textarea } from 'primevue'
import { ref } from 'vue'

const [visible] = defineModel<boolean>({ required: true })
</script>

<style lang="scss">
.from-text-modal {
  &:not(.p-dialog-maximized) {
    width: 80vw;
    height: 80vh;
    max-width: 90rem;
    max-height: 60rem;
  }
  .p-dialog-content {
    height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .textfields {
    height: 0;
    flex: 1;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
}
</style>
