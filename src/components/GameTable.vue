<template>
  <div class="game">
<<<<<<< HEAD
    <!-- ZONA CRUPIER -->
    <div class="zone zone--dealer">
      <div class="cards-row cards-row--dealer">
        <Card
          v-for="(card, i) in store.dealerHand"
          :key="i"
          :card="card"
          :dealer="true"
          :style="{
            '--r': (i - store.dealerHand.length / 2) * 5,
            '--tx': `${(i - store.dealerHand.length / 2) * 4}px`,
            '--ty': `${Math.abs(i - store.dealerHand.length / 2) * 1.5}px`,
          }"
          class="card-on-table"
        />
      </div>
    </div>

    <!-- Separador de mesa (perspectiva) -->
    <div class="table-line"></div>

    <!-- Mensaje objeto -->
    <transition name="slide-msg">
      <div v-if="store.objetoMensaje" class="obj-msg">
        <span class="obj-msg__icon">▌</span>
        <span class="obj-msg__text">{{ store.objetoMensaje }}</span>
      </div>
=======
    <!-- ZONA CRUPIER: sin score tag, el puntaje va en el monitor -->
    <div class="zone zone--dealer">
      <div class="cards-row">
        <Card v-for="(card, i) in store.dealerHand" :key="i" :card="card" :dealer="true" :style="{ '--r': (i - store.dealerHand.length / 2) * 4 }" />
      </div>
    </div>

    <!-- Mensaje objeto -->
    <transition name="fade">
      <div v-if="store.objetoMensaje" class="obj-msg">▌ {{ store.objetoMensaje }}</div>
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    </transition>

    <!-- ZONA JUGADOR -->
    <div class="zone zone--player">
<<<<<<< HEAD
      <div class="cards-row cards-row--player">
        <Card
          v-for="(card, i) in store.playerHand"
          :key="i"
          :card="card"
          :style="{
            '--r': (i - store.playerHand.length / 2) * 6,
            '--tx': `${(i - store.playerHand.length / 2) * 5}px`,
          }"
          class="card-on-table card-on-table--player"
        />
=======
      <div class="cards-row">
        <Card v-for="(card, i) in store.playerHand" :key="i" :card="card" :style="{ '--r': (i - store.playerHand.length / 2) * 5 }" />
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
      </div>
    </div>

    <!-- UI INFERIOR -->
    <div class="ui-anchor">
      <PlayerUI />
    </div>
  </div>
</template>

<script setup>
  import { useGameStore } from '@/store/gameStore'
  import Card from '@/components/Card.vue'
  import PlayerUI from '@/components/PlayerUI.vue'

  const store = useGameStore()
</script>

<style scoped>
  .game {
    position: absolute;
    top: 0;
    left: 0;
    width: 1360px;
    height: 704px;
    pointer-events: none;
  }

  .zone {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    pointer-events: auto;
  }

<<<<<<< HEAD
  /* ── Dealer: cartas en perspectiva leve ── */
  .zone--dealer {
    top: 298px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    perspective: 600px;
  }

  /* ── Jugador: cartas más abajo, sin perspectiva ── */
  .zone--player {
    top: 448px;
=======
  .zone--dealer {
    top: 330px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
  }

  .zone--player {
    top: 460px;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
  }

  .cards-row {
    display: flex;
<<<<<<< HEAD
    gap: 8px;
    justify-content: center;
    align-items: flex-end;
    min-height: 110px;
    position: relative;
  }

  /* Perspectiva para las cartas del dealer */
  .cards-row--dealer {
    transform: perspective(500px) rotateX(10deg);
    transform-origin: bottom center;
  }

  /* Cartas del jugador con leve perspectiva inversa */
  .cards-row--player {
    transform: perspective(500px) rotateX(-5deg);
    transform-origin: top center;
  }

  /* Efecto de carta "posada" en la mesa */
  .card-on-table {
    transform: rotate(calc(var(--r, 0) * 1deg)) translateX(var(--tx, 0)) translateY(var(--ty, 0));
    transition: transform 0.25s ease;
  }

  .card-on-table--player:hover {
    transform: rotate(calc(var(--r, 0) * 1deg)) translateX(var(--tx, 0)) translateY(-14px) scale(1.06) !important;
  }

  /* Línea de separación de mesa */
  .table-line {
    position: absolute;
    top: 445px;
    left: 15%;
    width: 70%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(180, 130, 60, 0.35), rgba(220, 160, 80, 0.55), rgba(180, 130, 60, 0.35), transparent);
    box-shadow: 0 0 8px rgba(180, 130, 60, 0.2);
    pointer-events: none;
=======
    gap: 10px;
    justify-content: center;
    align-items: flex-end;
    min-height: 100px;
  }

  .cards-row .card {
    transform: rotate(calc(var(--r, 0) * 1deg));
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }

  .ui-anchor {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1360px;
    pointer-events: auto;
  }

<<<<<<< HEAD
  /* ── Mensaje objeto mejorado ── */
  .obj-msg {
    position: absolute;
    top: 408px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    font-family: 'Courier New', monospace;
    font-size: 0.78rem;
    color: #ffcc80;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.9), rgba(20, 10, 0, 0.95), rgba(0, 0, 0, 0.9));
    border: 1px solid rgba(200, 120, 0, 0.4);
    border-left: 3px solid #cc7700;
    border-right: 3px solid #cc7700;
    padding: 7px 22px;
    pointer-events: none;
    z-index: 30;
    text-shadow: 0 0 8px rgba(255, 180, 60, 0.7);
    letter-spacing: 1px;
  }

  .obj-msg__icon {
    color: #cc7700;
    animation: blink-icon 1s infinite;
  }

  .obj-msg__text {
    color: #ffd080;
  }

  @keyframes blink-icon {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .slide-msg-enter-active {
    transition: all 0.3s ease;
  }
  .slide-msg-leave-active {
    transition: all 0.4s ease;
  }
  .slide-msg-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  .slide-msg-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
=======
  .obj-msg {
    position: absolute;
    top: 430px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: #ffcc80;
    background: rgba(0, 0, 0, 0.85);
    border: 1px solid rgba(200, 100, 0, 0.5);
    border-left: 3px solid #cc6600;
    padding: 6px 18px;
    pointer-events: none;
    z-index: 30;
    text-shadow: 0 0 8px rgba(255, 180, 60, 0.7);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }
</style>
