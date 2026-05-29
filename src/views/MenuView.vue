<template>
  <div class="viewport">
    <div class="scene" :style="sceneStyle">

      <!-- ── FONDO ── -->
      <img class="layer" src="@/assets/Images/bg-menu.png" draggable="false" />

      <!-- ── BOTONES ── -->
      <button class="menu-btn menu-btn--1" @click="goToGame" @mouseenter="playHover">
        <img src="@/assets/Images/btn-nuevo-contrato.png" draggable="false" />
        <span>NUEVO CONTRATO</span>
      </button>

      <button class="menu-btn menu-btn--2" @click="goToRules" @mouseenter="playHover">
        <img src="@/assets/Images/btn-reglamentos.png" draggable="false" />
        <span>REGLAMENTOS DE LA CÁBALA</span>
      </button>

      <button class="menu-btn menu-btn--3" @click="goToOptions" @mouseenter="playHover">
        <img src="@/assets/Images/btn-opciones.png" draggable="false" />
        <span>OPCIONES</span>
      </button>

      <button class="menu-btn menu-btn--4" @click="salir" @mouseenter="playHover">
        <img src="@/assets/Images/btn-salir.png" draggable="false" />
        <span>SALIR</span>
      </button>

    </div>

    <!-- ── OVERLAY GLITCH ── -->
    <div v-if="isGlitching" class="glitch-overlay">
      <div v-for="n in 8" :key="n" class="glitch-bar" :style="barStyle(n)"></div>
      <div class="glitch-scanline"></div>
      <div class="glitch-text">INICIANDO PACTO...</div>
      <div class="glitch-noise"></div>
    </div>

    <!-- ── MODAL REGLAMENTOS ── -->
    <Teleport to="body">
      <Transition name="rules-modal">
        <div v-if="showRules" class="rules-overlay" @click.self="showRules = false">
          <div class="rules-panel">

            <div class="rules-header">
              <div class="rules-title-block">
                <span class="rules-title-line">// REGLAMENTOS DE LA CÁBALA //</span>
                <span class="rules-subtitle">PROTOCOLO DE PACTO — BLACKJACK MODIFICADO</span>
              </div>
              <button class="rules-close" @click="showRules = false">✕ CERRAR</button>
            </div>

            <div class="rules-divider"></div>

            <div class="rules-body">

              <!-- OBJETIVO -->
              <section class="rules-section">
                <h2 class="rules-section-title">▌ OBJETIVO</h2>
                <p class="rules-text">
                  Conseguir una mano con valor lo más cercano posible a <strong class="hl">21</strong> sin pasarse,
                  superando al Crupier. El primero que acumule <strong class="hl">5 victorias</strong> gana la serie.
                  Si el Crupier llega a 5 victorias antes, perderás y comenzará una nueva partida desde cero.
                </p>
              </section>

              <div class="rules-divider rules-divider--thin"></div>

              <!-- VALOR DE LAS CARTAS -->
              <section class="rules-section">
                <h2 class="rules-section-title">▌ VALOR DE LAS CARTAS</h2>
                <div class="rules-cards-grid">
                  <div class="rules-card-item">
                    <span class="rules-card-label">2 — 10</span>
                    <span class="rules-card-val">Valor nominal</span>
                  </div>
                  <div class="rules-card-item">
                    <span class="rules-card-label">J / Q / K</span>
                    <span class="rules-card-val">10 puntos</span>
                  </div>
                  <div class="rules-card-item">
                    <span class="rules-card-label">A (As)</span>
                    <span class="rules-card-val">11 pts (o 1 si te pasas)</span>
                  </div>
                </div>
              </section>

              <div class="rules-divider rules-divider--thin"></div>

              <!-- FLUJO DE TURNO -->
              <section class="rules-section">
                <h2 class="rules-section-title">▌ CÓMO SE JUEGA UN TURNO</h2>
                <ol class="rules-list">
                  <li><span class="rules-step">01</span> <strong class="hl">APOSTAR O NEGAR</strong> — Elige cuánto arriesgar (mínimo 50 $) o niega la apuesta para jugar sin fichas. <em>Si niegas, los objetos quedan bloqueados ese turno.</em></li>
                  <li><span class="rules-step">02</span> <strong class="hl">TU TURNO</strong> — Puedes <strong>Pedir carta</strong> (sumar una carta a tu mano) o <strong>Plantarte</strong> (quedarte con lo que tienes). También puedes usar objetos antes de decidir.</li>
                  <li><span class="rules-step">03</span> <strong class="hl">TURNO DEL CRUPIER</strong> — El Crupier roba automáticamente hasta tener 17 o más puntos, y entonces se planta.</li>
                  <li><span class="rules-step">04</span> <strong class="hl">RESULTADO</strong> — Gana quien esté más cerca de 21 sin pasarse. Si ambos se pasan, gana el que tenga el puntaje menor.</li>
                  <li><span class="rules-step">05</span> <strong class="hl">SIGUIENTE TURNO</strong> — Recibes 25 $ al inicio de cada nuevo turno. También pueden aparecer cargas de objetos como bonus aleatorio.</li>
                </ol>
              </section>

              <div class="rules-divider rules-divider--thin"></div>

              <!-- APUESTAS -->
              <section class="rules-section">
                <h2 class="rules-section-title">▌ APUESTAS Y DINERO</h2>
                <p class="rules-text">
                  Al apostar, tu dinero <strong class="hl">y</strong> el del Crupier (fondos ilimitados) entran al pozo.
                  Si ganas, te llevas el pozo completo. Si empatas, recuperas tu apuesta. Si pierdes, el Crupier se lleva todo.
                  Al inicio de cada turno de apuestas recibes <strong class="hl">+25 $</strong> automáticamente.
                  Si bajas de 50 $, el juego te completa hasta el mínimo para que siempre puedas jugar.
                </p>
              </section>

              <div class="rules-divider rules-divider--thin"></div>

              <!-- OBJETOS -->
              <section class="rules-section">
                <h2 class="rules-section-title">▌ OBJETOS</h2>
                <p class="rules-text rules-text--small">
                  Los objetos se usan durante <strong class="hl">tu turno</strong> (excepto si negaste la apuesta).
                  Se compran en la <strong class="hl">TIENDA</strong> con tus fichas, y también pueden aparecer como bonus al final de cada turno.
                  Los objetos <strong class="hl">PREMIUM</strong> requieren desbloqueo previo (1000 $) antes de poder comprarse.
                </p>
                <div class="rules-objetos-grid">
                  <div class="rules-objeto">
                    <span class="rules-objeto-name">🔫 PISTOLA</span>
                    <span class="rules-objeto-desc">Añade ±5 puntos a tu mano o a la del Crupier. 50% de chance de acertar el efecto elegido; si falla, el efecto se invierte.</span>
                  </div>
                  <div class="rules-objeto">
                    <span class="rules-objeto-name">🃏 COMODÍN</span>
                    <span class="rules-objeto-desc">Suma o resta un valor aleatorio (1–13) a tu puntuación. Elige la dirección, el valor es al azar.</span>
                  </div>
                  <div class="rules-objeto">
                    <span class="rules-objeto-name">🍷 COPA</span>
                    <span class="rules-objeto-desc">Devuelve tu última carta al mazo, como si nunca la hubieras robado. Útil para deshacer una mala jugada.</span>
                  </div>
                  <div class="rules-objeto premium-obj">
                    <span class="rules-objeto-name">💉 JERINGA <span class="premium-tag">PREMIUM</span></span>
                    <span class="rules-objeto-desc">Congela al Crupier un turno completo: no podrá robar carta en su próximo turno.</span>
                  </div>
                  <div class="rules-objeto premium-obj">
                    <span class="rules-objeto-name">🔥 ENCENDEDOR <span class="premium-tag">PREMIUM</span></span>
                    <span class="rules-objeto-desc">Quema la carta más perjudicial de tu mano. Si te pasaste de 21, elimina la carta de mayor valor. Si no, elimina la más pequeña.</span>
                  </div>
                  <div class="rules-objeto premium-obj">
                    <span class="rules-objeto-name">🌑 PURO <span class="premium-tag">PREMIUM</span></span>
                    <span class="rules-objeto-desc">Revela la carta oculta del Crupier este turno, permitiéndote tomar decisiones con información completa.</span>
                  </div>
                </div>
              </section>

              <div class="rules-divider rules-divider--thin"></div>

              <!-- CONSEJOS -->
              <section class="rules-section">
                <h2 class="rules-section-title">▌ CONSEJOS</h2>
                <ul class="rules-tips">
                  <li>Plántate con <strong class="hl">17 o más</strong> a menos que el Crupier muestre una carta muy alta.</li>
                  <li>Negar la apuesta te protege las fichas si no confías en tu mano, pero pierdes acceso a los objetos.</li>
                  <li>Guarda la <strong class="hl">Copa</strong> para cuando recibas una carta que te lleve al borde del 21 o te haga pasarte.</li>
                  <li>La <strong class="hl">Pistola</strong> puede disparar contra el Crupier para sumarle puntos y hacerlo pasarse de 21.</li>
                  <li>Desbloquea los objetos Premium lo antes posible — el Encendedor y la Jeringa pueden cambiar el resultado de una ronda entera.</li>
                </ul>
              </section>

            </div>

            <div class="rules-divider"></div>
            <p class="rules-footer">ESC O CLICK FUERA PARA CERRAR — EL PACTO TE OBLIGA</p>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isGlitching = ref(false)
const showRules = ref(false)

// ── WEB AUDIO ──
let audioCtx = null
let bgNodes = []
let masterGain = null

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function startBg() {
  if (bgNodes.length > 0) return
  const ctx = getCtx()

  masterGain = ctx.createGain()
  masterGain.gain.value = 0.008
  masterGain.connect(ctx.destination)

  const layers = [
    { freq: 55,  type: 'sawtooth',  vol: 0.015, lfoFreq: 0.3 },
    { freq: 82,  type: 'sawtooth',  vol: 0.01,  lfoFreq: 0.5 },
    { freq: 110, type: 'sine',      vol: 0.02,  lfoFreq: 0.2 },
    { freq: 165, type: 'triangle',  vol: 0.008, lfoFreq: 0.7 },
  ]

  layers.forEach(({ freq, type, vol, lfoFreq }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()

    lfo.frequency.value = lfoFreq
    lfoGain.gain.value = vol * 0.5
    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)

    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = vol

    osc.connect(gain)
    gain.connect(masterGain)
    osc.start()
    lfo.start()
    bgNodes.push(osc, lfo)
  })
}

function stopBg() {
  bgNodes.forEach((n) => { try { n.stop() } catch {} })
  bgNodes = []
}

function muteBg() {
  if (masterGain) masterGain.gain.value = 0
}

function unmuteBg() {
  if (masterGain) masterGain.gain.value = 0.008
}

function playHover() {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 400
  gain.gain.setValueAtTime(0.03, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.08)
}

function playGlitch() {
  const ctx = getCtx()
  const duration = 0.04
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.4, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  noise.connect(gain)
  gain.connect(ctx.destination)
  noise.start()
  noise.stop(ctx.currentTime + duration)

  const osc = ctx.createOscillator()
  const gainOsc = ctx.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(80, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3)
  gainOsc.gain.setValueAtTime(0.15, ctx.currentTime)
  gainOsc.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gainOsc)
  gainOsc.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

async function glitchTo(path) {
  muteBg()
  playGlitch()
  isGlitching.value = true
  await new Promise((r) => setTimeout(r, 700))
  unmuteBg()
  await router.push(path)
  isGlitching.value = false
}

const SCENE_W = 1360
const SCENE_H = 704
const scale = ref(1)

function updateScale() {
  const scaleX = window.innerWidth / SCENE_W
  const scaleY = window.innerHeight / SCENE_H
  scale.value = Math.min(scaleX, scaleY)
}

function onKeydown(e) {
  if (e.key === 'Escape') showRules.value = false
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('mousemove', startBg, { once: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
  window.removeEventListener('keydown', onKeydown)
  stopBg()
})

const sceneStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'top left',
  left: `${(window.innerWidth - SCENE_W * scale.value) / 2}px`,
  top: `${(window.innerHeight - SCENE_H * scale.value) / 2}px`,
}))

function barStyle(n) {
  const top = (n / 8) * 100
  const height = Math.random() * 8 + 2
  const offset = (Math.random() - 0.5) * 40
  const delay = Math.random() * 0.3
  return {
    top: `${top}%`,
    height: `${height}%`,
    transform: `translateX(${offset}px)`,
    animationDelay: `${delay}s`,
    background:
      Math.random() > 0.5
        ? `rgba(180,0,0,${Math.random() * 0.6 + 0.2})`
        : `rgba(0,0,0,${Math.random() * 0.8 + 0.2})`,
  }
}

function goToGame() { glitchTo('/juego') }
function goToRules() { showRules.value = true }
function goToOptions() { alert('Próximamente') }
function salir() { window.close() }
</script>

<style scoped>
.viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  position: relative;
}

.scene {
  position: absolute;
  width: 1360px;
  height: 704px;
}

.layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 1360px;
  height: 704px;
  display: block;
  user-select: none;
  pointer-events: none;
}

.menu-btn {
  position: absolute;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, filter 0.15s;
}

.menu-btn img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.menu-btn span {
  position: relative;
  z-index: 1;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  font-weight: bold;
  color: #ff3030;
  text-shadow: 0 0 8px rgba(255, 48, 48, 0.9), 0 0 20px rgba(255, 48, 48, 0.4);
  letter-spacing: 3px;
  text-transform: uppercase;
  pointer-events: none;
  animation: flicker 4s infinite;
}

.menu-btn:hover {
  transform: scale(1.04);
  filter: brightness(1.3);
}

.menu-btn:active {
  transform: scale(0.97);
}

.menu-btn--1 { left: 512px; top: 288px; width: 336px; height: 56px; }
.menu-btn--2 { left: 512px; top: 358px; width: 337px; height: 53px; }
.menu-btn--3 { left: 512px; top: 425px; width: 337px; height: 61px; }
.menu-btn--4 { left: 512px; top: 500px; width: 338px; height: 58px; }

/* ── GLITCH ── */
.glitch-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: #000;
  animation: glitchFadeIn 0.7s ease-out forwards;
  overflow: hidden;
}

.glitch-bar {
  position: absolute;
  left: 0;
  width: 100%;
  animation: glitchBar 0.15s infinite alternate;
  mix-blend-mode: screen;
}

.glitch-scanline {
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255, 30, 30, 0.6);
  box-shadow: 0 0 12px rgba(255, 30, 30, 0.8);
  animation: scanlineDown 0.7s linear forwards;
}

.glitch-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Courier New', monospace;
  font-size: 1.4rem;
  color: #ff2020;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow:
    0 0 10px rgba(255, 32, 32, 1),
    0 0 30px rgba(255, 32, 32, 0.6),
    4px 0 rgba(0, 255, 255, 0.4),
    -4px 0 rgba(255, 0, 255, 0.4);
  animation: glitchText 0.1s infinite alternate;
}

.glitch-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
  opacity: 0.15;
  animation: noiseShift 0.05s infinite;
  pointer-events: none;
}

/* ── MODAL REGLAMENTOS ── */
.rules-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
  box-sizing: border-box;
}

.rules-panel {
  background: #070302;
  border: 1px solid rgba(180, 30, 0, 0.5);
  box-shadow:
    0 0 80px rgba(160, 20, 0, 0.4),
    inset 0 0 60px rgba(0, 0, 0, 0.9);
  width: 860px;
  max-width: 96vw;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px 36px 24px;
  box-sizing: border-box;
  font-family: 'Courier New', Courier, monospace;
  scrollbar-width: thin;
  scrollbar-color: #5a1000 #0a0202;
}

.rules-panel::-webkit-scrollbar { width: 6px; }
.rules-panel::-webkit-scrollbar-track { background: #0a0202; }
.rules-panel::-webkit-scrollbar-thumb { background: #5a1000; border-radius: 2px; }

.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.rules-title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rules-title-line {
  font-size: 1.05rem;
  color: #cc2200;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 12px rgba(200, 34, 0, 0.9);
  animation: flicker 5s infinite;
}

.rules-subtitle {
  font-size: 0.55rem;
  color: #5a2000;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.rules-close {
  background: rgba(40, 5, 0, 0.8);
  border: 1px solid rgba(180, 30, 0, 0.5);
  color: #882200;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.75rem;
  letter-spacing: 2px;
  padding: 6px 14px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.rules-close:hover {
  color: #ff4400;
  border-color: rgba(255, 68, 0, 0.8);
  box-shadow: 0 0 10px rgba(255, 68, 0, 0.3);
  background: rgba(80, 10, 0, 0.9);
}

.rules-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(180, 40, 0, 0.6), transparent);
  margin: 12px 0;
}

.rules-divider--thin {
  opacity: 0.4;
  margin: 10px 0;
}

.rules-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rules-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rules-section-title {
  font-size: 0.72rem;
  color: #cc3300;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 8px rgba(200, 51, 0, 0.7);
  margin: 0;
  font-weight: normal;
}

.rules-text {
  font-size: 0.78rem;
  color: #b08060;
  line-height: 1.7;
  margin: 0;
  letter-spacing: 0.3px;
}

.rules-text--small {
  font-size: 0.73rem;
}

.hl {
  color: #ff6030;
  text-shadow: 0 0 6px rgba(255, 96, 48, 0.6);
}

/* Tabla de cartas */
.rules-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.rules-card-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  background: rgba(20, 5, 0, 0.6);
  border: 1px solid rgba(120, 30, 0, 0.3);
  padding: 8px 12px;
}

.rules-card-label {
  font-size: 0.78rem;
  color: #ff4400;
  letter-spacing: 2px;
}

.rules-card-val {
  font-size: 0.65rem;
  color: #7a5040;
  letter-spacing: 1px;
}

/* Lista ordenada de pasos */
.rules-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rules-list li {
  font-size: 0.75rem;
  color: #a07050;
  line-height: 1.65;
  letter-spacing: 0.3px;
  padding-left: 34px;
  position: relative;
}

.rules-step {
  position: absolute;
  left: 0;
  top: 2px;
  font-size: 0.6rem;
  color: #882200;
  letter-spacing: 1px;
  width: 24px;
  text-align: right;
}

/* Lista de consejos */
.rules-tips {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rules-tips li {
  font-size: 0.74rem;
  color: #906040;
  line-height: 1.6;
  letter-spacing: 0.3px;
  padding-left: 14px;
  position: relative;
}

.rules-tips li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #882200;
  font-size: 0.65rem;
}

/* Grid de objetos */
.rules-objetos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 4px;
}

.rules-objeto {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: rgba(15, 4, 0, 0.7);
  border: 1px solid rgba(100, 25, 0, 0.4);
  padding: 10px 12px;
}

.premium-obj {
  border-color: rgba(140, 60, 0, 0.5);
  background: rgba(20, 8, 0, 0.8);
}

.rules-objeto-name {
  font-size: 0.68rem;
  color: #cc3300;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.premium-tag {
  font-size: 0.5rem;
  color: #ff8800;
  background: rgba(80, 30, 0, 0.8);
  border: 1px solid rgba(180, 80, 0, 0.5);
  padding: 1px 5px;
  letter-spacing: 1px;
  text-shadow: 0 0 6px rgba(255, 136, 0, 0.6);
}

.rules-objeto-desc {
  font-size: 0.62rem;
  color: #7a5035;
  line-height: 1.55;
  letter-spacing: 0.2px;
}

.rules-footer {
  font-size: 0.52rem;
  color: #441100;
  text-align: center;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0;
  padding-top: 4px;
}

/* Transición del modal */
.rules-modal-enter-active,
.rules-modal-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.rules-modal-enter-from,
.rules-modal-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

/* ── KEYFRAMES ── */
@keyframes glitchFadeIn {
  0%   { opacity: 0; }
  20%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { opacity: 1; background: #000; }
}

@keyframes glitchBar {
  0%   { opacity: 0.8; transform: translateX(0); }
  50%  { opacity: 0.3; transform: translateX(-8px); }
  100% { opacity: 0.9; transform: translateX(6px); }
}

@keyframes scanlineDown {
  0%   { top: 0%; opacity: 1; }
  100% { top: 100%; opacity: 0.3; }
}

@keyframes glitchText {
  0%  { text-shadow: 4px 0 rgba(0,255,255,0.5), -4px 0 rgba(255,0,255,0.5), 0 0 10px rgba(255,32,32,1); clip-path: inset(0 0 0 0); }
  25% { text-shadow: -6px 0 rgba(0,255,255,0.5), 6px 0 rgba(255,0,255,0.5), 0 0 20px rgba(255,32,32,1); clip-path: inset(20% 0 30% 0); }
  50% { text-shadow: 2px 0 rgba(0,255,255,0.3), -2px 0 rgba(255,0,255,0.3); clip-path: inset(0 0 0 0); }
  75% { text-shadow: -8px 0 rgba(0,255,255,0.6), 8px 0 rgba(255,0,255,0.6); clip-path: inset(60% 0 10% 0); }
}

@keyframes noiseShift {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(-2px, 1px); }
  50%  { transform: translate(2px, -1px); }
  75%  { transform: translate(-1px, 2px); }
  100% { transform: translate(1px, -2px); }
}

@keyframes flicker {
  0%, 91%, 93%, 95%, 100% { opacity: 1; }
  92%, 94% { opacity: 0.55; }
}
</style>