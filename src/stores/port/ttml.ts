import { DOMParser } from '@xmldom/xmldom'
import { coreCreate, type LyricLine, type Metadata } from '../core'
import { str2ms } from '../../utils/timeModel'

export function parseTTML(ttmlString: string) {
  const raw = new DOMParser().parseFromString(ttmlString, 'application/xml').documentElement

  const isElement = (node: Node | null): node is Element => node?.nodeType === 1
  const isText = (node: Node | null): node is Text => node?.nodeType === 3
  const matchTag = (node: Element, tag: string): boolean =>
    node.tagName.toLowerCase() === tag.toLowerCase()
  const getAttrMap = (node: Element): Map<string, string> =>
    new Map(Array.from(node.attributes).map((attr) => [attr.name, attr.value]))
  const safeStr2ms = (str: string | null | undefined): number => str2ms(str || '0') || 0

  // xmldom does not implement querySelector
  // so implement a simple tag selector here
  const tagSelect = (...tags: string[]): Element | null => tagSelectOnNode(raw, tags)
  function tagSelectOnNode(node: Element, tags: string[]): Element | null {
    const targetTag = tags.shift()
    if (!targetTag) return node
    if (!node.childNodes) return null
    for (const child of Array.from(node.childNodes)) {
      if (!isElement(child)) continue
      if (child.tagName === targetTag) return tagSelectOnNode(child, tags)
    }
    return null
  }

  // Metadata
  const agentToDuet = new Map<string, boolean>()
  const metadataNode = tagSelect('head', 'metadata')
  // console.log(metadataNode)
  const metadata: Metadata = new Map()
  for (const child of Array.from(metadataNode?.childNodes ?? [])) {
    if (child.nodeType !== 1) continue
    const node = child as Element
    const tagname = node.nodeName.toLowerCase()
    const attrs = getAttrMap(node)
    if (tagname === 'ttm:agent') {
      const id = attrs.get('xml:id')
      if (!id) continue
      agentToDuet.set(id, agentToDuet.size !== 0)
    } else if (tagname === 'amll:meta') {
      const key = attrs.get('key')
      const value = attrs.get('value')
      if (!key || !value) continue
      if (!metadata.has(key)) metadata.set(key, [])
      metadata.get(key)!.push(value)
    }
  }

  // Contents
  const bodyNode = tagSelect('body')
  if (!bodyNode) throw new Error('No <body> found in TTML')
  const rawLines = Array.from(bodyNode.childNodes)
    .filter((node) => isElement(node))
    .filter((node) => matchTag(node, 'div'))
    .flatMap((div) =>
      Array.from(div.childNodes)
        .filter((node) => isElement(node))
        .filter((el) => matchTag(el, 'p')),
    )
  const lyricLines: LyricLine[] = []
  function processLine(rawLine: Element, removeBrace?: boolean) {
    // Attrs
    const attrs = getAttrMap(rawLine)
    const line = coreCreate.newLine({
      startTime: safeStr2ms(attrs.get('begin')),
      endTime: safeStr2ms(attrs.get('end')),
    })
    lyricLines.push(line)
    const agentId = attrs.get('ttm:agent')
    if (agentId) line.duet = agentToDuet.get(agentId) ?? false
    const role = attrs.get('ttm:role')
    if (role === 'x-bg') line.background = true
    // Contents
    const children = Array.from(rawLine.childNodes)
    for (const [index, child] of children.entries()) {
      let textContent = child.textContent || ''
      if (removeBrace) {
        if (index === 0) textContent = textContent.replace(/^\(/, '')
        else if (index === children.length - 1) textContent = textContent.replace(/\)$/, '')
      }
      if (isText(child)) {
        const word = coreCreate.newWord({
          word: textContent,
        })
        line.words.push(word)
      } else if (isElement(child) && matchTag(child, 'span')) {
        const spanAttrs = getAttrMap(child)
        const role = spanAttrs.get('ttm:role')
        if (role === 'x-bg') {
          // Current line pushed
          // so nested background line will be after current line
          processLine(child, true)
        } else if (role === 'x-translation') {
          line.translatedLyric = textContent
        } else if (role === 'x-roman') {
          line.romanLyric = textContent
        } else {
          const word = coreCreate.newWord({
            word: textContent,
            startTime: safeStr2ms(spanAttrs.get('begin')),
            endTime: safeStr2ms(spanAttrs.get('end')),
          })
          line.words.push(word)
        }
      } else console.warn('Unknown node type in TTML line:', child)
    }
    // Post process
    if (line.words.length === 1) {
      const onlyWord = line.words[0]!
      if (!onlyWord.startTime && line.startTime) onlyWord.startTime = line.startTime
      if (!onlyWord.endTime && line.endTime) onlyWord.endTime = line.endTime
    }
    if (!line.startTime || !line.endTime) {
      const firstWord = line.words[0]
      const lastWord = line.words.at(-1)
      if (firstWord?.startTime && !line.startTime) line.startTime = firstWord.startTime
      if (lastWord?.endTime && !line.endTime) line.endTime = lastWord.endTime
    }
  }
  for (const rawLine of rawLines) processLine(rawLine)

  console.log('Parsed TTML metadata:', metadata)
  console.log(
    'Parsed TTML lyricLines:',
    lyricLines
      .map(
        (line) =>
          (line.background ? '[BG]' : line.duet ? '[DT]' : '') +
          line.words.map((word) => word.word).join(''),
      )
      .join('\n'),
  )
}
