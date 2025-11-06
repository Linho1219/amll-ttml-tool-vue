export interface Rewrite {
  target: string
  indices: number[]
}

export type Splitter = (
  str: string,
  rewrites: Readonly<Rewrite>[],
  caseSensitive: boolean,
) => string[] | Promise<string[]>

const pureLatin = `0-9A-Za-z\\u00C0-\\u00ff\\u0370-\\u03FF\\u0400-\\u04FF`
const halfwidthPunc = `‘’“”.,\\-/#!$%^&*;:{}=\\-_\`~()`

export function basicSplitCore(str: string): string[] {
  const latin = pureLatin + halfwidthPunc
  const tokenReg = new RegExp(`[${latin}]+|\\s+|[^${latin}]`, 'gu')
  return str.match(tokenReg) || []
}

export function basicSplit(
  str: string,
  rewrites: Readonly<Rewrite>[],
  caseSensitive: boolean,
  splitter?: (s: string) => string[],
): string[] {
  if (!rewrites.length && !splitter) return basicSplitCore(str)
  const tokenReg = new RegExp(`[${pureLatin}]+|[^${pureLatin}]+`, 'gu')
  const pureLatinReg = new RegExp(`[${pureLatin}]`)
  const isLatin = (s: string) => pureLatinReg.test(s)
  const rewriteMap = new Map<string, number[]>()
  for (const rw of rewrites) {
    const key = caseSensitive ? rw.target : rw.target.toLowerCase()
    rewriteMap.set(key, rw.indices)
  }
  return basicSplitCore(str).flatMap((part) => {
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
  })
}

export function splitTextByIndices(orignal: string, indices: number[]): string[] {
  let lastIndex = 0
  const partResult = []
  for (const index of indices) {
    partResult.push(orignal.slice(lastIndex, index))
    lastIndex = index
  }
  partResult.push(orignal.slice(lastIndex))
  return partResult
}
