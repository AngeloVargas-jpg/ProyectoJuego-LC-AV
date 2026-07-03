<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="cerrar">
        <div class="modal-panel">
          <div class="modal-header">
            <span class="modal-title">// OBJETOS //</span>
            <button class="modal-close" @click="cerrar">✕</button>
          </div>

          <div class="modal-divider"></div>

          <Transition name="fade">
            <p v-if="store.objetoMensaje" class="modal-mensaje">{{ store.objetoMensaje }}</p>
          </Transition>

          <p v-if="store.jugadorNego" class="modal-bloqueado">⚠ OBJETOS BLOQUEADOS — APUESTA NEGADA</p>

          <!-- Objetos base -->
          <p class="seccion-titulo">— OBJETOS ESTÁNDAR —</p>
          <div class="objetos-grid">
            <!-- PISTOLA -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible': puedeUsarPistola,
                'objeto-card--agotado': !puedeUsarPistola,
                'objeto-card--activo': objetoActivo === 'pistola',
              }"
              @click="toggleObjeto('pistola')"
            >
              <div class="objeto-img-wrap">
                <img src="@/assets/Images/revolver.png" class="objeto-img" alt="Pistola" />
              </div>
              <p class="objeto-nombre">PISTOLA</p>
              <p class="objeto-cargas">BALAS: {{ store.objetos.pistola.balas }}</p>
              <Transition name="submenu">
                <div v-if="objetoActivo === 'pistola'" class="submenu" @click.stop>
                  <p class="submenu-titulo">OBJETIVO</p>
                  <div class="submenu-fila">
                    <button class="submenu-btn" :class="{ 'submenu-btn--sel': pistola.objetivo === 'jugador' }" @click="pistola.objetivo = 'jugador'">YO</button>
                    <button class="submenu-btn" :class="{ 'submenu-btn--sel': pistola.objetivo === 'crupier' }" @click="pistola.objetivo = 'crupier'">CRUPIER</button>
                  </div>
                  <p class="submenu-titulo">EFECTO</p>
                  <div class="submenu-fila">
                    <button class="submenu-btn" :class="{ 'submenu-btn--sel': pistola.efecto === 'sumar' }" @click="pistola.efecto = 'sumar'">+5</button>
                    <button class="submenu-btn" :class="{ 'submenu-btn--sel': pistola.efecto === 'restar' }" @click="pistola.efecto = 'restar'">-5</button>
                  </div>
                  <button class="submenu-confirmar" :disabled="!pistola.objetivo || !pistola.efecto" @click="confirmarPistola">▶ DISPARAR</button>
                </div>
              </Transition>
            </div>

            <!-- COMODÍN -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible': puedeUsarComodin,
                'objeto-card--agotado': !puedeUsarComodin,
                'objeto-card--activo': objetoActivo === 'comodin',
              }"
              @click="toggleObjeto('comodin')"
            >
              <div class="objeto-img-wrap">
                <img src="@/assets/Images/comodin.png" class="objeto-img" alt="Comodín" />
              </div>
              <p class="objeto-nombre">COMODÍN</p>
              <p class="objeto-cargas">DISP: {{ store.objetos.comoDin.disponible }}</p>
              <Transition name="submenu">
                <div v-if="objetoActivo === 'comodin'" class="submenu" @click.stop>
                  <p class="submenu-titulo">ELIGE ACCIÓN</p>
                  <div class="submenu-fila">
                    <button class="submenu-btn submenu-btn--confirmar" @click="confirmarComodin('sumar')">▶ SUMAR</button>
                    <button class="submenu-btn submenu-btn--confirmar" @click="confirmarComodin('restar')">▶ RESTAR</button>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- COPA -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible': puedeUsarCopa,
                'objeto-card--agotado': !puedeUsarCopa,
              }"
              @click="confirmarCopa"
            >
              <div class="objeto-img-wrap">
                <img src="@/assets/Images/copa.png" class="objeto-img" alt="Copa" />
              </div>
              <p class="objeto-nombre">COPA</p>
              <p class="objeto-cargas">CARGAS: {{ store.objetos.copa.cargas }}</p>
            </div>
          </div>

          <div class="modal-divider"></div>

          <!-- Objetos premium -->
          <div class="premium-header">
            <p class="seccion-titulo">— OBJETOS PREMIUM —</p>
            <span class="premium-lock-hint"> 🔒 Desbloquea cada uno en la Tienda por {{ store.PRECIO_DESBLOQUEO }} $ </span>
          </div>

          <div class="objetos-grid">
            <!-- JERINGA -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible': puedeUsarJeringa,
                'objeto-card--agotado': store.jeringaDesbloqueada && !puedeUsarJeringa,
                'objeto-card--bloqueado': !store.jeringaDesbloqueada,
              }"
              @click="confirmarJeringa"
            >
              <div class="objeto-img-wrap">
                <img src="@/assets/Images/jeringa.png" class="objeto-img" :class="{ 'objeto-img--bloqueado': !store.jeringaDesbloqueada }" alt="Jeringa" />
              </div>
              <p class="objeto-nombre">JERINGA</p>
              <p class="objeto-cargas" :class="{ 'objeto-lock': !store.jeringaDesbloqueada }">
                <span v-if="!store.jeringaDesbloqueada">🔒</span>
                <span v-else>CARGAS: {{ store.objetos.jeringa.cargas }}</span>
              </p>
              <p v-if="store.jeringaDesbloqueada" class="objeto-efecto-desc">Congela al crupier 1 turno</p>
            </div>

            <!-- ENCENDEDOR -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible': puedeUsarEncendedor,
                'objeto-card--agotado': store.encendedorDesbloqueado && !puedeUsarEncendedor,
                'objeto-card--bloqueado': !store.encendedorDesbloqueado,
              }"
              @click="confirmarEncendedor"
            >
              <div class="objeto-img-wrap">
                <img src="@/assets/Images/encendedor.png" class="objeto-img" :class="{ 'objeto-img--bloqueado': !store.encendedorDesbloqueado }" alt="Encendedor" />
              </div>
              <p class="objeto-nombre">ENCEND.</p>
              <p class="objeto-cargas" :class="{ 'objeto-lock': !store.encendedorDesbloqueado }">
                <span v-if="!store.encendedorDesbloqueado">🔒</span>
                <span v-else>CARGAS: {{ store.objetos.encendedor.cargas }}</span>
              </p>
              <p v-if="store.encendedorDesbloqueado" class="objeto-efecto-desc">Quema carta perjudicial</p>
            </div>

            <!-- PURO -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible': puedeUsarPuro,
                'objeto-card--agotado': store.puroDesbloqueado && !puedeUsarPuro,
                'objeto-card--bloqueado': !store.puroDesbloqueado,
              }"
              @click="confirmarPuro"
            >
              <div class="objeto-img-wrap">
                <img src="@/assets/Images/puro.png" class="objeto-img" :class="{ 'objeto-img--bloqueado': !store.puroDesbloqueado }" alt="Puro" />
              </div>
              <p class="objeto-nombre">PURO</p>
              <p class="objeto-cargas" :class="{ 'objeto-lock': !store.puroDesbloqueado }">
                <span v-if="!store.puroDesbloqueado">🔒</span>
                <span v-else>CARGAS: {{ store.objetos.puro.cargas }}</span>
              </p>
              <p v-if="store.puroDesbloqueado" class="objeto-efecto-desc">Revela carta oculta del crupier</p>
            </div>
          </div>

          <div class="modal-divider"></div>
          <p class="modal-hint">CLICK EN UN OBJETO PARA USARLO — ESC PARA CERRAR</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
  import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
  import { useGameStore } from '@/store/gameStore'

  defineProps({ visible: Boolean })
  const emit = defineEmits(['close'])

  const store = useGameStore()
  const objetoActivo = ref(null)
  const pistola = reactive({ objetivo: null, efecto: null })

  const bloqueado = computed(() => store.jugadorNego)

  const puedeUsarPistola = computed(() => !bloqueado.value && store.objetos.pistola.balas > 0)
  const puedeUsarComodin = computed(() => !bloqueado.value && store.objetos.comoDin.disponible > 0)
  const puedeUsarCopa = computed(() => !bloqueado.value && store.objetos.copa.cargas > 0 && store.playerHand.some((c) => !c.esFantasma))
  const puedeUsarJeringa = computed(() => !bloqueado.value && store.jeringaDesbloqueada && store.objetos.jeringa.cargas > 0)
  const puedeUsarEncendedor = computed(() => !bloqueado.value && store.encendedorDesbloqueado && store.objetos.encendedor.cargas > 0 && store.playerHand.filter((c) => !c.esFantasma).length > 1)
  const puedeUsarPuro = computed(() => !bloqueado.value && store.puroDesbloqueado && store.objetos.puro.cargas > 0 && store.dealerHand.some((c) => c.hidden))

  function toggleObjeto(nombre) {
    if (nombre === 'pistola' && !puedeUsarPistola.value) return
    if (nombre === 'comodin' && !puedeUsarComodin.value) return
    objetoActivo.value = objetoActivo.value === nombre ? null : nombre
    if (objetoActivo.value === 'pistola') {
      pistola.objetivo = null
      pistola.efecto = null
    }
  }

  function confirmarPistola() {
    if (!pistola.objetivo || !pistola.efecto) return
    store.usarPistola(pistola.objetivo, pistola.efecto)
    objetoActivo.value = null
    cerrar()
    store.turnoCrupier()
  }

  function confirmarComodin(accion) {
    store.usarComodin(accion)
    objetoActivo.value = null
    cerrar()
    store.turnoCrupier()
  }

  function confirmarCopa() {
    if (!puedeUsarCopa.value) return
    store.usarCopa()
    cerrar()
  }

  function confirmarJeringa() {
    if (!puedeUsarJeringa.value) return
    store.usarJeringa()
    cerrar()
    store.turnoCrupier()
  }

  function confirmarEncendedor() {
    if (!puedeUsarEncendedor.value) return
    store.usarEncendedor()
    cerrar()
    store.turnoCrupier()
  }

  function confirmarPuro() {
    if (!puedeUsarPuro.value) return
    store.usarPuro()
    cerrar()
  }

  function cerrar() {
    objetoActivo.value = null
    emit('close')
  }

  function onKey(e) {
    if (e.key === 'Escape') cerrar()
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal-panel {
    background: #0d0604;
    border: 1px solid rgba(180, 40, 0, 0.6);
    box-shadow:
      0 0 60px rgba(180, 30, 0, 0.45),
      inset 0 0 80px rgba(0, 0, 0, 0.8);
    padding: 24px 32px;
    width: 900px;
    max-width: 96vw;
    max-height: 92vh;
    overflow-y: auto;
    font-family: 'Courier New', Courier, monospace;
    position: relative;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .modal-title {
    color: #cc2200;
    font-size: 1.1rem;
    letter-spacing: 5px;
    text-shadow: 0 0 10px rgba(200, 34, 0, 0.9);
    text-transform: uppercase;
  }
  .modal-close {
    background: none;
    border: 1px solid rgba(180, 40, 0, 0.4);
    color: #882200;
    font-size: 0.85rem;
    padding: 4px 10px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
  }
  .modal-close:hover {
    color: #ff3300;
    border-color: rgba(255, 51, 0, 0.7);
    box-shadow: 0 0 8px rgba(255, 51, 0, 0.3);
  }
  .modal-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(180, 40, 0, 0.5), transparent);
    margin: 8px 0;
  }

  .modal-mensaje {
    font-size: 0.82rem;
    color: #ff8800;
    text-align: center;
    letter-spacing: 1px;
    text-shadow: 0 0 8px rgba(255, 136, 0, 0.8);
    margin: 6px 0;
    text-transform: uppercase;
  }
  .modal-bloqueado {
    font-size: 0.78rem;
    color: #882200;
    text-align: center;
    letter-spacing: 2px;
    margin: 6px 0;
    animation: flicker 1.5s infinite;
  }
  .modal-hint {
    font-size: 0.62rem;
    color: #551100;
    text-align: center;
    letter-spacing: 2px;
    margin-top: 8px;
    text-transform: uppercase;
  }

  .seccion-titulo {
    font-size: 0.5rem;
    color: #882200;
    letter-spacing: 3px;
    text-align: center;
    margin: 8px 0 4px;
    text-transform: uppercase;
  }

  .premium-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 4px 0;
  }
  .premium-lock-hint {
    font-size: 0.48rem;
    color: #664400;
    letter-spacing: 1px;
  }
  .premium-unlock-hint {
    font-size: 0.48rem;
    color: #ff8800;
    letter-spacing: 2px;
    text-shadow: 0 0 6px rgba(255, 136, 0, 0.6);
  }

  .objetos-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin: 10px 0;
  }

  .objeto-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid rgba(120, 30, 0, 0.4);
    padding: 14px 10px 10px;
    background: rgba(20, 5, 0, 0.6);
    position: relative;
    transition: all 0.2s;
    min-height: 200px;
    justify-content: flex-start;
    overflow: visible;
  }
  .objeto-card--disponible {
    cursor: pointer;
    border-color: rgba(180, 40, 0, 0.5);
  }
  .objeto-card--disponible:hover {
    background: rgba(50, 10, 0, 0.8);
    border-color: rgba(255, 60, 0, 0.7);
    box-shadow: 0 0 20px rgba(200, 40, 0, 0.35);
    transform: translateY(-3px);
  }
  .objeto-card--activo {
    border-color: rgba(255, 80, 0, 0.9);
    box-shadow: 0 0 24px rgba(255, 60, 0, 0.45);
    background: rgba(60, 12, 0, 0.85);
  }
  .objeto-card--agotado {
    cursor: not-allowed;
    opacity: 0.45;
    filter: grayscale(60%);
  }
  .objeto-card--bloqueado {
    cursor: not-allowed;
    opacity: 0.28;
    filter: grayscale(85%);
  }

  .objeto-img-wrap {
    width: 140px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .objeto-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 8px rgba(180, 40, 0, 0.5));
    transition: filter 0.2s;
  }
  .objeto-card--disponible:hover .objeto-img {
    filter: drop-shadow(0 0 14px rgba(255, 80, 0, 0.75));
  }
  .objeto-img--bloqueado {
    filter: grayscale(100%) brightness(0.35);
  }

  .objeto-nombre {
    margin: 8px 0 3px;
    font-size: 0.72rem;
    color: #cc3300;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-shadow: 0 0 6px rgba(200, 51, 0, 0.7);
  }
  .objeto-cargas {
    font-size: 0.64rem;
    color: #882200;
    letter-spacing: 1px;
    margin: 0;
  }
  .objeto-efecto-desc {
    font-size: 0.44rem;
    color: #662200;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-align: center;
    margin-top: 4px;
  }
  .objeto-lock {
    color: #441100;
    font-size: 0.65rem;
  }

  /* Submenú */
  .submenu {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    background: #0d0604;
    border: 1px solid rgba(200, 50, 0, 0.7);
    box-shadow: 0 0 24px rgba(180, 30, 0, 0.5);
    padding: 14px 16px;
    width: 100%;
    margin-top: 10px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .submenu-titulo {
    font-size: 0.62rem;
    color: #882200;
    letter-spacing: 2px;
    margin: 0 0 2px;
    text-transform: uppercase;
  }
  .submenu-fila {
    display: flex;
    gap: 8px;
  }
  .submenu-btn {
    flex: 1;
    background: rgba(40, 8, 0, 0.8);
    border: 1px solid rgba(150, 35, 0, 0.5);
    color: #cc4400;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.68rem;
    letter-spacing: 1px;
    padding: 6px 8px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.15s;
  }
  .submenu-btn:hover,
  .submenu-btn--sel {
    background: rgba(100, 20, 0, 0.9);
    border-color: rgba(255, 70, 0, 0.8);
    color: #ff5500;
    box-shadow: 0 0 8px rgba(255, 60, 0, 0.3);
  }
  .submenu-btn--confirmar {
    background: rgba(80, 15, 0, 0.9);
    border-color: rgba(180, 40, 0, 0.7);
    color: #ff4400;
  }
  .submenu-btn--confirmar:hover {
    background: rgba(140, 25, 0, 0.95);
    box-shadow: 0 0 10px rgba(255, 60, 0, 0.4);
  }
  .submenu-confirmar {
    margin-top: 4px;
    width: 100%;
    background: rgba(100, 20, 0, 0.9);
    border: 1px solid rgba(200, 50, 0, 0.7);
    color: #ff5500;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.68rem;
    letter-spacing: 2px;
    padding: 7px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
  }
  .submenu-confirmar:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .submenu-confirmar:not(:disabled):hover {
    background: rgba(160, 30, 0, 0.95);
    box-shadow: 0 0 12px rgba(255, 60, 0, 0.5);
  }

  .modal-enter-active,
  .modal-leave-active {
    transition:
      opacity 0.2s,
      transform 0.2s;
  }
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
    transform: scale(0.96);
  }
  .submenu-enter-active,
  .submenu-leave-active {
    transition:
      opacity 0.15s,
      transform 0.15s;
  }
  .submenu-enter-from,
  .submenu-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  @keyframes flicker {
    0%,
    89%,
    91%,
    93%,
    100% {
      opacity: 1;
    }
    90%,
    92% {
      opacity: 0.3;
    }
  }
</style>
