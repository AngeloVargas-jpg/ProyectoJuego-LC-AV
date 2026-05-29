<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="cerrar">
        <div class="modal-panel">
          <div class="modal-header">
            <span class="modal-title">// TIENDA //</span>
            <span class="modal-dinero">💰 {{ store.dineroJugador }} $</span>
            <button class="modal-close" @click="cerrar">✕</button>
          </div>

          <div class="modal-divider"></div>

          <Transition name="fade">
            <p v-if="mensajeCompra" class="modal-mensaje" :class="mensajeClase">
              {{ mensajeCompra }}
            </p>
          </Transition>

          <!-- Objetos base -->
          <p class="seccion-titulo">— OBJETOS ESTÁNDAR —</p>
          <div class="objetos-grid">
            <!-- PISTOLA -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible': puedeComprar(100),
                'objeto-card--agotado': !puedeComprar(100),
              }"
              @click="comprar('pistola')"
            >
              <div class="objeto-img-wrap">
                <img src="@/assets/Images/revolver.png" class="objeto-img" alt="Pistola" />
              </div>
              <p class="objeto-nombre">PISTOLA</p>
              <p class="objeto-stock">BALAS: {{ store.objetos.pistola.balas.value }}</p>
              <div class="objeto-precio-wrap">
                <span class="objeto-precio">100 $</span>
                <span class="objeto-desc">+1 bala</span>
              </div>
            </div>

            <!-- COMODÍN -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible':
                  puedeComprar(150) && store.objetos.comoDin.disponible.value === 0,
                'objeto-card--agotado':
                  !puedeComprar(150) || store.objetos.comoDin.disponible.value > 0,
              }"
              @click="comprar('comodin')"
            >
              <div class="objeto-img-wrap">
                <img src="@/assets/Images/comodin.png" class="objeto-img" alt="Comodín" />
              </div>
              <p class="objeto-nombre">COMODÍN</p>
              <p class="objeto-stock">
                <span v-if="store.objetos.comoDin.disponible.value > 0" class="stock-ok"
                  >✓ DISPONIBLE</span
                >
                <span v-else>DISP: 0</span>
              </p>
              <div class="objeto-precio-wrap">
                <span class="objeto-precio">150 $</span>
                <span class="objeto-desc">+1 uso</span>
              </div>
            </div>

            <!-- COPA -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible': puedeComprar(75),
                'objeto-card--agotado': !puedeComprar(75),
              }"
              @click="comprar('copa')"
            >
              <div class="objeto-img-wrap">
                <img src="@/assets/Images/copa.png" class="objeto-img" alt="Copa" />
              </div>
              <p class="objeto-nombre">COPA</p>
              <p class="objeto-stock">CARGAS: {{ store.objetos.copa.cargas.value }}</p>
              <div class="objeto-precio-wrap">
                <span class="objeto-precio">75 $</span>
                <span class="objeto-desc">+1 carga</span>
              </div>
            </div>
          </div>

          <div class="modal-divider"></div>

          <!-- Objetos premium individuales -->
          <p class="seccion-titulo">— OBJETOS PREMIUM —</p>
          <div class="objetos-grid">
            <!-- JERINGA -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible': store.jeringaDesbloqueada && puedeComprar(200),
                'objeto-card--agotado': store.jeringaDesbloqueada && !puedeComprar(200),
                'objeto-card--bloqueado': !store.jeringaDesbloqueada,
              }"
              @click="
                store.jeringaDesbloqueada ? comprar('jeringa') : intentarDesbloquear('jeringa')
              "
            >
              <div class="objeto-img-wrap">
                <img
                  src="@/assets/Images/jeringa.png"
                  class="objeto-img"
                  :class="{ 'objeto-img--bloqueado': !store.jeringaDesbloqueada }"
                  alt="Jeringa"
                />
              </div>
              <p class="objeto-nombre">JERINGA</p>
              <p class="objeto-stock" :class="{ 'objeto-lock': !store.jeringaDesbloqueada }">
                <span v-if="!store.jeringaDesbloqueada">🔒 1000 $ DESBLOQUEAR</span>
                <span v-else>CARGAS: {{ store.objetos.jeringa.cargas.value }}</span>
              </p>
              <div class="objeto-precio-wrap">
                <span v-if="!store.jeringaDesbloqueada" class="objeto-precio desbloqueo-precio-btn"
                  >🔓 1000 $</span
                >
                <span v-else class="objeto-precio">200 $</span>
                <span class="objeto-desc">Congela al crupier</span>
              </div>
            </div>

            <!-- ENCENDEDOR -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible': store.encendedorDesbloqueado && puedeComprar(175),
                'objeto-card--agotado': store.encendedorDesbloqueado && !puedeComprar(175),
                'objeto-card--bloqueado': !store.encendedorDesbloqueado,
              }"
              @click="
                store.encendedorDesbloqueado
                  ? comprar('encendedor')
                  : intentarDesbloquear('encendedor')
              "
            >
              <div class="objeto-img-wrap">
                <img
                  src="@/assets/Images/encendedor.png"
                  class="objeto-img"
                  :class="{ 'objeto-img--bloqueado': !store.encendedorDesbloqueado }"
                  alt="Encendedor"
                />
              </div>
              <p class="objeto-nombre">ENCEND.</p>
              <p class="objeto-stock" :class="{ 'objeto-lock': !store.encendedorDesbloqueado }">
                <span v-if="!store.encendedorDesbloqueado">🔒 1000 $ DESBLOQUEAR</span>
                <span v-else>CARGAS: {{ store.objetos.encendedor.cargas.value }}</span>
              </p>
              <div class="objeto-precio-wrap">
                <span
                  v-if="!store.encendedorDesbloqueado"
                  class="objeto-precio desbloqueo-precio-btn"
                  >🔓 1000 $</span
                >
                <span v-else class="objeto-precio">175 $</span>
                <span class="objeto-desc">Quema carta perjudicial</span>
              </div>
            </div>

            <!-- PURO -->
            <div
              class="objeto-card"
              :class="{
                'objeto-card--disponible': store.puroDesbloqueado && puedeComprar(125),
                'objeto-card--agotado': store.puroDesbloqueado && !puedeComprar(125),
                'objeto-card--bloqueado': !store.puroDesbloqueado,
              }"
              @click="store.puroDesbloqueado ? comprar('puro') : intentarDesbloquear('puro')"
            >
              <div class="objeto-img-wrap">
                <img
                  src="@/assets/Images/puro.png"
                  class="objeto-img"
                  :class="{ 'objeto-img--bloqueado': !store.puroDesbloqueado }"
                  alt="Puro"
                />
              </div>
              <p class="objeto-nombre">PURO</p>
              <p class="objeto-stock" :class="{ 'objeto-lock': !store.puroDesbloqueado }">
                <span v-if="!store.puroDesbloqueado">🔒 1000 $ DESBLOQUEAR</span>
                <span v-else>CARGAS: {{ store.objetos.puro.cargas.value }}</span>
              </p>
              <div class="objeto-precio-wrap">
                <span v-if="!store.puroDesbloqueado" class="objeto-precio desbloqueo-precio-btn"
                  >🔓 1000 $</span
                >
                <span v-else class="objeto-precio">125 $</span>
                <span class="objeto-desc">Revela carta oculta</span>
              </div>
            </div>
          </div>

          <div class="modal-divider"></div>
          <p class="modal-hint">
            CLICK EN UN OBJETO PARA COMPRARLO — CLICK EN 🔒 PARA DESBLOQUEARLO — ESC PARA CERRAR
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useGameStore } from '@/store/gameStore'

  defineProps({ visible: Boolean })
  const emit = defineEmits(['close'])

  const store = useGameStore()
  const mensajeCompra = ref('')
  const mensajeClase = ref('')
  let mensajeTimer = null

  function mostrarMensaje(texto, tipo = 'ok') {
    mensajeCompra.value = texto
    mensajeClase.value = tipo === 'ok' ? 'modal-mensaje--ok' : 'modal-mensaje--error'
    clearTimeout(mensajeTimer)
    mensajeTimer = setTimeout(() => {
      mensajeCompra.value = ''
    }, 2500)
  }

  function puedeComprar(precio) {
    return store.dineroJugador >= precio
  }

  function comprar(objeto) {
    const result = store.comprarObjeto(objeto)
    mostrarMensaje(result.mensaje, result.ok ? 'ok' : 'error')
  }

  function intentarDesbloquear(objeto) {
    const result = store.desbloquearObjeto(objeto)
    mostrarMensaje(result.mensaje, result.ok ? 'ok' : 'error')
  }

  function cerrar() {
    emit('close')
  }

  function onKey(e) {
    if (e.key === 'Escape') cerrar()
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onUnmounted(() => {
    window.removeEventListener('keydown', onKey)
    clearTimeout(mensajeTimer)
  })
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal-panel {
    background: #1a0800;
    border: 1px solid rgba(180, 40, 0, 0.6);
    box-shadow:
      0 0 40px rgba(180, 30, 0, 0.4),
      inset 0 0 60px rgba(0, 0, 0, 0.5);
    padding: 20px 24px;
    width: 780px;
    max-width: 95vw;
    max-height: 92vh;
    overflow-y: auto;
    font-family: 'Courier New', Courier, monospace;
    position: relative;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .modal-title {
    color: #cc2200;
    font-size: 0.85rem;
    letter-spacing: 4px;
    text-shadow: 0 0 10px rgba(200, 34, 0, 0.9);
    text-transform: uppercase;
  }
  .modal-dinero {
    font-size: 0.75rem;
    color: #ff8800;
    letter-spacing: 2px;
    text-shadow: 0 0 8px rgba(255, 136, 0, 0.7);
  }

  .modal-close {
    background: none;
    border: 1px solid rgba(180, 40, 0, 0.4);
    color: #882200;
    font-size: 0.7rem;
    padding: 3px 7px;
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
    font-size: 0.62rem;
    text-align: center;
    letter-spacing: 1px;
    margin: 4px 0;
    text-transform: uppercase;
  }
  .modal-mensaje--ok {
    color: #ff8800;
    text-shadow: 0 0 8px rgba(255, 136, 0, 0.8);
  }
  .modal-mensaje--error {
    color: #ff2200;
    text-shadow: 0 0 8px rgba(255, 34, 0, 0.8);
    animation: flicker 1s infinite;
  }

  .modal-hint {
    font-size: 0.45rem;
    color: #662200;
    text-align: center;
    letter-spacing: 2px;
    margin-top: 6px;
    text-transform: uppercase;
  }

  .seccion-titulo {
    font-size: 0.5rem;
    color: #882200;
    letter-spacing: 3px;
    text-align: center;
    margin: 8px 0 6px;
    text-transform: uppercase;
  }

  /* ── Grid ── */
  .objetos-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 8px 0;
  }

  .objeto-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid rgba(120, 30, 0, 0.4);
    padding: 10px 8px 8px;
    background: rgba(60, 15, 5, 0.85);
    position: relative;
    transition: all 0.2s;
    min-height: 195px;
    justify-content: flex-start;
  }

  .objeto-card--disponible {
    cursor: pointer;
    border-color: rgba(180, 40, 0, 0.5);
  }
  .objeto-card--disponible:hover {
    background: rgba(80, 20, 5, 0.95);
    border-color: rgba(255, 60, 0, 0.7);
    box-shadow: 0 0 16px rgba(200, 40, 0, 0.3);
    transform: translateY(-2px);
  }
  .objeto-card--agotado {
    cursor: not-allowed;
    opacity: 0.45;
    filter: grayscale(60%);
  }
  .objeto-card--bloqueado {
    cursor: pointer;
    opacity: 0.7;
    border-color: rgba(255, 136, 0, 0.35);
  }
  .objeto-card--bloqueado:hover {
    background: rgba(60, 25, 0, 0.95);
    border-color: rgba(255, 170, 0, 0.6);
    box-shadow: 0 0 16px rgba(255, 120, 0, 0.25);
    transform: translateY(-2px);
  }

  .objeto-img-wrap {
    width: 110px;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .objeto-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    mix-blend-mode: screen;
    filter: drop-shadow(0 0 6px rgba(180, 40, 0, 0.5));
    transition: filter 0.2s;
  }
  .objeto-card--disponible:hover .objeto-img {
    filter: drop-shadow(0 0 10px rgba(255, 80, 0, 0.7));
  }
  .objeto-img--bloqueado {
    filter: grayscale(100%) brightness(0.35);
    mix-blend-mode: normal;
  }

  .objeto-nombre {
    margin: 6px 0 2px;
    font-size: 0.55rem;
    color: #cc3300;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-shadow: 0 0 6px rgba(200, 51, 0, 0.7);
  }
  .objeto-stock {
    font-size: 0.48rem;
    color: #dd4400;
    letter-spacing: 1px;
    margin: 0 0 6px;
    text-shadow: 0 0 4px rgba(220, 68, 0, 0.6);
    text-align: center;
  }
  .stock-ok {
    color: #ff8800;
    text-shadow: 0 0 6px rgba(255, 136, 0, 0.8);
  }
  .objeto-lock {
    color: #ff8800;
    text-shadow: 0 0 6px rgba(255, 136, 0, 0.6);
  }

  .objeto-precio-wrap {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding-top: 6px;
    border-top: 1px solid rgba(150, 35, 0, 0.3);
    width: 100%;
  }
  .objeto-precio {
    font-size: 0.7rem;
    color: #ff6600;
    letter-spacing: 2px;
    text-shadow: 0 0 8px rgba(255, 102, 0, 0.8);
    font-weight: bold;
  }
  .desbloqueo-precio-btn {
    color: #ffaa00;
    text-shadow: 0 0 8px rgba(255, 170, 0, 0.9);
  }
  .objeto-desc {
    font-size: 0.42rem;
    color: #882200;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-align: center;
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
