import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

//test

const newLine = (attrs: Partial<LyricLine> = {}): LyricLine => ({
  startTime: 0,
  endTime: 0,
  words: [],
  ignoreInTiming: false,
  bookmarked: false,
  translatedLyric: '',
  romanLyric: '',
  background: false,
  duet: false,
  ...attrs,
})
const newWord = (attrs: Partial<LyricWord> = {}): LyricWord => ({
  startTime: 0,
  endTime: 0,
  word: '',
  placeholdingBeat: 0,
  currentplaceholdingBeat: 0,
  bookmarked: false,
  comments: [],
  ...attrs,
})

const line: LyricLine = newLine({
  startTime: 0,
  endTime: 3000,
  translatedLyric: '你好，世界！',
})
const word1: LyricWord = newWord({
  startTime: 0,
  endTime: 1000,
  word: 'Hello',
})
const word2: LyricWord = newWord({
  startTime: 0,
  endTime: 0,
  word: ' ',
})
const word3: LyricWord = newWord({
  startTime: 2300,
  endTime: 3000,
  word: 'world!',
  placeholdingBeat: 3,
})
line.words.push(word1, word2, word3)

export const useCoreStore = defineStore('core', () => {
  const createdAt = ref(Date.now())
  const metadata = reactive<Metadata>(new Map())
  const lyricLines = reactive<LyricLine[]>([line])
  const comments = reactive<Comment[]>([])
  return {
    createdAt,
    metadata,
    lyricLines,
    comments,
    newLine,
    newWord,
    deleteLine,
    deleteWord,
    deleteWordFromLine,
  }

  function deleteLine(...lines: LyricLine[]) {
    const lineSet = new Set(lines)
    const filtered = lyricLines.filter((line) => !lineSet.has(line))
    if (filtered.length === lyricLines.length) return
    lyricLines.length = 0
    lyricLines.push(...filtered)
  }
  function deleteWord(...words: LyricWord[]) {
    const wordSet = new Set(words)
    for (const line of lyricLines) {
      const filtered = line.words.filter((word) => !wordSet.has(word))
      if (filtered.length === line.words.length) continue
      line.words.length = 0
      line.words.push(...filtered)
    }
  }
  function deleteWordFromLine(line: LyricLine, ...words: LyricWord[]) {
    const wordSet = new Set(words)
    const filtered = line.words.filter((word) => !wordSet.has(word))
    if (filtered.length === line.words.length) return
    line.words.length = 0
    line.words.push(...filtered)
  }
})
export const coreCreate = { newLine, newWord }

export type MetadataKey = string
export type Metadata = Map<MetadataKey, string[]>

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
export interface LyricLine {
  /** 该行的翻译 */
  translatedLyric: string
  /** 该行的音译 */
  romanLyric: string
  /** 该行是否为背景歌词行 */
  background: boolean
  /** 该行是否为对唱歌词行（即歌词行靠右对齐） */
  duet: boolean
  /** 该行的开始时间 并不总是等于第一个单词的开始时间 */
  startTime: number
  /** 该行的结束时间 并不总是等于最后一个单词的开始时间 */
  endTime: number
  /** 该行的所有单词  */
  words: LyricWord[]
  /** 在时轴上忽略 */
  ignoreInTiming: boolean
  /** 已添加书签 */
  bookmarked: boolean
}
/** 单词 */
export interface LyricWord {
  /** 单词的起始时间 */
  startTime: number
  /** 单词的结束时间 */
  endTime: number
  /** 词内容 */
  word: string
  /** 占位拍，用于日语多音节汉字时轴 */
  placeholdingBeat: number
  /** 当前占位拍 */
  currentplaceholdingBeat: number
  /** 已添加书签 */
  bookmarked: boolean
  /** 批注 */
  comments: Comment[]
}
