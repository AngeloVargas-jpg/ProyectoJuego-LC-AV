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

  function updateSize() {
    // Usar 100vw/100vh reales sin scrollbar
    vpW.value = window.visualViewport
      ? window.visualViewport.width
      : document.documentElement.clientWidth
    vpH.value = window.visualViewport
      ? window.visualViewport.height
      : document.documentElement.clientHeight
  }

  onMounted(() => {
    updateSize()
    window.addEventListener('resize', updateSize)
    if (window.visualViewport) window.visualViewport.addEventListener('resize', updateSize)
    store.startGame()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
    if (window.visualViewport) window.visualViewport.removeEventListener('resize', updateSize)
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
