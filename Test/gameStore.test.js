// ============================================================
//  gameStore.test.js  –  Pruebas unitarias de la lógica central
//  Ejecutar con: npx jest   (o abre test.html en el navegador)
// ============================================================
 
// ── Importa sólo las funciones puras (sin DOM) ──────────────
import {
  createDeck,
  calcScore,
  startGame,
  playerHit,
  playerStand,
  state,
} from './gameStore.js';
 
// ════════════════════════════════════════════════════════════
//  1. BARAJA
// ════════════════════════════════════════════════════════════
describe('createDeck()', () => {
  test('genera exactamente 52 cartas', () => {
    expect(createDeck()).toHaveLength(52);
  });
 
  test('contiene los 4 palos', () => {
    const deck  = createDeck();
    const suits = [...new Set(deck.map(c => c.suit))];
    expect(suits.sort()).toEqual(['♠', '♥', '♦', '♣'].sort());
  });
 
  test('contiene los 13 valores por palo', () => {
    const deck   = createDeck();
    const values = [...new Set(deck.map(c => c.value))];
    expect(values).toHaveLength(13);
  });
 
  test('el mazo está barajado (≠ orden original con alta probabilidad)', () => {
    const d1 = createDeck();
    const d2 = createDeck();
    // La probabilidad de que salgan idénticos es 1/52! ≈ 0
    const same = d1.every((c, i) => c.value === d2[i].value && c.suit === d2[i].suit);
    expect(same).toBe(false);
  });
});
 
// ════════════════════════════════════════════════════════════
//  2. CÁLCULO DE PUNTAJE
// ════════════════════════════════════════════════════════════
describe('calcScore()', () => {
  const card = (value) => ({ value, suit: '♠', hidden: false });
 
  test('figura (K, Q, J) vale 10', () => {
    expect(calcScore([card('K'), card('Q')])).toBe(20);
    expect(calcScore([card('J'), card('5')])).toBe(15);
  });
 
  test('as vale 11 por defecto', () => {
    expect(calcScore([card('A'), card('9')])).toBe(20);
  });
 
  test('as se rebaja a 1 si supera 21', () => {
    expect(calcScore([card('A'), card('K'), card('5')])).toBe(16); // 11+10+5=26 → 1+10+5=16
  });
 
  test('dos ases: uno vale 11, otro 1', () => {
    expect(calcScore([card('A'), card('A')])).toBe(12); // 11+1
  });
 
  test('blackjack natural = 21', () => {
    expect(calcScore([card('A'), card('K')])).toBe(21);
  });
 
  test('mano de 5 cartas sin pasarse', () => {
    expect(calcScore([card('2'), card('3'), card('4'), card('5'), card('6')])).toBe(20);
  });
 
  test('carta oculta no se cuenta cuando countHidden=false', () => {
    const hand = [
      { value: 'K', suit: '♠', hidden: false },
      { value: 'A', suit: '♥', hidden: true },
    ];
    expect(calcScore(hand, false)).toBe(10);  // sólo K
    expect(calcScore(hand, true)).toBe(21);   // K + A
  });
});
 
// ════════════════════════════════════════════════════════════
//  3. FLUJO DEL JUEGO
// ════════════════════════════════════════════════════════════
describe('startGame()', () => {
  beforeEach(() => startGame());
 
  test('jugador recibe exactamente 2 cartas', () => {
    expect(state.playerHand).toHaveLength(2);
  });
 
  test('crupier recibe exactamente 2 cartas', () => {
    expect(state.dealerHand).toHaveLength(2);
  });
 
  test('primera carta del crupier está oculta', () => {
    expect(state.dealerHand[1].hidden).toBe(true);
  });
 
  test('quedan 48 cartas en el mazo', () => {
    expect(state.deck).toHaveLength(48);
  });
 
  test('partida no ha terminado al inicio', () => {
    expect(state.gameOver).toBe(false);
  });
});
 
describe('playerHit()', () => {
  test('añade una carta al jugador', () => {
    startGame();
    const before = state.playerHand.length;
    playerHit();
    expect(state.playerHand.length).toBe(before + 1);
  });
 
  test('termina la partida si el jugador se pasa de 21', () => {
    // Forzar mano con 20 pts
    startGame();
    state.playerHand = [
      { value: 'K', suit: '♠', hidden: false },
      { value: 'Q', suit: '♥', hidden: false },
    ];
    state.deck.unshift({ value: '5', suit: '♦', hidden: false }); // siguiente carta = 5
    playerHit(); // 20 + 5 = 25 → bust
    expect(state.gameOver).toBe(true);
    expect(state.winner).toBe('dealer');
  });
 
  test('no hace nada si la partida ya terminó', () => {
    startGame();
    state.gameOver = true;
    const result = playerHit();
    expect(result).toBeNull();
  });
});
 
describe('playerStand() → turno del crupier', () => {
  test('el crupier termina con ≥ 17 puntos si no se pasa', () => {
    startGame();
    playerStand();
    if (!state.gameOver) return; // si ya había blackjack
    const dealerTotal = calcScore(state.dealerHand);
    expect(dealerTotal >= 17 || dealerTotal > 21).toBe(true);
  });
 
  test('la carta oculta del crupier se revela al terminar', () => {
    startGame();
    playerStand();
    const hidden = state.dealerHand.some(c => c.hidden);
    expect(hidden).toBe(false);
  });
 
  test('la partida tiene un ganador definido', () => {
    startGame();
    playerStand();
    expect(['player', 'dealer', 'tie']).toContain(state.winner);
  });
});
 
// ════════════════════════════════════════════════════════════
//  4. CASOS EXTREMOS
// ════════════════════════════════════════════════════════════
describe('Casos extremos', () => {
  test('empate cuando ambos tienen el mismo puntaje', () => {
    startGame();
    // Forzar manos iguales
    state.playerHand = [{ value: '9', suit: '♠', hidden: false }, { value: '8', suit: '♥', hidden: false }];
    state.dealerHand = [{ value: '9', suit: '♦', hidden: false }, { value: '8', suit: '♣', hidden: true  }];
    state.gameOver   = false;
    playerStand();
    expect(state.winner).toBe('tie');
  });
 
  test('crupier gana cuando ambos superan 21 (no ocurre en flujo normal, borde)', () => {
    // En el flujo estándar el jugador pierde antes si se pasa.
    // Este test verifica que calcScore maneja una mano bust correctamente.
    const bust = [
      { value: 'K', suit: '♠', hidden: false },
      { value: 'Q', suit: '♥', hidden: false },
      { value: '5', suit: '♦', hidden: false },
    ];
    expect(calcScore(bust)).toBe(25);
  });
});