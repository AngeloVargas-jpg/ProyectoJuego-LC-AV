<template>
  <!-- Todo posicionado dentro del canvas 1360x704
       La mesa está en left:319 top:358 w:722 h:346
       Las cartas van SOBRE la superficie de la mesa -->
  <div class="game">

    <!-- ZONA CRUPIER: superficie trasera de la mesa
         aprox top:370, centrado en x:680 -->
    <div class="zone zone--dealer">
      <div class="score-tag">
        <span>CRUPIER</span>
        <span class="score-tag__val">{{ store.dealerVisibleScore }}</span>
      </div>
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

    <!-- OBJETOS: centro de la mesa -->
    <transition name="fade">
      <div v-if="store.faseJuego === 'turnoJugador' && !store.jugadorNego" class="zone zone--objects">
        <div class="obj" :class="{ 'obj--off': store.objetos.pistola.balas === 0 }">
          <span class="obj__icon">🔫</span>
          <span class="obj__count">{{ store.objetos.pistola.balas }}</span>
          <div class="obj__btns">
            <button @click="store.usarPistola('jugador')" :disabled="store.objetos.pistola.balas === 0">YO</button>
            <button @click="store.usarPistola('crupier')" :disabled="store.objetos.pistola.balas === 0">CRU</button>
          </div>
        </div>
        <div class="obj" :class="{ 'obj--off': store.objetos.copa.cargas === 0 || !store.ultimaCartaJugador }">
          <span class="obj__icon">🍷</span>
          <span class="obj__count">{{ store.objetos.copa.cargas }}</span>
          <div class="obj__btns">
            <button @click="store.usarCopa()" :disabled="store.objetos.copa.cargas === 0 || !store.ultimaCartaJugador">USAR</button>
          </div>
        </div>
        <div class="obj" :class="{ 'obj--off': store.objetos.comoDin.disponible === 0 }">
          <span class="obj__icon">🃏</span>
          <span class="obj__count">{{ store.objetos.comoDin.disponible ? '✓' : '✗' }}</span>
          <div class="obj__btns">
            <button @click="store.usarComodin('sumar')" :disabled="store.objetos.comoDin.disponible === 0">+</button>
            <button @click="store.usarComodin('restar')" :disabled="store.objetos.comoDin.disponible === 0">−</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mensaje objeto -->
    <transition name="fade">
      <div v-if="store.objetoMensaje" class="obj-msg">▌ {{ store.objetoMensaje }}</div>
    </transition>

    <!-- ZONA JUGADOR: superficie frontal de la mesa -->
    <div class="zone zone--player">
      <div class="cards-row">
        <Card
          v-for="(card, i) in store.playerHand"
          :key="i"
          :card="card"
          :style="{ '--r': (i - store.playerHand.length / 2) * 5 }"
        />
      </div>
      <div class="score-tag">
        <span>TÚ</span>
        <span class="score-tag__val" :class="{ 'score-tag__val--bust': store.playerScore > 21 }">
          {{ store.playerScore }}
        </span>
      </div>
    </div>

    <!-- UI INFERIOR — anclada al fondo del canvas -->
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
/* Contenedor del juego: mismo tamaño que la escena,
   posicionado en 0,0 — los hijos se ubican en px absolutos */
.game {
  position: absolute;
  top: 0;
  left: 0;
  width: 1360px;
  height: 704px;
  pointer-events: none; /* los hijos reactivan los suyos */
}

/* ── Zonas de cartas ── */
.zone {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  pointer-events: auto;
}

/* Crupier: centro-superior de la mesa
   Mesa empieza en top:358, superficie ~top:380
   Centro x: 680 → left: 680 - mitad del ancho */
.zone--dealer {
  top: 320px;
  left: 50%;
  transform: translateX(-50%);
}

/* Objetos: medio de la mesa */
.zone--objects {
  position: absolute;
  top: 400px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  gap: 16px;
  pointer-events: auto;
}

/* Jugador: parte frontal de la mesa */
.zone--player {
  top: 470px;
  left: 50%;
  transform: translateX(-50%);
}

/* ── Filas de cartas ── */
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

/* ── Score tag ── */
.score-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,0,0,0.65);
  border: 1px solid rgba(139,0,0,0.5);
  padding: 3px 16px;
  font-family: 'Courier New', monospace;
  font-size: 0.72rem;
  color: #884040;
  letter-spacing: 3px;
  text-transform: uppercase;
  pointer-events: none;
}

.score-tag__val {
  color: #ff3030;
  font-size: 1rem;
  text-shadow: 0 0 8px rgba(255,48,48,0.9);
  animation: flicker 4s infinite;
}

.score-tag__val--bust {
  color: #ff8000;
  text-shadow: 0 0 10px rgba(255,128,0,0.9);
}

/* ── Objetos ── */
.obj {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: rgba(0,0,0,0.6);
  border: 1px solid rgba(92,51,23,0.7);
  padding: 6px 10px;
  min-width: 54px;
  pointer-events: auto;
}

.obj--off { opacity: 0.25; filter: grayscale(1); }
.obj__icon { font-size: 1.2rem; }
.obj__count {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  color: #d4820a;
  letter-spacing: 1px;
}

.obj__btns { display: flex; gap: 3px; }
.obj__btns button {
  background: rgba(139,0,0,0.3);
  border: 1px solid rgba(139,0,0,0.6);
  color: #ff9090;
  font-family: 'Courier New', monospace;
  font-size: 0.58rem;
  padding: 3px 6px;
  cursor: pointer;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.15s;
}
.obj__btns button:hover:not(:disabled) {
  background: rgba(180,0,0,0.5);
}
.obj__btns button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ── UI anclada al fondo del canvas ── */
.ui-anchor {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 1360px;
  pointer-events: auto;
}

/* ── Mensaje objeto ── */
.obj-msg {
  position: absolute;
  top: 500px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: #ff9060;
  background: rgba(100,0,0,0.25);
  border: 1px solid rgba(139,0,0,0.4);
  border-left: 3px solid #cc1111;
  padding: 5px 14px;
  pointer-events: none;
}

/* ── Transición ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes flicker {
  0%, 91%, 93%, 95%, 100% { opacity: 1; }
  92%, 94% { opacity: 0.55; }
}
</style>