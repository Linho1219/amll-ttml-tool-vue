import { DOMParser } from '@xmldom/xmldom'
import type { Metadata } from '../core'

function parseTTML(ttmlString: string) {
  const raw = new DOMParser().parseFromString(ttmlString, 'application/xml').documentElement

  // xmldom does not implement querySelector
  // so implement a simple tag selector here
  const tagSelect = (...tags: string[]): Element | null => tagSelectOnNode(raw, tags)
  function tagSelectOnNode(node: Element, tags: string[]): Element | null {
    const targetTag = tags.shift()
    if (!targetTag) return node
    if (!node.childNodes) return null
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType !== 1) continue
      if ((child as Element).tagName === targetTag) return tagSelectOnNode(child as Element, tags)
    }
    return null
  }

  // Metadata
  const metadataNode = tagSelect('head', 'metadata')
  // console.log(metadataNode)
  const metadata: Metadata = new Map()
  for (const child of Array.from(metadataNode?.childNodes ?? [])) {
    if (child.nodeType !== 1) continue
    const node = child as Element
    const tagname = node.nodeName.toLowerCase()
    console.log(tagname, Array.from(node.attributes).map((attr) => [attr.name, attr.value]))
  }
}

//test
parseTTML(`
<tt xmlns="http://www.w3.org/ns/ttml" xmlns:ttm="http://www.w3.org/ns/ttml#metadata" xmlns:itunes="http://music.apple.com/lyric-ttml-internal" xmlns:amll="http://www.example.com/ns/amll">
  <head>
    <metadata xmlns="">
      <ttm:agent type="person" xml:id="v1"/>
      <ttm:agent type="other" xml:id="v2"/>
      <amll:meta key="qqMusicId" value="0025taaD2uLfbu"/>
      <amll:meta key="spotifyId" value="3XbVhzdxnqfd5lVFuTkAEi"/>
      <amll:meta key="appleMusicId" value="1773512795"/>
      <amll:meta key="isrc" value="QMDA62489627"/>
      <amll:meta key="isrc" value="QMDA62489909"/>
      <amll:meta key="musicName" value="不乱不破"/>
      <amll:meta key="musicName" value="不亂不破"/>
      <amll:meta key="musicName" value="No Dazzle, No Break"/>
      <amll:meta key="musicName" value="《崩坏：星穹铁道》乱破角色PV曲"/>
      <amll:meta key="artists" value="HOYO-MiX"/>
      <amll:meta key="artists" value="Reol(れをる)"/>
      <amll:meta key="album" value="崩坏星穹铁道-不乱不破 No Dazzle, No Break"/>
      <amll:meta key="album" value="不亂不破"/>
      <amll:meta key="album" value="不乱不破 - Single"/>
      <amll:meta key="ncmMusicId" value="2639639291"/>
      <amll:meta key="ttmlAuthorGithub" value="50987405"/>
      <amll:meta key="ttmlAuthorGithubLogin" value="ITManCHINA"/>
    </metadata>
  </head>
  <body dur="02:17.655">
    <div xmlns="" begin="00:03.770" end="02:17.655">
      <p begin="00:03.770" end="00:11.567" ttm:agent="v1" itunes:key="L1">
        <span begin="00:03.770" end="00:05.706">A</span>
        <span begin="00:05.706" end="00:07.845">woo</span>
        <span begin="00:07.845" end="00:11.567">ooh</span>
      </p>
      <p begin="00:08.943" end="00:12.261" ttm:agent="v2" itunes:key="L2">
        <span begin="00:08.943" end="00:09.062">The</span>
        <span begin="00:09.062" end="00:09.224">perp</span>
        <span begin="00:09.224" end="00:09.367">will</span>
        <span begin="00:09.367" end="00:09.594">launch</span>
        <span begin="00:09.594" end="00:09.624">in</span>
        <span begin="00:09.769" end="00:10.111">3,</span>
        <span begin="00:10.729" end="00:11.004">2,</span>
        <span begin="00:11.960" end="00:12.261">1</span>
        <span ttm:role="x-translation" xml:lang="zh-CN">预演即将开始 3 2 1</span>
      </p>
      <p begin="00:12.514" end="00:19.311" ttm:agent="v1" itunes:key="L3">
        <span begin="00:12.514" end="00:13.256">A</span>
        <span begin="00:13.256" end="00:16.579">woo</span>
        <span begin="00:16.579" end="00:19.311">ooh</span>
      </p>
      <p begin="00:18.474" end="00:20.291" ttm:agent="v2" itunes:key="L4">
        <span begin="00:18.474" end="00:18.729">Yeah,</span>
        <span begin="00:19.205" end="00:19.347">let's</span>
        <span begin="00:19.347" end="00:19.598">get</span>
        <span begin="00:19.598" end="00:20.291">started</span>
        <span ttm:role="x-translation" xml:lang="zh-CN">哟 让我们开始吧</span>
      </p>
      <p begin="00:19.680" end="00:20.813" ttm:agent="v1" itunes:key="L5">
        <span begin="00:19.680" end="00:19.875">Wake</span>
        <span begin="00:20.222" end="00:20.405">me</span>
        <span begin="00:20.586" end="00:20.813">up</span>
        <span ttm:role="x-bg" begin="00:20.866" end="00:21.135">
          <span begin="00:20.866" end="00:21.012">(A</span>
          <span begin="00:21.012" end="00:21.135">yo)</span>
        </span>
        <span ttm:role="x-translation" xml:lang="zh-CN">唤醒我</span>
      </p>
      <p begin="00:21.815" end="00:23.707" ttm:agent="v1" itunes:key="L6">
        <span begin="00:21.815" end="00:21.994" amll:empty-beat="1">覚</span>
        <span begin="00:22.302" end="00:22.524">醒</span>
        <span begin="00:22.847" end="00:23.073" amll:empty-beat="1">READY</span>
        <span begin="00:23.400" end="00:23.577">O</span>
        <span begin="00:23.577" end="00:23.707">K</span>
        <span ttm:role="x-translation" xml:lang="zh-CN">该觉醒了 准备好，OK？</span>
        <span ttm:role="x-roman">ka ku se i Ready, OK？</span>
      </p>
      <p begin="00:23.798" end="00:26.038" ttm:agent="v1" itunes:key="L7">
        <span begin="00:23.798" end="00:23.949">今</span>
        <span begin="00:23.949" end="00:24.212" amll:empty-beat="1">宵</span>
        <span begin="00:24.212" end="00:24.490" amll:empty-beat="1">思</span>
        <span begin="00:24.490" end="00:24.610">い</span>
        <span begin="00:24.610" end="00:24.738">切</span>
        <span begin="00:24.738" end="00:24.899">り</span>
        <span begin="00:24.899" end="00:25.159" amll:empty-beat="1">白</span>
        <span begin="00:25.159" end="00:25.432" amll:empty-beat="1">黒</span>
        <span begin="00:25.432" end="00:25.548">つ</span>
        <span begin="00:25.548" end="00:25.682">け</span>
        <span begin="00:25.682" end="00:25.806">よ</span>
        <span begin="00:25.806" end="00:25.953">う</span>
        <span begin="00:25.953" end="00:26.038">ぜ</span>
        <span ttm:role="x-translation" xml:lang="zh-CN">今晚，就下定决心做个了断</span>
        <span ttm:role="x-roman">ko yo i o mo i ki ri shi ro ku ro tsu ke yo u ze</span>
      </p>
      <p begin="00:26.114" end="00:28.353" ttm:agent="v1" itunes:key="L8">
        <span begin="00:26.114" end="00:26.241">規制</span>
        <span begin="00:26.241" end="00:26.385">ま</span>
        <span begin="00:26.385" end="00:26.515">み</span>
        <span begin="00:26.515" end="00:26.662">れ</span>
        <span begin="00:26.662" end="00:26.833">断</span>
        <span begin="00:26.938" end="00:27.073">念</span>
        <span begin="00:27.204" end="00:27.560" amll:empty-beat="2">滴</span>
        <span begin="00:27.560" end="00:27.688">る</span>
        <span begin="00:27.688" end="00:27.961">ダ</span>
        <span begin="00:27.961" end="00:28.220">メー</span>
        <span begin="00:28.220" end="00:28.353">ジ</span>
        <span ttm:role="x-translation" xml:lang="zh-CN">与其让自己被规则继续伤害</span>
        <span ttm:role="x-roman">ki se i ma mi re da n ne n shi ta ta ru da me i ji</span>
      </p>
      <p begin="00:28.138" end="00:30.307" ttm:agent="v1" itunes:key="L9">
        <span begin="00:28.138" end="00:28.261">じゃ</span>
        <span begin="00:28.261" end="00:28.407">木</span>
        <span begin="00:28.407" end="00:28.535">っ端</span>
        <span begin="00:28.535" end="00:28.800">微</span>
        <span begin="00:28.800" end="00:29.074">塵</span>
        <span begin="00:29.074" end="00:29.205">に</span>
        <span begin="00:29.205" end="00:29.632" amll:empty-beat="1">叩</span>
        <span begin="00:29.632" end="00:29.903">き</span>
        <span begin="00:29.903" end="00:30.171" amll:empty-beat="1">潰</span>
        <span begin="00:30.171" end="00:30.307">せ</span>
        <span ttm:role="x-translation" xml:lang="zh-CN">不如就此把它们都打个粉碎</span>
        <span ttm:role="x-roman">ja ko ppa mi ji n ni ta ta ki tsu bu se</span>
      </p>
      <p begin="00:30.457" end="00:32.409" ttm:agent="v1" itunes:key="L10">
        <span begin="00:30.457" end="00:30.867">喧</span>
        <span begin="00:30.867" end="00:31.006">嘩</span>
        <span begin="00:31.277" end="00:31.417">上</span>
        <span begin="00:31.417" end="00:31.547">等</span>
        <span begin="00:31.547" end="00:31.667">酔</span>
        <span begin="00:31.667" end="00:31.812">い</span>
        <span begin="00:31.812" end="00:31.945">覚</span>
        <span begin="00:31.945" end="00:32.217">ま</span>
        <span begin="00:32.217" end="00:32.409">せ</span>
        <span ttm:role="x-translation" xml:lang="zh-CN">放马过来，快从迷醉中清醒</span>
        <span ttm:role="x-roman">ken ka jo u to u yo i sa ma se</span>
      </p>
      <p begin="00:32.682" end="00:34.543" ttm:agent="v1" itunes:key="L11">
        <span begin="00:32.682" end="00:33.068">繚</span>
        <span begin="00:33.068" end="00:33.189">乱</span>
        <span begin="00:33.461" end="00:33.572">忍</span>
        <span begin="00:33.572" end="00:33.679">法</span>
        <span begin="00:33.679" end="00:33.812">世</span>
        <span begin="00:33.812" end="00:33.981">に</span>
        <span begin="00:33.981" end="00:34.405" amll:empty-beat="1">翳</span>
        <span begin="00:34.405" end="00:34.543">せ</span>
        <span ttm:role="x-translation" xml:lang="zh-CN">忍法缭乱，让这个世界开眼</span>
        <span ttm:role="x-roman">ryo u ra n ni n po u yo ni ka za se</span>
      </p>
      <p begin="00:34.713" end="00:36.896" ttm:agent="v1" itunes:key="L12">
        <span begin="00:34.713" end="00:34.913">乱</span>
        <span begin="00:34.913" end="00:35.172">破</span>
        <span begin="00:35.172" end="00:35.405">道</span>
        <span begin="00:35.525" end="00:35.749">ラ</span>
        <span begin="00:35.749" end="00:35.844">ッパ</span>
        <span begin="00:35.914" end="00:36.025">駆</span>
        <span begin="00:36.172" end="00:36.296">け</span>
        <span begin="00:36.473" end="00:36.574">抜</span>
        <span begin="00:36.699" end="00:36.896">け</span>
        <span ttm:role="x-translation" xml:lang="zh-CN">看我将乱破之道贯彻到底</span>
        <span ttm:role="x-roman">ra n pa do u ra ppa ka ke nu ke</span>
      </p>
      <p begin="00:37.011" end="00:40.306" ttm:agent="v1" itunes:key="L13">
        <span begin="00:37.011" end="00:37.279" amll:empty-beat="1">絶</span>
        <span begin="00:37.459" end="00:37.821">望</span>
        <span begin="00:37.821" end="00:38.358" amll:empty-beat="1">嗤い</span>
        <span begin="00:38.358" end="00:38.481">飛</span>
        <span begin="00:38.481" end="00:38.620">ば</span>
        <span begin="00:38.620" end="00:40.306">せ</span>
        <span ttm:role="x-translation" xml:lang="zh-CN">笑着把绝望从这驱逐殆尽</span>
        <span ttm:role="x-roman">ze tsu bo u wa ra i to ba se</span>
      </p>
      <p begin="00:41.410" end="00:42.795" ttm:agent="v1" itunes:key="L14">
        <span begin="00:41.410" end="00:41.623">Wake</span>
        <span begin="00:41.950" end="00:42.200">me</span>
        <span begin="00:42.502" end="00:42.795">up</span>
        <span ttm:role="x-bg" begin="00:43.039" end="00:43.372">
          <span begin="00:43.039" end="00:43.136">(A</span>
          <span begin="00:43.136" end="00:43.259">woo</span>
          <span begin="00:43.259" end="00:43.372">ooh)</span>
        </span>
        <span ttm:role="x-translation" xml:lang="zh-CN">唤醒我</span>
      </p>
    </div>
  </body>
</tt>
`)
