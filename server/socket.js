import { Server } from 'socket.io';
<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import GameEngine from './game/GameEngine.js';
import User from './models/User.js';
import Game from './models/Game.js';
import { SECRET } from './middleware/auth.middleware.js';

// Guarda todas las salas activas en memoria, mientras dura cada partida.
// Cada sala tiene su propio GameEngine con fichas, objetos y cartas,
// más los metadatos necesarios para guardar el resultado al terminar.
=======
import GameEngine from './game/GameEngine.js';

// Guarda todas las salas activas en memoria, mientras dura cada partida.
// Cada sala tiene su propio GameEngine con fichas, objetos y cartas.
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
const salas = new Map();

export function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' } // ajustar al dominio real del frontend en producción
  });

<<<<<<< HEAD
  // Autenticación: el cliente debe mandar el mismo token JWT que usa en las
  // peticiones HTTP, en socket.handshake.auth.token al conectar.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('No autenticado: falta token'));
    }
    try {
      const datos = jwt.verify(token, SECRET);
      socket.data.userId = datos.id;
      socket.data.username = datos.username;
      next();
    } catch (error) {
      next(new Error('Token inválido o expirado'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.data.username} (${socket.id})`);

    // El jugador entra a una sala. En singleplayer se crea la sala con el
    // CrupierBot de inmediato. PvP real (emparejar dos sockets) queda
    // pendiente; por ahora también crea una sala individual.
    socket.on('join_room', ({ modo = 'singleplayer' } = {}) => {
=======
  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // El jugador entra a una sala. Si el modo es singleplayer, se crea
    // la sala con el CrupierBot de inmediato; si es pvp, espera a un segundo jugador.
    socket.on('join_room', ({ modo }) => {
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
      const idSala = `sala_${socket.id}`;
      socket.join(idSala);

      const partida = new GameEngine({ modo });
<<<<<<< HEAD
      salas.set(idSala, {
        partida,
        jugadores: [socket.data.userId],
        inicio: Date.now()
      });
      socket.data.idSala = idSala;

      io.to(idSala).emit('room_ready', partida.obtenerEstado());
    });

    // El jugador pide carta, se planta, apuesta, niega la apuesta,
    // pasa a la siguiente ronda o usa un objeto especial.
    socket.on('player_action', ({ tipo, payload = {} } = {}) => {
      const sala = salas.get(socket.data.idSala);
      if (!sala) return;
      const { partida } = sala;

      const resultado = _despacharAccion(partida, tipo, payload);
      _emitirEstado(io, socket.data.idSala, partida, resultado);

      if (partida.terminada) {
        _finalizarPartida(socket.data.idSala, sala, io).catch((err) =>
          console.error('Error al guardar resultado de partida:', err.message)
        );
      }
    });

    // El jugador compra una carga de objeto, o desbloquea un objeto premium,
    // con las fichas de la partida actual.
    socket.on('buy_item', ({ item, tipo = 'comprar' } = {}) => {
      const sala = salas.get(socket.data.idSala);
      if (!sala) return;
      const { partida } = sala;

      const resultado = tipo === 'desbloquear'
        ? partida.desbloquearPremium(item)
        : partida.comprarObjeto(item);

      _emitirEstado(io, socket.data.idSala, partida, resultado);
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.data.username} (${socket.id})`);
=======
      salas.set(idSala, partida);
      socket.data.idSala = idSala;

      // En singleplayer la sala queda lista de inmediato (bot ya está "conectado")
      // En pvp, aquí debería ir la lógica de emparejamiento con otro socket en espera.
      io.to(idSala).emit('room_ready', partida.obtenerEstado());
    });

    // El jugador pide carta, se planta, apuesta o usa un objeto
    socket.on('player_action', (accion) => {
      const idSala = socket.data.idSala;
      const partida = salas.get(idSala);
      if (!partida) return;

      const nuevoEstado = partida.procesarAccion(accion);
      io.to(idSala).emit('game_state', nuevoEstado);

      if (nuevoEstado.terminada) {
        io.to(idSala).emit('game_over', nuevoEstado.resultado);
        salas.delete(idSala); // fichas y objetos de esta partida se descartan
      }
    });

    // El jugador compra una carga de objeto con las fichas de la partida actual
    socket.on('buy_item', ({ item }) => {
      const idSala = socket.data.idSala;
      const partida = salas.get(idSala);
      if (!partida) return;

      const nuevoEstado = partida.comprarObjeto(item);
      io.to(idSala).emit('game_state', nuevoEstado);
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
      const idSala = socket.data.idSala;
      if (idSala) salas.delete(idSala);
    });
  });
<<<<<<< HEAD
}

// Traduce el 'tipo' de acción que manda el cliente al método correspondiente del GameEngine.
function _despacharAccion(partida, tipo, payload) {
  switch (tipo) {
    case 'apostar': return partida.hacerApuesta(payload.monto);
    case 'negar_apuesta': return partida.negarApuesta();
    case 'pedir_carta': return partida.pedirCarta();
    case 'plantarse': return partida.plantarse();
    case 'siguiente_ronda': return partida.siguienteRonda();
    case 'usar_pistola': return partida.usarPistola(payload.objetivo, payload.efecto);
    case 'usar_comodin': return partida.usarComodin(payload.accion);
    case 'usar_copa': return partida.usarCopa();
    case 'usar_jeringa': return partida.usarJeringa();
    case 'usar_encendedor': return partida.usarEncendedor();
    case 'usar_puro': return partida.usarPuro();
    default: return { ok: false, mensaje: 'Acción no reconocida.' };
  }
}

// Manda el estado actualizado a todos en la sala, junto con el resultado
// puntual de la última acción (útil para mostrar mensajes de error en el cliente).
function _emitirEstado(io, idSala, partida, ultimaAccion) {
  io.to(idSala).emit('game_state', {
    ...partida.obtenerEstado(),
    ultimaAccion
  });
}

// Al terminar la partida (alguien llega a 5 victorias): guarda el resultado
// final en MongoDB y actualiza el historial de victorias/derrotas del usuario.
// Las fichas y objetos de la partida NUNCA se guardan, solo el marcador final.
async function _finalizarPartida(idSala, sala, io) {
  const { partida, jugadores, inicio } = sala;
  const [userId] = jugadores;
  const gano = partida.resultado.ganador === 'player';

  await Game.create({
    modo: partida.modo,
    players: jugadores,
    winner: gano ? userId : null, // null si ganó el CrupierBot
    scores: {
      player1: partida.victoriasJugador,
      player2: partida.victoriasRival
    },
    duration: Math.round((Date.now() - inicio) / 1000)
  });

  await User.findByIdAndUpdate(userId, {
    $inc: gano ? { victorias: 1 } : { derrotas: 1 }
  });

  io.to(idSala).emit('game_over', partida.resultado);
  salas.delete(idSala);
=======
>>>>>>> d593137cd941e4a3fa8ece548096203d2b2eecc5
}