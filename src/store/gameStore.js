import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useGameStore = defineStore('game', () => {
  // --- ESTADO (State) ---
  const deck = ref([]);
  const playerHand = ref([]);
  const dealerHand = ref([]);
  const playerScore = ref(0);
  const dealerScore = ref(0);
  const gameOver = ref(false);
  const winner = ref(null); // 'player', 'dealer', 'tie'
  const message = ref('');
  const playerStood = ref(false);
  
  // Contadores persistentes entre partidas
  const victoriasJugador = ref(0);
  const victoriasCrupier = ref(0);

  // --- COMPUTED (Getters) ---
  
  // Calcula el puntaje del crupier ignorando las cartas que aún están ocultas
  const dealerVisibleScore = computed(() => {
    return calcScore(dealerHand.value, false);
  });

  // --- ACCIONES (Actions) ---

  /**
   * Genera un mazo de 52 cartas y lo baraja usando Fisher-Yates.
   */
  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck = [];

    for (const suit of suits) {
      for (const value of values) {
        newDeck.push({ value, suit, hidden: false });
      }
    }

    // Algoritmo de barajado Fisher-Yates
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    return newDeck;
  };

  /**
   * Calcula el puntaje de una mano manejando el As flexible (11 o 1).
   * @param {Array} hand - La mano a calcular.
   * @param {Boolean} countHidden - Si debe incluir cartas ocultas en el cálculo.
   */
  const calcScore = (hand, countHidden = true) => {
    let score = 0;
    let aces = 0;

    const cardsToScore = countHidden ? hand : hand.filter(c => !c.hidden);

    for (const card of cardsToScore) {
      if (card.value === 'A') {
        aces += 1;
        score += 11;
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        score += 10;
      } else {
        score += parseInt(card.value);
      }
    }

    // Ajuste de Ases: si el puntaje supera 21, el As pasa de valer 11 a valer 1.
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }

    return score;
  };

  /**
   * Saca una carta del mazo.
   */
  const drawCard = (hidden = false) => {
    const card = deck.value.pop();
    return { ...card, hidden };
  };

  /**
   * Finaliza la partida, revela cartas y actualiza estadísticas.
   */
  const endGame = (gameWinner, gameMessage) => {
    gameOver.value = true;
    winner.value = gameWinner;
    message.value = gameMessage;

    // Revelar todas las cartas del crupier
    dealerHand.value.forEach(card => card.hidden = false);

    // Actualizar puntajes finales reales
    playerScore.value = calcScore(playerHand.value);
    dealerScore.value = calcScore(dealerHand.value);

    // Actualizar contadores globales de victorias
    if (gameWinner === 'player') victoriasJugador.value++;
    if (gameWinner === 'dealer') victoriasCrupier.value++;
  };

  /**
   * Compara los puntajes finales para determinar el resultado.
   */
  const resolveGame = () => {
    const pScore = calcScore(playerHand.value);
    const dScore = calcScore(dealerHand.value);

    if (dScore > 21) {
      endGame('player', '¡El crupier se pasó! Ganaste.');
    } else if (pScore > dScore) {
      endGame('player', '¡Felicidades! Tienes mejor mano.');
    } else if (dScore > pScore) {
      endGame('dealer', 'El crupier gana esta vez.');
    } else {
      endGame('tie', 'Es un empate. El pacto se mantiene.');
    }
  };

  /**
   * Verifica si alguien tiene 21 natural al inicio.
   */
  const checkInstantBlackjack = () => {
    const pScore = calcScore(playerHand.value);
    const dScore = calcScore(dealerHand.value);

    if (pScore === 21 && dScore === 21) {
      endGame('tie', 'Doble Blackjack Natural. Empate.');
      return true;
    } else if (pScore === 21) {
      endGame('player', '¡Blackjack Natural! Ganaste.');
      return true;
    } else if (dScore === 21) {
      endGame('dealer', 'El crupier tiene Blackjack Natural.');
      return true;
    }
    return false;
  };

  /**
   * Reinicia el tablero y comienza una nueva ronda.
   */
  const startGame = () => {
    // Reset de estado de la ronda (no de victorias)
    deck.value = createDeck();
    playerHand.value = [];
    dealerHand.value = [];
    playerScore.value = 0;
    dealerScore.value = 0;
    gameOver.value = false;
    winner.value = null;
    message.value = '';
    playerStood.value = false;

    // Reparto inicial
    playerHand.value.push(drawCard(), drawCard());
    dealerHand.value.push(drawCard(), drawCard(true)); // Segunda carta oculta

    // Actualizar puntajes iniciales
    playerScore.value = calcScore(playerHand.value);
    dealerScore.value = calcScore(dealerHand.value, false);

    // Verificar si hay ganador inmediato
    checkInstantBlackjack();
  };

  /**
   * Acción para que el jugador pida una carta.
   */
  const playerHit = () => {
    if (gameOver.value || playerStood.value) return;

    playerHand.value.push(drawCard());
    playerScore.value = calcScore(playerHand.value);

    if (playerScore.value > 21) {
      endGame('dealer', 'Te has pasado de 21. El crupier gana.');
    }
  };

  /**
   * El jugador se planta y pasa el turno al crupier.
   */
  const playerStand = () => {
    if (gameOver.value) return;
    playerStood.value = true;
    runDealerTurn();
  };

  /**
   * Lógica automática del crupier.
   */
  const runDealerTurn = () => {
    // Revelar carta oculta
    dealerHand.value.forEach(card => card.hidden = false);
    
    // El crupier pide cartas mientras su puntaje sea menor a 17
    while (calcScore(dealerHand.value) < 17) {
      dealerHand.value.push(drawCard());
    }

    resolveGame();
  };

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
    // Getters
    dealerVisibleScore,
    // Actions
    startGame,
    playerHit,
    playerStand,
    calcScore // Útil si necesitas calcular puntajes externos
  };
});