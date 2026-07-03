<template>
  <div class="ui">
    <!-- ══ FASE: APUESTAS ══ -->
    <div v-if="store.faseJuego === 'apuestas'" class="ui__panel ui__panel--bet">
<<<<<<< HEAD
      <span class="ui__label">TURNO_{{ String(store.turnoNumero).padStart(2, '0') }} // APUESTA</span>

      <div class="ui__bet-row">
        <button class="ui__chip" :class="{ 'ui__chip--active': betAmount === 50 }" @click="onChip50">50</button>
        <button class="ui__chip" :class="{ 'ui__chip--active': betAmount === 100 }" @click="onChip100">100</button>
        <button class="ui__chip" :class="{ 'ui__chip--active': betAmount === 200 }" @click="onChip200">200</button>
        <button class="ui__chip ui__chip--half" @click="onChipHalf">½</button>
        <button class="ui__chip ui__chip--all" @click="onChipAll">ALL</button>
=======
      <span class="ui__label"> TURNO_{{ String(store.turnoNumero).padStart(2, '0') }} // APUESTA </span>

      <div class="ui__bet-row">
        <button class="ui__chip" @click="onChip50">50</button>
        <button class="ui__chip" @click="onChip100">100</button>
        <button class="ui__chip" @click="onChip200">200</button>
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5

        <input v-model.number="betAmount" type="number" :min="store.apuestaMinima" :max="store.dineroJugador" class="ui__input" />

        <button class="ui__btn ui__btn--bet" :disabled="!canBet" @click="onApostar">▶ APOSTAR</button>
        <button class="ui__btn ui__btn--deny" @click="onNegar">✕ NEGAR</button>
      </div>

<<<<<<< HEAD
      <div class="ui__hints-row">
        <span v-if="!canBet && betAmount < store.apuestaMinima" class="ui__hint">MÍN: {{ store.apuestaMinima }} $</span>
        <span v-else-if="!canBet" class="ui__hint">FONDOS INSUFICIENTES</span>
        <span class="ui__tip">💡 NEGAR bloquea objetos pero conserva fichas</span>
      </div>
=======
      <span v-if="!canBet && betAmount < store.apuestaMinima" class="ui__hint"> MÍN: {{ store.apuestaMinima }} $ </span>
      <span v-else-if="!canBet" class="ui__hint"> FONDOS INSUFICIENTES </span>
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    </div>

    <!-- ══ TURNO JUGADOR ══ -->
    <div v-else-if="store.faseJuego === 'turnoJugador'" class="ui__panel ui__panel--turn">
<<<<<<< HEAD
      <div class="ui__turn-actions">
        <button class="ui__btn ui__btn--hit" :disabled="store.gameOver" @click="onHit">
          <span class="btn-icon">▶</span>
          <span class="btn-text">PEDIR CARTA</span>
          <span class="btn-hint">+1 carta</span>
        </button>
        <button class="ui__btn ui__btn--stand" :disabled="store.gameOver" @click="onStand">
          <span class="btn-icon">■</span>
          <span class="btn-text">PLANTARSE</span>
          <span class="btn-hint">turno del crupier</span>
        </button>
      </div>

      <div class="ui__score-inline">
        <span class="score-badge" :class="{ 'score-badge--bust': store.playerScore > 21, 'score-badge--good': store.playerScore >= 17 && store.playerScore <= 21, 'score-badge--low': store.playerScore < 17 }">
          {{ store.playerScore }} pts
        </span>
        <span class="score-vs">vs</span>
        <span class="score-badge score-badge--dealer">{{ store.dealerVisibleScore }}+ pts</span>
      </div>

      <span v-if="store.jugadorNego" class="ui__warn">⚠ OBJETOS BLOQUEADOS (negaste apuesta)</span>

      <!-- Instrucción contextual -->
      <div class="ui__context-tip">
        <span v-if="store.playerScore > 21" class="tip--bad">💀 ¡TE PASASTE! El crupier gana automáticamente.</span>
        <span v-else-if="store.playerScore === 21" class="tip--great">⭐ ¡21! Puedes plantarte para asegurar.</span>
        <span v-else-if="store.playerScore >= 17" class="tip--ok">Zona segura. Plantarse es arriesgado pero viable.</span>
        <span v-else class="tip--info">Bajo riesgo de pasarse. Considera pedir otra carta.</span>
      </div>
=======
      <button class="ui__btn ui__btn--hit" :disabled="store.gameOver" @click="onHit">▶ PEDIR CARTA</button>
      <button class="ui__btn ui__btn--stand" :disabled="store.gameOver" @click="onStand">■ PLANTARSE</button>
      <span v-if="store.jugadorNego" class="ui__warn"> ⚠ OBJETOS BLOQUEADOS </span>
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    </div>

    <!-- ══ TURNO CRUPIER ══ -->
    <div v-else-if="store.faseJuego === 'turnoCrupier'" class="ui__panel ui__panel--dealer">
<<<<<<< HEAD
      <div class="dealer-processing">
        <span class="dealer-dot" v-for="n in 3" :key="n" :style="{ animationDelay: `${n * 0.2}s` }">▌</span>
        <span class="ui__label ui__label--blink">PROCESANDO TURNO DEL CRUPIER</span>
        <span class="dealer-dot" v-for="n in 3" :key="`r${n}`" :style="{ animationDelay: `${n * 0.2 + 0.6}s` }">▌</span>
      </div>
=======
      <span class="ui__label ui__label--blink"> ▌ PROCESANDO TURNO DEL CRUPIER... </span>
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    </div>

    <!-- ══ RESULTADO ══ -->
    <div v-else-if="store.faseJuego === 'resultado' || store.gameOver" class="ui__panel ui__panel--result">
<<<<<<< HEAD
      <div class="result-content">
        <span class="ui__result-icon">{{ resultIcon }}</span>
        <span class="ui__result-msg">{{ store.message }}</span>
        <div class="result-scores">
          <span>TÚ: {{ store.playerScore }} pts</span>
          <span class="vs-sep">|</span>
          <span>CRUPIER: {{ store.dealerScore }} pts</span>
        </div>
        <button class="ui__btn ui__btn--restart" @click="onRestart">↺ NUEVA PARTIDA</button>
      </div>
=======
      <span class="ui__result-msg">{{ store.message }}</span>
      <button class="ui__btn ui__btn--restart" @click="onRestart">↺ NUEVA PARTIDA</button>
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    </div>

    <!-- HUD -->
    <div class="ui__hud">
<<<<<<< HEAD
      <span class="ui__hud-item">
        💰 <strong>{{ store.dineroJugador }}</strong> $
      </span>
      <span v-if="store.apuestaJugador > 0" class="ui__hud-item ui__hud-item--bet">
        🎯 BET: {{ store.apuestaJugador }} $
      </span>
      <span class="ui__hud-item ui__hud-item--wins">
        ✅ {{ store.victoriasJugador }} <span class="sep">|</span> ❌ {{ store.victoriasCrupier }}
      </span>
      <span class="ui__hud-item ui__hud-item--turn">
        T{{ String(store.turnoNumero).padStart(2, '0') }}
      </span>
=======
      <span class="ui__hud-item"> 💰 {{ store.dineroJugador }} $ </span>
      <span v-if="store.apuestaJugador > 0" class="ui__hud-item ui__hud-item--bet"> BET: {{ store.apuestaJugador }} $ </span>
      <span class="ui__hud-item ui__hud-item--wins"> W: {{ store.victoriasJugador }} / L: {{ store.victoriasCrupier }} </span>
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useGameStore } from '@/store/gameStore'

  const store = useGameStore()
  const betAmount = ref(store.apuestaMinima || 50)

  const canBet = computed(() => betAmount.value >= store.apuestaMinima && betAmount.value <= store.dineroJugador)

<<<<<<< HEAD
  const resultIcon = computed(() => {
    if (!store.message) return '?'
    const msg = store.message.toLowerCase()
    if (msg.includes('ganas') || msg.includes('blackjack')) return '🏆'
    if (msg.includes('empate') || msg.includes('tie')) return '🤝'
    if (msg.includes('pierde') || msg.includes('crupier')) return '💀'
    return '🃏'
  })

  function onChip50() { betAmount.value = 50 }
  function onChip100() { betAmount.value = 100 }
  function onChip200() { betAmount.value = 200 }
  function onChipHalf() { betAmount.value = Math.floor(store.dineroJugador / 2) }
  function onChipAll() { betAmount.value = store.dineroJugador }

  function onApostar() { if (canBet.value) store.hacerApuesta(betAmount.value) }
  function onNegar() { store.negarApuesta() }
  function onHit() { store.playerHit() }
  function onStand() { store.playerStand() }
  function onRestart() { store.startGame() }

  onMounted(() => { store.startGame() })
=======
  function setPreset(n) {
    betAmount.value = n
  }

  function placeBet() {
    if (!canBet.value) return
    store.hacerApuesta(betAmount.value)
  }

  function onChip50() {
    setPreset(50)
  }

  function onChip100() {
    setPreset(100)
  }

  function onChip200() {
    setPreset(200)
  }

  function onApostar() {
    placeBet()
  }

  function onNegar() {
    store.negarApuesta()
  }

  function onHit() {
    store.playerHit()
  }

  function onStand() {
    store.playerStand()
  }

  function onRestart() {
    store.startGame()
  }

  onMounted(() => {
    store.startGame()
  })
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
</script>

<style scoped>
  .ui {
    width: 100%;
<<<<<<< HEAD
    background: rgba(6, 3, 1, 0.94);
    border-top: 2px solid #3d2810;
    border-left: 2px solid #3d2810;
    border-right: 2px solid #3d2810;
    padding: 10px 20px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.8);
    position: relative;
=======
    background: rgba(8, 4, 2, 0.92);
    border-top: 2px solid #3d2810;
    border-left: 2px solid #3d2810;
    border-right: 2px solid #3d2810;
    padding: 12px 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.7);
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }

  .ui__panel {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
<<<<<<< HEAD
    gap: 8px;
=======
    gap: 10px;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    justify-content: center;
  }

  .ui__label {
    width: 100%;
    text-align: center;
    font-family: 'Share Tech Mono', monospace;
<<<<<<< HEAD
    font-size: 0.7rem;
=======
    font-size: 0.72rem;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    color: #aa4040;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-shadow: 0 0 6px rgba(200, 32, 32, 0.7);
  }

  .ui__label--blink {
<<<<<<< HEAD
    animation: flicker 1.2s infinite;
=======
    animation: flicker 1.5s infinite;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    color: #ff3030;
    text-shadow: 0 0 10px rgba(255, 48, 48, 0.9);
  }

<<<<<<< HEAD
  /* ── BET ROW ── */
  .ui__bet-row {
    display: flex;
    align-items: center;
    gap: 7px;
=======
  .ui__bet-row {
    display: flex;
    align-items: center;
    gap: 8px;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    flex-wrap: wrap;
    justify-content: center;
  }

  .ui__chip {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #4a2a10, #2a1408);
    border: 3px solid #8b5e3c;
    color: #d4820a;
    font-family: 'Share Tech Mono', monospace;
<<<<<<< HEAD
    font-size: 0.72rem;
    font-weight: bold;
    cursor: pointer;
    text-shadow: 0 0 6px rgba(212, 130, 10, 0.8);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 200, 100, 0.15);
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .ui__chip:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.7), 0 0 12px rgba(212, 130, 10, 0.5);
  }

  .ui__chip--active {
    border-color: #ffaa22;
    box-shadow: 0 0 14px rgba(255, 170, 34, 0.6), 0 3px 8px rgba(0, 0, 0, 0.6);
    color: #ffaa22;
  }

  .ui__chip--half {
    background: radial-gradient(circle at 35% 35%, #1a2a40, #0a1420);
    border-color: #3c6080;
    color: #80aacc;
    text-shadow: 0 0 6px rgba(128, 170, 200, 0.8);
  }

  .ui__chip--all {
    font-size: 0.6rem;
    background: radial-gradient(circle at 35% 35%, #2a1040, #100820);
    border-color: #603080;
    color: #cc80ff;
    text-shadow: 0 0 6px rgba(200, 128, 255, 0.8);
  }

  .ui__input {
    width: 78px;
=======
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

  .ui__input {
    width: 80px;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
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

<<<<<<< HEAD
  .ui__input::-webkit-inner-spin-button { -webkit-appearance: none; }

  .ui__input:focus {
    border-color: #cc1111;
    box-shadow: inset 0 0 10px rgba(139, 0, 0, 0.3), 0 0 8px rgba(204, 17, 17, 0.5);
  }

  .ui__hints-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    flex-wrap: wrap;
  }

  .ui__tip {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: #554433;
    letter-spacing: 1px;
    font-style: italic;
  }

  /* ── TURN ACTIONS ── */
  .ui__turn-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .ui__score-inline {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 10px;
  }

  .score-badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    padding: 4px 10px;
    border: 1px solid rgba(100, 60, 20, 0.5);
    background: rgba(10, 5, 2, 0.8);
    color: #c8a060;
    letter-spacing: 1px;
    border-radius: 2px;
    transition: all 0.3s;
  }

  .score-badge--good {
    color: #44cc44;
    border-color: rgba(68, 200, 68, 0.4);
    box-shadow: 0 0 10px rgba(68, 200, 68, 0.2);
  }

  .score-badge--bust {
    color: #ff4400;
    border-color: rgba(255, 68, 0, 0.5);
    animation: flicker 0.8s infinite;
    box-shadow: 0 0 10px rgba(255, 68, 0, 0.3);
  }

  .score-badge--low {
    color: #cc9933;
    border-color: rgba(200, 150, 50, 0.4);
  }

  .score-badge--dealer {
    color: #cc6644;
    border-color: rgba(200, 100, 68, 0.4);
  }

  .score-vs {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: #443322;
    letter-spacing: 2px;
  }

  .ui__context-tip {
    width: 100%;
    text-align: center;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 1px;
    padding-top: 2px;
  }

  .tip--bad { color: #cc3322; text-shadow: 0 0 6px rgba(200, 50, 34, 0.6); }
  .tip--great { color: #44cc66; text-shadow: 0 0 6px rgba(68, 200, 100, 0.5); }
  .tip--ok { color: #aacc44; }
  .tip--info { color: #666655; }

  /* ── DEALER PROCESSING ── */
  .dealer-processing {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 6px 0;
  }

  .dealer-dot {
    color: #ff3030;
    font-size: 0.8rem;
    animation: blink-dot 0.6s infinite;
    opacity: 0;
  }

  @keyframes blink-dot {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

  /* ── RESULTADO ── */
  .result-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    width: 100%;
  }

  .ui__result-icon { font-size: 1.4rem; line-height: 1; }

  .result-scores {
    display: flex;
    gap: 10px;
    align-items: center;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem;
    color: #664433;
    letter-spacing: 1px;
  }

  .vs-sep { color: #332211; }

  /* ── BOTONES ── */
  .ui__btn {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
=======
  .ui__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  .ui__input:focus {
    border-color: #cc1111;
    box-shadow:
      inset 0 0 10px rgba(139, 0, 0, 0.3),
      0 0 8px rgba(204, 17, 17, 0.5);
  }

  .ui__btn {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.78rem;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    letter-spacing: 2px;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
<<<<<<< HEAD
    padding: 0;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    transition: all 0.15s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-width: 110px;
    padding: 8px 16px;
  }

  .btn-icon { font-size: 0.85rem; line-height: 1; }
  .btn-text { font-size: 0.7rem; letter-spacing: 2px; }
  .btn-hint { font-size: 0.5rem; opacity: 0.6; letter-spacing: 1px; }

  .ui__btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .ui__btn:active:not(:disabled) { transform: translateY(1px); }
=======
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
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5

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
<<<<<<< HEAD
    box-shadow: 0 0 20px rgba(204, 17, 17, 0.8);
=======
    box-shadow: 0 0 18px rgba(204, 17, 17, 0.8);
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }

  .ui__btn--stand {
    background: rgba(30, 20, 8, 0.9);
    color: #d4820a;
    border: 1px solid #7a4a05;
    box-shadow: 0 0 8px rgba(212, 130, 10, 0.3);
  }

  .ui__btn--stand:hover:not(:disabled) {
    background: rgba(60, 35, 8, 0.9);
<<<<<<< HEAD
    box-shadow: 0 0 16px rgba(212, 130, 10, 0.5);
=======
    box-shadow: 0 0 14px rgba(212, 130, 10, 0.5);
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }

  .ui__btn--deny {
    background: rgba(20, 14, 8, 0.9);
    color: #6b5a45;
    border: 1px solid #3d2810;
<<<<<<< HEAD
    min-width: auto;
    padding: 10px 16px;
=======
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
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
<<<<<<< HEAD
    box-shadow: 0 0 22px rgba(77, 255, 77, 0.5);
    background: rgba(15, 40, 15, 0.9);
=======
    box-shadow: 0 0 20px rgba(77, 255, 77, 0.5);
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }

  .ui__hint {
    font-family: 'Share Tech Mono', monospace;
<<<<<<< HEAD
    font-size: 0.65rem;
=======
    font-size: 0.68rem;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    color: #663333;
    letter-spacing: 1px;
  }

  .ui__warn {
    font-family: 'Share Tech Mono', monospace;
<<<<<<< HEAD
    font-size: 0.68rem;
    color: #ff5030;
    letter-spacing: 2px;
    text-shadow: 0 0 8px rgba(255, 80, 48, 0.7);
    animation: flicker 2s infinite;
    width: 100%;
    text-align: center;
=======
    font-size: 0.72rem;
    color: #ff3030;
    letter-spacing: 2px;
    text-shadow: 0 0 8px rgba(255, 48, 48, 0.7);
    animation: flicker 2s infinite;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }

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

<<<<<<< HEAD
  /* ── HUD ── */
  .ui__hud {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    padding-top: 5px;
    border-top: 1px solid rgba(61, 40, 16, 0.35);
=======
  .ui__hud {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding-top: 6px;
    border-top: 1px solid rgba(61, 40, 16, 0.4);
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }

  .ui__hud-item {
    font-family: 'Share Tech Mono', monospace;
<<<<<<< HEAD
    font-size: 0.7rem;
=======
    font-size: 0.72rem;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    color: #6b5a45;
    letter-spacing: 1px;
  }

<<<<<<< HEAD
  .ui__hud-item strong { color: #aa8855; }

  .ui__hud-item--bet {
    color: #ff4040;
    text-shadow: 0 0 6px rgba(255, 64, 64, 0.5);
  }

  .ui__hud-item--wins { color: #5a6b45; }

  .ui__hud-item--turn {
    color: #334455;
    font-size: 0.62rem;
  }

  .sep { color: #333; margin: 0 4px; }

  @keyframes flicker {
    0%, 91%, 93%, 95%, 100% { opacity: 1; }
    92%, 94% { opacity: 0.5; }
=======
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
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }
</style>
