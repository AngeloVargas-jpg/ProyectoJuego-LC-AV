// ============================================================
//  gameStore.js  –  Lógica central del Blackjack "Contrato 21"
//  Semana 1: reparto, pedir, quedarse, puntajes, crupier
// ============================================================
 
// ──────────────────────────────────────────────
//  Constantes del mazo
// ──────────────────────────────────────────────
const SUITS  = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
 
// ──────────────────────────────────────────────
//  Estado global del juego
// ──────────────────────────────────────────────
export const state = {
  deck:          [],   // Baraja restante
  playerHand:    [],   // Mano del jugador  [{value, suit, hidden}]
  dealerHand:    [],   // Mano del crupier  [{value, suit, hidden}]
  playerScore:   0,
  dealerScore:   0,
  playerStood:   false,
  dealerStood:   false,
  gameOver:      false,
  winner:        null,  // 'player' | 'dealer' | 'tie'
  message:       '',
};
 
// ──────────────────────────────────────────────
//  Utilidades de baraja
// ──────────────────────────────────────────────
 
/** Genera un mazo estándar de 52 cartas y lo baraja (Fisher-Yates). */
export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ value, suit, hidden: false });
    }
  }
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
 
/**
 * Calcula el puntaje de una mano.
 * - Figuras (J, Q, K) valen 10.
 * - Ases valen 11; si el total supera 21 se rebajan a 1.
 * @param {Array} hand
 * @param {boolean} countHidden  Si false, ignora las cartas ocultas.
 */
export function calcScore(hand, countHidden = true) {
  let score = 0;
  let aces  = 0;
 
  for (const card of hand) {
    if (!countHidden && card.hidden) continue;
 
    if (card.value === 'A') {
      score += 11;
      aces++;
    } else if (['J', 'Q', 'K'].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }
 
  // Ajustar ases
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
 
  return score;
}
 
// ──────────────────────────────────────────────
//  Flujo principal del juego
// ──────────────────────────────────────────────
 
/** Reinicia todo el estado e inicia una nueva partida. */
export function startGame() {
  state.deck        = createDeck();
  state.playerHand  = [];
  state.dealerHand  = [];
  state.playerStood = false;
  state.dealerStood = false;
  state.gameOver    = false;
  state.winner      = null;
  state.message     = '';
 
  // Reparto inicial: jugador visible, crupier visible, jugador visible, crupier OCULTA
  state.playerHand.push(drawCard());
  state.dealerHand.push(drawCard());
  state.playerHand.push(drawCard());
  state.dealerHand.push(drawCard({ hidden: true }));  // Primera carta del crupier queda oculta
 
  updateScores();
  checkInstantBlackjack();
}
 
/** Saca la carta superior del mazo. */
function drawCard(options = {}) {
  const card = state.deck.pop();
  if (options.hidden) card.hidden = true;
  return card;
}
 
/** Recalcula puntajes y los guarda en el estado. */
function updateScores() {
  state.playerScore = calcScore(state.playerHand);
  // El puntaje visible del crupier no cuenta su carta oculta
  state.dealerScore = calcScore(state.dealerHand, false);
}
 
// ──────────────────────────────────────────────
//  Acciones del jugador
// ──────────────────────────────────────────────
 
/**
 * El jugador pide una carta.
 * Retorna el estado actualizado o null si ya terminó la partida.
 */
export function playerHit() {
  if (state.gameOver || state.playerStood) return null;
 
  state.playerHand.push(drawCard());
  updateScores();
 
  if (state.playerScore > 21) {
    endGame('dealer', '¡Te pasaste de 21! El Crupier gana.');
  }
 
  return getSnapshot();
}
 
/**
 * El jugador se queda con sus cartas.
 * Dispara el turno automático del crupier.
 */
export function playerStand() {
  if (state.gameOver || state.playerStood) return null;
 
  state.playerStood = true;
  runDealerTurn();
  return getSnapshot();
}
 
// ──────────────────────────────────────────────
//  Turno del crupier (IA automática)
// ──────────────────────────────────────────────
 
/**
 * El crupier revela su carta oculta y pide cartas
 * mientras su puntaje sea < 17 (regla estándar de casino).
 */
function runDealerTurn() {
  // Revelar carta oculta
  for (const card of state.dealerHand) {
    card.hidden = false;
  }
 
  // El crupier debe llegar al menos a 17
  while (calcScore(state.dealerHand) < 17) {
    state.dealerHand.push(drawCard());
  }
 
  state.dealerStood = true;
  updateScores();
  resolveGame();
}
 
// ──────────────────────────────────────────────
//  Resolución de la partida
// ──────────────────────────────────────────────
 
/** Determina el ganador cuando ambos se quedan. */
function resolveGame() {
  const p = calcScore(state.playerHand);
  const d = calcScore(state.dealerHand);
 
  if (d > 21) {
    endGame('player', `¡El Crupier se pasó (${d})! Tú ganas.`);
  } else if (p > d) {
    endGame('player', `¡Ganaste! ${p} vs ${d}`);
  } else if (d > p) {
    endGame('dealer', `El Crupier gana. ${d} vs ${p}`);
  } else {
    // Empate exacto → ambos bajo 21 o igual → nadie gana
    endGame('tie', `¡Empate! Ambos con ${p}`);
  }
}
 
/** Comprueba si alguno tiene blackjack natural (21 con 2 cartas). */
function checkInstantBlackjack() {
  const playerBJ = calcScore(state.playerHand) === 21;
  // Para el crupier contamos TODAS las cartas (incluyendo oculta)
  const dealerBJ = calcScore(state.dealerHand, true) === 21;
 
  if (playerBJ && dealerBJ) {
    // Revelar carta oculta del crupier
    for (const c of state.dealerHand) c.hidden = false;
    updateScores();
    endGame('tie', '¡Doble Blackjack! Empate.');
  } else if (playerBJ) {
    for (const c of state.dealerHand) c.hidden = false;
    updateScores();
    endGame('player', '¡BLACKJACK! Ganas automáticamente.');
  } else if (dealerBJ) {
    for (const c of state.dealerHand) c.hidden = false;
    updateScores();
    endGame('dealer', 'El Crupier tiene Blackjack. Pierdes.');
  }
}
 
/** Marca la partida como terminada y guarda el resultado. */
function endGame(winner, message) {
  state.gameOver = true;
  state.winner   = winner;
  state.message  = message;
  // Revelar todas las cartas al terminar
  for (const c of [...state.playerHand, ...state.dealerHand]) {
    c.hidden = false;
  }
  updateScores();
}
 
// ──────────────────────────────────────────────
//  Snapshot inmutable para la UI
// ──────────────────────────────────────────────
 
/** Devuelve una copia profunda del estado (evita mutaciones externas). */
export function getSnapshot() {
  return JSON.parse(JSON.stringify(state));
}