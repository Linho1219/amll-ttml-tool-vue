import { usePreferenceStore } from '@/stores/preference'
import { computed, readonly, ref, watch } from 'vue'
import { useNcmResolver } from './ncm'

// use ms as time unit
export function useAudioCtrl() {
  const audio = new Audio()
  let revokeUrlHook: (() => void) | null = null
  const activatedRef = ref(false)
  const lengthRef = ref(0)

  function mount(src: Blob | File | string): Promise<void> {
    audio.pause()
    audio.currentTime = 0
    audio.playbackRate = 1
    audio.volume = 1
    revokeUrlHook?.()
    revokeUrlHook = null
    if (typeof src !== 'string') {
      const url = URL.createObjectURL(src)
      revokeUrlHook = () => URL.revokeObjectURL(url)
      src = url
    }
    audio.src = src
    activatedRef.value = true
    progressRef.value = 0
    playingRef.value = false
    return new Promise((resolve) => {
      audio.onloadedmetadata = () => {
        lengthRef.value = audio.duration * 1000
        resolve()
        audio.playbackRate = playbackRateRef.value
        audio.volume = volumeRef.value
      }
    })
  }
  async function mountNcm(src: Blob | File) {
    const ncmResolver = useNcmResolver()
    const extractedBlob = await ncmResolver.transform(src)
    await mount(extractedBlob)
    ncmResolver.destroy()
  }

  const seek = (time: number) => (audio.currentTime = time / 1000)
  const seekBy = (delta: number) => {
    delta /= 1000
    const target = Math.min(Math.max(0, audio.currentTime + delta), audio.duration)
    audio.currentTime = target
  }
  const getProgress = () => audio.currentTime * 1000
  const progressRef = ref(0)
  const maintainProgressRef = () => {
    progressRef.value = getProgress()
    if (!audio.paused) requestAnimationFrame(maintainProgressRef)
  }
  audio.onseeked = () => (progressRef.value = getProgress())
  const amendmentRef = computed(
    () => usePreferenceStore().globalLatency * playbackRateRef.value * (playingRef.value ? 1 : 0),
  )

  const play = () => {
    if (audio.src) audio.play()
  }
  const pause = () => {
    if (audio.src) audio.pause()
  }
  const togglePlay = () => (audio.paused ? play() : pause())

  const playingRef = ref(false)
  audio.onplay = () => {
    playingRef.value = true
    maintainProgressRef()
  }
  audio.onpause = () => (playingRef.value = false)
  watch(playingRef, (v) => (v ? play() : pause()))

  const volumeRef = ref(audio.volume)
  audio.onvolumechange = () => (volumeRef.value = audio.volume)
  watch(volumeRef, (v) => (audio.volume = v))

  const playbackRateRef = ref(audio.playbackRate || 1)
  audio.onratechange = () => (playbackRateRef.value = audio.playbackRate)
  watch(playbackRateRef, (v) => (audio.playbackRate = v))

  return {
    audioEl: audio,
    mount,
    mountNcm,
    play,
    pause,
    togglePlay,
    seek,
    seekBy,
    getProgress,
    /** Readonly: use `seek` to change */
    progressRef: readonly(progressRef),
    lengthRef: readonly(lengthRef),
    amendmentRef,
    playingRef,
    volumeRef,
    playbackRateRef,
    activatedRef,
  }
}

export type AudioCtrl = ReturnType<typeof useAudioCtrl>
