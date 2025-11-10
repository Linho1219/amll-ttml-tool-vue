<template>
  <Dialog v-model:visible="visible" modal header="从纯文本导入" class="from-text-modal" maximizable>
    <div class="options">
      <div class="select-field">
        <Select
          class="mode-selection"
          :options="modeSelectItems"
          v-model="currentMode"
          optionLabel="name"
          checkmark
        />
        <div class="description">{{ currentMode.description }}</div>
      </div>
      <div class="checkboxes">
        <div class="check-item">
          <Checkbox v-model="originalChecked" inputId="original" name="original" binary disabled />
          <label for="original"> 原文 </label>
        </div>
        <div class="check-item">
          <Checkbox v-model="translationChecked" inputId="translation" name="translation" binary />
          <label for="translation"> 翻译 </label>
        </div>
        <div class="check-item">
          <Checkbox v-model="romanChecked" inputId="roman" name="roman" binary />
          <label for="roman"> 音译 </label>
        </div>
      </div>
    </div>
    <div class="textfields">
      <div class="textfield-shell">
        <div class="textfield-label" v-if="currentMode === separate">原文</div>
        <CodeMirror
          class="textfield"
          v-model:content="originalInput"
          v-model:scroll-top="cmScrollTop"
          v-model:current-line="cmCurrentLine"
          showLineNumbers
        />
      </div>
      <div class="textfield-shell" v-if="currentMode === separate && translationChecked">
        <div class="textfield-label">翻译</div>
        <CodeMirror
          class="textfield"
          v-model:content="translationInput"
          v-model:scroll-top="cmScrollTop"
          v-model:current-line="cmCurrentLine"
        />
      </div>
      <div class="textfield-shell" v-if="currentMode === separate && romanChecked">
        <div class="textfield-label">音译</div>
        <CodeMirror
          class="textfield"
          v-model:content="romanInput"
          v-model:scroll-top="cmScrollTop"
          v-model:current-line="cmCurrentLine"
        />
      </div>
    </div>
    <div class="actions">
      <Button
        label="去除时间戳"
        icon="pi pi-times"
        severity="secondary"
        @click="handleRemoveTimestamps"
      />
      <Button label="取消" icon="pi pi-times" severity="secondary" @click="visible = false" />
      <Button label="导入" icon="pi pi-arrow-right" @click="handleImportAction" />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Button, Checkbox, Dialog, Select } from 'primevue'
import { ref, shallowRef } from 'vue'
import CodeMirror from './CodeMirror.vue'
import { importPersist } from '@/port'
import { parseSeparatePlainText } from '@/port/paintext'

const [visible] = defineModel<boolean>({ required: true })
const originalInput = ref<string>('')
const translationInput = ref<string>('')
const romanInput = ref<string>('')

const cmCurrentLine = ref<number>(1)
const cmScrollTop = ref<number>(0)

interface ModeSelectItem {
  name: string
  description: string
}
const interleaved: ModeSelectItem = {
  name: '交错行',
  description: '歌词原文与翻译、音译行混合交错排列。每连续的数行为一组。',
} as const
const separate: ModeSelectItem = {
  name: '分别输入',
  description: '歌词原文、翻译、音译分别在不同的文本框中输入。相同位置的行为一组。',
} as const

const modeSelectItems = [separate, interleaved]
const currentMode = shallowRef<ModeSelectItem>(separate)

const originalChecked = ref(true)
const translationChecked = ref(false)
const romanChecked = ref(false)

function handleImportAction() {
  if (currentMode.value === separate) {
    importPersist(
      parseSeparatePlainText(
        originalInput.value,
        translationChecked.value ? translationInput.value : undefined,
        romanChecked.value ? romanInput.value : undefined,
      ),
    )
  }
  visible.value = false
}
function handleRemoveTimestamps() {
  const timestampRegex = /^\[\d{1,2}:\d{1,2}(?:\.\d{1,3})?\] */
  const rmTimestamp = (text: string) =>
    text
      .split(/\r?\n/)
      .map((line) => line.replace(timestampRegex, ''))
      .join('\n')
  originalInput.value = rmTimestamp(originalInput.value)
  if (currentMode.value === separate) {
    if (translationChecked.value) translationInput.value = rmTimestamp(translationInput.value)
    if (romanChecked.value) romanInput.value = rmTimestamp(romanInput.value)
  }
}
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
  .options {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .description {
    font-size: 0.875rem;
    opacity: 0.8;
  }
  .select-field {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .mode-selection {
    min-width: 12rem;
  }
  .checkboxes {
    display: flex;
    gap: 1.5rem;
  }
  .check-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .textfields {
    height: 0;
    flex: 1;
    display: flex;
    gap: 1rem;
  }
  .textfield-shell {
    display: flex;
    flex: 1;
    width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .textfield-label {
    opacity: 0.9;
    padding-left: 0.5rem;
  }
  .textfield {
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
