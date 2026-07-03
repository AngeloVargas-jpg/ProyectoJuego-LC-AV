// IA simple del Crupier en modo Singleplayer.
// Regla fija según el DESIGN.md: pide carta si su puntaje < 17, se planta si es >= 17.
export default class CrupierBot {
  // Decide la siguiente acción del bot dado su puntaje actual.
  // Devuelve 'pedir' o 'plantarse'.
  decidirAccion(puntajeActual) {
    return puntajeActual < 17 ? 'pedir' : 'plantarse';
  }
}