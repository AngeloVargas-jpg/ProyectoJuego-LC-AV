<template>
  <!-- ══ MONITOR IZQUIERDO GRANDE ══ -->
  <div v-if="side === 'left'" class="screen screen--left">
    <div class="screen__scanlines"></div>
    <div class="screen__content">
      <p class="line line--title">
        JUGADOR <span class="line--score">{{ store.victoriasJugador }}</span>
        :
        <span class="line--score">{{ store.victoriasCrupier }}</span> CRUPIER
      </p>
      <div class="divider"></div>
      <p class="line line--label">APUESTAS</p>
      <p class="line line--data">TU: {{ store.apuestaJugador }} $</p>
      <p class="line line--data">CRUPIER: {{ store.apuestaCrupier }} $</p>
      <p class="line line--pozo">POZO: {{ store.apuestaJugador + store.apuestaCrupier }} $</p>
    </div>
  </div>

  <!-- ══ PANTALLITA INFERIOR IZQUIERDA ══ -->
  <div v-else-if="side === 'bottom-left'" class="screen screen--bottom-left">
    <div class="screen__scanlines"></div>
    <div class="screen__content screen__content--row">
      <button class="screen__btn" @click="abrirTienda">▶ TIENDA</button>
      <span class="line line--data">{{ store.dineroJugador }} $</span>
    </div>
  </div>

  <!-- ══ MONITOR DERECHO SUPERIOR — cargas de objetos ══ -->
  <div v-else-if="side === 'top-right'" class="screen screen--top-right">
    <div class="screen__scanlines"></div>
    <div class="screen__content screen__content--left-align">
      <button class="screen__btn screen__btn--usar" @click="abrirObjetos">▶ USAR OBJETOS</button>
      <div class="divider"></div>
      <div class="obj-grid">
<<<<<<< HEAD
        <span class="line line--obj" :class="{ 'line--obj-active': store.objetos.pistola.balas.value > 0 }">
          PISTOLA: {{ store.objetos.pistola.balas.value }}
        </span>
        <span class="line line--obj" :class="{ 'line--obj-active': store.objetos.jeringa.cargas.value > 0 }">
          JERINGA: {{ store.objetos.jeringa.cargas.value }}
        </span>
        <span class="line line--obj" :class="{ 'line--obj-active': store.objetos.copa.cargas.value > 0 }">
          COPA: {{ store.objetos.copa.cargas.value }}
        </span>
        <span class="line line--obj" :class="{ 'line--obj-active': store.objetos.encendedor.cargas.value > 0 }">
          ENCEND: {{ store.objetos.encendedor.cargas.value }}
        </span>
        <span class="line line--obj" :class="{ 'line--obj-active': store.objetos.comoDin.disponible.value > 0 }">
          COMODIN: {{ store.objetos.comoDin.disponible.value }}
        </span>
        <span class="line line--obj" :class="{ 'line--obj-active': store.objetos.puro.cargas.value > 0 }">
          PURO: {{ store.objetos.puro.cargas.value }}
        </span>
=======
        <span class="line line--obj">PISTOLA: {{ store.objetos.pistola.balas.value }}</span>
        <span class="line line--obj">JERINGA: 0</span>
        <span class="line line--obj">COPA: {{ store.objetos.copa.cargas.value }}</span>
        <span class="line line--obj">ENCEND: 0</span>
        <span class="line line--obj">COMODIN: {{ store.objetos.comoDin.disponible.value }}</span>
        <span class="line line--obj">PURO: 0</span>
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
      </div>
    </div>
  </div>

  <!-- ══ MONITOR DERECHO GRANDE ══ -->
  <div v-else class="screen screen--right">
    <div class="screen__scanlines"></div>
    <div class="screen__content">
      <p class="line line--label">FASE</p>
      <p class="line line--fase">{{ faseTexto }}</p>
      <div class="divider"></div>
      <p class="line line--label">PUNTAJES</p>
      <p class="line line--data">CRUPIER: {{ store.dealerVisibleScore }}</p>
      <p class="line line--data" :class="{ 'line--bust': store.playerScore > 21 }">TU: {{ store.playerScore }}</p>
<<<<<<< HEAD
      <div class="divider"></div>
      <!-- BOTÓN STATS (solo del juego, perfil va en menú) -->
      <button class="mute-btn mute-btn--stats" @click="abrirStats">
        <span class="mute-icon">📊</span>
        <span class="mute-label">ESTADÍSTICAS</span>
      </button>
=======
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    </div>
  </div>

  <!-- ══ MODALES ══ -->
  <ObjetosModal :visible="modalObjetos" @close="modalObjetos = false" />
  <TiendaModal :visible="modalTienda" @close="modalTienda = false" />
<<<<<<< HEAD

  <!-- ══ MODAL ESTADÍSTICAS / PERFIL ══ -->
  <Teleport to="body">
    <Transition name="stats-modal">
      <div v-if="modalStats" class="stats-overlay" @click.self="modalStats = false">
        <div class="stats-panel">
          <div class="stats-header">
            <span class="stats-title">// PERFIL DEL JUGADOR //</span>
            <button class="stats-close" @click="modalStats = false">✕</button>
          </div>
          <div class="stats-divider"></div>

          <!-- Nombre/alias -->
          <div class="stats-alias-row">
            <span class="stats-label">ALIAS:</span>
            <span v-if="!editingAlias" class="stats-alias" @click="startEditAlias">{{ playerAlias }}</span>
            <input
              v-else
              ref="aliasInput"
              v-model="aliasTemp"
              class="stats-alias-input"
              maxlength="16"
              @blur="saveAlias"
              @keyup.enter="saveAlias"
            />
            <button class="stats-edit-btn" @click="startEditAlias" v-if="!editingAlias">✎</button>
          </div>

          <div class="stats-divider stats-divider--thin"></div>

          <!-- Estadísticas de la sesión -->
          <div class="stats-section">
            <p class="stats-section-title">▌ SESIÓN ACTUAL</p>
            <div class="stats-grid">
              <div class="stats-item">
                <span class="stats-item-label">VICTORIAS</span>
                <span class="stats-item-val stats-item-val--win">{{ store.victoriasJugador }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-item-label">DERROTAS</span>
                <span class="stats-item-val stats-item-val--loss">{{ store.victoriasCrupier }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-item-label">TURNOS</span>
                <span class="stats-item-val">{{ store.turnoNumero }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-item-label">SALDO</span>
                <span class="stats-item-val" :class="store.dineroJugador >= 1000 ? 'stats-item-val--win' : 'stats-item-val--loss'">
                  {{ store.dineroJugador }} $
                </span>
              </div>
              <div class="stats-item">
                <span class="stats-item-label">RATIO V/D</span>
                <span class="stats-item-val">
                  {{ store.victoriasCrupier > 0 ? (store.victoriasJugador / store.victoriasCrupier).toFixed(2) : '∞' }}
                </span>
              </div>
              <div class="stats-item">
                <span class="stats-item-label">WIN RATE</span>
                <span class="stats-item-val">
                  {{ totalRondas > 0 ? ((store.victoriasJugador / totalRondas) * 100).toFixed(1) + '%' : '—' }}
                </span>
              </div>
            </div>
          </div>

          <div class="stats-divider stats-divider--thin"></div>

          <!-- Estadísticas acumuladas -->
          <div class="stats-section">
            <p class="stats-section-title">▌ HISTORIAL ACUMULADO</p>
            <div class="stats-grid">
              <div class="stats-item">
                <span class="stats-item-label">TOT. VICTORIAS</span>
                <span class="stats-item-val stats-item-val--win">{{ lifetimeStats.wins }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-item-label">TOT. DERROTAS</span>
                <span class="stats-item-val stats-item-val--loss">{{ lifetimeStats.losses }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-item-label">MAYOR SALDO</span>
                <span class="stats-item-val">{{ lifetimeStats.maxMoney }} $</span>
              </div>
              <div class="stats-item">
                <span class="stats-item-label">PARTIDAS</span>
                <span class="stats-item-val">{{ lifetimeStats.gamesPlayed }}</span>
              </div>
            </div>
          </div>

          <!-- Barra de progreso victorias -->
          <div class="stats-progress-row">
            <span class="stats-label">PROGRESO SERIE</span>
            <div class="stats-progress-bar">
              <div
                class="stats-progress-fill"
                :style="{ width: `${(store.victoriasJugador / 5) * 100}%` }"
              ></div>
            </div>
            <span class="stats-label">{{ store.victoriasJugador }}/5</span>
          </div>

          <div class="stats-divider stats-divider--thin"></div>
          <button class="stats-reset-btn" @click="resetLifetimeStats">⟳ REINICIAR HISTORIAL</button>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ══ FEED DE EVENTOS (sistema de mensajes mejorado) ══ -->
  <div class="event-feed" v-if="side === 'right'">
    <transition-group name="event-item" tag="div" class="event-feed__list">
      <div
        v-for="ev in eventLog"
        :key="ev.id"
        class="event-feed__item"
        :class="`event-feed__item--${ev.type}`"
      >
        <span class="event-feed__icon">{{ ev.icon }}</span>
        <span class="event-feed__msg">{{ ev.msg }}</span>
        <span class="event-feed__time">{{ ev.time }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
  import { computed, ref, watch, nextTick, onMounted } from 'vue'
=======
</template>

<script setup>
  import { computed, ref } from 'vue'
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  import { useGameStore } from '@/store/gameStore'
  import ObjetosModal from '@/components/ObjetosModal.vue'
  import TiendaModal from '@/components/TiendaModal.vue'

<<<<<<< HEAD
  const props = defineProps({
    side: { type: String, default: 'left' },
=======
  defineProps({
    side: {
      type: String,
      default: 'left',
    },
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  })

  const store = useGameStore()
  const modalObjetos = ref(false)
  const modalTienda = ref(false)
<<<<<<< HEAD
  const modalStats = ref(false)

  // ── PERFIL / ALIAS ──
  const playerAlias = ref(localStorage.getItem('playerAlias') || 'JUGADOR_01')
  const editingAlias = ref(false)
  const aliasTemp = ref('')
  const aliasInput = ref(null)

  function startEditAlias() {
    aliasTemp.value = playerAlias.value
    editingAlias.value = true
    nextTick(() => aliasInput.value?.focus())
  }

  function saveAlias() {
    if (aliasTemp.value.trim()) {
      playerAlias.value = aliasTemp.value.trim().toUpperCase()
      localStorage.setItem('playerAlias', playerAlias.value)
    }
    editingAlias.value = false
  }

  // ── ESTADÍSTICAS ACUMULADAS ──
  const lifetimeStats = ref({
    wins: 0,
    losses: 0,
    maxMoney: 1000,
    gamesPlayed: 0,
  })

  function loadLifetimeStats() {
    const saved = localStorage.getItem('lifetimeStats')
    if (saved) lifetimeStats.value = JSON.parse(saved)
  }

  function saveLifetimeStats() {
    localStorage.setItem('lifetimeStats', JSON.stringify(lifetimeStats.value))
  }

  function resetLifetimeStats() {
    lifetimeStats.value = { wins: 0, losses: 0, maxMoney: 1000, gamesPlayed: 0 }
    saveLifetimeStats()
  }

  const totalRondas = computed(() => store.victoriasJugador + store.victoriasCrupier)

  // Actualizar stats cuando cambien victorias
  watch(
    () => store.victoriasJugador,
    (newVal, oldVal) => {
      if (newVal > oldVal) {
        lifetimeStats.value.wins++
        saveLifetimeStats()
      }
    }
  )
  watch(
    () => store.victoriasCrupier,
    (newVal, oldVal) => {
      if (newVal > oldVal) {
        lifetimeStats.value.losses++
        saveLifetimeStats()
      }
    }
  )
  watch(
    () => store.dineroJugador,
    (val) => {
      if (val > lifetimeStats.value.maxMoney) {
        lifetimeStats.value.maxMoney = val
        saveLifetimeStats()
      }
    }
  )

  onMounted(loadLifetimeStats)

  // ── SISTEMA DE MENSAJES/EVENTOS ──
  const eventLog = ref([])
  let eventCounter = 0

  function addEvent(msg, type = 'info', icon = '▌') {
    const now = new Date()
    const time = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    eventLog.value.unshift({ id: ++eventCounter, msg, type, icon, time })
    if (eventLog.value.length > 5) eventLog.value.pop()
  }

  watch(
    () => store.faseJuego,
    (fase) => {
      const faseMap = {
        apuestas: { msg: 'Fase de apuestas', type: 'phase', icon: '💰' },
        turnoJugador: { msg: 'Tu turno', type: 'player', icon: '🃏' },
        turnoCrupier: { msg: 'Turno del crupier', type: 'dealer', icon: '🤖' },
        resultado: { msg: 'Resultado de ronda', type: 'result', icon: '🏆' },
      }
      if (faseMap[fase]) addEvent(faseMap[fase].msg, faseMap[fase].type, faseMap[fase].icon)
    }
  )

  watch(
    () => store.objetoMensaje,
    (msg) => {
      if (msg) addEvent(msg, 'object', '⚡')
    }
  )

  watch(
    () => store.victoriasJugador,
    (v, old) => { if (v > old) addEvent(`¡Victoria! +1 punto`, 'win', '✅') }
  )

  watch(
    () => store.victoriasCrupier,
    (v, old) => { if (v > old) addEvent('Crupier gana la ronda', 'loss', '❌') }
  )

  // ── FASE TEXTO ──
  const faseTexto = computed(() => {
    switch (store.faseJuego) {
      case 'apuestas': return 'APUESTAS'
      case 'turnoJugador': return 'TU TURNO'
      case 'turnoCrupier': return 'TRN CRUPIER'
      case 'resultado': return 'RESULTADO'
      default: return store.faseJuego.toUpperCase()
    }
  })

  function abrirObjetos() { modalObjetos.value = true }
  function abrirTienda() { modalTienda.value = true }
  function abrirStats() { modalStats.value = true }
=======

  const faseTexto = computed(() => {
    switch (store.faseJuego) {
      case 'apuestas':
        return 'APUESTAS'
      case 'turnoJugador':
        return 'TU TURNO'
      case 'turnoCrupier':
        return 'TRN CRUPIER'
      case 'resultado':
        return 'RESULTADO'
      default:
        return store.faseJuego.toUpperCase()
    }
  })

  function abrirObjetos() {
    modalObjetos.value = true
  }
  function abrirTienda() {
    modalTienda.value = true
  }
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
</script>

<style scoped>
  .screen {
    position: absolute;
    overflow: hidden;
    pointer-events: auto;
    background: transparent;
  }

  .screen--left {
    left: 170px;
    top: 155px;
    width: 250px;
    height: 175px;
    transform: rotate(2.3deg);
    transform-origin: left top;
  }

  .screen--bottom-left {
    left: 210px;
    top: 403px;
    width: 150px;
    height: 42px;
    transform: rotate(-4.5deg) skewX(2deg);
    transform-origin: left top;
  }

  .screen--top-right {
    left: 1045px;
    top: 18px;
    width: 185px;
    height: 100px;
    transform: rotate(-10.18deg) skewX(19.51deg);
    transform-origin: left top;
  }

  .screen--right {
    left: 1070px;
    top: 170px;
    width: 185px;
<<<<<<< HEAD
    height: 230px;
=======
    height: 200px;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    transform: rotate(-0.5deg);
    transform-origin: left top;
  }

  .screen__scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.12) 2px, rgba(0, 0, 0, 0.12) 4px);
    pointer-events: none;
    z-index: 2;
  }

  .screen__content {
    position: relative;
    z-index: 1;
    padding: 8px 12px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    box-sizing: border-box;
  }

  .screen__content--row {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
  }

  .screen__content--left-align {
    align-items: flex-start;
    padding: 6px 10px;
    gap: 2px;
  }

  .line {
    margin: 0;
    font-family: 'Courier New', Courier, monospace;
    text-transform: uppercase;
    text-align: center;
    animation: flicker 5s infinite;
    line-height: 1.2;
  }

  .line--title {
    font-size: 0.7rem;
    color: #cc2200;
    text-shadow: 0 0 6px rgba(200, 34, 0, 0.9);
    letter-spacing: 1px;
  }

  .line--score {
    font-size: 0.8rem;
    color: #ff3300;
<<<<<<< HEAD
    text-shadow: 0 0 8px rgba(255, 51, 0, 1), 0 0 20px rgba(255, 51, 0, 0.5);
=======
    text-shadow:
      0 0 8px rgba(255, 51, 0, 1),
      0 0 20px rgba(255, 51, 0, 0.5);
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    letter-spacing: 3px;
  }

  .line--label {
    font-size: 0.72rem;
    color: #992200;
    text-shadow: 0 0 5px rgba(150, 34, 0, 0.7);
    letter-spacing: 2px;
  }

  .line--data {
    font-size: 0.85rem;
    color: #dd4400;
    text-shadow: 0 0 6px rgba(220, 68, 0, 0.8);
    letter-spacing: 1px;
  }

  .line--pozo {
    font-size: 0.85rem;
    color: #ff6600;
    text-shadow: 0 0 8px rgba(255, 102, 0, 0.9);
    animation: flicker 2s infinite;
  }

  .line--fase {
    font-size: 0.88rem;
    color: #ff4400;
<<<<<<< HEAD
    text-shadow: 0 0 8px rgba(255, 68, 0, 0.9), 0 0 20px rgba(255, 68, 0, 0.4);
=======
    text-shadow:
      0 0 8px rgba(255, 68, 0, 0.9),
      0 0 20px rgba(255, 68, 0, 0.4);
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    letter-spacing: 1px;
    animation: flicker 2.5s infinite;
  }

  .line--obj {
    font-size: 0.55rem;
<<<<<<< HEAD
    color: #882200;
    text-shadow: 0 0 4px rgba(140, 34, 0, 0.5);
    text-align: left;
    white-space: nowrap;
    transition: color 0.3s, text-shadow 0.3s;
  }

  .line--obj-active {
    color: #ff5500 !important;
    text-shadow: 0 0 6px rgba(255, 85, 0, 0.9) !important;
    font-weight: bold;
=======
    color: #cc3300;
    text-shadow: 0 0 4px rgba(200, 51, 0, 0.7);
    text-align: left;
    white-space: nowrap;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }

  .line--bust {
    color: #ff8800;
    text-shadow: 0 0 8px rgba(255, 136, 0, 1);
    animation: flicker 0.8s infinite;
  }

  .obj-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px 8px;
    width: 100%;
  }

  .divider {
    width: 80%;
    height: 1px;
    background: rgba(180, 40, 0, 0.35);
    flex-shrink: 0;
    margin: 1px 0;
  }

  .screen__btn {
    background: rgba(80, 10, 0, 0.7);
    border: 1px solid rgba(180, 40, 0, 0.6);
    color: #ff5500;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.55rem;
    letter-spacing: 1px;
    padding: 3px 6px;
    cursor: pointer;
    text-transform: uppercase;
    text-shadow: 0 0 6px rgba(255, 85, 0, 0.7);
    transition: all 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }

<<<<<<< HEAD
  .screen__btn--usar { width: 100%; text-align: left; }
=======
  .screen__btn--usar {
    width: 100%;
    text-align: left;
  }
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5

  .screen__btn:hover {
    background: rgba(120, 20, 0, 0.85);
    border-color: rgba(255, 85, 0, 0.8);
    box-shadow: 0 0 8px rgba(255, 85, 0, 0.4);
  }

<<<<<<< HEAD
  /* ── BOTÓN MUTE ── */
  .mute-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(10, 10, 30, 0.8);
    border: 1px solid rgba(100, 100, 200, 0.4);
    color: #8080cc;
    font-family: 'Courier New', monospace;
    font-size: 0.5rem;
    letter-spacing: 1px;
    padding: 3px 8px;
    cursor: pointer;
    text-transform: uppercase;
    border-radius: 2px;
    transition: all 0.2s;
    width: 100%;
    justify-content: center;
  }

  .mute-btn--stats {
    border-color: rgba(100, 200, 100, 0.4);
    color: #80cc80;
    background: rgba(10, 30, 10, 0.8);
    margin-top: 2px;
  }

  .mute-btn:hover {
    background: rgba(20, 20, 60, 0.9);
    border-color: rgba(150, 150, 255, 0.7);
    box-shadow: 0 0 8px rgba(100, 100, 200, 0.4);
    color: #aaaaff;
  }

  .mute-btn--stats:hover {
    background: rgba(10, 50, 10, 0.9);
    border-color: rgba(100, 255, 100, 0.6);
    color: #aaffaa;
  }

  .mute-icon { font-size: 0.7rem; }
  .mute-label { font-size: 0.48rem; letter-spacing: 1px; }

  /* ── FEED DE EVENTOS ── */
  .event-feed {
    position: absolute;
    bottom: 145px;
    right: 30px;
    width: 220px;
    pointer-events: none;
    z-index: 20;
  }

  .event-feed__list {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .event-feed__item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(0, 0, 0, 0.82);
    border-left: 2px solid #553300;
    font-family: 'Courier New', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.5px;
    color: #aa7744;
    border-radius: 0 2px 2px 0;
    transition: all 0.3s;
    opacity: 0.85;
  }

  .event-feed__item--win { border-left-color: #226622; color: #66cc66; }
  .event-feed__item--loss { border-left-color: #882222; color: #cc6666; }
  .event-feed__item--object { border-left-color: #886600; color: #ccaa44; }
  .event-feed__item--phase { border-left-color: #224466; color: #6699cc; }
  .event-feed__item--player { border-left-color: #446622; color: #88cc66; }
  .event-feed__item--dealer { border-left-color: #662244; color: #cc6688; }

  .event-feed__icon { font-size: 0.65rem; flex-shrink: 0; }
  .event-feed__msg { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .event-feed__time { font-size: 0.48rem; color: #555; flex-shrink: 0; }

  .event-item-enter-active { transition: all 0.3s ease; }
  .event-item-leave-active { transition: all 0.25s ease; }
  .event-item-enter-from { opacity: 0; transform: translateX(20px); }
  .event-item-leave-to { opacity: 0; transform: translateX(-10px); }

  /* ── MODAL ESTADÍSTICAS ── */
  .stats-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .stats-panel {
    background: linear-gradient(160deg, #0a0404, #060202);
    border: 1px solid #3d1a0a;
    border-top: 2px solid #8b3010;
    width: 480px;
    padding: 24px;
    font-family: 'Courier New', monospace;
    position: relative;
    box-shadow: 0 0 40px rgba(139, 48, 16, 0.3), inset 0 0 60px rgba(0, 0, 0, 0.5);
  }

  .stats-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .stats-title {
    font-size: 0.78rem;
    color: #cc4400;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-shadow: 0 0 8px rgba(200, 68, 0, 0.7);
  }

  .stats-close {
    background: transparent;
    border: 1px solid #3d1a0a;
    color: #664422;
    font-family: 'Courier New', monospace;
    font-size: 0.65rem;
    padding: 4px 8px;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.2s;
  }
  .stats-close:hover { color: #cc4400; border-color: #8b3010; }

  .stats-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139, 48, 16, 0.6), transparent);
    margin: 10px 0;
  }
  .stats-divider--thin { margin: 6px 0; opacity: 0.5; }

  .stats-alias-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }
  .stats-label { font-size: 0.62rem; color: #664422; letter-spacing: 2px; }
  .stats-alias {
    font-size: 0.88rem;
    color: #ff6633;
    text-shadow: 0 0 8px rgba(255, 100, 50, 0.6);
    letter-spacing: 2px;
    cursor: pointer;
    flex: 1;
  }
  .stats-alias-input {
    flex: 1;
    background: #050202;
    border: 1px solid #8b3010;
    color: #ff5500;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    padding: 3px 8px;
    letter-spacing: 2px;
    outline: none;
  }
  .stats-edit-btn {
    background: transparent;
    border: 1px solid #3d1a0a;
    color: #664422;
    font-size: 0.7rem;
    padding: 2px 6px;
    cursor: pointer;
    transition: color 0.2s;
  }
  .stats-edit-btn:hover { color: #cc4400; }

  .stats-section { margin: 4px 0; }
  .stats-section-title {
    font-size: 0.65rem;
    color: #8b3010;
    letter-spacing: 2px;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .stats-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
    background: rgba(20, 8, 4, 0.7);
    border: 1px solid rgba(61, 26, 10, 0.6);
    padding: 8px 10px;
    border-radius: 2px;
  }
  .stats-item-label { font-size: 0.52rem; color: #664422; letter-spacing: 1px; }
  .stats-item-val {
    font-size: 1rem;
    color: #cc4400;
    text-shadow: 0 0 6px rgba(200, 68, 0, 0.5);
    letter-spacing: 1px;
  }
  .stats-item-val--win { color: #44cc44; text-shadow: 0 0 6px rgba(68, 200, 68, 0.5); }
  .stats-item-val--loss { color: #cc4444; text-shadow: 0 0 6px rgba(200, 68, 68, 0.5); }

  .stats-progress-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 8px 0 4px;
  }
  .stats-progress-bar {
    flex: 1;
    height: 6px;
    background: rgba(61, 26, 10, 0.5);
    border: 1px solid rgba(139, 48, 16, 0.4);
    border-radius: 2px;
    overflow: hidden;
  }
  .stats-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #8b3010, #ff6633);
    box-shadow: 0 0 8px rgba(255, 100, 50, 0.5);
    transition: width 0.5s ease;
  }

  .stats-reset-btn {
    width: 100%;
    background: rgba(30, 8, 4, 0.8);
    border: 1px solid rgba(80, 20, 10, 0.5);
    color: #553322;
    font-family: 'Courier New', monospace;
    font-size: 0.6rem;
    letter-spacing: 2px;
    padding: 6px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
    margin-top: 4px;
  }
  .stats-reset-btn:hover { color: #cc3311; border-color: #8b2010; }

  .stats-modal-enter-active { transition: all 0.25s ease; }
  .stats-modal-leave-active { transition: all 0.2s ease; }
  .stats-modal-enter-from, .stats-modal-leave-to { opacity: 0; transform: scale(0.96); }

  @keyframes flicker {
    0%, 89%, 91%, 93%, 100% { opacity: 1; }
    90%, 92% { opacity: 0.4; }
=======
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
      opacity: 0.4;
    }
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }
</style>
