<template>
  <div class="game">
    <!-- ZONA CRUPIER: sin score tag, el puntaje va en el monitor -->
    <div class="zone zone--dealer">
      <div class="cards-row">
        <Card
          v-for="(card, i) in store.dealerHand"
          :key="i"
          :card="card"
          :dealer="true"
          :style="{ '--r': (i - store.dealerHand.length / 2) * 4 }"
        />
      </div>
    </div>

    <!-- Mensaje objeto -->
    <transition name="fade">
      <div v-if="store.objetoMensaje" class="obj-msg">▌ {{ store.objetoMensaje }}</div>
    </transition>

    <!-- ZONA JUGADOR -->
    <div class="zone zone--player">
      <div class="cards-row">
        <Card
          v-for="(card, i) in store.playerHand"
          :key="i"
          :card="card"
          :style="{ '--r': (i - store.playerHand.length / 2) * 5 }"
        />
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

  .zone--dealer {
    top: 330px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
  }

  .zone--player {
    top: 460px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
  }

  .cards-row {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: flex-end;
    min-height: 100px;
  }

  .cards-row .card {
    transform: rotate(calc(var(--r, 0) * 1deg));
  }

  .ui-anchor {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1360px;
    pointer-events: auto;
  }

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
  }
</style>
