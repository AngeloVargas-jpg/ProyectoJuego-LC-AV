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
    <template v-if="card.hidden">
      <div class="card__back-pattern"></div>
      <span class="card__hidden-mark">?</span>
    </template>
    <template v-else-if="card.esFantasma">
      <!-- Carta fantasma: imagen del asset + valor -->
      <span class="card__corner card__corner--tl">{{ card.value }}</span>
      <div class="card__ghost-center">
        <img
          v-if="card.suit === '🔫'"
          src="@/assets/Images/revolver.png"
          class="card__ghost-img"
          alt="pistola"
        />
        <img
          v-else-if="card.suit === '🃏'"
          src="@/assets/Images/comodin.png"
          class="card__ghost-img"
          alt="comodín"
        />
        <span v-else class="card__ghost-suit">{{ card.suit }}</span>
      </div>
      <span class="card__corner card__corner--br">{{ card.value }}</span>
    </template>
    <template v-else>
      <span class="card__corner card__corner--tl">{{ card.value }}<br />{{ card.suit }}</span>
      <span class="card__center">{{ card.suit }}</span>
      <span class="card__corner card__corner--br">{{ card.value }}<br />{{ card.suit }}</span>
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
</script>

<style scoped>
  .card {
    width: 72px;
    height: 104px;
    background: #f5edd8;
    border-radius: 5px;
    border: 1px solid #c8b49a;
    box-shadow:
      2px 3px 0 #8b7355,
      4px 6px 10px rgba(0, 0, 0, 0.7),
      inset 0 0 0 1px rgba(255, 255, 255, 0.4);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    flex-shrink: 0;
    font-family: 'Georgia', serif;
    color: #1a0a0a;
    cursor: default;
    user-select: none;
  }

  .card:hover:not(.card--hidden) {
    transform: translateY(-8px) rotate(-1deg);
    box-shadow:
      2px 3px 0 #8b7355,
      6px 12px 18px rgba(0, 0, 0, 0.8),
      inset 0 0 0 1px rgba(255, 255, 255, 0.4);
    z-index: 10;
  }

  .card--dealer {
    width: 60px;
    height: 88px;
    transform: rotate(calc(var(--r, 0) * 1deg));
  }

  .card--red {
    color: #cc0000;
  }

  .card--ghost {
    background: #1a0a0a;
    color: #ff4040;
    border-color: #8b0000;
    box-shadow:
      2px 3px 0 #3d0808,
      4px 6px 10px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(180, 20, 20, 0.4);
  }

  .card--hidden {
    background: #1a0808;
    overflow: hidden;
  }

  .card__back-pattern {
    position: absolute;
    inset: 4px;
    background: repeating-linear-gradient(45deg, #2d1010, #2d1010 4px, #1a0808 4px, #1a0808 8px);
    border: 1px solid rgba(139, 0, 0, 0.4);
    border-radius: 2px;
  }

  .card__hidden-mark {
    position: relative;
    z-index: 1;
    font-size: 2rem;
    color: #8b0000;
    text-shadow: 0 0 10px rgba(180, 20, 20, 0.8);
  }

  .card__corner {
    position: absolute;
    font-size: 0.65rem;
    font-weight: bold;
    line-height: 1.1;
    text-align: center;
  }

  .card__corner--tl {
    top: 4px;
    left: 5px;
  }
  .card__corner--br {
    bottom: 4px;
    right: 5px;
    transform: rotate(180deg);
  }

  .card__center {
    font-size: 1.8rem;
    line-height: 1;
  }

  /* ── Carta fantasma ── */
  .card__ghost-center {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .card__ghost-img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    filter: drop-shadow(0 0 6px rgba(255, 60, 0, 0.8)) brightness(0.85) sepia(0.3);
  }

  .card__ghost-suit {
    font-size: 1.4rem;
  }
</style>
