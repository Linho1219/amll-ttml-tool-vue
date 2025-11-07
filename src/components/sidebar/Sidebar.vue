<template>
  <aside class="sidebar" :style="{ width: configStore.sidebarWidth + 'px' }">
    <div
      v-if="currentSidebarTab && runtimeStore.openedSidebars.length === 1"
      class="sidebar-title single"
    >
      <div class="sidebar-title-single-text">{{ currentSidebarTab.title }}</div>
      <Button
        icon="pi pi-times"
        variant="text"
        severity="secondary"
        @click="runtimeStore.closeCurrentSidebar"
      />
    </div>
    <div v-else class="sidebar-title multiple">
      <Tabs v-model:value="runtimeStore.currentSidebarIndex">
        <TabList>
          <Tab v-for="(tab, index) in openedSidebarTabs" :key="tab.key" :value="index">
            {{ tab.title }}
          </Tab>
        </TabList>
      </Tabs>
    </div>
    <component class="sidebar-inner" :is="currentSidebarTab?.component" />
    <div class="sidebar-resizer" @mousedown="handleResizeStart"></div>
  </aside>
</template>

<script setup lang="ts">
import { useRuntimeStore } from '@/stores/runtime'
import { computed } from 'vue'
import { sidebarRegs } from './register'
import { Button, Tab, TabList, Tabs } from 'primevue'
import { usePreferenceStore } from '@/stores/preference'

const runtimeStore = useRuntimeStore()
const configStore = usePreferenceStore()

const openedSidebarTabs = computed(() => runtimeStore.openedSidebars.map((key) => sidebarRegs[key]))
const currentSidebarTab = computed(() => openedSidebarTabs.value[runtimeStore.currentSidebarIndex])

const MIN_SIDEBAR_WIDTH = 200
function handleResizeStart(e: MouseEvent) {
  const startX = e.clientX
  const startWidth = configStore.sidebarWidth
  function handleMouseMove(e: MouseEvent) {
    const deltaX = e.clientX - startX
    configStore.sidebarWidth = Math.max(MIN_SIDEBAR_WIDTH, startWidth + deltaX)
  }
  function handleMouseUp() {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}
</script>

<style lang="scss">
@keyframes sidebar-enter {
  from {
    transform: translateX(-5rem);
  }
}
.sidebar {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--p-content-border-color);
  position: relative;
  animation:
    sidebar-enter 0.4s cubic-bezier(0, 1, 0, 1),
    fade 0.3s;
}
.sidebar-title.single {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0.5rem 0.5rem 1rem;
}
.sidebar-title-single-text {
  font-size: 1.4rem;
}
.sidebar-inner {
  height: 0;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0.5rem 1rem;
}
.sidebar-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -0.15rem;
  width: 0.3rem;
  background-color: var(--p-primary-color);
  z-index: 3;
  opacity: 0;
  transition: opacity 0.1s;
  &:hover {
    opacity: 0.7;
    transition-delay: 0.3s;
  }
  &:active {
    opacity: 0.7;
    transition: opacity 0.1s;
  }
  &,
  :root:has(&:active) {
    cursor: ew-resize;
  }
}
</style>
