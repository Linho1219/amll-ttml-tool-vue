import nlp from 'compromise/tokenize'
import nlpSpeech from 'compromise-speech'

export interface Rewrite {
  target: string
  indices: number[]
}

export type Splitter = (
  strs: string[],
  rewrites: Readonly<Rewrite>[],
  caseSensitive: boolean,
) => string[][] | Promise<string[][]>

const pureLatin = `0-9A-Za-z\\u00C0-\\u00ff\\u0370-\\u03FF\\u0400-\\u04FF`
const halfwidthPunc = `'"‘’“”.,\\-/#!?$%^&*;:{}=\\-_\`~()`

export function basicSplitCore(strs: string[]): string[][] {
  const latin = pureLatin + halfwidthPunc
  const tokenReg = new RegExp(`[${latin}]+|\\s+|[^${latin}]`, 'gu')
  return strs.map((str) => str.match(tokenReg) || [])
}

export function basicSplit(
  strs: string[],
  rewrites: Readonly<Rewrite>[],
  caseSensitive: boolean,
  splitter?: (s: string) => string[],
): string[][] {
  if (!rewrites.length && !splitter) return basicSplitCore(strs)
  const tokenReg = new RegExp(`[${pureLatin}]+|[^${pureLatin}]+`, 'gu')
  const pureLatinReg = new RegExp(`[${pureLatin}]`)
  const isLatin = (s: string) => pureLatinReg.test(s)
  const rewriteMap = new Map<string, number[]>()
  for (const rw of rewrites) {
    const key = caseSensitive ? rw.target : rw.target.toLowerCase()
    rewriteMap.set(key, rw.indices)
  }
  return basicSplitCore(strs).map((str) =>
    str.flatMap((part) => {
      const split = part.match(tokenReg) || []
      const result: string[] = []
      for (const token of split) {
        const stickToLast = () => {
          if (result.length) {
            result[result.length - 1] += token
          } else result.push(token)
        }
        const handleSubparts = (subParts: string[]) => {
          if (subParts.length === 0) stickToLast()
          else {
            if (result.length) result[result.length - 1] += subParts.shift()!
            else result.push(subParts.shift()!)
            result.push(...subParts)
          }
        }
        if (!isLatin(token)) {
          stickToLast()
          continue
        }
        const key = caseSensitive ? token : token.toLowerCase()
        if (rewriteMap.has(key)) {
          const indices = rewriteMap.get(key)!
          const subParts = splitTextByIndices(token, indices)
          handleSubparts(subParts)
          continue
        }
        if (splitter) {
          const subParts = splitter(token)
          handleSubparts(subParts)
          continue
        }
        stickToLast()
      }
      return result
    }),
  )
}

export function compromiseSplitCore(nlp: any, token: string): string[] {
  const doc = nlp(token)
  const syllables = (doc.syllables() as string[][]).flat()
  if (syllables.length <= 1) return [token]
  let index = 0
  const intervals = syllables.map((syl) => {
    const left = token.substring(index)
    const match = left.toLowerCase().indexOf(syl.toLowerCase())
    const end = index + (match < 0 ? 0 : match) + syl.length
    const nextBegin = index
    index = end
    return { begin: nextBegin, end }
  })
  intervals.forEach((itv, index) => {
    if (index === intervals.length - 1) itv.end = token.length
    else {
      const nextItv = intervals[index + 1]!
      itv.end = nextItv.begin
      if (/['’]/.test(token.charAt(itv.end - 1))) {
        // move the apostrophe to next syllable
        itv.end -= 1
        nextItv.begin -= 1
      }
    }
    if (index === 0) itv.begin = 0
  })
  return intervals.map((itv) => token.substring(itv.begin, itv.end))
}

export function compromiseSplit(
  strs: string[],
  rewrites: Readonly<Rewrite>[],
  caseSensitive: boolean,
) {
  const nlpWithPlg = nlp.extend(nlpSpeech)
  return basicSplit(strs, rewrites, caseSensitive, (token) =>
    compromiseSplitCore(nlpWithPlg, token),
  )
}

let dictCache: Map<string, 0 | number[]> | null = null
export async function prosoticSplit(
  strs: string[],
  rewrites: Readonly<Rewrite>[],
  caseSensitive: boolean,
) {
  if (!dictCache) {
    const rawDict = (await fetch('/dicts/SUBTLEXus_prosotic.dict.json').then((res) =>
      res.json(),
    )) as Record<string, 0 | number[]>
    dictCache = new Map<string, 0 | number[]>(Object.entries(rawDict))
  }
  const dict = dictCache
  const nlpWithPlg = nlp.extend(nlpSpeech)
  const partReg = /[a-zA-Z]+|[^a-zA-Z]+/
  return basicSplit(strs, rewrites, caseSensitive, (word) => {
    if (word.length === 0) return []
    const parts = word.match(partReg)!
    const result: string[] = []
    const stickToLast = (part: string) => {
      if (result.length) result[result.length - 1] += part
      else result.push(part)
    }
    for (const part of parts) {
      if (!/[a-zA-Z]/.test(part)) {
        stickToLast(part)
        continue
      }
      const key = part.toLowerCase()
      if (dict.has(key)) {
        const lengths = dict.get(key)!
        if (!lengths) {
          stickToLast(part)
          continue
        }
        const subParts = splitTextByLengths(part, lengths)
        subParts.forEach((subPart, index) => {
          if (index === 0) stickToLast(subPart)
          else result.push(subPart)
        })
      } else {
        const subParts = compromiseSplitCore(nlpWithPlg, part)
        subParts.forEach((subPart, index) => {
          if (index === 0) stickToLast(subPart)
          else result.push(subPart)
        })
      }
    }
    return result
  })
}

function splitTextByIndices(orignal: string, indices: number[]): string[] {
  let lastIndex = 0
  const partResult = []
  for (const index of indices) {
    partResult.push(orignal.slice(lastIndex, index))
    lastIndex = index
  }
  partResult.push(orignal.slice(lastIndex))
  return partResult
}
function splitTextByLengths(orignal: string, lengths: number[]): string[] {
  const indices: number[] = [...lengths]
  for (let i = 1; i < indices.length; i++) indices[i]! += indices[i - 1] ?? 0
  return splitTextByIndices(orignal, indices)
}
