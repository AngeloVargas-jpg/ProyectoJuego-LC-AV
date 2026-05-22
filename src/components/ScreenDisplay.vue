<template>
  <!-- ══ MONITOR IZQUIERDO ══ -->
  <div v-if="side === 'left'" class="screen screen--left">
    <div class="screen__scanlines"></div>
    <div class="screen__content">
      <p class="screen__line screen__line--title">TÚ</p>
      <p class="screen__line screen__line--score">{{ store.victoriasJugador }}-{{ store.victoriasCrupier }}</p>
      <p class="screen__line screen__line--title">CRUPIER</p>
      <div class="screen__divider"></div>
      <p class="screen__line screen__line--money">{{ store.dineroJugador }} $</p>
      <button class="screen__btn" @click="goToShop">IR A LA TIENDA</button>
    </div>
  </div>

  <!-- ══ MONITOR DERECHO ══ -->
  <div v-else class="screen screen--right">
    <div class="screen__scanlines"></div>
    <div class="screen__content">
      <p class="screen__line screen__line--title">DEALER: {{ dealerStatus }}</p>
      <div class="screen__divider"></div>
      <p class="screen__line screen__line--info">FASE: {{ store.faseJuego.toUpperCase() }}</p>
      <p class="screen__line screen__line--info" v-if="store.apuestaCrupier > 0">
        BET: {{ store.apuestaCrupier }} $
      </p>
      <p class="screen__line screen__line--info">SCORE: {{ store.dealerVisibleScore }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/store/gameStore'
import { useRouter } from 'vue-router'

const props = defineProps({ side: String })
const store = useGameStore()
const router = useRouter()

const dealerStatus = computed(() => {
  if (store.gameOver)                    return 'DONE'
  if (store.faseJuego === 'turnoCrupier') return 'PLAY'
  if (store.faseJuego === 'apuestas')    return 'WAIT'
  return 'IDLE'
})

function goToShop() {
  router.push('/shop')
}
</script>

<style scoped>
.screen {
  position: absolute;
  overflow: hidden;
  border-radius: 2px;
  pointer-events: auto;
  background: transparent;
}
.screen--left {
  left: 270px;
  top: 182px;
  width: 154px;
  height: 153px;
  background: transparent;
  box-shadow: none;
}

.screen--right {
  left: 950px;
  top: 160px;
  width: 218px;
  height: 224px;
  background: transparent;
  box-shadow: none;
}
/* Scanlines */
.screen__scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.2) 2px,
    rgba(0,0,0,0.2) 4px
  );
  pointer-events: none;
  z-index: 2;
}

.screen__content {
  position: relative;
  z-index: 1;
  padding: 12px 14px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  box-sizing: border-box;
}

.screen__line {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  animation: flicker 4s infinite;
}

.screen__line--title {
  font-size: 0.78rem;
  color: #ff3030;
  text-shadow: 0 0 8px rgba(255,48,48,0.9), 0 0 20px rgba(255,48,48,0.4);
}

.screen__line--score {
  font-size: 1.5rem;
  color: #ff4040;
  text-shadow: 0 0 12px rgba(255,48,48,1), 0 0 30px rgba(255,48,48,0.5);
  letter-spacing: 6px;
  animation: flicker 3s infinite;
}

.screen__line--money {
  font-size: 0.78rem;
  color: #ff6030;
  text-shadow: 0 0 6px rgba(255,96,48,0.8);
}

.screen__line--info {
  font-size: 0.72rem;
  color: #cc2020;
  text-shadow: 0 0 6px rgba(200,32,32,0.8);
}

.screen__divider {
  width: 70%;
  height: 1px;
  background: rgba(180,20,20,0.35);
  flex-shrink: 0;
}

.screen__btn {
  margin-top: auto;
  background: rgba(139,0,0,0.35);
  border: 1px solid #6b0000;
  color: #ff8060;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.62rem;
  letter-spacing: 1px;
  padding: 4px 8px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s;
}

.screen__btn:hover {
  background: rgba(139,0,0,0.65);
  box-shadow: 0 0 10px rgba(255,48,48,0.5);
}

@keyframes flicker {
  0%, 91%, 93%, 95%, 100% { opacity: 1; }
  92%, 94% { opacity: 0.55; }
}
</style>