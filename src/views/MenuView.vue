<template>
  <div class="viewport">
    <div class="scene" :style="sceneStyle">
      <!-- ── FONDO ── -->
      <img class="layer" src="@/assets/Images/bg-menu.png" draggable="false" />

      <!-- ── BOTONES ── -->
      <button class="menu-btn menu-btn--1" @click="goToGame">
        <img src="@/assets/Images/btn-nuevo-contrato.png" draggable="false" />
        <span>NUEVO CONTRATO</span>
      </button>

      <button class="menu-btn menu-btn--2" @click="goToRules">
        <img src="@/assets/Images/btn-reglamentos.png" draggable="false" />
        <span>REGLAMENTOS DE LA CÁBALA</span>
      </button>

      <button class="menu-btn menu-btn--3" @click="goToOptions">
        <img src="@/assets/Images/btn-opciones.png" draggable="false" />
        <span>OPCIONES</span>
      </button>

      <button class="menu-btn menu-btn--4" @click="salir">
        <img src="@/assets/Images/btn-salir.png" draggable="false" />
        <span>SALIR</span>
      </button>
    </div>

    <!-- ── OVERLAY GLITCH — encima de todo, fuera del scene para cubrir viewport ── -->
    <div v-if="isGlitching" class="glitch-overlay">
      <div v-for="n in 8" :key="n" class="glitch-bar" :style="barStyle(n)"></div>
      <div class="glitch-scanline"></div>
      <div class="glitch-text">INICIANDO PACTO...</div>
      <div class="glitch-noise"></div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const isGlitching = ref(false)

  async function glitchTo(path) {
    isGlitching.value = true
    await new Promise((r) => setTimeout(r, 700))
    await router.push(path)
    isGlitching.value = false
  }

  const SCENE_W = 1360
  const SCENE_H = 704
  const scale = ref(1)

  function updateScale() {
    const scaleX = window.innerWidth / SCENE_W
    const scaleY = window.innerHeight / SCENE_H
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
    left: `${(window.innerWidth - SCENE_W * scale.value) / 2}px`,
    top: `${(window.innerHeight - SCENE_H * scale.value) / 2}px`,
  }))

  // Genera posición y estilo aleatorio para cada barra de glitch
  function barStyle(n) {
    const top = (n / 8) * 100
    const height = Math.random() * 8 + 2
    const offset = (Math.random() - 0.5) * 40
    const delay = Math.random() * 0.3
    return {
      top: `${top}%`,
      height: `${height}%`,
      transform: `translateX(${offset}px)`,
      animationDelay: `${delay}s`,
      background:
        Math.random() > 0.5
          ? `rgba(180,0,0,${Math.random() * 0.6 + 0.2})`
          : `rgba(0,0,0,${Math.random() * 0.8 + 0.2})`,
    }
  }

  function goToGame() {
    glitchTo('/juego')
  }
  function goToRules() {
    alert('Próximamente')
  }
  function goToOptions() {
    alert('Próximamente')
  }
  function salir() {
    window.close()
  }
</script>

<style scoped>
  .viewport {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #000;
    position: relative;
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

  /* ── Botón base ── */
  .menu-btn {
    position: absolute;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      transform 0.15s,
      filter 0.15s;
  }

  .menu-btn img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }

  .menu-btn span {
    position: relative;
    z-index: 1;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1rem;
    font-weight: bold;
    color: #ff3030;
    text-shadow:
      0 0 8px rgba(255, 48, 48, 0.9),
      0 0 20px rgba(255, 48, 48, 0.4);
    letter-spacing: 3px;
    text-transform: uppercase;
    pointer-events: none;
    animation: flicker 4s infinite;
  }

  .menu-btn:hover {
    transform: scale(1.04);
    filter: brightness(1.3);
  }

  .menu-btn:active {
    transform: scale(0.97);
  }

  .menu-btn--1 {
    left: 512px;
    top: 288px;
    width: 336px;
    height: 56px;
  }
  .menu-btn--2 {
    left: 512px;
    top: 358px;
    width: 337px;
    height: 53px;
  }
  .menu-btn--3 {
    left: 512px;
    top: 425px;
    width: 337px;
    height: 61px;
  }
  .menu-btn--4 {
    left: 512px;
    top: 500px;
    width: 338px;
    height: 58px;
  }

  /* ══════════════════════════════
   GLITCH OVERLAY
══════════════════════════════ */
  .glitch-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: #000;
    animation: glitchFadeIn 0.7s ease-out forwards;
    overflow: hidden;
  }

  /* Barras horizontales de interferencia */
  .glitch-bar {
    position: absolute;
    left: 0;
    width: 100%;
    animation: glitchBar 0.15s infinite alternate;
    mix-blend-mode: screen;
  }

  /* Línea de scanline que baja */
  .glitch-scanline {
    position: absolute;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(255, 30, 30, 0.6);
    box-shadow: 0 0 12px rgba(255, 30, 30, 0.8);
    animation: scanlineDown 0.7s linear forwards;
  }

  /* Texto CRT al centro */
  .glitch-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Courier New', monospace;
    font-size: 1.4rem;
    color: #ff2020;
    letter-spacing: 6px;
    text-transform: uppercase;
    text-shadow:
      0 0 10px rgba(255, 32, 32, 1),
      0 0 30px rgba(255, 32, 32, 0.6),
      4px 0 rgba(0, 255, 255, 0.4),
      -4px 0 rgba(255, 0, 255, 0.4);
    animation: glitchText 0.1s infinite alternate;
  }

  /* Ruido de fondo */
  .glitch-noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
    opacity: 0.15;
    animation: noiseShift 0.05s infinite;
    pointer-events: none;
  }

  /* ── Keyframes ── */
  @keyframes glitchFadeIn {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    85% {
      opacity: 1;
    }
    100% {
      opacity: 1;
      background: #000;
    }
  }

  @keyframes glitchBar {
    0% {
      opacity: 0.8;
      transform: translateX(0);
    }
    50% {
      opacity: 0.3;
      transform: translateX(-8px);
    }
    100% {
      opacity: 0.9;
      transform: translateX(6px);
    }
  }

  @keyframes scanlineDown {
    0% {
      top: 0%;
      opacity: 1;
    }
    100% {
      top: 100%;
      opacity: 0.3;
    }
  }

  @keyframes glitchText {
    0% {
      text-shadow:
        4px 0 rgba(0, 255, 255, 0.5),
        -4px 0 rgba(255, 0, 255, 0.5),
        0 0 10px rgba(255, 32, 32, 1);
      clip-path: inset(0 0 0 0);
    }
    25% {
      text-shadow:
        -6px 0 rgba(0, 255, 255, 0.5),
        6px 0 rgba(255, 0, 255, 0.5),
        0 0 20px rgba(255, 32, 32, 1);
      clip-path: inset(20% 0 30% 0);
    }
    50% {
      text-shadow:
        2px 0 rgba(0, 255, 255, 0.3),
        -2px 0 rgba(255, 0, 255, 0.3);
      clip-path: inset(0 0 0 0);
    }
    75% {
      text-shadow:
        -8px 0 rgba(0, 255, 255, 0.6),
        8px 0 rgba(255, 0, 255, 0.6);
      clip-path: inset(60% 0 10% 0);
    }
  }

  @keyframes noiseShift {
    0% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(-2px, 1px);
    }
    50% {
      transform: translate(2px, -1px);
    }
    75% {
      transform: translate(-1px, 2px);
    }
    100% {
      transform: translate(1px, -2px);
    }
  }

  @keyframes flicker {
    0%,
    91%,
    93%,
    95%,
    100% {
      opacity: 1;
    }
    92%,
    94% {
      opacity: 0.55;
    }
  }
</style>
