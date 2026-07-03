<template>
  <div class="viewport">
    <div class="scene" :style="sceneStyle">
      <img class="layer" src="@/assets/Images/fondo.png" draggable="false" />
      <ScreenDisplay side="left" />
      <ScreenDisplay side="bottom-left" />
      <ScreenDisplay side="top-right" />
      <ScreenDisplay side="right" />

      <GameTable />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useGameStore } from '@/store/gameStore'
  import ScreenDisplay from '@/components/ScreenDisplay.vue'
  import GameTable from '@/components/GameTable.vue'

  const SCENE_W = 1360
  const SCENE_H = 704

  const vpW = ref(0)
  const vpH = ref(0)
  const store = useGameStore()

  // ── AUDIO DEL JUEGO ──
  let audioCtx = null
  let bgNodes = []
  let masterGain = null
  let isMuted = localStorage.getItem('audioMuted') === '1'

  function getCtx() {
    if (!audioCtx) audioCtx = new AudioContext()
    return audioCtx
  }

  function startGameAudio() {
    if (bgNodes.length > 0) return
    const ctx = getCtx()

    masterGain = ctx.createGain()
    masterGain.gain.value = isMuted ? 0 : 0.006
    masterGain.connect(ctx.destination)

    // Ambiente de sala oscura: drones graves + tensión
    const layers = [
      { freq: 40, type: 'sawtooth', vol: 0.018, lfoFreq: 0.15 },
      { freq: 60, type: 'sawtooth', vol: 0.012, lfoFreq: 0.3 },
      { freq: 80, type: 'sine', vol: 0.015, lfoFreq: 0.1 },
      { freq: 120, type: 'triangle', vol: 0.008, lfoFreq: 0.5 },
    ]

    layers.forEach(({ freq, type, vol, lfoFreq }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()

      lfo.frequency.value = lfoFreq
      lfoGain.gain.value = vol * 0.4
      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)

      osc.type = type
      osc.frequency.value = freq
      gain.gain.value = vol

      osc.connect(gain)
      gain.connect(masterGain)
      osc.start()
      lfo.start()
      bgNodes.push(osc, lfo)
    })
  }

  function stopGameAudio() {
    bgNodes.forEach((n) => { try { n.stop() } catch {} })
    bgNodes = []
  }

  function handleMuteToggle(e) {
    isMuted = e.detail.muted
    if (masterGain) {
      masterGain.gain.setTargetAtTime(isMuted ? 0 : 0.006, audioCtx.currentTime, 0.1)
    }
  }

  function updateSize() {
    vpW.value = window.visualViewport ? window.visualViewport.width : document.documentElement.clientWidth
    vpH.value = window.visualViewport ? window.visualViewport.height : document.documentElement.clientHeight
  }

  onMounted(() => {
    updateSize()
    window.addEventListener('resize', updateSize)
    if (window.visualViewport) window.visualViewport.addEventListener('resize', updateSize)
    window.addEventListener('game-mute-toggle', handleMuteToggle)
    store.startGame()
    // Iniciar audio al primer click del usuario
    const startAudio = () => {
      startGameAudio()
      document.removeEventListener('click', startAudio)
    }
    document.addEventListener('click', startAudio)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
    if (window.visualViewport) window.visualViewport.removeEventListener('resize', updateSize)
    window.removeEventListener('game-mute-toggle', handleMuteToggle)
    stopGameAudio()
  })

  const scale = computed(() => {
    if (!vpW.value || !vpH.value) return 1
    return Math.min(vpW.value / SCENE_W, vpH.value / SCENE_H)
  })

  const sceneStyle = computed(() => {
    const s = scale.value
    const offsetX = (vpW.value - SCENE_W * s) / 2
    const offsetY = (vpH.value - SCENE_H * s) / 2
    return {
      transform: `scale(${s})`,
      transformOrigin: 'top left',
      left: `${Math.max(0, offsetX)}px`,
      top: `${Math.max(0, offsetY)}px`,
    }
  })
</script>

<style scoped>
  .viewport {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #000;
  }

  .scene {
    position: absolute;
    width: 1360px;
    height: 704px;
  }

  .layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 1360px;
    height: 704px;
    display: block;
    user-select: none;
    pointer-events: none;
  }
</style>
