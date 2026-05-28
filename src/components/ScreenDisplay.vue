<template>
  <!-- ══ MONITOR IZQUIERDO GRANDE ══ -->
  <div v-if="side === 'left'" class="screen screen--left">
    <div class="screen__scanlines"></div>
    <div class="screen__content">
      <p class="line line--title">
        JUGADOR <span class="line--score">{{ store.victoriasJugador }}</span>
        :
        <span class="line--score">{{ store.victoriasCrupier }}</span> CRUPIER
      </p>
      <div class="divider"></div>
      <p class="line line--label">APUESTAS</p>
      <p class="line line--data">TU: {{ store.apuestaJugador }} $</p>
      <p class="line line--data">CRUPIER: {{ store.apuestaCrupier }} $</p>
      <p class="line line--pozo">POZO: {{ store.apuestaJugador + store.apuestaCrupier }} $</p>
    </div>
  </div>

  <!-- ══ PANTALLITA INFERIOR IZQUIERDA ══ -->
  <div v-else-if="side === 'bottom-left'" class="screen screen--bottom-left">
    <div class="screen__scanlines"></div>
    <div class="screen__content screen__content--row">
      <button class="screen__btn" @click="abrirTienda">▶ TIENDA</button>
      <span class="line line--data">{{ store.dineroJugador }} $</span>
    </div>
  </div>

  <!-- ══ MONITOR DERECHO SUPERIOR — cargas de objetos ══ -->
  <div v-else-if="side === 'top-right'" class="screen screen--top-right">
    <div class="screen__scanlines"></div>
    <div class="screen__content screen__content--left-align">
      <button class="screen__btn screen__btn--usar" @click="abrirObjetos">▶ USAR OBJETOS</button>
      <div class="divider"></div>
      <div class="obj-grid">
        <span class="line line--obj">PISTOLA: {{ store.objetos.pistola.balas.value }}</span>
        <span class="line line--obj">JERINGA: 0</span>
        <span class="line line--obj">COPA: {{ store.objetos.copa.cargas.value }}</span>
        <span class="line line--obj">ENCEND: 0</span>
        <span class="line line--obj">COMODIN: {{ store.objetos.comoDin.disponible.value }}</span>
        <span class="line line--obj">PURO: 0</span>
      </div>
    </div>
  </div>

  <!-- ══ MONITOR DERECHO GRANDE ══ -->
  <div v-else class="screen screen--right">
    <div class="screen__scanlines"></div>
    <div class="screen__content">
      <p class="line line--label">FASE</p>
      <p class="line line--fase">{{ faseTexto }}</p>
      <div class="divider"></div>
      <p class="line line--label">PUNTAJES</p>
      <p class="line line--data">CRUPIER: {{ store.dealerVisibleScore }}</p>
      <p class="line line--data" :class="{ 'line--bust': store.playerScore > 21 }">
        TU: {{ store.playerScore }}
      </p>
    </div>
  </div>

  <!-- ══ MODALES ══ -->
  <ObjetosModal :visible="modalObjetos" @close="modalObjetos = false" />
  <TiendaModal :visible="modalTienda" @close="modalTienda = false" />
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useGameStore } from '@/store/gameStore'
  import ObjetosModal from '@/components/ObjetosModal.vue'
  import TiendaModal from '@/components/TiendaModal.vue'

  defineProps({
    side: {
      type: String,
      default: 'left',
    },
  })

  const store = useGameStore()
  const modalObjetos = ref(false)
  const modalTienda = ref(false)

  const faseTexto = computed(() => {
    switch (store.faseJuego) {
      case 'apuestas':
        return 'APUESTAS'
      case 'turnoJugador':
        return 'TU TURNO'
      case 'turnoCrupier':
        return 'TRN CRUPIER'
      case 'resultado':
        return 'RESULTADO'
      default:
        return store.faseJuego.toUpperCase()
    }
  })

  function abrirObjetos() {
    modalObjetos.value = true
  }
  function abrirTienda() {
    modalTienda.value = true
  }
</script>

<style scoped>
  .screen {
    position: absolute;
    overflow: hidden;
    pointer-events: auto;
    background: transparent;
  }

  .screen--left {
    left: 170px;
    top: 155px;
    width: 250px;
    height: 175px;
    transform: rotate(2.3deg);
    transform-origin: left top;
  }

  .screen--bottom-left {
    left: 210px;
    top: 403px;
    width: 150px;
    height: 42px;
    transform: rotate(-4.5deg) skewX(2deg);
    transform-origin: left top;
  }

  .screen--top-right {
    left: 1045px;
    top: 18px;
    width: 185px;
    height: 100px;
    transform: rotate(-10.18deg) skewX(19.51deg);
    transform-origin: left top;
  }

  .screen--right {
    left: 1070px;
    top: 170px;
    width: 185px;
    height: 200px;
    transform: rotate(-0.5deg);
    transform-origin: left top;
  }

  .screen__scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.12) 2px,
      rgba(0, 0, 0, 0.12) 4px
    );
    pointer-events: none;
    z-index: 2;
  }

  .screen__content {
    position: relative;
    z-index: 1;
    padding: 8px 12px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    box-sizing: border-box;
  }

  .screen__content--row {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
  }

  .screen__content--left-align {
    align-items: flex-start;
    padding: 6px 10px;
    gap: 2px;
  }

  .line {
    margin: 0;
    font-family: 'Courier New', Courier, monospace;
    text-transform: uppercase;
    text-align: center;
    animation: flicker 5s infinite;
    line-height: 1.2;
  }

  .line--title {
    font-size: 0.7rem;
    color: #cc2200;
    text-shadow: 0 0 6px rgba(200, 34, 0, 0.9);
    letter-spacing: 1px;
  }

  .line--score {
    font-size: 0.8rem;
    color: #ff3300;
    text-shadow:
      0 0 8px rgba(255, 51, 0, 1),
      0 0 20px rgba(255, 51, 0, 0.5);
    letter-spacing: 3px;
  }

  .line--label {
    font-size: 0.72rem;
    color: #992200;
    text-shadow: 0 0 5px rgba(150, 34, 0, 0.7);
    letter-spacing: 2px;
  }

  .line--data {
    font-size: 0.85rem;
    color: #dd4400;
    text-shadow: 0 0 6px rgba(220, 68, 0, 0.8);
    letter-spacing: 1px;
  }

  .line--pozo {
    font-size: 0.85rem;
    color: #ff6600;
    text-shadow: 0 0 8px rgba(255, 102, 0, 0.9);
    animation: flicker 2s infinite;
  }

  .line--fase {
    font-size: 0.88rem;
    color: #ff4400;
    text-shadow:
      0 0 8px rgba(255, 68, 0, 0.9),
      0 0 20px rgba(255, 68, 0, 0.4);
    letter-spacing: 1px;
    animation: flicker 2.5s infinite;
  }

  .line--obj {
    font-size: 0.55rem;
    color: #cc3300;
    text-shadow: 0 0 4px rgba(200, 51, 0, 0.7);
    text-align: left;
    white-space: nowrap;
  }

  .line--bust {
    color: #ff8800;
    text-shadow: 0 0 8px rgba(255, 136, 0, 1);
    animation: flicker 0.8s infinite;
  }

  .obj-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px 8px;
    width: 100%;
  }

  .divider {
    width: 80%;
    height: 1px;
    background: rgba(180, 40, 0, 0.35);
    flex-shrink: 0;
    margin: 1px 0;
  }

  .screen__btn {
    background: rgba(80, 10, 0, 0.7);
    border: 1px solid rgba(180, 40, 0, 0.6);
    color: #ff5500;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.55rem;
    letter-spacing: 1px;
    padding: 3px 6px;
    cursor: pointer;
    text-transform: uppercase;
    text-shadow: 0 0 6px rgba(255, 85, 0, 0.7);
    transition: all 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .screen__btn--usar {
    width: 100%;
    text-align: left;
  }

  .screen__btn:hover {
    background: rgba(120, 20, 0, 0.85);
    border-color: rgba(255, 85, 0, 0.8);
    box-shadow: 0 0 8px rgba(255, 85, 0, 0.4);
  }

  @keyframes flicker {
    0%,
    89%,
    91%,
    93%,
    100% {
      opacity: 1;
    }
    90%,
    92% {
      opacity: 0.4;
    }
  }
</style>
