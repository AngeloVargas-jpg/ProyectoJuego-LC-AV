<template>
  <div class="viewport">
    <div class="scene" ref="sceneRef" :style="sceneStyle">

      <!-- ── FONDO ── -->
      <img class="layer" src="@/assets/Images/bg-room.png" draggable="false" />

      <!-- ── MONITORES (detrás de la mesa) ── -->
      <img class="layer" src="@/assets/Images/monitors.png" draggable="false" />

      <!-- ── PANTALLAS CRT — contenido sobre los monitores ── -->
      <ScreenDisplay side="left" />
      <ScreenDisplay side="right" />
      <!-- ── MESA ── -->
      <img
        class="layer layer--table"
        src="@/assets/Images/table.png"
        draggable="false"
      />

      <!-- ── JUEGO sobre la mesa ── -->
      <GameTable />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ScreenDisplay from '@/components/ScreenDisplay.vue'
import GameTable from '@/components/GameTable.vue'

// Dimensiones fijas del canvas de diseño
const SCENE_W = 1360
const SCENE_H = 704

const sceneRef = ref(null)
const scale = ref(1)

function updateScale() {
  const scaleX = window.innerWidth  / SCENE_W
  const scaleY = window.innerHeight / SCENE_H
  // Usa el menor para que nunca se salga de la pantalla
  scale.value = Math.min(scaleX, scaleY)
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
})

const sceneStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'top left',
  // Centra la escena en el viewport
  left: `${(window.innerWidth  - SCENE_W * scale.value) / 2}px`,
  top:  `${(window.innerHeight - SCENE_H * scale.value) / 2}px`,
}))
</script>

<style scoped>
/* Viewport: ocupa toda la pantalla, fondo negro */
.viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  position: relative;
}

/* Scene: canvas fijo 1360x704, se escala como bloque */
.scene {
  position: absolute;
  width: 1360px;
  height: 704px;
}

/* Todas las imágenes ocupan el 100% de la escena por defecto */
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

/* Mesa: 722x346, centrada horizontalmente, apoyada abajo
   left = (1360-722)/2 = 319px
   top  = 704-346      = 358px               */
.layer--table {
  width: 722px;
  height: 346px;
  left: 319px;
  top: 358px;
}
</style>