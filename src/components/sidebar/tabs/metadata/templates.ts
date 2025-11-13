export interface MetadataTemplate {
  name: string
  fields: {
    key: string
    label: string
    discription?: string
    validation?: {
      validator: (s: string) => boolean
      message: string
      severity: 'error' | 'warning'
    }
  }[]
}

export const lrcMetaTemplate: MetadataTemplate = {
  name: 'LRC 元数据',
  fields: [
    { key: 'ti', label: '标题' },
    { key: 'ar', label: '艺术家' },
    { key: 'al', label: '专辑' },
    { key: 'lr', label: '作词' },
    {
      key: 'length',
      label: '音频长度',
      validation: {
        validator: (s) => /^\d{1,2}:\d{1,2}(\.\d{1,3})?$/.test(s),
        message: '长度格式应为 mm:ss 或 mm:ss.sss',
        severity: 'error',
      },
    },
    { key: 'by', label: '歌词文件创建者' },
    { key: 're', label: '歌词文件创建工具' },
  ],
}
