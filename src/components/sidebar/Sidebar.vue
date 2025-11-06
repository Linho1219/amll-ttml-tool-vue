<template>
  <aside class="sidebar">
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
  </aside>
</template>

<script setup lang="ts">
import { useRuntimeStore } from '@/stores/runtime'
import { computed } from 'vue'
import { sidebarRegs } from './register'
import { Button, Tab, TabList, Tabs } from 'primevue'

const runtimeStore = useRuntimeStore()

const openedSidebarTabs = computed(() => runtimeStore.openedSidebars.map((key) => sidebarRegs[key]))
const currentSidebarTab = computed(() => openedSidebarTabs.value[runtimeStore.currentSidebarIndex])
</script>

<style lang="scss">
.sidebar {
  width: 360px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--p-content-border-color);
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
</style>
