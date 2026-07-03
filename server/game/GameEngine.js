import Deck from './Deck.js';
import CrupierBot from './CrupierBot.js';
import calcularPuntaje from './calcularPuntaje.js';

const FICHAS_INICIALES = 1000;
const APUESTA_MINIMA_BASE = 50;
const INCREMENTO_POR_RONDA = 25;
const VICTORIAS_PARA_GANAR = 5;

// Motor de UNA partida completa (hasta 5 victorias). Vive en memoria en el
// servidor mientras dura la sala; nada de esto se persiste en MongoDB.
export default class GameEngine {
  constructor({ modo = 'singleplayer' } = {}) {
    this.modo = modo;
    this.crupierBot = modo === 'singleplayer' ? new CrupierBot() : null;

    this.deck = null;
    this.playerHand = [];
    this.dealerHand = [];

    this.fichasJugador = FICHAS_INICIALES;
    this.fichasRival = modo === 'singleplayer' ? Infinity : FICHAS_INICIALES;
    this.apuestaJugador = 0;
    this.apuestaRival = 0;
    this.apuestaMinima = APUESTA_MINIMA_BASE;

    this.victoriasJugador = 0;
    this.victoriasRival = 0;
    this.turnoNumero = 1;
    this.fase = 'apuestas'; // 'apuestas' | 'turnoJugador' | 'turnoRival' | 'resultado'
    this.jugadorNego = false;
    this.terminada = false;
    this.resultado = null;

    this.objetos = {
      pistola: { balas: 1 },
      comodin: { disponible: 0 },
      copa: { cargas: 0 },
      jeringa: { cargas: 0, desbloqueada: false },
      encendedor: { cargas: 0, desbloqueada: false },
      puro: { cargas: 0, desbloqueada: false }
    };

    this.crupierCongelado = false;
    this.cartaCrupierRevelada = false;
    this.ultimaCartaJugador = null;
    this.mensaje = '';

    this._nuevaRonda();
  }

  // Reparte una mano nueva: 2 cartas a cada uno, la segunda del rival oculta.
  _nuevaRonda() {
    this.deck = new Deck();
    this.playerHand = [];
    this.dealerHand = [];
    this.apuestaJugador = 0;
    this.apuestaRival = 0;
    this.jugadorNego = false;
    this.fase = 'apuestas';
    this.crupierCongelado = false;
    this.cartaCrupierRevelada = false;
    this.ultimaCartaJugador = null;
    this.mensaje = '';

    this.playerHand.push(this.deck.robarCarta());
    this.playerHand.push(this.deck.robarCarta());
    this.dealerHand.push(this.deck.robarCarta());
    this.dealerHand.push(this.deck.robarCarta(true)); // segunda carta oculta

    // +25 fichas al jugador al inicio de cada nuevo turno (regla del DESIGN.md)
    this.fichasJugador += INCREMENTO_POR_RONDA;
  }

  get puntajeJugador() {
    return calcularPuntaje(this.playerHand);
  }

  get puntajeRival() {
    return calcularPuntaje(this.dealerHand);
  }

  // Estado que se manda al cliente por Socket.io (room_ready / game_state)
  obtenerEstado() {
    return {
      modo: this.modo,
      fase: this.fase,
      playerHand: this.playerHand,
      dealerHand: this.dealerHand,
      puntajeJugador: this.puntajeJugador,
      puntajeRivalVisible: calcularPuntaje(this.dealerHand.filter((c) => !c.hidden)),
      fichasJugador: this.fichasJugador,
      // Infinity no se puede mandar por JSON: se representa como null (fondos ilimitados)
      fichasRival: this.fichasRival === Infinity ? null : this.fichasRival,
      apuestaJugador: this.apuestaJugador,
      apuestaRival: this.apuestaRival,
      apuestaMinima: this.apuestaMinima,
      victoriasJugador: this.victoriasJugador,
      victoriasRival: this.victoriasRival,
      turnoNumero: this.turnoNumero,
      jugadorNego: this.jugadorNego,
      objetos: this.objetos,
      mensaje: this.mensaje,
      terminada: this.terminada,
      resultado: this.resultado
    };
  }

  // ── Fase de apuestas ──

  // El jugador apuesta (mínimo this.apuestaMinima).
  // En singleplayer el rival iguala automático (fondos ilimitados);
  // en PvP debería esperar la apuesta del otro jugador (pendiente cuando se arme el emparejamiento real).
  hacerApuesta(monto) {
    if (this.fase !== 'apuestas') {
      return { ok: false, mensaje: 'No estás en fase de apuestas.' };
    }
    if (monto < this.apuestaMinima) {
      return { ok: false, mensaje: `La apuesta mínima es ${this.apuestaMinima} $.` };
    }
    if (monto > this.fichasJugador) {
      return { ok: false, mensaje: 'No tienes fichas suficientes.' };
    }

    this.fichasJugador -= monto;
    this.apuestaJugador = monto;

    if (this.modo === 'singleplayer') {
      this.apuestaRival = monto;
    }

    this.jugadorNego = false;
    this.fase = 'turnoJugador';
    return { ok: true, mensaje: `Apostaste ${monto} $.` };
  }

  // Negar la apuesta: se cobra igual la mínima, pero bloquea el uso de objetos ese turno.
  negarApuesta() {
    if (this.fase !== 'apuestas') {
      return { ok: false, mensaje: 'No estás en fase de apuestas.' };
    }
    if (this.apuestaMinima > this.fichasJugador) {
      return { ok: false, mensaje: 'No tienes fichas suficientes ni para la apuesta mínima.' };
    }

    this.fichasJugador -= this.apuestaMinima;
    this.apuestaJugador = this.apuestaMinima;
    if (this.modo === 'singleplayer') {
      this.apuestaRival = this.apuestaMinima;
    }

    this.jugadorNego = true;
    this.fase = 'turnoJugador';
    return { ok: true, mensaje: 'Negaste la apuesta. Objetos bloqueados este turno.' };
  }

  // ── Turno del jugador ──

  pedirCarta() {
    if (this.fase !== 'turnoJugador') {
      return { ok: false, mensaje: 'No es tu turno.' };
    }

    const carta = this.deck.robarCarta();
    if (!carta) {
      return { ok: false, mensaje: 'No quedan cartas en el mazo.' };
    }

    this.playerHand.push(carta);
    this.ultimaCartaJugador = carta;

    if (this.puntajeJugador > 21) {
      this._resolverRonda();
      return { ok: true, mensaje: `Te pasaste con ${this.puntajeJugador}.` };
    }

    return { ok: true, mensaje: 'Carta robada.' };
  }

  plantarse() {
    if (this.fase !== 'turnoJugador') {
      return { ok: false, mensaje: 'No es tu turno.' };
    }

    this.fase = 'turnoRival';
    this._turnoRival();
    return { ok: true, mensaje: 'Te plantaste.' };
  }

  // ── Turno del rival ──

  // En singleplayer, el CrupierBot juega solo (pide hasta 17, según CrupierBot.decidirAccion).
  // En PvP esto se reemplaza más adelante por el turno real del segundo jugador.
  _turnoRival() {
    // revela la carta oculta del rival al empezar su turno
    this.dealerHand.forEach((carta) => (carta.hidden = false));

    if (this.modo === 'singleplayer') {
      if (this.crupierCongelado) {
        // Efecto de la Jeringa: el rival no roba carta este turno
        this.crupierCongelado = false;
        this._resolverRonda();
        return;
      }

      while (this.crupierBot.decidirAccion(this.puntajeRival) === 'pedir') {
        const carta = this.deck.robarCarta();
        if (!carta) break;
        this.dealerHand.push(carta);
        if (this.puntajeRival > 21) break;
      }
    }

    this._resolverRonda();
  }

  // ── Resolución de la ronda ──

  _resolverRonda() {
    const pScore = this.puntajeJugador;
    const dScore = this.puntajeRival;
    const pPaso = pScore > 21;
    const dPaso = dScore > 21;

    let ganador; // 'player' | 'rival' | 'tie'
    let mensaje;

    if (pPaso && dPaso) {
      if (pScore < dScore) { ganador = 'player'; mensaje = `Ambos se pasaron. Tu ${pScore} está más cerca de 21. Ganaste.`; }
      else if (dScore < pScore) { ganador = 'rival'; mensaje = `Ambos se pasaron. El rival (${dScore}) está más cerca. Pierdes.`; }
      else { ganador = 'tie'; mensaje = `Ambos se pasaron con ${pScore}. Empate.`; }
    } else if (pPaso) {
      ganador = 'rival';
      mensaje = `Te pasaste de 21 (${pScore}). Pierdes la ronda.`;
    } else if (dPaso) {
      ganador = 'player';
      mensaje = `El rival se pasó de 21 (${dScore}). Ganaste con ${pScore}.`;
    } else if (pScore > dScore) {
      ganador = 'player';
      mensaje = `Ganaste. ${pScore} vs ${dScore}.`;
    } else if (dScore > pScore) {
      ganador = 'rival';
      mensaje = `El rival gana. ${dScore} vs ${pScore}.`;
    } else {
      ganador = 'tie';
      mensaje = `Empate. Ambos con ${pScore}.`;
    }

    this._cobrarApuesta(ganador);

    if (ganador === 'player') this.victoriasJugador++;
    if (ganador === 'rival') this.victoriasRival++;

    this.fase = 'resultado';
    this.mensaje = mensaje;
    this.turnoNumero++;

    if (this.victoriasJugador >= VICTORIAS_PARA_GANAR) {
      this.terminada = true;
      this.resultado = { ganador: 'player', marcador: `${this.victoriasJugador}-${this.victoriasRival}` };
    } else if (this.victoriasRival >= VICTORIAS_PARA_GANAR) {
      this.terminada = true;
      this.resultado = { ganador: 'rival', marcador: `${this.victoriasJugador}-${this.victoriasRival}` };
    }
  }

  // Reparte el pozo de fichas de la ronda según quién ganó.
  _cobrarApuesta(ganador) {
    const pozo = (this.apuestaJugador || 0) + (this.apuestaRival || 0);
    if (pozo === 0) return;

    if (ganador === 'player') {
      this.fichasJugador += pozo;
    } else if (ganador === 'tie') {
      this.fichasJugador += this.apuestaJugador || 0;
    }
    // si gana el rival, el pozo se lo queda él (o desaparece si es el CrupierBot con fondos infinitos)

    this.apuestaJugador = 0;
    this.apuestaRival = 0;
  }

  // Se llama después de mostrar el resultado, para arrancar la siguiente ronda
  // (si la partida no terminó todavía).
  siguienteRonda() {
    if (this.terminada) {
      return { ok: false, mensaje: 'La partida ya terminó.' };
    }
    this._nuevaRonda();
    return { ok: true, mensaje: 'Nueva ronda.' };
  }

  // ── Tienda ──

  static PRECIOS = {
    pistola: 100,
    comodin: 150,
    copa: 75,
    jeringa: 200,
    encendedor: 175,
    puro: 125
  };

  static PRECIO_DESBLOQUEO_PREMIUM = 1000;

  desbloquearPremium(objeto) {
    const premium = ['jeringa', 'encendedor', 'puro'];
    if (!premium.includes(objeto)) {
      return { ok: false, mensaje: 'Ese objeto no requiere desbloqueo.' };
    }
    if (this.objetos[objeto].desbloqueada) {
      return { ok: false, mensaje: `${objeto.toUpperCase()} ya está desbloqueado.` };
    }
    if (this.fichasJugador < GameEngine.PRECIO_DESBLOQUEO_PREMIUM) {
      return { ok: false, mensaje: `Fondos insuficientes — necesitas ${GameEngine.PRECIO_DESBLOQUEO_PREMIUM} $.` };
    }

    this.fichasJugador -= GameEngine.PRECIO_DESBLOQUEO_PREMIUM;
    this.objetos[objeto].desbloqueada = true;
    return { ok: true, mensaje: `🔓 ${objeto.toUpperCase()} desbloqueado.` };
  }

  comprarObjeto(objeto) {
    const precio = GameEngine.PRECIOS[objeto];
    if (!precio) return { ok: false, mensaje: 'Objeto no reconocido.' };

    const premium = ['jeringa', 'encendedor', 'puro'];
    if (premium.includes(objeto) && !this.objetos[objeto].desbloqueada) {
      return { ok: false, mensaje: '🔒 Requiere desbloqueo individual (1000 $).' };
    }
    if (this.fichasJugador < precio) {
      return { ok: false, mensaje: `Fondos insuficientes — necesitas ${precio} $.` };
    }
    if (objeto === 'comodin' && this.objetos.comodin.disponible > 0) {
      return { ok: false, mensaje: 'Ya tienes un comodín disponible.' };
    }

    this.fichasJugador -= precio;

    if (objeto === 'pistola') this.objetos.pistola.balas++;
    else if (objeto === 'comodin') this.objetos.comodin.disponible = 1;
    else if (objeto === 'copa') this.objetos.copa.cargas++;
    else if (objeto === 'jeringa') this.objetos.jeringa.cargas++;
    else if (objeto === 'encendedor') this.objetos.encendedor.cargas++;
    else if (objeto === 'puro') this.objetos.puro.cargas++;

    return { ok: true, mensaje: `Comprado — ${objeto} (${precio} $).` };
  }

  // ── Objetos estándar ──

  _puedeUsarObjeto() {
    return this.fase === 'turnoJugador' && !this.jugadorNego;
  }

  usarPistola(objetivo, efecto) {
    if (!this._puedeUsarObjeto() || this.objetos.pistola.balas <= 0) {
      return { ok: false, mensaje: 'No puedes usar la pistola ahora.' };
    }
    this.objetos.pistola.balas--;

    const acierta = Math.random() >= 0.5;
    const efectoReal = acierta ? efecto : (efecto === 'sumar' ? 'restar' : 'sumar');
    const valor = efectoReal === 'sumar' ? '+5' : '-5';
    const cartaFantasma = { value: valor, suit: '🔫', hidden: false, esFantasma: true };
    const resultadoTexto = acierta ? 'Acertó.' : 'Falló. Efecto invertido.';

    if (objetivo === 'jugador') {
      this.playerHand.push(cartaFantasma);
      this.mensaje = `Pistola — ${resultadoTexto} Te ${efectoReal === 'sumar' ? 'sumó' : 'restó'} 5 puntos.`;
    } else {
      this.dealerHand.push(cartaFantasma);
      this.mensaje = `Pistola — ${resultadoTexto} Le ${efectoReal === 'sumar' ? 'sumó' : 'restó'} 5 puntos al rival.`;
    }
    return { ok: true, mensaje: this.mensaje };
  }

  usarComodin(accion) {
    if (!this._puedeUsarObjeto() || this.objetos.comodin.disponible <= 0) {
      return { ok: false, mensaje: 'No puedes usar el comodín ahora.' };
    }
    this.objetos.comodin.disponible = 0;

    const valorAleatorio = Math.floor(Math.random() * 13) + 1;
    const valor = accion === 'sumar' ? `+${valorAleatorio}` : `-${valorAleatorio}`;
    this.playerHand.push({ value: valor, suit: '🃏', hidden: false, esFantasma: true });

    this.mensaje = `Comodín — Te ${accion === 'sumar' ? 'sumó' : 'restó'} ${valorAleatorio} puntos.`;
    return { ok: true, mensaje: this.mensaje };
  }

  usarCopa() {
    if (!this._puedeUsarObjeto() || this.objetos.copa.cargas <= 0) {
      return { ok: false, mensaje: 'No puedes usar la copa ahora.' };
    }
    const cartaObjetivo = this.ultimaCartaJugador;
    if (!cartaObjetivo) {
      return { ok: false, mensaje: 'No hay carta que devolver.' };
    }

    this.objetos.copa.cargas--;
    const index = this.playerHand.findIndex((c) => c === cartaObjetivo);
    if (index !== -1) this.playerHand.splice(index, 1);
    this.deck.devolverCarta(cartaObjetivo);
    this.ultimaCartaJugador = null;

    this.mensaje = 'Copa — La última carta regresó al mazo.';
    return { ok: true, mensaje: this.mensaje };
  }

  // ── Objetos premium ──

  usarJeringa() {
    if (!this._puedeUsarObjeto() || this.objetos.jeringa.cargas <= 0 || !this.objetos.jeringa.desbloqueada) {
      return { ok: false, mensaje: 'No puedes usar la jeringa ahora.' };
    }
    this.objetos.jeringa.cargas--;
    this.crupierCongelado = true;
    this.mensaje = 'Jeringa — El rival no podrá robar carta en su próximo turno. 💉';
    return { ok: true, mensaje: this.mensaje };
  }

  usarEncendedor() {
    if (!this._puedeUsarObjeto() || this.objetos.encendedor.cargas <= 0 || !this.objetos.encendedor.desbloqueada) {
      return { ok: false, mensaje: 'No puedes usar el encendedor ahora.' };
    }
    const cartasReales = this.playerHand.filter((c) => !c.esFantasma);
    if (cartasReales.length <= 1) {
      return { ok: false, mensaje: 'No hay carta que quemar.' };
    }

    const valorCarta = (c) => {
      if (c.value === 'A') return 11;
      if (['J', 'Q', 'K'].includes(c.value)) return 10;
      return parseInt(c.value, 10);
    };

    const pScore = this.puntajeJugador;
    const cartaObjetivo = pScore > 21
      ? cartasReales.reduce((max, c) => (valorCarta(c) > valorCarta(max) ? c : max))
      : cartasReales.reduce((min, c) => (valorCarta(c) < valorCarta(min) ? c : min));

    this.objetos.encendedor.cargas--;
    const index = this.playerHand.findIndex((c) => c === cartaObjetivo);
    if (index !== -1) this.playerHand.splice(index, 1);

    this.mensaje = `Encendedor — Quemaste el ${cartaObjetivo.value}${cartaObjetivo.suit}. 🔥`;
    return { ok: true, mensaje: this.mensaje };
  }

  usarPuro() {
    if (!this._puedeUsarObjeto() || this.objetos.puro.cargas <= 0 || !this.objetos.puro.desbloqueada) {
      return { ok: false, mensaje: 'No puedes usar el puro ahora.' };
    }
    const cartaOculta = this.dealerHand.find((c) => c.hidden);
    if (!cartaOculta) {
      return { ok: false, mensaje: 'No hay carta oculta del rival.' };
    }

    this.objetos.puro.cargas--;
    this.cartaCrupierRevelada = true;
    cartaOculta.hidden = false;

    this.mensaje = `Puro — Revelaste la carta oculta del rival: ${cartaOculta.value}${cartaOculta.suit}. 🌑`;
    return { ok: true, mensaje: this.mensaje };
  }
}