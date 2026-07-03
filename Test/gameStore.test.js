import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/store/gameStore'

describe('gameStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // ── INICIO DE PARTIDA ──
  it('startGame reparte 2 cartas a cada jugador', () => {
    const store = useGameStore()
    store.startGame()
    expect(store.playerHand.length).toBe(2)
    expect(store.dealerHand.length).toBe(2)
  })

  it('startGame resetea el dinero apostado a 0', () => {
    const store = useGameStore()
    store.startGame()
    expect(store.apuestaJugador).toBe(0)
    expect(store.apuestaCrupier).toBe(0)
  })

  it('startGame inicia en fase apuestas', () => {
    const store = useGameStore()
    store.startGame()
    expect(store.faseJuego).toBe('apuestas')
  })

  // ── APUESTAS ──
  it('hacerApuesta descuenta dinero del jugador y crupier', () => {
    const store = useGameStore()
    store.startGame()
    const antes = store.dineroJugador
    store.hacerApuesta(100)
    expect(store.dineroJugador).toBe(antes - 100)
    expect(store.apuestaJugador).toBe(100)
  })

  it('hacerApuesta rechaza apuesta menor a la minima', () => {
    const store = useGameStore()
    store.startGame()
    const antes = store.dineroJugador
    store.hacerApuesta(10) // mínimo es 50
    expect(store.dineroJugador).toBe(antes) // no se descuenta
  })

  it('negarApuesta cambia fase a turnoJugador y bloquea objetos', () => {
    const store = useGameStore()
    store.startGame()
    store.negarApuesta()
    expect(store.faseJuego).toBe('turnoJugador')
    expect(store.jugadorNego).toBe(true)
  })

  // ── COMPRA DE OBJETOS ──
  it('comprarObjeto pistola agrega una bala y descuenta dinero', () => {
    const store = useGameStore()
    store.startGame()
    const balasAntes = store.objetos.pistola.balas
    const dineroAntes = store.dineroJugador
    store.comprarObjeto('pistola')
    expect(store.objetos.pistola.balas).toBe(balasAntes + 1)
    expect(store.dineroJugador).toBe(dineroAntes - store.preciosTienda.pistola)
  })

  it('comprarObjeto falla si no hay fondos suficientes', () => {
    const store = useGameStore()
    store.startGame()
    store.dineroJugador = 10 // forzamos poco dinero
    const result = store.comprarObjeto('pistola')
    expect(result.ok).toBe(false)
  })

  // ── PUNTAJE ──
  it('calcScore cuenta correctamente un As como 11', () => {
    const store = useGameStore()
    const mano = [
      { value: 'A', suit: '♠', hidden: false },
      { value: '9', suit: '♥', hidden: false },
    ]
    expect(store.calcScore(mano)).toBe(20)
  })

  it('calcScore ajusta As de 11 a 1 si se pasa de 21', () => {
    const store = useGameStore()
    const mano = [
      { value: 'A', suit: '♠', hidden: false },
      { value: 'K', suit: '♥', hidden: false },
      { value: '5', suit: '♦', hidden: false },
    ]
    expect(store.calcScore(mano)).toBe(16) // A vale 1, no 11
  })
})