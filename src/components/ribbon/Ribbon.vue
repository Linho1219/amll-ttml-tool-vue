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
          <Checkbox inputId="ribbon-bgline" value="bgline" size="small" />
          <label for="ribbon-bgline">背景行</label>
          <Checkbox inputId="ribbon-duetline" value="duetline" size="small" />
          <label for="ribbon-duetline">对唱行</label>
          <Checkbox inputId="ribbon-ignoretime" value="ignoretime" size="small" />
          <label for="ribbon-ignoretime">忽略打轴</label>
        </div>
        <div class="kvgrid">
          <span>开始时间</span>
          <InputMask
            class="timeinput"
            mask="99:99.999"
            placeholder="00:00.000"
            slotChar="00:00.000"
            size="small"
          />
          <span>结束时间</span>
          <InputMask
            class="timeinput"
            mask="99:99.999"
            placeholder="00:00.000"
            slotChar="00:00.000"
            size="small"
          />
        </div>
      </div>
    </RibbonGroup>
    <RibbonGroup label="词属性">
      <div class="hflex" style="align-items: center; gap: 1rem">
        <div class="kvgrid">
          <span>开始时间</span>
          <InputMask
            class="timeinput"
            mask="99:99.999"
            placeholder="00:00.000"
            slotChar="00:00.000"
            size="small"
          />
          <span>结束时间</span>
          <InputMask
            class="timeinput"
            mask="99:99.999"
            placeholder="00:00.000"
            slotChar="00:00.000"
            size="small"
          />
          <span>持续时长</span>
          <InputNumber class="durationinput" size="small" />
        </div>
        <div class="vflex" style="gap: 0.5rem; width: 10rem">
          <span style="text-align: center">空拍 0 / 0</span>
          <div class="hflex">
            <InputGroup>
              <InputNumber class="monospace" showButtons :min="0" size="small" />
              <InputGroupAddon>
                <Button
                  icon="pi pi-angle-double-right"
                  severity="secondary"
                  variant="text"
                  size="small"
                  fluid
                />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <Slider :step="20" style="margin: 0.5rem" />
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
        />
      </div>
      <Button icon="pi pi-sliders-h" label="批量时移" size="small" severity="secondary" />
    </RibbonGroup>
    <RibbonGroup label="审校" more>
      <div class="kvgrid">
        <Checkbox inputId="ribbon-hlt-lineoverlap" value="hlt-lineoverlap" size="small" />
        <label for="ribbon-hlt-lineoverlap">高亮行时间冲突</label>
        <Checkbox inputId="ribbon-hlt-wordoverlap" value="hlt-wordoverlap" size="small" />
        <label for="ribbon-hlt-wordoverlap">高亮词时间冲突</label>
        <Checkbox inputId="ribbon-sensitive" value="sensitive" size="small" />
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
import {
  Button,
  Checkbox,
  InputGroup,
  InputGroupAddon,
  InputMask,
  InputNumber,
  Slider,
} from 'primevue'
import Ribbon from './RibbonShell.vue'
import RibbonGroup from './RibbonGroupShell.vue'
</script>
