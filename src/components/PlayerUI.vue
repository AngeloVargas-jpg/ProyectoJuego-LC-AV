<template>
  <div class="ui">
    <!-- ══ FASE: APUESTAS ══ -->
    <div v-if="store.faseJuego === 'apuestas'" class="ui__panel ui__panel--bet">
      <span class="ui__label"
        >TURNO_{{ String(store.turnoNumero).padStart(2, '0') }} // APUESTA</span
      >

      <div class="ui__bet-row">
        <button class="ui__chip" @click="setPreset(50)">50</button>
        <button class="ui__chip" @click="setPreset(100)">100</button>
        <button class="ui__chip" @click="setPreset(200)">200</button>

        <input
          v-model.number="betAmount"
          type="number"
          :min="store.apuestaMinima"
          :max="store.dineroJugador"
          class="ui__input"
        />

        <button class="ui__btn ui__btn--bet" :disabled="!canBet" @click="placeBet">
          ▶ APOSTAR
        </button>
        <button class="ui__btn ui__btn--deny" @click="store.negarApuesta()">✕ NEGAR</button>
      </div>

      <span v-if="!canBet && betAmount < store.apuestaMinima" class="ui__hint">
        MÍN: {{ store.apuestaMinima }} $
      </span>
      <span v-else-if="!canBet" class="ui__hint">FONDOS INSUFICIENTES</span>
    </div>

    <!-- ══ FASE: TURNO JUGADOR ══ -->
    <div v-else-if="store.faseJuego === 'turnoJugador'" class="ui__panel ui__panel--turn">
      <button class="ui__btn ui__btn--hit" :disabled="store.gameOver" @click="store.playerHit()">
        ▶ PEDIR CARTA
      </button>
      <button
        class="ui__btn ui__btn--stand"
        :disabled="store.gameOver"
        @click="store.playerStand()"
      >
        ■ PLANTARSE
      </button>
      <span v-if="store.jugadorNego" class="ui__warn">⚠ OBJETOS BLOQUEADOS</span>
    </div>

    <!-- ══ FASE: CRUPIER ══ -->
    <div v-else-if="store.faseJuego === 'turnoCrupier'" class="ui__panel ui__panel--dealer">
      <span class="ui__label ui__label--blink">▌ PROCESANDO TURNO DEL CRUPIER...</span>
    </div>

    <!-- ══ RESULTADO ══ -->
    <div
      v-else-if="store.faseJuego === 'resultado' || store.gameOver"
      class="ui__panel ui__panel--result"
    >
      <span class="ui__result-msg">{{ store.message }}</span>
      <button class="ui__btn ui__btn--restart" @click="store.startGame()">↺ NUEVA PARTIDA</button>
    </div>

    <!-- Fichas siempre visibles -->
    <div class="ui__hud">
      <span class="ui__hud-item">💰 {{ store.dineroJugador }} $</span>
      <span v-if="store.apuestaJugador > 0" class="ui__hud-item ui__hud-item--bet">
        BET: {{ store.apuestaJugador }} $
      </span>
      <span class="ui__hud-item ui__hud-item--wins">
        W: {{ store.victoriasJugador }} / L: {{ store.victoriasCrupier }}
      </span>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useGameStore } from '@/store/gameStore'

  const store = useGameStore()
  const betAmount = ref(store.apuestaMinima || 50)

  const canBet = computed(
    () => betAmount.value >= store.apuestaMinima && betAmount.value <= store.dineroJugador
  )

  function setPreset(n) {
    betAmount.value = n
  }

  function placeBet() {
    if (!canBet.value) return
    store.hacerApuesta(betAmount.value)
  }

  onMounted(() => store.startGame())
</script>

<style scoped>
  .ui {
    width: 100%;
    background: rgba(8, 4, 2, 0.92);
    border-top: 2px solid #3d2810;
    border-left: 2px solid #3d2810;
    border-right: 2px solid #3d2810;
    padding: 12px 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.7);
  }

  /* Panel base */
  .ui__panel {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    justify-content: center;
  }

  /* Etiqueta de estado */
  .ui__label {
    width: 100%;
    text-align: center;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: #aa4040;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-shadow: 0 0 6px rgba(200, 32, 32, 0.7);
  }

  .ui__label--blink {
    animation: flicker 1.5s infinite;
    color: #ff3030;
    text-shadow: 0 0 10px rgba(255, 48, 48, 0.9);
  }

  /* Fila de apuesta */
  .ui__bet-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* Fichas preset */
  .ui__chip {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #4a2a10, #2a1408);
    border: 3px solid #8b5e3c;
    color: #d4820a;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    font-weight: bold;
    cursor: pointer;
    text-shadow: 0 0 6px rgba(212, 130, 10, 0.8);
    box-shadow:
      0 3px 8px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 200, 100, 0.15);
    transition: all 0.15s;
  }

  .ui__chip:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 12px rgba(0, 0, 0, 0.7),
      0 0 10px rgba(212, 130, 10, 0.4);
  }

  /* Input apuesta */
  .ui__input {
    width: 80px;
    padding: 8px;
    background: #050202;
    border: 1px solid #8b0000;
    color: #ff3030;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.9rem;
    text-align: center;
    text-shadow: 0 0 6px rgba(255, 48, 48, 0.7);
    outline: none;
    box-shadow: inset 0 0 10px rgba(139, 0, 0, 0.3);
  }
  .ui__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .ui__input:focus {
    border-color: #cc1111;
    box-shadow:
      inset 0 0 10px rgba(139, 0, 0, 0.3),
      0 0 8px rgba(204, 17, 17, 0.5);
  }

  /* Botones acción */
  .ui__btn {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    padding: 10px 18px;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    transition: all 0.15s;
  }

  .ui__btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .ui__btn:active:not(:disabled) {
    transform: translateY(1px);
  }

  .ui__btn--bet,
  .ui__btn--hit {
    background: #8b0000;
    color: #ffb0b0;
    border: 1px solid #cc1111;
    box-shadow: 0 0 10px rgba(180, 20, 20, 0.5);
    text-shadow: 0 0 6px rgba(255, 100, 100, 0.8);
  }
  .ui__btn--bet:hover:not(:disabled),
  .ui__btn--hit:hover:not(:disabled) {
    background: #cc1111;
    box-shadow: 0 0 18px rgba(204, 17, 17, 0.8);
  }

  .ui__btn--stand {
    background: rgba(30, 20, 8, 0.9);
    color: #d4820a;
    border: 1px solid #7a4a05;
    box-shadow: 0 0 8px rgba(212, 130, 10, 0.3);
  }
  .ui__btn--stand:hover:not(:disabled) {
    background: rgba(60, 35, 8, 0.9);
    box-shadow: 0 0 14px rgba(212, 130, 10, 0.5);
  }

  .ui__btn--deny {
    background: rgba(20, 14, 8, 0.9);
    color: #6b5a45;
    border: 1px solid #3d2810;
  }
  .ui__btn--deny:hover {
    color: #c8b49a;
    border-color: #5c3317;
  }

  .ui__btn--restart {
    background: rgba(10, 25, 10, 0.9);
    color: #4dff4d;
    border: 1px solid #1a6b1a;
    box-shadow: 0 0 10px rgba(77, 255, 77, 0.3);
    text-shadow: 0 0 8px rgba(77, 255, 77, 0.8);
  }
  .ui__btn--restart:hover {
    box-shadow: 0 0 20px rgba(77, 255, 77, 0.5);
  }

  /* Hints */
  .ui__hint {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: #663333;
    letter-spacing: 1px;
  }

  .ui__warn {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: #ff3030;
    letter-spacing: 2px;
    text-shadow: 0 0 8px rgba(255, 48, 48, 0.7);
    animation: flicker 2s infinite;
  }

  /* Mensaje resultado */
  .ui__result-msg {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    color: #ff6040;
    text-shadow: 0 0 10px rgba(255, 96, 64, 0.7);
    letter-spacing: 2px;
    text-transform: uppercase;
    text-align: center;
    animation: flicker 3s infinite;
  }

  /* HUD: fichas siempre visibles */
  .ui__hud {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding-top: 6px;
    border-top: 1px solid rgba(61, 40, 16, 0.4);
  }

  .ui__hud-item {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    color: #6b5a45;
    letter-spacing: 1px;
  }

  .ui__hud-item--bet {
    color: #ff3030;
    text-shadow: 0 0 6px rgba(255, 48, 48, 0.6);
  }

  .ui__hud-item--wins {
    color: #5a6b45;
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
