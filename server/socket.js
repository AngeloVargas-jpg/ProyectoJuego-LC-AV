import { Server } from 'socket.io';
import GameEngine from './game/GameEngine.js';

// Guarda todas las salas activas en memoria, mientras dura cada partida.
// Cada sala tiene su propio GameEngine con fichas, objetos y cartas.
const salas = new Map();

export function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' } // ajustar al dominio real del frontend en producción
  });

  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // El jugador entra a una sala. Si el modo es singleplayer, se crea
    // la sala con el CrupierBot de inmediato; si es pvp, espera a un segundo jugador.
    socket.on('join_room', ({ modo }) => {
      const idSala = `sala_${socket.id}`;
      socket.join(idSala);

      const partida = new GameEngine({ modo });
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
      const idSala = socket.data.idSala;
      if (idSala) salas.delete(idSala);
    });
  });
}