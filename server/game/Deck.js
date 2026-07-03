const PALOS = ['♠', '♥', '♦', '♣'];
const VALORES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Representa el mazo de cartas de UNA partida. Vive en memoria mientras
// dura la sala (no se persiste en MongoDB, se descarta al terminar la partida).
export default class Deck {
  constructor() {
    this.cartas = this._crear();
  }

  _crear() {
    const mazo = [];
    for (const palo of PALOS) {
      for (const valor of VALORES) {
        mazo.push({ value: valor, suit: palo, hidden: false });
      }
    }
    return this._barajar(mazo);
  }

  _barajar(mazo) {
    for (let i = mazo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      ;[mazo[i], mazo[j]] = [mazo[j], mazo[i]]
    }
    return mazo;
  }

  // Saca la carta de arriba del mazo.
  // 'oculta' indica si debe repartirse boca abajo (la segunda carta del crupier).
  robarCarta(oculta = false) {
    if (this.cartas.length === 0) return null;
    const carta = this.cartas.pop();
    return { ...carta, hidden: oculta };
  }

  cartasRestantes() {
    return this.cartas.length;
  }

  // Devuelve una carta usada al mazo (la usa el objeto "Copa de Vino").
  devolverCarta(carta) {
    this.cartas.unshift(carta);
  }
}