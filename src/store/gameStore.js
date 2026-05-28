// src/store/gameStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  const deck = ref([])
  const playerHand = ref([])
  const dealerHand = ref([])
  const playerScore = ref(0)
  const dealerScore = ref(0)
  const gameOver = ref(false)
  const winner = ref(null)
  const message = ref('')
  const playerStood = ref(false)

  const victoriasJugador = ref(0)
  const victoriasCrupier = ref(0)

  const dineroJugador = ref(1000)
  const dineroCrupier = ref(1000)
  const apuestaJugador = ref(0)
  const apuestaCrupier = ref(0)
  const apuestaMinima = ref(50)
  const jugadorNego = ref(false)
  const faseJuego = ref('apuestas')
  const turnoNumero = ref(1)
  const dealerStood = ref(false)

  const objetos = {
    pistola: { balas: ref(1) },
    comoDin: { disponible: ref(0) },
    copa: { cargas: ref(0) },
  }
  const ultimaCartaJugador = ref(null)
  const objetoMensaje = ref('')

  // Precios tienda
  const preciosTienda = {
    pistola: 100,
    comodin: 150,
    copa: 75,
  }

  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣']
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const newDeck = []
    for (const suit of suits) {
      for (const value of values) {
        newDeck.push({ value, suit, hidden: false })
      }
    }
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }
    return newDeck
  }

  const calcScore = (hand, countHidden = true) => {
    let score = 0
    let aces = 0
    const cardsToScore = countHidden ? hand : hand.filter((c) => !c.hidden)
    for (const card of cardsToScore) {
      if (card.value === 'A') {
        aces += 1
        score += 11
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        score += 10
      } else {
        score += parseInt(card.value)
      }
    }
    while (score > 21 && aces > 0) {
      score -= 10
      aces -= 1
    }
    return score
  }

  const drawCard = (hidden = false) => {
    if (!deck.value || deck.value.length === 0) return null
    const card = deck.value.pop()
    return { ...card, hidden }
  }

  const dealerVisibleScore = computed(() => calcScore(dealerHand.value, false))

  const cobrarApuesta = () => {
    const pot = (apuestaJugador.value || 0) + (apuestaCrupier.value || 0)
    if (pot === 0) return
    if (winner.value === 'player') {
      dineroJugador.value += pot
    } else if (winner.value === 'dealer') {
      dineroCrupier.value += pot
    } else if (winner.value === 'tie') {
      dineroJugador.value += apuestaJugador.value || 0
      dineroCrupier.value += apuestaCrupier.value || 0
    }
    apuestaJugador.value = 0
    apuestaCrupier.value = 0
  }

  const endGame = (gameWinner, gameMessage) => {
    winner.value = gameWinner
    cobrarApuesta()
    gameOver.value = true
    message.value = gameMessage
    faseJuego.value = 'resultado'
    dealerHand.value.forEach((card) => (card.hidden = false))
    playerScore.value = calcScore(playerHand.value)
    dealerScore.value = calcScore(dealerHand.value)
    if (gameWinner === 'player') victoriasJugador.value++
    if (gameWinner === 'dealer') victoriasCrupier.value++
  }

  const resolveGame = () => {
    const pScore = calcScore(playerHand.value)
    const dScore = calcScore(dealerHand.value)
    const pPaso = pScore > 21
    const dPaso = dScore > 21

    if (pPaso && dPaso) {
      if (pScore < dScore) {
        endGame('player', `Ambos se pasaron. Tu ${pScore} esta mas cerca de 21. Ganaste.`)
      } else if (dScore < pScore) {
        endGame(
          'dealer',
          `Ambos se pasaron. El crupier (${dScore}) esta mas cerca. Gana el crupier.`
        )
      } else {
        endGame('tie', `Ambos se pasaron con ${pScore}. Empate.`)
      }
    } else if (pPaso) {
      endGame('dealer', `Te pasaste de 21 (${pScore}). El crupier gana.`)
    } else if (dPaso) {
      endGame('player', `El crupier se paso de 21 (${dScore}). Ganaste con ${pScore}.`)
    } else {
      if (pScore > dScore) {
        endGame('player', `Ganaste. ${pScore} vs ${dScore}.`)
      } else if (dScore > pScore) {
        endGame('dealer', `El crupier gana. ${dScore} vs ${pScore}.`)
      } else {
        endGame('tie', `Empate. Ambos con ${pScore}.`)
      }
    }
  }

  const startGame = () => {
    deck.value = createDeck()
    playerHand.value = []
    dealerHand.value = []
    playerScore.value = 0
    dealerScore.value = 0
    gameOver.value = false
    winner.value = null
    message.value = ''
    playerStood.value = false

    jugadorNego.value = false
    apuestaJugador.value = 0
    apuestaCrupier.value = 0
    turnoNumero.value = 1
    faseJuego.value = 'apuestas'
    dealerStood.value = false

    objetos.comoDin.disponible.value = 0
    ultimaCartaJugador.value = null
    objetoMensaje.value = ''

    const c1 = drawCard()
    const c2 = drawCard()
    if (c1) playerHand.value.push(c1)
    if (c2) playerHand.value.push(c2)

    const d1 = drawCard()
    const d2 = drawCard(true)
    if (d1) dealerHand.value.push(d1)
    if (d2) dealerHand.value.push(d2)

    playerScore.value = calcScore(playerHand.value)
    dealerScore.value = calcScore(dealerHand.value, false)
  }

  const hacerApuesta = (cantidad) => {
    if (faseJuego.value !== 'apuestas') {
      message.value = 'No puedes apostar en este momento.'
      return
    }
    if (cantidad < apuestaMinima.value) {
      message.value = `La apuesta minima es ${apuestaMinima.value}.`
      return
    }
    if (cantidad > dineroJugador.value) {
      message.value = 'No tienes suficiente dinero para esa apuesta.'
      return
    }
    if (cantidad > dineroCrupier.value) {
      message.value = 'El crupier no tiene fondos suficientes para igualar esa apuesta.'
      return
    }
    dineroJugador.value -= cantidad
    dineroCrupier.value -= cantidad
    apuestaJugador.value += cantidad
    apuestaCrupier.value += cantidad
    jugadorNego.value = false
    message.value = `Apostaste ${cantidad}. Pozo total: ${apuestaJugador.value + apuestaCrupier.value} $`
    faseJuego.value = 'turnoJugador'
  }

  const negarApuesta = () => {
    if (faseJuego.value !== 'apuestas') {
      message.value = 'No puedes negar la apuesta ahora.'
      return
    }
    jugadorNego.value = true
    message.value = 'Has negado la apuesta este turno. Objetos bloqueados.'
    faseJuego.value = 'turnoJugador'
  }

  const playerHit = () => {
    if (gameOver.value || faseJuego.value !== 'turnoJugador') return
    const c = drawCard()
    if (c) {
      ultimaCartaJugador.value = c
      playerHand.value.push(c)
    }
    playerScore.value = calcScore(playerHand.value)
    faseJuego.value = 'turnoCrupier'
    turnoCrupier()
  }

  const playerStand = () => {
    if (gameOver.value || faseJuego.value !== 'turnoJugador') return
    playerStood.value = true
    faseJuego.value = 'turnoCrupier'
    turnoCrupier()
  }

  const turnoCrupier = () => {
    const puntajeCrupierReal = calcScore(dealerHand.value, true)

    if (puntajeCrupierReal < 17) {
      const c = drawCard()
      if (c) dealerHand.value.push(c)
      message.value = 'El crupier pide una carta.'
      dealerStood.value = false
    } else {
      dealerStood.value = true
      message.value = 'El crupier se planta.'
    }

    playerScore.value = calcScore(playerHand.value)
    dealerScore.value = calcScore(dealerHand.value, false)
    turnoNumero.value += 1

    if (playerStood.value && dealerStood.value) {
      dealerHand.value.forEach((card) => (card.hidden = false))
      resolveGame()
      return
    }

    const mensajesObjetos = []
    if (Math.random() < 0.15) {
      objetos.pistola.balas.value++
      mensajesObjetos.push('+1 bala')
    }
    if (Math.random() < 0.2 && objetos.comoDin.disponible.value === 0) {
      objetos.comoDin.disponible.value = 1
      mensajesObjetos.push('Comodin disponible')
    }
    if (Math.random() < 0.2) {
      objetos.copa.cargas.value++
      mensajesObjetos.push('+1 carga de copa')
    }

    if (mensajesObjetos.length > 0) {
      objetoMensaje.value = `OBTUVISTE: ${mensajesObjetos.join(' — ')}`
    } else {
      objetoMensaje.value = ''
    }

    playerStood.value = false
    dealerStood.value = false
    jugadorNego.value = false
    faseJuego.value = 'apuestas'
  }

  const runDealerTurn = () => {
    dealerHand.value.forEach((card) => (card.hidden = false))
    while (calcScore(dealerHand.value) < 17) {
      const c = drawCard()
      if (!c) break
      dealerHand.value.push(c)
    }
    resolveGame()
  }

  // ── TIENDA ──
  const comprarObjeto = (objeto) => {
    const precio = preciosTienda[objeto]
    if (!precio) return { ok: false, mensaje: 'Objeto no reconocido.' }

    if (dineroJugador.value < precio) {
      return { ok: false, mensaje: `FONDOS INSUFICIENTES — Necesitas ${precio} $` }
    }

    if (objeto === 'comodin' && objetos.comoDin.disponible.value > 0) {
      return { ok: false, mensaje: 'YA TIENES UN COMODIN DISPONIBLE' }
    }

    dineroJugador.value -= precio

    if (objeto === 'pistola') {
      objetos.pistola.balas.value++
      return { ok: true, mensaje: `COMPRADO — +1 bala (${precio} $)` }
    }
    if (objeto === 'comodin') {
      objetos.comoDin.disponible.value = 1
      return { ok: true, mensaje: `COMPRADO — Comodin disponible (${precio} $)` }
    }
    if (objeto === 'copa') {
      objetos.copa.cargas.value++
      return { ok: true, mensaje: `COMPRADO — +1 carga de copa (${precio} $)` }
    }

    return { ok: false, mensaje: 'Error desconocido.' }
  }

  // ── OBJETOS ──
  const usarPistola = (objetivo, efecto) => {
    if (faseJuego.value !== 'turnoJugador' || jugadorNego.value || objetos.pistola.balas.value <= 0)
      return

    objetos.pistola.balas.value--
    const acierta = Math.random() >= 0.5
    const efectoReal = acierta ? efecto : efecto === 'sumar' ? 'restar' : 'sumar'
    const valorCarta = efectoReal === 'sumar' ? '+5' : '-5'
    const cartaFantasma = { value: valorCarta, suit: '🔫', hidden: false, esFantasma: true }
    const accionTexto = efectoReal === 'sumar' ? 'sumo' : 'resto'
    const resultadoTexto = acierta ? 'ACERTO.' : 'FALLO. Efecto invertido.'

    if (objetivo === 'jugador') {
      playerHand.value.push(cartaFantasma)
      playerScore.value = calcScore(playerHand.value)
      objetoMensaje.value = `PISTOLA — ${resultadoTexto} Te ${accionTexto} 5 puntos.`
    } else if (objetivo === 'crupier') {
      dealerHand.value.push(cartaFantasma)
      dealerScore.value = calcScore(dealerHand.value)
      objetoMensaje.value = `PISTOLA — ${resultadoTexto} Le ${accionTexto} 5 puntos al crupier.`
    }
  }

  const usarComodin = (accion) => {
    if (
      faseJuego.value !== 'turnoJugador' ||
      jugadorNego.value ||
      objetos.comoDin.disponible.value <= 0
    )
      return

    objetos.comoDin.disponible.value = 0
    const valorAleatorio = Math.floor(Math.random() * 13) + 1
    const valorCarta = accion === 'sumar' ? `+${valorAleatorio}` : `-${valorAleatorio}`
    const cartaFantasma = { value: valorCarta, suit: '🃏', hidden: false, esFantasma: true }
    playerHand.value.push(cartaFantasma)
    playerScore.value = calcScore(playerHand.value)
    objetoMensaje.value = `COMODIN — Te ${accion === 'sumar' ? 'sumo' : 'resto'} ${valorAleatorio} puntos.`
  }

  const usarCopa = () => {
    if (faseJuego.value !== 'turnoJugador' || jugadorNego.value || objetos.copa.cargas.value <= 0)
      return

    const cartaObjetivo =
      ultimaCartaJugador.value ?? [...playerHand.value].reverse().find((c) => !c.esFantasma) ?? null

    if (!cartaObjetivo) return

    objetos.copa.cargas.value--
    const index = playerHand.value.findIndex((card) => card === cartaObjetivo)
    if (index !== -1) playerHand.value.splice(index, 1)
    deck.value.push(cartaObjetivo)
    playerScore.value = calcScore(playerHand.value)
    ultimaCartaJugador.value = null
    objetoMensaje.value = 'COPA — La ultima carta regreso al mazo.'
  }

  return {
    deck,
    playerHand,
    dealerHand,
    playerScore,
    dealerScore,
    gameOver,
    winner,
    message,
    playerStood,
    victoriasJugador,
    victoriasCrupier,
    dineroJugador,
    dineroCrupier,
    apuestaJugador,
    apuestaCrupier,
    apuestaMinima,
    jugadorNego,
    faseJuego,
    turnoNumero,
    dealerStood,
    objetos,
    ultimaCartaJugador,
    objetoMensaje,
    dealerVisibleScore,
    startGame,
    playerHit,
    playerStand,
    calcScore,
    hacerApuesta,
    negarApuesta,
    cobrarApuesta,
    turnoCrupier,
    runDealerTurn,
    usarPistola,
    usarComodin,
    usarCopa,
    comprarObjeto,
    preciosTienda,
  }
})
