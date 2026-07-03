<template>
  <div class="viewport">
    <div class="scene" :style="sceneStyle">
<<<<<<< HEAD
      <!-- FONDO -->
      <img class="layer" src="@/assets/Images/bg-menu.png" draggable="false" />

      <!-- BOTÓN MUTE (esquina superior derecha dentro de la escena) -->
      <button class="mute-btn" @click="toggleMute" :title="isMuted ? 'Activar sonido' : 'Silenciar'">
        <span class="mute-icon">{{ isMuted ? '🔇' : '🔊' }}</span>
        <span class="mute-label">{{ isMuted ? 'MUTE' : 'AUDIO' }}</span>
      </button>

      <!-- INDICADOR DE PERFIL (esquina superior izquierda) -->
      <div class="profile-indicator" @click="showProfile = true">
        <span class="profile-avatar">{{ currentProfile ? currentProfile.alias[0] : '?' }}</span>
        <div class="profile-info">
          <span class="profile-name">{{ currentProfile ? currentProfile.alias : 'SIN PERFIL' }}</span>
          <span class="profile-sub">{{ currentProfile ? `${currentProfile.wins}V / ${currentProfile.losses}D` : 'CLICK PARA INGRESAR' }}</span>
        </div>
      </div>

      <!-- BOTONES DEL MENÚ -->
=======
      <!-- ── FONDO ── -->
      <img class="layer" src="@/assets/Images/bg-menu.png" draggable="false" />

      <!-- ── BOTONES ── -->
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
      <button class="menu-btn menu-btn--1" @click="goToGame" @mouseenter="playHover">
        <img src="@/assets/Images/btn-nuevo-contrato.png" draggable="false" />
        <span>NUEVO CONTRATO</span>
      </button>

      <button class="menu-btn menu-btn--2" @click="goToRules" @mouseenter="playHover">
        <img src="@/assets/Images/btn-reglamentos.png" draggable="false" />
        <span>REGLAMENTOS DE LA CÁBALA</span>
      </button>

<<<<<<< HEAD
      <button class="menu-btn menu-btn--3" @click="showProfile = true" @mouseenter="playHover">
        <img src="@/assets/Images/btn-opciones.png" draggable="false" />
        <span>PERFIL</span>
=======
      <button class="menu-btn menu-btn--3" @click="goToOptions" @mouseenter="playHover">
        <img src="@/assets/Images/btn-opciones.png" draggable="false" />
        <span>OPCIONES</span>
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
      </button>

      <button class="menu-btn menu-btn--4" @click="salir" @mouseenter="playHover">
        <img src="@/assets/Images/btn-salir.png" draggable="false" />
        <span>SALIR</span>
      </button>
    </div>

<<<<<<< HEAD
    <!-- OVERLAY GLITCH -->
=======
    <!-- ── OVERLAY GLITCH ── -->
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    <div v-if="isGlitching" class="glitch-overlay">
      <div v-for="n in 8" :key="n" class="glitch-bar" :style="barStyle(n)"></div>
      <div class="glitch-scanline"></div>
      <div class="glitch-text">INICIANDO PACTO...</div>
      <div class="glitch-noise"></div>
    </div>

<<<<<<< HEAD
    <!-- ═══════════════════════════════════════
         MODAL: PERFIL / LOGIN / REGISTRO
    ════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showProfile" class="modal-overlay" @click.self="showProfile = false">
          <div class="profile-panel">
            <div class="profile-panel__header">
              <span class="profile-panel__title">// ARCHIVO PERSONAL //</span>
              <button class="profile-panel__close" @click="showProfile = false">✕</button>
            </div>
            <div class="profile-panel__divider"></div>

            <!-- Si hay perfil activo: mostrar datos + opción de cerrar sesión -->
            <template v-if="currentProfile">
              <div class="profile-active">
                <div class="profile-active__avatar">{{ currentProfile.alias[0] }}</div>
                <div class="profile-active__info">
                  <span class="profile-active__alias">{{ currentProfile.alias }}</span>
                  <span class="profile-active__sub">JUGADOR IDENTIFICADO</span>
                </div>
              </div>

              <div class="profile-panel__divider profile-panel__divider--thin"></div>

              <div class="stats-grid">
                <div class="stat-box">
                  <span class="stat-label">VICTORIAS</span>
                  <span class="stat-val stat-val--win">{{ currentProfile.wins }}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">DERROTAS</span>
                  <span class="stat-val stat-val--loss">{{ currentProfile.losses }}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">PARTIDAS</span>
                  <span class="stat-val">{{ currentProfile.gamesPlayed }}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">MAYOR SALDO</span>
                  <span class="stat-val">{{ currentProfile.maxMoney }} $</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">WIN RATE</span>
                  <span class="stat-val">
                    {{ (currentProfile.wins + currentProfile.losses) > 0
                      ? ((currentProfile.wins / (currentProfile.wins + currentProfile.losses)) * 100).toFixed(1) + '%'
                      : '—' }}
                  </span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">RATIO</span>
                  <span class="stat-val">
                    {{ currentProfile.losses > 0
                      ? (currentProfile.wins / currentProfile.losses).toFixed(2)
                      : '∞' }}
                  </span>
                </div>
              </div>

              <div class="profile-panel__divider profile-panel__divider--thin"></div>

              <!-- Lista de perfiles guardados -->
              <div class="profiles-list-section">
                <p class="profiles-list-title">▌ CAMBIAR JUGADOR</p>
                <div class="profiles-list">
                  <button
                    v-for="p in profiles"
                    :key="p.alias"
                    class="profile-list-item"
                    :class="{ 'profile-list-item--active': p.alias === currentProfile.alias }"
                    @click="switchProfile(p)"
                  >
                    <span class="pli-avatar">{{ p.alias[0] }}</span>
                    <span class="pli-name">{{ p.alias }}</span>
                    <span class="pli-stats">{{ p.wins }}V / {{ p.losses }}D</span>
                    <button class="pli-delete" @click.stop="deleteProfile(p.alias)" title="Eliminar">✕</button>
                  </button>
                </div>
              </div>

              <div class="profile-panel__divider profile-panel__divider--thin"></div>

              <div class="profile-actions">
                <button class="action-btn action-btn--new" @click="profileView = 'register'">+ NUEVO JUGADOR</button>
                <button class="action-btn action-btn--logout" @click="logout">CERRAR SESIÓN</button>
              </div>
            </template>

            <!-- Sin perfil activo: tabs LOGIN / REGISTRO -->
            <template v-else>
              <div class="auth-tabs">
                <button
                  class="auth-tab"
                  :class="{ 'auth-tab--active': profileView === 'login' }"
                  @click="profileView = 'login'"
                >INGRESAR</button>
                <button
                  class="auth-tab"
                  :class="{ 'auth-tab--active': profileView === 'register' }"
                  @click="profileView = 'register'"
                >NUEVO PERFIL</button>
              </div>

              <!-- LOGIN -->
              <div v-if="profileView === 'login'" class="auth-form">
                <p class="auth-form__label">SELECCIONA TU PERFIL</p>
                <div class="profiles-list" v-if="profiles.length > 0">
                  <button
                    v-for="p in profiles"
                    :key="p.alias"
                    class="profile-list-item"
                    @click="login(p)"
                  >
                    <span class="pli-avatar">{{ p.alias[0] }}</span>
                    <span class="pli-name">{{ p.alias }}</span>
                    <span class="pli-stats">{{ p.wins }}V / {{ p.losses }}D</span>
                    <button class="pli-delete" @click.stop="deleteProfile(p.alias)" title="Eliminar">✕</button>
                  </button>
                </div>
                <p v-else class="auth-empty">No hay perfiles guardados.<br/>Crea uno nuevo.</p>
              </div>

              <!-- REGISTRO -->
              <div v-if="profileView === 'register'" class="auth-form">
                <p class="auth-form__label">NOMBRE / ALIAS</p>
                <input
                  v-model="newAlias"
                  class="auth-input"
                  placeholder="ESCRIBE TU ALIAS..."
                  maxlength="16"
                  @keyup.enter="register"
                />
                <p v-if="registerError" class="auth-error">{{ registerError }}</p>
                <button class="action-btn action-btn--register" @click="register">CREAR PERFIL</button>
              </div>
            </template>

            <!-- Nuevo jugador (desde perfil activo) -->
            <template v-if="currentProfile && profileView === 'register'">
              <div class="auth-form">
                <p class="auth-form__label">NOMBRE DEL NUEVO JUGADOR</p>
                <input
                  v-model="newAlias"
                  class="auth-input"
                  placeholder="ALIAS..."
                  maxlength="16"
                  @keyup.enter="register"
                />
                <p v-if="registerError" class="auth-error">{{ registerError }}</p>
                <div class="profile-actions">
                  <button class="action-btn action-btn--new" @click="register">CREAR</button>
                  <button class="action-btn action-btn--logout" @click="profileView = 'list'">CANCELAR</button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL REGLAMENTOS -->
=======
    <!-- ── MODAL REGLAMENTOS ── -->
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
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
<<<<<<< HEAD
            <div class="rules-divider"></div>
            <div class="rules-body">
              <section class="rules-section">
                <h2 class="rules-section-title">▌ OBJETIVO</h2>
                <p class="rules-text">Conseguir una mano con valor lo más cercano posible a <strong class="hl">21</strong> sin pasarse, superando al Crupier. El primero que acumule <strong class="hl">5 victorias</strong> gana la serie.</p>
              </section>
              <div class="rules-divider rules-divider--thin"></div>
              <section class="rules-section">
                <h2 class="rules-section-title">▌ VALOR DE LAS CARTAS</h2>
                <div class="rules-cards-grid">
                  <div class="rules-card-item"><span class="rules-card-label">2 — 10</span><span class="rules-card-val">Valor nominal</span></div>
                  <div class="rules-card-item"><span class="rules-card-label">J / Q / K</span><span class="rules-card-val">10 puntos</span></div>
                  <div class="rules-card-item"><span class="rules-card-label">A (As)</span><span class="rules-card-val">11 pts (o 1 si te pasas)</span></div>
                </div>
              </section>
              <div class="rules-divider rules-divider--thin"></div>
              <section class="rules-section">
                <h2 class="rules-section-title">▌ CÓMO SE JUEGA UN TURNO</h2>
                <ol class="rules-list">
                  <li><span class="rules-step">01</span> <strong class="hl">APOSTAR O NEGAR</strong> — Elige cuánto arriesgar (mínimo 50 $) o niega la apuesta para jugar sin fichas.</li>
                  <li><span class="rules-step">02</span> <strong class="hl">TU TURNO</strong> — Pedir carta o Plantarte. También puedes usar objetos.</li>
                  <li><span class="rules-step">03</span> <strong class="hl">TURNO DEL CRUPIER</strong> — Roba automáticamente hasta tener 17 o más.</li>
                  <li><span class="rules-step">04</span> <strong class="hl">RESULTADO</strong> — Gana quien esté más cerca de 21 sin pasarse.</li>
                </ol>
              </section>
              <div class="rules-divider rules-divider--thin"></div>
              <section class="rules-section">
                <h2 class="rules-section-title">▌ OBJETOS</h2>
                <div class="rules-objetos-grid">
                  <div class="rules-objeto"><span class="rules-objeto-name">🔫 PISTOLA</span><span class="rules-objeto-desc">Añade ±5 puntos. 50% de chance de invertir el efecto.</span></div>
                  <div class="rules-objeto"><span class="rules-objeto-name">🃏 COMODÍN</span><span class="rules-objeto-desc">Suma o resta un valor aleatorio (1–13).</span></div>
                  <div class="rules-objeto"><span class="rules-objeto-name">🍷 COPA</span><span class="rules-objeto-desc">Devuelve tu última carta al mazo.</span></div>
                  <div class="rules-objeto premium-obj"><span class="rules-objeto-name">💉 JERINGA <span class="premium-tag">PREMIUM</span></span><span class="rules-objeto-desc">Congela al Crupier un turno.</span></div>
                  <div class="rules-objeto premium-obj"><span class="rules-objeto-name">🔥 ENCENDEDOR <span class="premium-tag">PREMIUM</span></span><span class="rules-objeto-desc">Quema tu carta más perjudicial.</span></div>
                  <div class="rules-objeto premium-obj"><span class="rules-objeto-name">🌑 PURO <span class="premium-tag">PREMIUM</span></span><span class="rules-objeto-desc">Revela la carta oculta del Crupier.</span></div>
                </div>
              </section>
            </div>
=======

            <div class="rules-divider"></div>

            <div class="rules-body">
              <!-- OBJETIVO -->
              <section class="rules-section">
                <h2 class="rules-section-title">▌ OBJETIVO</h2>
                <p class="rules-text">
                  Conseguir una mano con valor lo más cercano posible a
                  <strong class="hl">21</strong> sin pasarse, superando al Crupier. El primero que acumule <strong class="hl">5 victorias</strong> gana la serie. Si el Crupier llega a 5 victorias
                  antes, perderás y comenzará una nueva partida desde cero.
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
                  <li>
                    <span class="rules-step">01</span> <strong class="hl">APOSTAR O NEGAR</strong> — Elige cuánto arriesgar (mínimo 50 $) o niega la apuesta para jugar sin fichas.
                    <em>Si niegas, los objetos quedan bloqueados ese turno.</em>
                  </li>
                  <li>
                    <span class="rules-step">02</span> <strong class="hl">TU TURNO</strong> — Puedes <strong>Pedir carta</strong> (sumar una carta a tu mano) o <strong>Plantarte</strong> (quedarte con
                    lo que tienes). También puedes usar objetos antes de decidir.
                  </li>
                  <li>
                    <span class="rules-step">03</span>
                    <strong class="hl">TURNO DEL CRUPIER</strong> — El Crupier roba automáticamente hasta tener 17 o más puntos, y entonces se planta.
                  </li>
                  <li>
                    <span class="rules-step">04</span> <strong class="hl">RESULTADO</strong> — Gana quien esté más cerca de 21 sin pasarse. Si ambos se pasan, gana el que tenga el puntaje menor.
                  </li>
                  <li>
                    <span class="rules-step">05</span> <strong class="hl">SIGUIENTE TURNO</strong> — Recibes 25 $ al inicio de cada nuevo turno. También pueden aparecer cargas de objetos como bonus
                    aleatorio.
                  </li>
                </ol>
              </section>

              <div class="rules-divider rules-divider--thin"></div>

              <!-- APUESTAS -->
              <section class="rules-section">
                <h2 class="rules-section-title">▌ APUESTAS Y DINERO</h2>
                <p class="rules-text">
                  Al apostar, tu dinero <strong class="hl">y</strong> el del Crupier (fondos ilimitados) entran al pozo. Si ganas, te llevas el pozo completo. Si empatas, recuperas tu apuesta. Si
                  pierdes, el Crupier se lleva todo. Al inicio de cada turno de apuestas recibes <strong class="hl">+25 $</strong> automáticamente. Si bajas de 50 $, el juego te completa hasta el
                  mínimo para que siempre puedas jugar.
                </p>
              </section>

              <div class="rules-divider rules-divider--thin"></div>

              <!-- OBJETOS -->
              <section class="rules-section">
                <h2 class="rules-section-title">▌ OBJETOS</h2>
                <p class="rules-text rules-text--small">
                  Los objetos se usan durante <strong class="hl">tu turno</strong> (excepto si negaste la apuesta). Se compran en la <strong class="hl">TIENDA</strong> con tus fichas, y también pueden
                  aparecer como bonus al final de cada turno. Los objetos <strong class="hl">PREMIUM</strong> requieren desbloqueo previo (1000 $) antes de poder comprarse.
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

>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
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
<<<<<<< HEAD
  const showProfile = ref(false)
  const profileView = ref('login') // 'login' | 'register' | 'list'

  // ── AUDIO ──
  let audioCtx = null
  let bgNodes = []
  let masterGain = null
  const isMuted = ref(false)
=======

  // ── WEB AUDIO ──
  let audioCtx = null
  let bgNodes = []
  let masterGain = null
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5

  function getCtx() {
    if (!audioCtx) audioCtx = new AudioContext()
    return audioCtx
  }

<<<<<<< HEAD
  function toggleMute() {
    isMuted.value = !isMuted.value
    if (masterGain) {
      masterGain.gain.setTargetAtTime(isMuted.value ? 0 : 0.008, audioCtx.currentTime, 0.1)
    }
    // Guardar preferencia
    localStorage.setItem('audioMuted', isMuted.value ? '1' : '0')
    // Notificar al juego también
    window.dispatchEvent(new CustomEvent('game-mute-toggle', { detail: { muted: isMuted.value } }))
  }

  function startBg() {
    if (bgNodes.length > 0) return
    const ctx = getCtx()
    masterGain = ctx.createGain()
    masterGain.gain.value = isMuted.value ? 0 : 0.008
    masterGain.connect(ctx.destination)
=======
  function startBg() {
    if (bgNodes.length > 0) return
    const ctx = getCtx()

    masterGain = ctx.createGain()
    masterGain.gain.value = 0.008
    masterGain.connect(ctx.destination)

>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    const layers = [
      { freq: 55, type: 'sawtooth', vol: 0.015, lfoFreq: 0.3 },
      { freq: 82, type: 'sawtooth', vol: 0.01, lfoFreq: 0.5 },
      { freq: 110, type: 'sine', vol: 0.02, lfoFreq: 0.2 },
      { freq: 165, type: 'triangle', vol: 0.008, lfoFreq: 0.7 },
    ]
<<<<<<< HEAD
=======

>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    layers.forEach(({ freq, type, vol, lfoFreq }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
<<<<<<< HEAD
=======

>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
      lfo.frequency.value = lfoFreq
      lfoGain.gain.value = vol * 0.5
      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)
<<<<<<< HEAD
      osc.type = type
      osc.frequency.value = freq
      gain.gain.value = vol
      osc.connect(gain)
      gain.connect(masterGain)
      osc.start(); lfo.start()
=======

      osc.type = type
      osc.frequency.value = freq
      gain.gain.value = vol

      osc.connect(gain)
      gain.connect(masterGain)
      osc.start()
      lfo.start()
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
      bgNodes.push(osc, lfo)
    })
  }

  function stopBg() {
<<<<<<< HEAD
    bgNodes.forEach((n) => { try { n.stop() } catch {} })
    bgNodes = []
  }

  function muteBg() { if (masterGain) masterGain.gain.value = 0 }
  function unmuteBg() { if (masterGain && !isMuted.value) masterGain.gain.value = 0.008 }

  function playHover() {
    const ctx = getCtx()
    if (isMuted.value) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'; osc.frequency.value = 400
    gain.gain.setValueAtTime(0.03, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + 0.08)
=======
    bgNodes.forEach((n) => {
      try {
        n.stop()
      } catch {}
    })
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
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }

  function playGlitch() {
    const ctx = getCtx()
    const duration = 0.04
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
<<<<<<< HEAD
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3
=======
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3
    }
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
<<<<<<< HEAD
    noise.connect(gain); gain.connect(ctx.destination)
    noise.start(); noise.stop(ctx.currentTime + duration)
=======
    noise.connect(gain)
    gain.connect(ctx.destination)
    noise.start()
    noise.stop(ctx.currentTime + duration)

>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    const osc = ctx.createOscillator()
    const gainOsc = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(80, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3)
    gainOsc.gain.setValueAtTime(0.15, ctx.currentTime)
    gainOsc.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
<<<<<<< HEAD
    osc.connect(gainOsc); gainOsc.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + duration)
  }

  async function glitchTo(path) {
    muteBg(); playGlitch()
=======
    osc.connect(gainOsc)
    gainOsc.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  }

  async function glitchTo(path) {
    muteBg()
    playGlitch()
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    isGlitching.value = true
    await new Promise((r) => setTimeout(r, 700))
    unmuteBg()
    await router.push(path)
    isGlitching.value = false
  }

<<<<<<< HEAD
  // ── PERFILES ──
  const profiles = ref([])
  const currentProfile = ref(null)
  const newAlias = ref('')
  const registerError = ref('')

  function loadProfiles() {
    const raw = localStorage.getItem('gameProfiles')
    profiles.value = raw ? JSON.parse(raw) : []
    const activeAlias = localStorage.getItem('activeProfile')
    if (activeAlias) {
      currentProfile.value = profiles.value.find(p => p.alias === activeAlias) || null
    }
  }

  function saveProfiles() {
    localStorage.setItem('gameProfiles', JSON.stringify(profiles.value))
  }

  function login(profile) {
    currentProfile.value = profile
    localStorage.setItem('activeProfile', profile.alias)
    profileView.value = 'list'
  }

  function logout() {
    currentProfile.value = null
    localStorage.removeItem('activeProfile')
    profileView.value = 'login'
  }

  function switchProfile(profile) {
    login(profile)
  }

  function register() {
    registerError.value = ''
    const alias = newAlias.value.trim().toUpperCase()
    if (!alias) { registerError.value = 'DEBES INGRESAR UN ALIAS'; return }
    if (alias.length < 2) { registerError.value = 'MÍNIMO 2 CARACTERES'; return }
    if (profiles.value.find(p => p.alias === alias)) { registerError.value = 'ESE ALIAS YA EXISTE'; return }
    const newProfile = { alias, wins: 0, losses: 0, gamesPlayed: 0, maxMoney: 1000 }
    profiles.value.push(newProfile)
    saveProfiles()
    newAlias.value = ''
    login(newProfile)
  }

  function deleteProfile(alias) {
    if (!confirm(`¿Eliminar perfil "${alias}"?`)) return
    profiles.value = profiles.value.filter(p => p.alias !== alias)
    saveProfiles()
    if (currentProfile.value?.alias === alias) logout()
  }

  // ── ESCALA ──
=======
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  const SCENE_W = 1360
  const SCENE_H = 704
  const scale = ref(1)

  function updateScale() {
<<<<<<< HEAD
    scale.value = Math.min(window.innerWidth / SCENE_W, window.innerHeight / SCENE_H)
  }

  function onKeydown(e) {
    if (e.key === 'Escape') { showRules.value = false; showProfile.value = false }
=======
    const scaleX = window.innerWidth / SCENE_W
    const scaleY = window.innerHeight / SCENE_H
    scale.value = Math.min(scaleX, scaleY)
  }

  function onKeydown(e) {
    if (e.key === 'Escape') showRules.value = false
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }

  onMounted(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
    window.addEventListener('keydown', onKeydown)
    document.addEventListener('mousemove', startBg, { once: true })
<<<<<<< HEAD
    // Restaurar preferencia de mute
    isMuted.value = localStorage.getItem('audioMuted') === '1'
    loadProfiles()
=======
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
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
<<<<<<< HEAD
    return {
      top: `${top}%`, height: `${height}%`,
      transform: `translateX(${offset}px)`,
      animationDelay: `${Math.random() * 0.3}s`,
      background: Math.random() > 0.5
        ? `rgba(180,0,0,${Math.random() * 0.6 + 0.2})`
        : `rgba(0,0,0,${Math.random() * 0.8 + 0.2})`,
    }
  }

  function goToGame() { glitchTo('/juego') }
  function goToRules() { showRules.value = true }
  function salir() { window.close() }
=======
    const delay = Math.random() * 0.3
    return {
      top: `${top}%`,
      height: `${height}%`,
      transform: `translateX(${offset}px)`,
      animationDelay: `${delay}s`,
      background: Math.random() > 0.5 ? `rgba(180,0,0,${Math.random() * 0.6 + 0.2})` : `rgba(0,0,0,${Math.random() * 0.8 + 0.2})`,
    }
  }

  function goToGame() {
    glitchTo('/juego')
  }
  function goToRules() {
    showRules.value = true
  }
  function goToOptions() {
    alert('Próximamente')
  }
  function salir() {
    window.close()
  }
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
</script>

<style scoped>
  .viewport {
<<<<<<< HEAD
    width: 100vw; height: 100vh;
    overflow: hidden; background: #000; position: relative;
=======
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #000;
    position: relative;
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
  }

  .scene {
    position: absolute;
<<<<<<< HEAD
    width: 1360px; height: 704px;
  }

  .layer {
    position: absolute; top: 0; left: 0;
    width: 1360px; height: 704px;
    display: block; user-select: none; pointer-events: none;
  }

  /* ── BOTÓN MUTE ── */
  .mute-btn {
    position: absolute;
    top: 18px; right: 20px;
    display: flex; align-items: center; gap: 6px;
    background: rgba(4, 2, 1, 0.82);
    border: 1px solid rgba(180, 40, 0, 0.45);
    color: #884422;
    font-family: 'Courier New', monospace;
    font-size: 0.6rem;
    letter-spacing: 2px;
    padding: 6px 12px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
    z-index: 10;
  }

  .mute-btn:hover {
    background: rgba(20, 6, 2, 0.95);
    border-color: rgba(255, 80, 0, 0.7);
    color: #ff5500;
    box-shadow: 0 0 10px rgba(255, 80, 0, 0.3);
  }

  .mute-icon { font-size: 0.9rem; }
  .mute-label { font-size: 0.52rem; letter-spacing: 2px; }

  /* ── INDICADOR DE PERFIL ── */
  .profile-indicator {
    position: absolute;
    top: 18px; left: 20px;
    display: flex; align-items: center; gap: 10px;
    background: rgba(4, 2, 1, 0.82);
    border: 1px solid rgba(180, 40, 0, 0.45);
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 10;
  }

  .profile-indicator:hover {
    border-color: rgba(255, 80, 0, 0.7);
    box-shadow: 0 0 10px rgba(255, 80, 0, 0.25);
  }

  .profile-avatar {
    width: 28px; height: 28px;
    background: rgba(100, 20, 0, 0.8);
    border: 1px solid rgba(200, 50, 0, 0.5);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    color: #ff5500;
    text-shadow: 0 0 6px rgba(255, 85, 0, 0.7);
    font-weight: bold;
    flex-shrink: 0;
  }

  .profile-info {
    display: flex; flex-direction: column; gap: 2px;
  }

  .profile-name {
    font-family: 'Courier New', monospace;
    font-size: 0.68rem;
    color: #dd4400;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-shadow: 0 0 6px rgba(220, 68, 0, 0.6);
  }

  .profile-sub {
    font-family: 'Courier New', monospace;
    font-size: 0.5rem;
    color: #664422;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* ── BOTONES MENÚ ── */
  .menu-btn {
    position: absolute; background: transparent; border: none;
    cursor: pointer; padding: 0;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.15s, filter 0.15s;
  }

  .menu-btn img {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    display: block; pointer-events: none;
  }

  .menu-btn span {
    position: relative; z-index: 1;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1rem; font-weight: bold;
    color: #ff3030;
    text-shadow: 0 0 8px rgba(255,48,48,0.9), 0 0 20px rgba(255,48,48,0.4);
    letter-spacing: 3px; text-transform: uppercase;
    pointer-events: none; animation: flicker 4s infinite;
  }

  .menu-btn:hover { transform: scale(1.04); filter: brightness(1.3); }
  .menu-btn:active { transform: scale(0.97); }

  .menu-btn--1 { left: 512px; top: 288px; width: 336px; height: 56px; }
  .menu-btn--2 { left: 512px; top: 358px; width: 337px; height: 53px; }
  .menu-btn--3 { left: 512px; top: 425px; width: 337px; height: 61px; }
  .menu-btn--4 { left: 512px; top: 500px; width: 338px; height: 58px; }

  /* ── GLITCH ── */
  .glitch-overlay {
    position: fixed; inset: 0; z-index: 999; background: #000;
    animation: glitchFadeIn 0.7s ease-out forwards; overflow: hidden;
  }
  .glitch-bar { position: absolute; left: 0; width: 100%; animation: glitchBar 0.15s infinite alternate; mix-blend-mode: screen; }
  .glitch-scanline { position: absolute; left: 0; width: 100%; height: 3px; background: rgba(255,30,30,0.6); box-shadow: 0 0 12px rgba(255,30,30,0.8); animation: scanlineDown 0.7s linear forwards; }
  .glitch-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-family: 'Courier New', monospace; font-size: 1.4rem; color: #ff2020; letter-spacing: 6px; text-transform: uppercase; text-shadow: 0 0 10px rgba(255,32,32,1), 0 0 30px rgba(255,32,32,0.6), 4px 0 rgba(0,255,255,0.4), -4px 0 rgba(255,0,255,0.4); animation: glitchText 0.1s infinite alternate; }
  .glitch-noise { position: absolute; inset: 0; opacity: 0.15; animation: noiseShift 0.05s infinite; pointer-events: none; }

  /* ── MODAL PERFIL ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.88);
    display: flex; align-items: center; justify-content: center;
    z-index: 300;
  }

  .profile-panel {
    background: linear-gradient(160deg, #0a0404, #060202);
    border: 1px solid #3d1a0a;
    border-top: 2px solid #8b3010;
    width: 500px;
    max-width: 96vw;
    max-height: 85vh;
    overflow-y: auto;
    padding: 24px 28px;
    font-family: 'Courier New', monospace;
    box-shadow: 0 0 50px rgba(139,48,16,0.35), inset 0 0 40px rgba(0,0,0,0.5);
=======
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
    transition:
      transform 0.15s,
      filter 0.15s;
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
    text-shadow:
      0 0 8px rgba(255, 48, 48, 0.9),
      0 0 20px rgba(255, 48, 48, 0.4);
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

  .menu-btn--1 {
    left: 512px;
    top: 288px;
    width: 336px;
    height: 56px;
  }
  .menu-btn--2 {
    left: 512px;
    top: 358px;
    width: 337px;
    height: 53px;
  }
  .menu-btn--3 {
    left: 512px;
    top: 425px;
    width: 337px;
    height: 61px;
  }
  .menu-btn--4 {
    left: 512px;
    top: 500px;
    width: 338px;
    height: 58px;
  }

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
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
    scrollbar-width: thin;
    scrollbar-color: #5a1000 #0a0202;
  }

<<<<<<< HEAD
  .profile-panel__header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 10px;
  }

  .profile-panel__title {
    font-size: 0.8rem; color: #cc4400;
    letter-spacing: 3px; text-transform: uppercase;
    text-shadow: 0 0 8px rgba(200,68,0,0.7);
  }

  .profile-panel__close {
    background: transparent; border: 1px solid #3d1a0a;
    color: #664422; font-family: 'Courier New', monospace;
    font-size: 0.65rem; padding: 4px 8px; cursor: pointer;
    letter-spacing: 1px; transition: all 0.2s;
  }
  .profile-panel__close:hover { color: #cc4400; border-color: #8b3010; }

  .profile-panel__divider {
    width: 100%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,48,16,0.6), transparent);
    margin: 10px 0;
  }
  .profile-panel__divider--thin { margin: 6px 0; opacity: 0.4; }

  /* Perfil activo */
  .profile-active {
    display: flex; align-items: center; gap: 14px;
    padding: 8px 0;
  }

  .profile-active__avatar {
    width: 48px; height: 48px;
    background: rgba(100,20,0,0.8);
    border: 2px solid rgba(200,50,0,0.6);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; color: #ff5500;
    text-shadow: 0 0 10px rgba(255,85,0,0.7);
    font-weight: bold; flex-shrink: 0;
  }

  .profile-active__info { display: flex; flex-direction: column; gap: 3px; }

  .profile-active__alias {
    font-size: 1rem; color: #ff6633;
    letter-spacing: 3px; text-transform: uppercase;
    text-shadow: 0 0 8px rgba(255,100,50,0.5);
  }

  .profile-active__sub {
    font-size: 0.52rem; color: #664422; letter-spacing: 2px; text-transform: uppercase;
  }

  /* Grid de stats */
  .stats-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 8px; margin: 6px 0;
  }

  .stat-box {
    display: flex; flex-direction: column; gap: 3px;
    background: rgba(20,8,4,0.7); border: 1px solid rgba(61,26,10,0.6);
    padding: 8px 10px; border-radius: 2px;
  }
  .stat-label { font-size: 0.5rem; color: #664422; letter-spacing: 1px; }
  .stat-val { font-size: 1rem; color: #cc4400; letter-spacing: 1px; text-shadow: 0 0 6px rgba(200,68,0,0.4); }
  .stat-val--win { color: #44cc44; text-shadow: 0 0 6px rgba(68,200,68,0.4); }
  .stat-val--loss { color: #cc4444; text-shadow: 0 0 6px rgba(200,68,68,0.4); }

  /* Lista de perfiles */
  .profiles-list-section { margin: 6px 0; }
  .profiles-list-title { font-size: 0.6rem; color: #8b3010; letter-spacing: 2px; margin: 0 0 8px; text-transform: uppercase; }

  .profiles-list {
    display: flex; flex-direction: column; gap: 5px;
    max-height: 180px; overflow-y: auto;
  }

  .profile-list-item {
    display: flex; align-items: center; gap: 10px;
    background: rgba(15,5,2,0.7);
    border: 1px solid rgba(80,25,8,0.5);
    padding: 8px 12px; cursor: pointer;
    transition: all 0.15s; text-align: left;
    font-family: 'Courier New', monospace;
    color: #aa5533;
    width: 100%;
  }

  .profile-list-item:hover { border-color: rgba(200,80,20,0.7); background: rgba(30,10,4,0.85); color: #ff6633; }
  .profile-list-item--active { border-color: rgba(255,100,30,0.6); color: #ff6633; box-shadow: 0 0 8px rgba(255,100,30,0.2); }

  .pli-avatar {
    width: 26px; height: 26px;
    background: rgba(80,15,0,0.8); border: 1px solid rgba(160,40,0,0.5);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: bold; color: #ff5500; flex-shrink: 0;
  }

  .pli-name { flex: 1; font-size: 0.72rem; letter-spacing: 2px; text-transform: uppercase; }
  .pli-stats { font-size: 0.55rem; color: #664422; letter-spacing: 1px; flex-shrink: 0; }

  .pli-delete {
    background: transparent; border: none; color: #441100;
    font-size: 0.65rem; cursor: pointer; padding: 2px 5px;
    transition: color 0.2s; flex-shrink: 0;
  }
  .pli-delete:hover { color: #cc2200; }

  /* Auth form */
  .auth-tabs {
    display: flex; gap: 0; margin-bottom: 14px;
    border-bottom: 1px solid rgba(100,30,10,0.4);
  }

  .auth-tab {
    flex: 1; background: transparent;
    border: none; border-bottom: 2px solid transparent;
    color: #553322; font-family: 'Courier New', monospace;
    font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase;
    padding: 8px; cursor: pointer; transition: all 0.2s;
    margin-bottom: -1px;
  }
  .auth-tab--active { color: #ff5500; border-bottom-color: #ff5500; }
  .auth-tab:hover:not(.auth-tab--active) { color: #aa4422; }

  .auth-form { display: flex; flex-direction: column; gap: 12px; padding: 4px 0; }
  .auth-form__label { font-size: 0.6rem; color: #664422; letter-spacing: 3px; text-transform: uppercase; margin: 0; }

  .auth-input {
    background: #050202; border: 1px solid #8b3010;
    color: #ff5500; font-family: 'Courier New', monospace;
    font-size: 0.85rem; padding: 10px 12px;
    letter-spacing: 3px; text-transform: uppercase; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .auth-input::placeholder { color: #332211; letter-spacing: 2px; }
  .auth-input:focus { border-color: #cc4400; box-shadow: 0 0 10px rgba(200,68,0,0.3); }

  .auth-error { font-size: 0.6rem; color: #cc2200; letter-spacing: 1px; margin: 0; text-transform: uppercase; }
  .auth-empty { font-size: 0.65rem; color: #553322; letter-spacing: 1px; text-align: center; line-height: 1.7; margin: 10px 0; }

  /* Acciones */
  .profile-actions { display: flex; gap: 8px; }

  .action-btn {
    flex: 1; font-family: 'Courier New', monospace;
    font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase;
    padding: 10px; border: none; cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    transition: all 0.15s;
  }
  .action-btn--new { background: #8b0000; color: #ffb0b0; border: 1px solid #cc1111; box-shadow: 0 0 8px rgba(180,20,20,0.4); }
  .action-btn--new:hover { background: #cc1111; box-shadow: 0 0 16px rgba(200,20,20,0.7); }
  .action-btn--logout { background: rgba(20,10,5,0.9); color: #554433; border: 1px solid #3d2010; }
  .action-btn--logout:hover { color: #aa6644; border-color: #5c3317; }
  .action-btn--register { width: 100%; background: #8b0000; color: #ffb0b0; border: 1px solid #cc1111; }
  .action-btn--register:hover { background: #cc1111; }

  /* ── MODAL REGLAMENTOS ── */
  .rules-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.88);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 20px; box-sizing: border-box;
  }

  .rules-panel {
    background: #070302; border: 1px solid rgba(180,30,0,0.5);
    box-shadow: 0 0 80px rgba(160,20,0,0.4), inset 0 0 60px rgba(0,0,0,0.9);
    width: 860px; max-width: 96vw; max-height: 90vh;
    overflow-y: auto; padding: 28px 36px 24px; box-sizing: border-box;
    font-family: 'Courier New', Courier, monospace;
    scrollbar-width: thin; scrollbar-color: #5a1000 #0a0202;
  }

  .rules-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 12px; }
  .rules-title-block { display: flex; flex-direction: column; gap: 4px; }
  .rules-title-line { font-size: 1.05rem; color: #cc2200; letter-spacing: 4px; text-transform: uppercase; text-shadow: 0 0 12px rgba(200,34,0,0.9); animation: flicker 5s infinite; }
  .rules-subtitle { font-size: 0.55rem; color: #5a2000; letter-spacing: 3px; text-transform: uppercase; }
  .rules-close { background: rgba(40,5,0,0.8); border: 1px solid rgba(180,30,0,0.5); color: #882200; font-family: 'Courier New', Courier, monospace; font-size: 0.75rem; letter-spacing: 2px; padding: 6px 14px; cursor: pointer; text-transform: uppercase; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; }
  .rules-close:hover { color: #ff4400; border-color: rgba(255,68,0,0.8); box-shadow: 0 0 10px rgba(255,68,0,0.3); background: rgba(80,10,0,0.9); }
  .rules-divider { width: 100%; height: 1px; background: linear-gradient(to right, transparent, rgba(180,40,0,0.6), transparent); margin: 12px 0; }
  .rules-divider--thin { opacity: 0.4; margin: 10px 0; }
  .rules-body { display: flex; flex-direction: column; gap: 6px; }
  .rules-section { display: flex; flex-direction: column; gap: 8px; }
  .rules-section-title { font-size: 0.72rem; color: #cc3300; letter-spacing: 4px; text-transform: uppercase; text-shadow: 0 0 8px rgba(200,51,0,0.7); margin: 0; font-weight: normal; }
  .rules-text { font-size: 0.78rem; color: #b08060; line-height: 1.7; margin: 0; letter-spacing: 0.3px; }
  .hl { color: #ff6030; text-shadow: 0 0 6px rgba(255,96,48,0.6); }
  .rules-cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .rules-card-item { display: flex; flex-direction: column; gap: 3px; background: rgba(20,5,0,0.6); border: 1px solid rgba(120,30,0,0.3); padding: 8px 12px; }
  .rules-card-label { font-size: 0.78rem; color: #ff4400; letter-spacing: 2px; }
  .rules-card-val { font-size: 0.65rem; color: #7a5040; letter-spacing: 1px; }
  .rules-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .rules-list li { font-size: 0.75rem; color: #a07050; line-height: 1.65; letter-spacing: 0.3px; padding-left: 34px; position: relative; }
  .rules-step { position: absolute; left: 0; top: 2px; font-size: 0.6rem; color: #882200; letter-spacing: 1px; width: 24px; text-align: right; }
  .rules-objetos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 4px; }
  .rules-objeto { display: flex; flex-direction: column; gap: 5px; background: rgba(15,4,0,0.7); border: 1px solid rgba(100,25,0,0.4); padding: 10px 12px; }
  .premium-obj { border-color: rgba(140,60,0,0.5); background: rgba(20,8,0,0.8); }
  .rules-objeto-name { font-size: 0.68rem; color: #cc3300; letter-spacing: 2px; text-transform: uppercase; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .premium-tag { font-size: 0.5rem; color: #ff8800; background: rgba(80,30,0,0.8); border: 1px solid rgba(180,80,0,0.5); padding: 1px 5px; letter-spacing: 1px; }
  .rules-objeto-desc { font-size: 0.62rem; color: #7a5035; line-height: 1.55; letter-spacing: 0.2px; }
  .rules-footer { font-size: 0.52rem; color: #441100; text-align: center; letter-spacing: 3px; text-transform: uppercase; margin: 0; padding-top: 4px; }

  /* Transiciones modales */
  .modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s, transform 0.25s; }
  .modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.96); }
  .rules-modal-enter-active, .rules-modal-leave-active { transition: opacity 0.25s, transform 0.25s; }
  .rules-modal-enter-from, .rules-modal-leave-to { opacity: 0; transform: scale(0.97); }

  /* Keyframes */
  @keyframes glitchFadeIn { 0%{opacity:0} 20%{opacity:1} 100%{opacity:1;background:#000} }
  @keyframes glitchBar { 0%{opacity:0.8;transform:translateX(0)} 50%{opacity:0.3;transform:translateX(-8px)} 100%{opacity:0.9;transform:translateX(6px)} }
  @keyframes scanlineDown { 0%{top:0%;opacity:1} 100%{top:100%;opacity:0.3} }
  @keyframes glitchText { 0%{text-shadow:4px 0 rgba(0,255,255,0.5),-4px 0 rgba(255,0,255,0.5),0 0 10px rgba(255,32,32,1);clip-path:inset(0 0 0 0)} 50%{clip-path:inset(20% 0 30% 0)} 100%{clip-path:inset(0 0 0 0)} }
  @keyframes noiseShift { 0%{transform:translate(0,0)} 50%{transform:translate(2px,-1px)} 100%{transform:translate(-1px,2px)} }
  @keyframes flicker { 0%,91%,93%,95%,100%{opacity:1} 92%,94%{opacity:0.55} }
=======
  .rules-panel::-webkit-scrollbar {
    width: 6px;
  }
  .rules-panel::-webkit-scrollbar-track {
    background: #0a0202;
  }
  .rules-panel::-webkit-scrollbar-thumb {
    background: #5a1000;
    border-radius: 2px;
  }

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
    transition:
      opacity 0.25s,
      transform 0.25s;
  }
  .rules-modal-enter-from,
  .rules-modal-leave-to {
    opacity: 0;
    transform: scale(0.97);
  }

  /* ── KEYFRAMES ── */
  @keyframes glitchFadeIn {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    85% {
      opacity: 1;
    }
    100% {
      opacity: 1;
      background: #000;
    }
  }

  @keyframes glitchBar {
    0% {
      opacity: 0.8;
      transform: translateX(0);
    }
    50% {
      opacity: 0.3;
      transform: translateX(-8px);
    }
    100% {
      opacity: 0.9;
      transform: translateX(6px);
    }
  }

  @keyframes scanlineDown {
    0% {
      top: 0%;
      opacity: 1;
    }
    100% {
      top: 100%;
      opacity: 0.3;
    }
  }

  @keyframes glitchText {
    0% {
      text-shadow:
        4px 0 rgba(0, 255, 255, 0.5),
        -4px 0 rgba(255, 0, 255, 0.5),
        0 0 10px rgba(255, 32, 32, 1);
      clip-path: inset(0 0 0 0);
    }
    25% {
      text-shadow:
        -6px 0 rgba(0, 255, 255, 0.5),
        6px 0 rgba(255, 0, 255, 0.5),
        0 0 20px rgba(255, 32, 32, 1);
      clip-path: inset(20% 0 30% 0);
    }
    50% {
      text-shadow:
        2px 0 rgba(0, 255, 255, 0.3),
        -2px 0 rgba(255, 0, 255, 0.3);
      clip-path: inset(0 0 0 0);
    }
    75% {
      text-shadow:
        -8px 0 rgba(0, 255, 255, 0.6),
        8px 0 rgba(255, 0, 255, 0.6);
      clip-path: inset(60% 0 10% 0);
    }
  }

  @keyframes noiseShift {
    0% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(-2px, 1px);
    }
    50% {
      transform: translate(2px, -1px);
    }
    75% {
      transform: translate(-1px, 2px);
    }
    100% {
      transform: translate(1px, -2px);
    }
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
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
</style>
