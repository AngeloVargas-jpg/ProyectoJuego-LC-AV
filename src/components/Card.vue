<template>
  <div
    class="card"
    :class="[
      { 'card--hidden': card.hidden },
      { 'card--red': isRed },
      { 'card--ghost': card.esFantasma },
      { 'card--dealer': dealer },
    ]"
  >
    <!-- Carta boca abajo -->
    <template v-if="card.hidden">
      <div class="card__back">
        <div class="card__back-pattern"></div>
        <div class="card__back-center">♠</div>
      </div>
    </template>

    <!-- Carta fantasma (objeto especial) -->
    <template v-else-if="card.esFantasma">
      <span class="card__corner card__corner--tl ghost-val">{{ card.value }}</span>
      <div class="card__ghost-center">
        <img v-if="card.suit === '🔫'" src="@/assets/Images/revolver.png" class="card__ghost-img" alt="pistola" />
        <img v-else-if="card.suit === '🃏'" src="@/assets/Images/comodin.png" class="card__ghost-img" alt="comodín" />
        <span v-else class="card__ghost-suit">{{ card.suit }}</span>
      </div>
      <span class="card__corner card__corner--br ghost-val">{{ card.value }}</span>
    </template>

    <!-- Carta normal con patrón real de símbolos -->
    <template v-else>
      <!-- Esquina superior izquierda -->
      <div class="card__corner card__corner--tl">
        <div class="card__val">{{ card.value }}</div>
        <div class="card__suit-sm">{{ card.suit }}</div>
      </div>
      <!-- Esquina inferior derecha (rotada) -->
      <div class="card__corner card__corner--br">
        <div class="card__val">{{ card.value }}</div>
        <div class="card__suit-sm">{{ card.suit }}</div>
      </div>

      <!-- Centro: patrón de símbolos según valor -->
      <div class="card__pips" :data-val="card.value">
        <!-- As -->
        <template v-if="card.value === 'A'">
          <span class="pip pip--ace">{{ card.suit }}</span>
        </template>

        <!-- Figuras J Q K -->
        <template v-else-if="isFace">
          <div class="pip--face">
            <span class="face-letter">{{ card.value }}</span>
            <span class="face-suit">{{ card.suit }}</span>
          </div>
        </template>

        <!-- Cartas numéricas: layout real de pips -->
        <template v-else>
          <span
            v-for="(pos, i) in pipPositions"
            :key="i"
            class="pip"
            :class="{ 'pip--flipped': pos.flipped }"
            :style="{ gridArea: pos.area }"
          >{{ card.suit }}</span>
        </template>
      </div>

      <!-- Borde interior -->
      <div class="card__inner-border"></div>
    </template>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    card: { type: Object, required: true },
    dealer: { type: Boolean, default: false },
  })

  const isRed = computed(() => ['♥', '♦'].includes(props.card.suit))
  const isFace = computed(() => ['J', 'Q', 'K'].includes(props.card.value))

  // Layouts de pips para cada valor numérico
  // Cada posición tiene { area: 'row/col', flipped: bool }
  // Usamos un grid de 3 columnas (L=left, C=center, R=right) × 4 filas (1-4)
  // Las posiciones flipadas apuntan hacia abajo
  const PIP_LAYOUTS = {
    '2':  [
      { area: '1 / 2', flipped: false },
      { area: '4 / 2', flipped: true  },
    ],
    '3':  [
      { area: '1 / 2', flipped: false },
      { area: '2 / 2', flipped: false },
      { area: '4 / 2', flipped: true  },
    ],
    '4':  [
      { area: '1 / 1', flipped: false },
      { area: '1 / 3', flipped: false },
      { area: '4 / 1', flipped: true  },
      { area: '4 / 3', flipped: true  },
    ],
    '5':  [
      { area: '1 / 1', flipped: false },
      { area: '1 / 3', flipped: false },
      { area: '2 / 2', flipped: false },
      { area: '4 / 1', flipped: true  },
      { area: '4 / 3', flipped: true  },
    ],
    '6':  [
      { area: '1 / 1', flipped: false },
      { area: '1 / 3', flipped: false },
      { area: '2 / 1', flipped: false },
      { area: '2 / 3', flipped: false },
      { area: '4 / 1', flipped: true  },
      { area: '4 / 3', flipped: true  },
    ],
    '7':  [
      { area: '1 / 1', flipped: false },
      { area: '1 / 3', flipped: false },
      { area: '2 / 1', flipped: false },
      { area: '2 / 2', flipped: false },
      { area: '2 / 3', flipped: false },
      { area: '4 / 1', flipped: true  },
      { area: '4 / 3', flipped: true  },
    ],
    '8':  [
      { area: '1 / 1', flipped: false },
      { area: '1 / 3', flipped: false },
      { area: '2 / 1', flipped: false },
      { area: '2 / 2', flipped: false },
      { area: '2 / 3', flipped: false },
      { area: '3 / 2', flipped: true  },
      { area: '4 / 1', flipped: true  },
      { area: '4 / 3', flipped: true  },
    ],
    '9':  [
      { area: '1 / 1', flipped: false },
      { area: '1 / 2', flipped: false },
      { area: '1 / 3', flipped: false },
      { area: '2 / 1', flipped: false },
      { area: '2 / 3', flipped: false },
      { area: '3 / 2', flipped: false },
      { area: '3 / 1', flipped: true  },
      { area: '3 / 3', flipped: true  },
      { area: '4 / 2', flipped: true  },
    ],
    '10': [
      { area: '1 / 1', flipped: false },
      { area: '1 / 2', flipped: false },
      { area: '1 / 3', flipped: false },
      { area: '2 / 1', flipped: false },
      { area: '2 / 3', flipped: false },
      { area: '2 / 2', flipped: false },
      { area: '3 / 1', flipped: true  },
      { area: '3 / 3', flipped: true  },
      { area: '3 / 2', flipped: true  },
      { area: '4 / 2', flipped: true  },
    ],
  }

  const pipPositions = computed(() => PIP_LAYOUTS[props.card.value] || [])
</script>

<style scoped>
  .card {
    width: 80px;
    height: 115px;
    background: #ffffff;
    border-radius: 7px;
    border: 1px solid #ccc;
    box-shadow:
      2px 2px 0 #bbb,
      3px 4px 10px rgba(0, 0, 0, 0.65),
      inset 0 0 0 1px rgba(255,255,255,0.8);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    flex-shrink: 0;
    font-family: 'Arial', sans-serif;
    color: #1a1a1a;
    cursor: default;
    user-select: none;
    overflow: hidden;
  }

  .card:hover:not(.card--hidden) {
    transform: translateY(-10px) rotate(-1deg) scale(1.04);
    box-shadow:
      2px 2px 0 #bbb,
      6px 12px 20px rgba(0,0,0,0.75),
      inset 0 0 0 1px rgba(255,255,255,0.8);
    z-index: 10;
  }

  .card--dealer {
    width: 64px;
    height: 92px;
    transform: rotate(calc(var(--r, 0) * 1deg));
  }
  .card--dealer .card__val { font-size: 0.7rem; }
  .card--dealer .card__suit-sm { font-size: 0.55rem; }
  .card--dealer .pip { font-size: 0.7rem; }
  .card--dealer .pip--ace { font-size: 1.4rem; }
  .card--dealer .face-letter { font-size: 1.1rem; }
  .card--dealer .face-suit { font-size: 0.7rem; }

  .card--red { color: #cc0000; }

  /* ── CARTA BOCA ABAJO ── */
  .card--hidden {
    background: #1a0808;
    border-color: #400;
  }

  .card__back {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card__back-pattern {
    position: absolute;
    inset: 5px;
    background:
      repeating-linear-gradient(45deg, #2d1010 0, #2d1010 3px, #1a0808 3px, #1a0808 6px),
      repeating-linear-gradient(-45deg, #2d1010 0, #2d1010 3px, #1a0808 3px, #1a0808 6px);
    border: 1px solid rgba(139,0,0,0.5);
    border-radius: 3px;
  }

  .card__back-center {
    position: relative;
    z-index: 1;
    font-size: 1.2rem;
    color: rgba(120,0,0,0.6);
    text-shadow: 0 0 6px rgba(180,0,0,0.5);
  }

  /* ── CARTA FANTASMA ── */
  .card--ghost {
    background: #140202;
    color: #ff4040;
    border-color: #600;
    box-shadow:
      2px 2px 0 #300,
      4px 6px 12px rgba(0,0,0,0.85),
      0 0 14px rgba(180,20,20,0.4);
  }

  .ghost-val {
    font-size: 0.7rem;
    font-weight: bold;
    color: #ff4040;
    text-shadow: 0 0 6px rgba(255,60,0,0.8);
  }

  .card__ghost-center {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; height: 100%;
  }

  .card__ghost-img {
    width: 44px; height: 44px;
    object-fit: contain;
    filter: drop-shadow(0 0 8px rgba(255,60,0,0.9)) brightness(0.9) sepia(0.3);
  }

  .card__ghost-suit { font-size: 1.5rem; }

  /* ── ESQUINAS ── */
  .card__corner {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    gap: 0px;
    z-index: 2;
  }

  .card__corner--tl { top: 5px; left: 6px; }
  .card__corner--br { bottom: 5px; right: 6px; transform: rotate(180deg); }

  .card__val {
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1;
  }

  .card__suit-sm {
    font-size: 0.6rem;
    line-height: 1;
    margin-top: 1px;
  }

  /* ── PIPS: grid de símbolos ── */
  .card__pips {
    position: absolute;
    inset: 18px 8px 18px 8px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    place-items: center;
  }

  .pip {
    font-size: 0.85rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: none;
  }

  .pip--flipped {
    transform: rotate(180deg);
  }

  /* As: símbolo grande centrado */
  .pip--ace {
    grid-column: 1 / 4;
    grid-row: 1 / 5;
    font-size: 2rem;
  }

  /* Figuras J/Q/K */
  .pip--face {
    grid-column: 1 / 4;
    grid-row: 1 / 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    width: 100%;
    height: 100%;
  }

  .face-letter {
    font-size: 1.6rem;
    font-weight: 900;
    line-height: 1;
    font-family: 'Georgia', serif;
    font-style: italic;
  }

  .face-suit {
    font-size: 1rem;
    line-height: 1;
  }

  /* Borde interior decorativo en cartas normales */
  .card__inner-border {
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 4px;
    pointer-events: none;
    z-index: 0;
  }
</style>
