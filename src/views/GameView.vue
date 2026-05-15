<template>
  <div class="game-container">
    <!-- Panel de fichas siempre visible arriba -->
    <div class="chips-panel">
      <div class="chips-left">
        <strong>Fichas Jugador:</strong> {{ gameStore.dineroJugador }}
        <span v-if="gameStore.apuestaJugador > 0" class="chip-bet">Apuesta: {{ gameStore.apuestaJugador }}</span>
      </div>

      <div class="chips-center">
        <strong>Turno:</strong> {{ gameStore.turnoNumero }}
      </div>

      <div class="chips-right">
        <strong>Fichas Crupier:</strong> {{ gameStore.dineroCrupier }}
        <span v-if="gameStore.apuestaCrupier > 0" class="chip-bet">Apuesta: {{ gameStore.apuestaCrupier }}</span>
      </div>
    </div>

    <header class="scoreboard">
      <h2>Jugador: {{ gameStore.victoriasJugador }} — Crupier: {{ gameStore.victoriasCrupier }}</h2>
    </header>

    <!-- Fase de Apuestas: se muestra solo cuando faseJuego === 'apuestas' -->
    <section v-if="gameStore.faseJuego === 'apuestas'" class="betting-zone">
      <!-- Título con número de turno -->
      <h3>Fase de Apuestas — Turno {{ gameStore.turnoNumero }}</h3>

      <!-- Controles de apuesta: input numérico y botones preestablecidos -->
      <div class="bet-controls">
        <!-- Comentario: input numérico para elegir cantidad de apuesta -->
        <label class="bet-label">
          Cantidad a apostar
          <input
            type="number"
            v-model.number="betAmount"
            :min="gameStore.apuestaMinima"
            :max="gameStore.dineroJugador"
            class="bet-input"
          />
        </label>

        <div class="preset-buttons">
          <button class="btn btn-preset" @click="setPreset(50)">50</button>
          <button class="btn btn-preset" @click="setPreset(100)">100</button>
          <button class="btn btn-preset" @click="setPreset(200)">200</button>
        </div>

        <div class="bet-actions">
          <button
            class="btn btn-action"
            @click="placeBet"
            :disabled="!canBet"
          >
            Apostar
          </button>

          <button
            class="btn btn-reject"
            @click="denyBet"
          >
            Negar Apuesta
          </button>
        </div>

        <!-- Texto explicativo sobre negar apuesta -->
        <p class="deny-explain">
          Al negar la apuesta bloqueas objetos este turno y pasas la decisión al crupier.
        </p>

        <!-- Mensaje de por qué está deshabilitado apostar -->
        <p v-if="betAmount < gameStore.apuestaMinima" class="hint">La apuesta mínima es {{ gameStore.apuestaMinima }} fichas.</p>
        <p v-else-if="betAmount > gameStore.dineroJugador" class="hint">No tienes suficientes fichas para esa apuesta.</p>
      </div>
    </section>

    <!-- Zona de mesa: siempre visible (cartas del crupier) -->
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

    <!-- Zona de mesa: siempre visible (mano del jugador) -->
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

    <!-- Fase turno jugador: Contenedor para botones y sección de objetos -->
    <div v-if="gameStore.faseJuego === 'turnoJugador'" class="turn-container">
      
      <!-- Controles de robar/plantarse -->
      <div class="controls">
        <div class="controls-left">
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
        </div>

        <!-- Aviso si el jugador negó la apuesta -->
        <div class="controls-right">
          <div v-if="gameStore.jugadorNego" class="deny-banner">
            Objetos bloqueados este turno
          </div>
        </div>
      </div>

      <!-- SECCIÓN OBJETOS — solo visible si el jugador no negó la apuesta -->
      <section v-if="!gameStore.jugadorNego" class="items-section">
        <h3 class="items-title">Objetos disponibles</h3>

        <!-- PISTOLA -->
        <div class="item-row">
          <div class="item-info">
            <span class="item-icon">🔫</span>
            <span class="item-name">PISTOLA</span>
            <span class="item-status">Balas: {{ gameStore.objetos.pistola.balas }}</span>
          </div>
          <div class="item-actions">
            <button 
              class="btn btn-item" 
              @click="gameStore.usarPistola('jugador')" 
              :disabled="gameStore.objetos.pistola.balas === 0"
            >
              Usar en mí
            </button>
            <button 
              class="btn btn-item" 
              @click="gameStore.usarPistola('crupier')" 
              :disabled="gameStore.objetos.pistola.balas === 0"
            >
              Usar en Crupier
            </button>
          </div>
        </div>

        <!-- COMODÍN -->
        <div class="item-row">
          <div class="item-info">
            <span class="item-icon">🃏</span>
            <span class="item-name">COMODÍN</span>
            <span class="item-status">
              Disponible: {{ gameStore.objetos.comoDin.disponible === 1 ? 'Sí' : 'No' }}
            </span>
          </div>
          <div class="item-actions">
            <button 
              class="btn btn-item" 
              @click="gameStore.usarComodin('sumar')" 
              :disabled="gameStore.objetos.comoDin.disponible === 0"
            >
              Sumar
            </button>
            <button 
              class="btn btn-item" 
              @click="gameStore.usarComodin('restar')" 
              :disabled="gameStore.objetos.comoDin.disponible === 0"
            >
              Restar
            </button>
          </div>
        </div>

        <!-- COPA DE VINO -->
        <div class="item-row">
          <div class="item-info">
            <span class="item-icon">🍷</span>
            <span class="item-name">COPA DE VINO</span>
            <span class="item-status">Cargas: {{ gameStore.objetos.copa.cargas }}</span>
          </div>
          <div class="item-actions">
            <button 
              class="btn btn-item" 
              @click="gameStore.usarCopa()" 
              :disabled="gameStore.objetos.copa.cargas === 0 || gameStore.ultimaCartaJugador === null"
            >
              Devolver última carta
            </button>
          </div>
        </div>

        <!-- Mensaje de resultado del objeto (Destacado) -->
        <p v-if="gameStore.objetoMensaje !== ''" class="item-message-highlight">
          {{ gameStore.objetoMensaje }}
        </p>
      </section>

    </div>

    <!-- Fase turno crupier: mensaje mientras procesa -->
    <div v-if="gameStore.faseJuego === 'turnoCrupier'" class="message-banner">
      <p>Turno del Crupier...</p>
    </div>

    <!-- Fase de resultado: mostrar mensaje y botón Nueva Partida -->
    <div v-if="gameStore.faseJuego === 'resultado' || gameStore.gameOver" class="result-zone">
      <div class="message-banner">
        <p>{{ gameStore.message }}</p>
      </div>

      <nav class="controls">
        <button 
          @click="gameStore.startGame()" 
          class="btn btn-restart"
        >
          Nueva Partida
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
// Importaciones necesarias de Vue y del store
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/store/gameStore'

// Inicializamos la conexión con el store de Pinia
const gameStore = useGameStore()

// Estado local para la cantidad de apuesta seleccionada
const betAmount = ref(gameStore.apuestaMinima || 50)

// Computed para validar si se puede apostar
const canBet = computed(() => {
  // No permitir apostar si la cantidad es menor a la apuesta mínima
  if (!gameStore.apuestaMinima) return false
  if (betAmount.value < gameStore.apuestaMinima) return false
  // No permitir apostar si el jugador no tiene suficiente dinero
  if (betAmount.value > gameStore.dineroJugador) return false
  return true
})

// Función para establecer presets rápidos
function setPreset(amount) {
  betAmount.value = amount
}

// Llamada para realizar la apuesta usando la acción del store
function placeBet() {
  // Protección adicional: no llamar si no cumple condiciones
  if (!canBet.value) return
  gameStore.hacerApuesta(betAmount.value)
}

// Llamada para negar la apuesta usando la acción del store
function denyBet() {
  gameStore.negarApuesta()
}

// Ciclo de vida: Inicia la partida en cuanto el componente se monta en el DOM
onMounted(() => {
  gameStore.startGame()
})
</script>

<style scoped>
/* Mantener estilos existentes y agregar algunos para el panel de fichas y apuestas */

/* Panel de fichas */
.chips-panel {
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 10px 16px;
  background-color: rgba(0,0,0,0.25);
  border-radius: 8px;
  border: 1px solid #2e2e4d;
  color: #fff;
}

.chips-left, .chips-center, .chips-right {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.chip-bet {
  margin-left: 8px;
  background-color: #e94560;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
  color: white;
  font-size: 0.9rem;
}

/* Zona de apuestas */
.betting-zone {
  width: 100%;
  max-width: 800px;
  background-color: rgba(15, 52, 96, 0.12);
  padding: 12px 18px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid rgba(233, 69, 96, 0.12);
}

.bet-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.bet-label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-weight: 600;
}

.bet-input {
  width: 140px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-weight: bold;
}

.preset-buttons {
  display: flex;
  gap: 8px;
}

.btn-preset {
  background-color: #0f3460;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.bet-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-reject {
  background-color: #333;
  color: white;
  padding: 10px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.deny-explain {
  color: #ddd;
  font-size: 0.9rem;
  margin: 0;
}

/* Mensaje de por qué está deshabilitado apostar */
.hint {
  color: #ffcccb;
  font-size: 0.9rem;
  margin: 0;
}

/* Reutilizar estilos existentes para scoreboard, table-zone, cards, etc. */
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

/* Contenedor general del turno (agrupa controles y objetos) */
.turn-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}

.controls {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
}

.controls-left {
  display: flex;
  gap: 12px;
}

.controls-right {
  margin-left: 12px;
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

.deny-banner {
  background-color: rgba(0,0,0,0.5);
  color: #ffdede;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: bold;
}

/* =========================================
   NUEVOS ESTILOS PARA LA SECCIÓN DE OBJETOS
   ========================================= */
.items-section {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 16px 20px;
  box-sizing: border-box;
}

.items-title {
  margin: 0 0 16px 0;
  color: #fff;
  font-size: 1.2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.item-row:last-of-type {
  border-bottom: none;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 50%;
}

.item-icon {
  font-size: 1.5rem;
}

.item-name {
  color: #e94560;
  font-weight: bold;
  font-size: 1.1rem;
}

.item-status {
  color: #aaa;
  font-size: 0.95rem;
}

.item-actions {
  display: flex;
  gap: 10px;
  width: 50%;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.btn-item {
  background-color: #2e2e4d;
  color: #fff;
  padding: 8px 14px;
  font-size: 0.9rem;
  border: 1px solid #4a4a75;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

.btn-item:hover:not(:disabled) {
  background-color: #e94560;
  border-color: #e94560;
}

.btn-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background-color: #1a1a2e;
  border-color: #333;
}

.item-message-highlight {
  background-color: rgba(233, 69, 96, 0.15);
  color: #ffcccb;
  border: 1px solid #e94560;
  padding: 12px;
  margin-top: 16px;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
  animation: popIn 0.3s ease-out;
}

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>