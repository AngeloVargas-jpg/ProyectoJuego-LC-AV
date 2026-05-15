// src/store/gameStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // --- ESTADO (State) ---
  const deck = ref([])
  const playerHand = ref([])
  const dealerHand = ref([])
  const playerScore = ref(0)
  const dealerScore = ref(0)
  const gameOver = ref(false)
  const winner = ref(null) // 'player', 'dealer', 'tie'
  const message = ref('')
  const playerStood = ref(false)

  // Contadores persistentes entre partidas
  const victoriasJugador = ref(0)
  const victoriasCrupier = ref(0)

  // --- NUEVO ESTADO: Sistema de fichas, apuestas y turnos ---
  const dineroJugador = ref(500) // empieza en 500
  const dineroCrupier = ref(500) // empieza en 500
  const apuestaJugador = ref(0) // empieza en 0
  const apuestaCrupier = ref(0) // el crupier iguala automáticamente
  const apuestaMinima = ref(50) // valor fijo de 50
  const jugadorNego = ref(false) // si el jugador negó la apuesta este turno (congela objetos)
  const faseJuego = ref('apuestas') // 'apuestas', 'turnoJugador', 'turnoCrupier', 'resultado'
  const turnoNumero = ref(1) // contador de turnos dentro de la partida, parte en 1
  const dealerStood = ref(false) // indica si el crupier se plantó en el turno actual

  // --- NUEVO ESTADO: Objetos ---
  const objetos = {
    pistola: { balas: ref(1) },       // parte con 1 bala
    comoDin: { disponible: ref(0) },   // parte en 0
    copa: { cargas: ref(0) }           // parte en 0
  }
  const ultimaCartaJugador = ref(null) // guarda la última carta que pidió el jugador (para la copa)
  const objetoMensaje = ref('') // mensaje específico de resultado al usar un objeto


  // --- FUNCIONES AUXILIARES (deben ir antes de los computed que las usan) ---

  /**
   * Genera un mazo de 52 cartas y lo baraja usando Fisher-Yates.
   */
  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣']
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const newDeck = []

    for (const suit of suits) {
      for (const value of values) {
        newDeck.push({ value, suit, hidden: false })
      }
    }

    // Algoritmo de barajado Fisher-Yates
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }

    return newDeck
  }

  /**
   * Calcula el puntaje de una mano manejando el As flexible (11 o 1).
   * @param {Array} hand - La mano a calcular.
   * @param {Boolean} countHidden - Si debe incluir cartas ocultas en el cálculo.
   */
  const calcScore = (hand, countHidden = true) => {
    let score = 0
    let aces = 0

    const cardsToScore = countHidden ? hand : hand.filter(c => !c.hidden)

    for (const card of cardsToScore) {
      if (card.value === 'A') {
        aces += 1
        score += 11
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        score += 10
      } else {
        // parseInt maneja correctamente valores de cartas fantasma como '+5' o '-7'
        score += parseInt(card.value)
      }
    }

    // Ajuste de Ases: si el puntaje supera 21, el As pasa de valer 11 a valer 1.
    while (score > 21 && aces > 0) {
      score -= 10
      aces -= 1
    }

    return score
  }

  /**
   * Saca una carta del mazo.
   * Devuelve null si el mazo está vacío (defensa).
   */
  const drawCard = (hidden = false) => {
    if (!deck.value || deck.value.length === 0) return null
    const card = deck.value.pop()
    return { ...card, hidden }
  }

  // --- COMPUTED (Getters) ---
  // Calcula el puntaje del crupier ignorando las cartas que aún están ocultas
  const dealerVisibleScore = computed(() => {
    return calcScore(dealerHand.value, false)
  })

  // --- ACCIONES (Actions) ---

  /**
   * Cobrar o devolver apuestas según el resultado.
   * - Si gana el jugador: suma todo el bote al jugador.
   * - Si gana el crupier: suma todo el bote al crupier.
   * - Si empate: devuelve apuestas a cada uno.
   * Luego resetea las apuestas a 0.
   */
  const cobrarApuesta = () => {
    // Calcula el bote total en mesa
    const pot = (apuestaJugador.value || 0) + (apuestaCrupier.value || 0)

    // Si no hay apuestas, no hacer nada
    if (pot === 0) return

    // Transferir el bote al ganador
    if (winner.value === 'player') {
      // El jugador recibe todo el bote
      dineroJugador.value += pot
    } else if (winner.value === 'dealer') {
      // El crupier recibe todo el bote
      dineroCrupier.value += pot
    } else if (winner.value === 'tie') {
      // En empate, devolver exactamente lo apostado a cada uno
      dineroJugador.value += apuestaJugador.value || 0
      dineroCrupier.value += apuestaCrupier.value || 0
    }

    // Reset de apuestas en mesa
    apuestaJugador.value = 0
    apuestaCrupier.value = 0
  }

  /**
   * Finaliza la partida, revela cartas y actualiza estadísticas.
   * Ahora llama a cobrarApuesta() antes de terminar.
   */
  const endGame = (gameWinner, gameMessage) => {
    // Establecer ganador para que cobrarApuesta pueda usarlo
    winner.value = gameWinner

    // Cobrar o devolver apuestas según el resultado (usa la función corregida)
    cobrarApuesta()

    // Marcar fin de la partida y mensaje
    gameOver.value = true
    message.value = gameMessage

    // Revelar todas las cartas del crupier
    dealerHand.value.forEach(card => (card.hidden = false))

    // Actualizar puntajes finales reales
    playerScore.value = calcScore(playerHand.value)
    dealerScore.value = calcScore(dealerHand.value)

    // Actualizar contadores globales de victorias
    if (gameWinner === 'player') victoriasJugador.value++
    if (gameWinner === 'dealer') victoriasCrupier.value++
  }

  /**
   * Compara los puntajes finales para determinar el resultado.
   */
  const resolveGame = () => {
    const pScore = calcScore(playerHand.value)
    const dScore = calcScore(dealerHand.value)

    if (dScore > 21) {
      endGame('player', '¡El crupier se pasó! Ganaste.')
    } else if (pScore > dScore) {
      endGame('player', '¡Felicidades! Tienes mejor mano.')
    } else if (dScore > pScore) {
      endGame('dealer', 'El crupier gana esta vez.')
    } else {
      endGame('tie', 'Es un empate. El pacto se mantiene.')
    }
  }

  /**
   * Verifica si alguien tiene 21 natural al inicio.
   */
  const checkInstantBlackjack = () => {
    const pScore = calcScore(playerHand.value)
    const dScore = calcScore(dealerHand.value)

    if (pScore === 21 && dScore === 21) {
      endGame('tie', 'Doble Blackjack Natural. Empate.')
      return true
    } else if (pScore === 21) {
      endGame('player', '¡Blackjack Natural! Ganaste.')
      return true
    } else if (dScore === 21) {
      endGame('dealer', 'El crupier tiene Blackjack Natural.')
      return true
    }
    return false
  }

  /**
   * Reinicia el tablero y comienza una nueva ronda.
   * Ahora inicia en fase de apuestas y resetea variables de apuesta y turno.
   * El dinero NO se resetea entre partidas.
   */
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

    // Resetear los objetos al inicio de cada partida
    objetos.pistola.balas.value = 1
    objetos.comoDin.disponible.value = 0
    objetos.copa.cargas.value = 0
    ultimaCartaJugador.value = null
    objetoMensaje.value = ''

    // Reparto inicial (si drawCard devuelve null, evitamos push de null)
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

    checkInstantBlackjack()
  }

  /**
   * Acción para que el jugador haga una apuesta.
   * Solo funciona si faseJuego === 'apuestas'.
   * Verifica que cantidad >= apuestaMinima y que el jugador y crupier tengan fondos.
   * Descuenta el dinero y el crupier iguala automáticamente.
   * Cambia faseJuego a 'turnoJugador'.
   */
  const hacerApuesta = cantidad => {
    if (faseJuego.value !== 'apuestas') {
      message.value = 'No puedes apostar en este momento.'
      return
    }
    if (cantidad < apuestaMinima.value) {
      message.value = `La apuesta mínima es ${apuestaMinima.value}.`
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
    apuestaJugador.value = cantidad
    apuestaCrupier.value = cantidad

    jugadorNego.value = false
    message.value = `Apostaste ${cantidad}. El crupier igualó la apuesta.`
    faseJuego.value = 'turnoJugador'
  }

  /**
   * El jugador niega la apuesta este turno.
   * Solo funciona si faseJuego === 'apuestas'.
   * Marca jugadorNego para "congelar objetos" en la UI y pasa a turnoJugador.
   * Importante: NO resetea ni modifica las apuestas existentes ni el dinero.
   * De esta forma la negación solo afecta la interacción (objetos bloqueados),
   * pero si ya existe un bote, seguirá siendo cobrado al final según el ganador.
   */
  const negarApuesta = () => {
    if (faseJuego.value !== 'apuestas') {
      message.value = 'No puedes negar la apuesta ahora.'
      return
    }

    // Marcar que el jugador negó la apuesta (congela objetos en la UI)
    jugadorNego.value = true
    message.value = 'Has negado la apuesta este turno. Objetos bloqueados.'

    // NO tocar apuestaJugador/apuestaCrupier ni dinero
    // Simplemente pasar a turno del jugador para que juegue con objetos bloqueados
    faseJuego.value = 'turnoJugador'
  }

  /**
   * Acción para que el jugador pida una carta.
   * Solo funciona si faseJuego === 'turnoJugador'.
   * Después de pedir carta, si no se pasa de 21, cambia faseJuego a 'turnoCrupier' y llama turnoCrupier().
   */
  const playerHit = () => {
    if (gameOver.value || faseJuego.value !== 'turnoJugador') return
    const c = drawCard()
    if (c) {
      ultimaCartaJugador.value = c // Guarda la última carta solicitada (para la copa)
      playerHand.value.push(c)
    }
    playerScore.value = calcScore(playerHand.value)
    if (playerScore.value > 21) {
      endGame('dealer', 'Te has pasado de 21. El crupier gana.')
      return
    }
    faseJuego.value = 'turnoCrupier'
    turnoCrupier()
  }

  /**
   * El jugador se planta y pasa el turno al crupier.
   * Solo funciona si faseJuego === 'turnoJugador'.
   */
  const playerStand = () => {
    if (gameOver.value || faseJuego.value !== 'turnoJugador') return
    playerStood.value = true
    faseJuego.value = 'turnoCrupier'
    turnoCrupier()
  }

  /**
   * Lógica del crupier por turno.
   * - El crupier pide UNA carta si su puntaje visible es menor a 17.
   * - Si tiene 17 o más, se planta.
   * - Incrementa turnoNumero.
   * - Si ambos jugadores se plantaron en este turno, llama resolveGame().
   * - Si no, vuelve a fase de 'apuestas' para el siguiente turno.
   */
  const turnoCrupier = () => {
    if (dealerVisibleScore.value < 17) {
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
      dealerHand.value.forEach(card => (card.hidden = false))
      resolveGame()
      faseJuego.value = 'resultado'
      return
    }

    // Resetear flags de plantado para que sean por-turno
    playerStood.value = false
    dealerStood.value = false
    // Al volver a fase de apuestas, también desbloqueamos la negación para el siguiente turno
    jugadorNego.value = false
    faseJuego.value = 'apuestas'
  }

  /**
   * Lógica automática del crupier para cuando el jugador se planta y se desea que el crupier juegue hasta 17.
   * Mantengo la función original por compatibilidad interna, pero ahora la interfaz principal usa turnoCrupier.
   */
  const runDealerTurn = () => {
    dealerHand.value.forEach(card => (card.hidden = false))
    while (calcScore(dealerHand.value) < 17) {
      const c = drawCard()
      if (!c) break
      dealerHand.value.push(c)
    }
    resolveGame()
  }

  // --- NUEVAS ACCIONES: Objetos ---

  /**
   * Dispara una pistola a un objetivo ('jugador' o 'crupier').
   * 50% de probabilidad de sumar 5 o restar 5 mediante una carta fantasma.
   */
  const usarPistola = (objetivo) => {
    if (faseJuego.value !== 'turnoJugador' || jugadorNego.value || objetos.pistola.balas.value <= 0) {
      return
    }

    objetos.pistola.balas.value-- // Consume 1 bala
    const acierta = Math.random() >= 0.5
    const valor = acierta ? '+5' : '-5'
    const cartaFantasma = { value: valor, suit: '🔫', hidden: false, esFantasma: true }

    if (objetivo === 'jugador') {
      playerHand.value.push(cartaFantasma)
      playerScore.value = calcScore(playerHand.value)
      objetoMensaje.value = acierta 
        ? '¡La pistola acertó! Has sumado 5 puntos a tu mano.' 
        : 'La pistola ha fallado. Has restado 5 puntos a tu mano.'

      if (playerScore.value > 21) {
        endGame('dealer', 'Te pasaste de 21 tras usar la pistola. El crupier gana.')
      }
    } else if (objetivo === 'crupier') {
      dealerHand.value.push(cartaFantasma)
      dealerScore.value = calcScore(dealerHand.value) // Actualiza el puntaje total del crupier
      objetoMensaje.value = acierta 
        ? '¡La pistola acertó! Has sumado 5 puntos a la mano del crupier.' 
        : 'La pistola ha fallado. Has restado 5 puntos a la mano del crupier.'

      if (dealerScore.value > 21) {
        endGame('player', '¡El crupier se pasó de 21 tras usar la pistola! Ganaste.')
      }
    }
  }

  /**
   * Utiliza el comodín para sumar o restar un valor aleatorio (1-13) a tu mano.
   * @param {String} accion - 'sumar' o 'restar'
   */
  const usarComodin = (accion) => {
    if (faseJuego.value !== 'turnoJugador' || jugadorNego.value || objetos.comoDin.disponible.value <= 0) {
      return
    }

    objetos.comoDin.disponible.value = 0 // Consume el comodín
    const valorAleatorio = Math.floor(Math.random() * 13) + 1
    const valor = accion === 'sumar' ? `+${valorAleatorio}` : `-${valorAleatorio}`
    const cartaFantasma = { value: valor, suit: '🃏', hidden: false, esFantasma: true }

    playerHand.value.push(cartaFantasma)
    playerScore.value = calcScore(playerHand.value)

    objetoMensaje.value = `El comodín te ha ${accion === 'sumar' ? 'sumado' : 'restado'} ${valorAleatorio} puntos.`

    if (playerScore.value > 21) {
      endGame('dealer', 'Te pasaste de 21 tras usar el comodín. El crupier gana.')
    }
  }

  /**
   * Usa la copa para devolver la última carta pedida al mazo.
   */
  const usarCopa = () => {
    if (faseJuego.value !== 'turnoJugador' || jugadorNego.value || objetos.copa.cargas.value <= 0 || ultimaCartaJugador.value === null) {
      return
    }

    objetos.copa.cargas.value-- // Consume 1 carga

    // Encontrar y eliminar la última carta guardada en playerHand
    const index = playerHand.value.findIndex(card => card === ultimaCartaJugador.value)
    if (index !== -1) {
      playerHand.value.splice(index, 1)
    }

    // Devolver la carta al mazo
    deck.value.push(ultimaCartaJugador.value)

    // Recalcular puntaje del jugador y limpiar el estado de la copa
    playerScore.value = calcScore(playerHand.value)
    ultimaCartaJugador.value = null
    objetoMensaje.value = 'Usaste la copa: la última carta que pediste ha regresado al mazo.'
  }


  return {
    // State
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
    // Nuevos estados de juego
    dineroJugador,
    dineroCrupier,
    apuestaJugador,
    apuestaCrupier,
    apuestaMinima,
    jugadorNego,
    faseJuego,
    turnoNumero,
    dealerStood,
    // Nuevos estados de objetos
    objetos,
    ultimaCartaJugador,
    objetoMensaje,
    // Getters
    dealerVisibleScore,
    // Actions
    startGame,
    playerHit,
    playerStand,
    calcScore,
    // Acciones relacionadas con apuestas y turnos
    hacerApuesta,
    negarApuesta,
    cobrarApuesta,
    turnoCrupier,
    runDealerTurn,
    // Nuevas acciones de objetos
    usarPistola,
    usarComodin,
    usarCopa
  }
})