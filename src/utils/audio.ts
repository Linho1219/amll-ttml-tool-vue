import { readonly, ref, watch } from 'vue'

// use ms as time unit
export function useAudioCtrl() {
  const audio = new Audio()
  let revokeUrlHook: (() => void) | null = null
  const activatedRef = ref(false)
  const lengthRef = ref(0)
  function mount(src: Blob | File | string) {
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
    audio.onloadedmetadata = () => (lengthRef.value = audio.duration * 1000)
  }

  const seek = (time: number) => (audio.currentTime = time / 1000)
  const getProgress = () => audio.currentTime * 1000
  const progressRef = ref(0)
  const maintainProgressRef = () => {
    progressRef.value = getProgress()
    if (!audio.paused) requestAnimationFrame(maintainProgressRef)
  }

  const play = () => audio.play()
  const pause = () => audio.pause()

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
    play,
    pause,
    seek,
    getProgress,
    /** Readonly: use `seek` to change */
    progressRef: readonly(progressRef),
    lengthRef: readonly(lengthRef),
    playingRef,
    volumeRef,
    playbackRateRef,
    activatedRef,
  }
}

export type AudioCtrl = ReturnType<typeof useAudioCtrl>
