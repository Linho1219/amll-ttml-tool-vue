<template>
  <Ribbon>
    <ContentProcessGroup />
    <LineAttrGroup />
    <WordAttrGroup />
    <TimeShiftGroup />
    <MarkGroup />
    <ViewGroup />
    <PerformanceGroup />
  </Ribbon>
</template>

<script setup lang="ts">
import Ribbon from './RibbonShell.vue'

import ContentProcessGroup from './groups/ContentProcessGroup.vue'
import LineAttrGroup from './groups/LineAttrGroup.vue'
import MarkGroup from './groups/MarkGroup.vue'
import PerformanceGroup from './groups/PerformanceGroup.vue'
import TimeShiftGroup from './groups/TimeShiftGroup.vue'
import ViewGroup from './groups/ViewGroup.vue'
import WordAttrGroup from './groups/WordAttrGroup.vue'
</script>
