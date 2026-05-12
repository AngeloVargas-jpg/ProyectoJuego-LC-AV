<template>
  <div class="game-container">
    <header class="scoreboard">
      <h2>Jugador: {{ gameStore.victoriasJugador }} — Crupier: {{ gameStore.victoriasCrupier }}</h2>
    </header>

    <section class="table-zone">
      <div class="zone-info">
        <h3>Mano del Crupier</h3>
        <span class="score-badge">Puntaje visible: {{ gameStore.dealerVisibleScore }}</span>
      </div>
      
      <div class="cards-container">
        <div 
          v-for="(card, index) in gameStore.dealerHand" 
          :key="index"
          class="card"
          :class="{ 'card-hidden': card.hidden }"
        >
          <span v-if="card.hidden" class="hidden-mark">?</span>
          <span v-else class="card-value">
            {{ card.value }}{{ card.suit }}
          </span>
        </div>
      </div>
    </section>

    <section class="table-zone">
      <div class="zone-info">
        <h3>Tu Mano</h3>
        <span class="score-badge">Puntaje: {{ gameStore.playerScore }}</span>
      </div>

      <div class="cards-container">
        <div 
          v-for="(card, index) in gameStore.playerHand" 
          :key="index"
          class="card card-player"
        >
          <span class="card-value">{{ card.value }}{{ card.suit }}</span>
        </div>
      </div>
    </section>

    <div v-if="gameStore.gameOver" class="message-banner">
      <p>{{ gameStore.message }}</p>
    </div>

    <nav class="controls">
      <button 
        @click="gameStore.playerHit()" 
        :disabled="gameStore.gameOver"
        class="btn btn-action"
      >
        Pedir
      </button>
      <button 
        @click="gameStore.playerStand()" 
        :disabled="gameStore.gameOver"
        class="btn btn-action"
      >
        Quedarse
      </button>
      <button 
        @click="gameStore.startGame()" 
        class="btn btn-restart"
      >
        Nueva Partida
      </button>
    </nav>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '@/store/gameStore'

// Inicializamos la conexión con el store de Pinia
const gameStore = useGameStore()

// Ciclo de vida: Inicia la partida en cuanto el componente se monta en el DOM
onMounted(() => {
  gameStore.startGame()
})
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  background-color: #1a1a2e; /* Fondo oscuro coherente con el menú */
  color: #ffffff;
  font-family: sans-serif;
  padding: 20px;
  box-sizing: border-box;
}

.scoreboard {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 10px 30px;
  border-radius: 50px;
  border: 1px solid #e94560;
}

.scoreboard h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #e94560;
}

.table-zone {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px 0;
}

.zone-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.zone-info h3 {
  margin: 0;
  font-size: 1.3rem;
}

.score-badge {
  background-color: #0f3460;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
}

.cards-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  min-height: 120px; /* Evita saltos visuales si la mano está vacía un milisegundo */
  align-items: center;
}

/* Estilos de Carta (Rectángulo con borde) */
.card {
  width: 80px;
  height: 115px;
  background-color: white;
  color: black;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: bold;
  border: 2px solid #ccc;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.card-hidden {
  background: linear-gradient(135deg, #7b113a 25%, #1a1a2e 25%, #1a1a2e 50%, #7b113a 50%, #7b113a 75%, #1a1a2e 75%, #1a1a2e 100%);
  background-size: 20px 20px;
  border-color: #e94560;
  color: white;
}

.hidden-mark {
  font-size: 2rem;
  background-color: rgba(26, 26, 46, 0.8);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.message-banner {
  background-color: #e94560;
  color: white;
  padding: 10px 40px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.5rem;
  animation: popIn 0.3s ease-out;
  text-align: center;
}

.controls {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn:active {
  transform: scale(0.95);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.btn-action {
  background-color: #e94560;
  color: white;
}

.btn-restart {
  background-color: #4caf50;
  color: white;
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>