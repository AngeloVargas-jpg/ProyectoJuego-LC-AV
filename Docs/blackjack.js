// ============================================================
//  blackjack.js — Simulación central del Blackjack "Contrato 21"
//  Sin UI, sin dependencias. Corre con: node blackjack.js
// ============================================================


// ──────────────────────────────────────────────────────────────
//  SECCIÓN 1: CONSTANTES DEL MAZO
// ──────────────────────────────────────────────────────────────

// Los 4 palos de una baraja estándar.
const PALOS = ['♠', '♥', '♦', '♣'];

// Los 13 valores posibles por palo.
// 'A' = As, 'J/Q/K' = figuras que valen 10.
const VALORES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];


// ──────────────────────────────────────────────────────────────
//  SECCIÓN 2: CREAR Y BARAJAR EL MAZO
// ──────────────────────────────────────────────────────────────

/**
 * Genera un mazo de 52 cartas (4 palos × 13 valores)
 * y lo devuelve barajado aleatoriamente.
 *
 * Cada carta es un objeto: { valor: 'A', palo: '♠', oculta: false }
 * El campo 'oculta' sirve para saber si la carta está boca abajo.
 */
function crearMazo() {
  const mazo = [];

  for (const palo of PALOS) {
    for (const valor of VALORES) {
      mazo.push({ valor, palo, oculta: false });
    }
  }

  // Algoritmo Fisher-Yates: recorre el array desde el final
  // y en cada posición intercambia la carta con una posición
  // aleatoria anterior. Garantiza una distribución uniforme.
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazo[i], mazo[j]] = [mazo[j], mazo[i]]; // swap con destructuring
  }

  return mazo;
}


// ──────────────────────────────────────────────────────────────
//  SECCIÓN 3: CALCULAR PUNTAJE DE UNA MANO
// ──────────────────────────────────────────────────────────────

/**
 * Calcula el puntaje total de una mano de cartas.
 *
 * Reglas:
 *   - Números (2-10): valen su número.
 *   - Figuras (J, Q, K): valen 10.
 *   - As (A): vale 11, pero si el total supera 21,
 *     se rebaja a 1 para evitar pasarse.
 *
 * @param {Array}   mano          - Array de cartas.
 * @param {boolean} contarOcultas - Si es false, ignora las cartas ocultas.
 *                                  Útil para mostrar el puntaje visible del crupier.
 */
function calcularPuntaje(mano, contarOcultas = true) {
  let puntaje = 0;
  let ases = 0;

  for (const carta of mano) {
    // Si la carta está oculta y no queremos contarla, la saltamos.
    if (!contarOcultas && carta.oculta) continue;

    if (carta.valor === 'A') {
      puntaje += 11; // El as empieza valiendo 11...
      ases++;
    } else if (['J', 'Q', 'K'].includes(carta.valor)) {
      puntaje += 10;
    } else {
      puntaje += parseInt(carta.valor);
    }
  }

  // ...pero si nos pasamos de 21, cada as puede "rebajarse" a 1.
  // Restamos 10 (diferencia entre 11 y 1) por cada as disponible.
  while (puntaje > 21 && ases > 0) {
    puntaje -= 10;
    ases--;
  }

  return puntaje;
}


// ──────────────────────────────────────────────────────────────
//  SECCIÓN 4: MOSTRAR UNA MANO EN CONSOLA
// ──────────────────────────────────────────────────────────────

/**
 * Convierte una mano a texto legible para consola.
 * Las cartas ocultas se muestran como [?].
 */
function mostrarMano(mano) {
  return mano
    .map(c => c.oculta ? '[?]' : `[${c.valor}${c.palo}]`)
    .join(' ');
}


// ──────────────────────────────────────────────────────────────
//  SECCIÓN 5: ESTADO GLOBAL DE LA PARTIDA
// ──────────────────────────────────────────────────────────────

// Toda la información de una partida vive aquí.
// Centralizar el estado en un objeto facilita resetearlo
// entre partidas y pasarlo a funciones sin mil parámetros.
const estado = {
  mazo:           [],    // Baraja restante
  manoJugador:    [],    // Cartas del jugador
  manoCrupier:    [],    // Cartas del crupier
  turnoTerminado: false, // ¿El jugador ya se quedó?
  juegoTerminado: false, // ¿La partida terminó?
  ganador:        null,  // 'jugador' | 'crupier' | 'empate'
  mensaje:        '',    // Descripción del resultado
};


// ──────────────────────────────────────────────────────────────
//  SECCIÓN 6: INICIAR PARTIDA
// ──────────────────────────────────────────────────────────────

/**
 * Resetea el estado y reparte las cartas iniciales.
 *
 * Reparto estándar del blackjack:
 *   1. Jugador  recibe carta VISIBLE
 *   2. Crupier  recibe carta VISIBLE
 *   3. Jugador  recibe carta VISIBLE
 *   4. Crupier  recibe carta OCULTA  ← la clave del juego
 */
function iniciarPartida() {
  estado.mazo           = crearMazo();
  estado.manoJugador    = [];
  estado.manoCrupier    = [];
  estado.turnoTerminado = false;
  estado.juegoTerminado = false;
  estado.ganador        = null;
  estado.mensaje        = '';

  // Repartir en el orden correcto del blackjack.
  estado.manoJugador.push(robarCarta());         // J: visible
  estado.manoCrupier.push(robarCarta());         // C: visible
  estado.manoJugador.push(robarCarta());         // J: visible
  estado.manoCrupier.push(robarCarta({ oculta: true })); // C: oculta

  // Verificar blackjack natural (21 con solo 2 cartas).
  verificarBlackjackNatural();
}

/**
 * Saca la carta del "tope" del mazo.
 * Usamos pop() porque el mazo es un array y el tope es el último elemento
 * (después del barajado, el orden es aleatorio de todas formas).
 */
function robarCarta(opciones = {}) {
  const carta = estado.mazo.pop();
  if (opciones.oculta) carta.oculta = true;
  return carta;
}


// ──────────────────────────────────────────────────────────────
//  SECCIÓN 7: ACCIONES DEL JUGADOR
// ──────────────────────────────────────────────────────────────

/**
 * PEDIR: el jugador toma una carta adicional.
 *
 * Si al sumar esa carta el jugador supera 21 → pierde automáticamente (bust).
 * No necesita esperar al crupier.
 */
function pedir() {
  if (estado.juegoTerminado || estado.turnoTerminado) return;

  estado.manoJugador.push(robarCarta());
  const puntaje = calcularPuntaje(estado.manoJugador);

  console.log(`\n  Jugador pide carta...`);
  console.log(`  Mano: ${mostrarMano(estado.manoJugador)} → ${puntaje} pts`);

  if (puntaje > 21) {
    terminarJuego('crupier', `Jugador se pasó de 21 (${puntaje}). Crupier gana.`);
  }
}

/**
 * QUEDARSE: el jugador decide no pedir más cartas.
 *
 * Esto cede el control al crupier, que juega automáticamente
 * siguiendo sus reglas fijas (debe llegar a mínimo 17).
 */
function quedarse() {
  if (estado.juegoTerminado || estado.turnoTerminado) return;

  estado.turnoTerminado = true;
  console.log(`\n  Jugador se queda con ${calcularPuntaje(estado.manoJugador)} pts.`);
  turnoDelCrupier();
}


// ──────────────────────────────────────────────────────────────
//  SECCIÓN 8: TURNO DEL CRUPIER (IA)
// ──────────────────────────────────────────────────────────────

/**
 * El crupier sigue reglas fijas de casino (no decide libremente):
 *   - DEBE pedir carta si tiene menos de 17 puntos.
 *   - DEBE quedarse si tiene 17 o más.
 *
 * Esto es intencional: el crupier no "piensa", solo aplica la regla.
 * Hace el juego predecible y justo.
 */
function turnoDelCrupier() {
  // Primero revelar la carta oculta.
  for (const carta of estado.manoCrupier) {
    carta.oculta = false;
  }

  console.log(`\n  --- Turno del Crupier ---`);
  console.log(`  Revela su carta oculta...`);
  console.log(`  Mano: ${mostrarMano(estado.manoCrupier)} → ${calcularPuntaje(estado.manoCrupier)} pts`);

  // El crupier pide cartas mientras esté bajo 17.
  while (calcularPuntaje(estado.manoCrupier) < 17) {
    const carta = robarCarta();
    estado.manoCrupier.push(carta);
    console.log(`  Crupier pide: [${carta.valor}${carta.palo}] → ${calcularPuntaje(estado.manoCrupier)} pts`);
  }

  // Una vez que el crupier se planta, resolvemos quién gana.
  resolverPartida();
}


// ──────────────────────────────────────────────────────────────
//  SECCIÓN 9: RESOLVER LA PARTIDA
// ──────────────────────────────────────────────────────────────

/**
 * Compara los puntajes finales y determina el ganador.
 *
 * Casos posibles:
 *   1. Crupier se pasa de 21 → gana el jugador.
 *   2. Jugador tiene más puntos → gana el jugador.
 *   3. Crupier tiene más puntos → gana el crupier.
 *   4. Puntajes iguales → empate (la apuesta se devuelve).
 */
function resolverPartida() {
  const pJ = calcularPuntaje(estado.manoJugador);
  const pC = calcularPuntaje(estado.manoCrupier);

  if (pC > 21) {
    terminarJuego('jugador', `Crupier se pasó (${pC}). Jugador gana.`);
  } else if (pJ > pC) {
    terminarJuego('jugador', `Jugador gana: ${pJ} vs ${pC}.`);
  } else if (pC > pJ) {
    terminarJuego('crupier', `Crupier gana: ${pC} vs ${pJ}.`);
  } else {
    terminarJuego('empate', `Empate: ambos con ${pJ}.`);
  }
}

/**
 * Verifica si alguno tiene blackjack natural (As + figura = 21 con 2 cartas).
 * El blackjack natural gana inmediatamente, sin que el jugador juegue.
 */
function verificarBlackjackNatural() {
  // Para el crupier contamos TODAS sus cartas, incluyendo la oculta.
  const bjJugador = calcularPuntaje(estado.manoJugador) === 21;
  const bjCrupier = calcularPuntaje(estado.manoCrupier, true) === 21;

  if (bjJugador && bjCrupier) {
    revelarCrupier();
    terminarJuego('empate', 'Doble Blackjack Natural. Empate.');
  } else if (bjJugador) {
    revelarCrupier();
    terminarJuego('jugador', '¡BLACKJACK NATURAL! Jugador gana automáticamente.');
  } else if (bjCrupier) {
    revelarCrupier();
    terminarJuego('crupier', 'Crupier tiene Blackjack Natural. Crupier gana.');
  }
}

function revelarCrupier() {
  for (const carta of estado.manoCrupier) carta.oculta = false;
}

/**
 * Cierra la partida: guarda el ganador, revela todo
 * y muestra el resultado en consola.
 */
function terminarJuego(ganador, mensaje) {
  estado.juegoTerminado = true;
  estado.ganador        = ganador;
  estado.mensaje        = mensaje;
  revelarCrupier();

  console.log(`\n  ════════════════════════`);
  console.log(`  RESULTADO: ${mensaje}`);
  console.log(`  ════════════════════════`);
}


// ──────────────────────────────────────────────────────────────
//  SECCIÓN 10: SIMULACIÓN DE UNA PARTIDA COMPLETA
// ──────────────────────────────────────────────────────────────

/**
 * Simula una partida entera de forma automática.
 * El jugador sigue una estrategia básica simple:
 *   - Pide carta mientras tenga menos de 17 puntos.
 *   - Se queda si tiene 17 o más.
 *
 * Esto nos permite probar toda la lógica sin necesidad de UI.
 */
function simularPartida(numero) {
  console.log(`\n${'═'.repeat(40)}`);
  console.log(`  PARTIDA #${numero}`);
  console.log(`${'═'.repeat(40)}`);

  iniciarPartida();

  if (estado.juegoTerminado) {
    // Hubo blackjack natural, la partida ya terminó.
    imprimirEstadoInicial();
    return estado.ganador;
  }

  imprimirEstadoInicial();

  // Turno del jugador: estrategia básica (pedir hasta 17).
  while (calcularPuntaje(estado.manoJugador) < 17 && !estado.juegoTerminado) {
    pedir();
  }

  if (!estado.juegoTerminado) {
    quedarse();
  }

  return estado.ganador;
}

function imprimirEstadoInicial() {
  const puntajeVisible = calcularPuntaje(estado.manoCrupier, false);
  console.log(`\n  [REPARTO INICIAL]`);
  console.log(`  Jugador : ${mostrarMano(estado.manoJugador)} → ${calcularPuntaje(estado.manoJugador)} pts`);
  console.log(`  Crupier : ${mostrarMano(estado.manoCrupier)} → ${puntajeVisible} pts (carta oculta)`);
}


// ──────────────────────────────────────────────────────────────
//  SECCIÓN 11: EJECUTAR VARIAS PARTIDAS Y VER ESTADÍSTICAS
// ──────────────────────────────────────────────────────────────

const TOTAL_PARTIDAS = 5;
const conteo = { jugador: 0, crupier: 0, empate: 0 };

for (let i = 1; i <= TOTAL_PARTIDAS; i++) {
  const ganador = simularPartida(i);
  if (ganador in conteo) conteo[ganador]++;
}

console.log(`\n${'═'.repeat(40)}`);
console.log(`  ESTADÍSTICAS (${TOTAL_PARTIDAS} partidas)`);
console.log(`${'═'.repeat(40)}`);
console.log(`  Jugador ganó : ${conteo.jugador} vez/veces`);
console.log(`  Crupier ganó : ${conteo.crupier} vez/veces`);
console.log(`  Empates      : ${conteo.empate} vez/veces`);
console.log(`${'═'.repeat(40)}\n`);
