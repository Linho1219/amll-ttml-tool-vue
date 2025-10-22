import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useCoreStore = defineStore('core', () => {
  const metadata = reactive<TTMLMetadata[]>([])
  const lyricLines = reactive<LyricLine[]>([])
  const comments = reactive<Comment[]>([])
  return { metadata, lyricLines, comments }
})

import type {
  LyricLine as AMLLLyricLine,
  LyricWord as AMLLLyricWord,
} from '@applemusic-like-lyrics/lyric'

export interface TTMLMetadata {
  key: string
  value: string[]
}

/** 批注 */
export interface Comment {
  /** 创建时间 */
  createTime: number
  /** 上次编辑时间 */
  lastEditTime: number
  /** 内容 */
  content: string
  /** 目标行或词 */
  target: LyricLine | LyricWord
}
/** 歌词行 */
export interface LyricLine extends AMLLLyricLine {
  words: LyricWord[]
  /** 在时轴上忽略 */
  ignoreInTiming: boolean
  /** 已添加书签 */
  bookmarked: boolean
  /** 批注 */
  comments: Comment[]
}
/** 单词 */
export interface LyricWord extends AMLLLyricWord {
  /** 所在行 */
  parentLine: LyricLine
  /** 占位拍，用于日语多音节汉字时轴 */
  placeholderBeat: number
  /** 当前占位拍 */
  currentPlaceholderBeat: number
  /** 已添加书签 */
  bookmarked: boolean
  /** 批注 */
  comments: Comment[]
}
