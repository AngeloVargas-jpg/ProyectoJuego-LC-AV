// Calcula el puntaje de una mano de Blackjack.
// Los Ases valen 11, salvo que eso pase de 21: ahí se ajustan a 1 de a uno.
export default function calcularPuntaje(mano) {
  let puntaje = 0;
  let ases = 0;

  for (const carta of mano) {
    if (carta.esFantasma) {
      const valor = parseInt(carta.value, 10);
      if (!isNaN(valor)) puntaje += valor;
      continue;
    }
    if (carta.value === 'A') {
      ases += 1;
      puntaje += 11;
    } else if (['J', 'Q', 'K'].includes(carta.value)) {
      puntaje += 10;
    } else {
      puntaje += parseInt(carta.value, 10);
    }
  }

  while (puntaje > 21 && ases > 0) {
    puntaje -= 10;
    ases -= 1;
  }

  return puntaje;
}