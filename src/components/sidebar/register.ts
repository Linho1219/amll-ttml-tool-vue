import SplitTextTab from './tabs/SplitTextTab.vue'

export enum SidebarKey {
  SplitText = 'SplitText',
}

interface SidebarTab {
  key: SidebarKey
  title: string
  component: any
}

export const sidebarRegs = {
  [SidebarKey.SplitText]: {
    key: SidebarKey.SplitText,
    title: '分词',
    component: SplitTextTab,
  },
} as const satisfies Record<SidebarKey, SidebarTab>
