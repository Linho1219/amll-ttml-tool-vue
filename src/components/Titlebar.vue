<template>
  <div class="titlebar">
    <div class="leftbar">
      <Button
        label="打开"
        icon="pi pi-folder-open"
        severity="secondary"
        @click="(e) => openMenu?.toggle(e)"
      />
      <Menu ref="openMenu" :model="openMenuItems" popup />
      <Button icon="pi pi-cog" variant="text" severity="secondary" />
      <Button
        icon="pi pi-undo"
        variant="text"
        severity="secondary"
        @click="editHistory.undo()"
        :disabled="!editHistory.undoable.value"
      />
      <Button
        icon="pi pi-refresh"
        variant="text"
        severity="secondary"
        @click="editHistory.redo()"
        :disabled="!editHistory.redoable.value"
      />
    </div>
    <div class="centerbar">
      <SelectButton v-model="viewHandler" :options="viewOptions" optionLabel="name" size="large" />
    </div>
    <div class="rightbar">
      <SplitButton
        label="保存"
        icon="pi pi-save"
        :model="[{ label: '另存为', icon: 'pi pi-file-export' }]"
        @click="handleSaveClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { View } from '@/stores/runtime'
import { Button, Menu, SelectButton, SplitButton } from 'primevue'
import { useRuntimeStore } from '@/stores/runtime'
import { nextTick, onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
import type { MenuItem } from 'primevue/menuitem'
import { stringifyNative } from '@/port/native'
import editHistory from '@/stores/editHistory'
import { chooseFile } from '@/utils/file'
import { importTTML, parseTTML } from '@/port/ttml'
import { importPersist } from '@/port'
import { importQRC } from '@/port/qrc'
import { importYRC } from '@/port/yrc'
import { importPlainText } from '@/port/paintext'

const runtimeStore = useRuntimeStore()

// Middle view selector
const viewOptions = [
  { name: '内容', value: View.Content },
  { name: '时轴', value: View.Timing },
  { name: '预览', value: View.Preview },
]
const stateToView = () => viewOptions.find((v) => v.value === runtimeStore.currentView)!
const viewHandler = ref<(typeof viewOptions)[number] | null>(stateToView())
watch(viewHandler, (value) => {
  if (!value) nextTick(() => (viewHandler.value = stateToView()))
  else runtimeStore.currentView = value.value
})
watch(
  () => runtimeStore.currentView,
  () => (viewHandler.value = stateToView()),
)

// File open
const openMenu = useTemplateRef('openMenu')

const handleImportFromFile = (accept: string, parser: (content: string) => void) => async () => {
  const file = await chooseFile(accept)
  if (!file) return
  return parser(file.content)
}

const openMenuItems: MenuItem[] = [
  {
    label: '现有项目',
    icon: 'pi pi-file',
    command: () => {},
  },
  {
    label: '从 TTML 文件导入',
    icon: 'pi pi-file-arrow-up',
    command: handleImportFromFile('.ttml', parseTTML),
  },
  {
    label: '从 YRC 文件导入',
    icon: 'pi pi-file-arrow-up',
    command: handleImportFromFile('.yrc', importYRC),
  },
  {
    label: '从 QRC 文件导入',
    icon: 'pi pi-file-arrow-up',
    command: handleImportFromFile('.qrc', importQRC),
  },
  {
    label: '从文本文件导入',
    icon: 'pi pi-file-arrow-up',
    command: handleImportFromFile('.txt', importPlainText),
  },
  {
    label: '从纯文本导入',
    icon: 'pi pi-align-left',
    command: () => {},
  },
  { separator: true },
  {
    label: '空项目',
    icon: 'pi pi-ban',
    command: handleNewProject,
  },
]

async function handleNewProject() {
  importPersist({
    lyricLines: [],
    metadata: {},
  })
}

// File save
function handleSaveClick() {
  // console.log(stringifyNative())
}
</script>

<style lang="scss">
.titlebar {
  display: flex;
  margin: 0 0.5rem;
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
