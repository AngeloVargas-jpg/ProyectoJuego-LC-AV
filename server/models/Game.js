import mongoose from 'mongoose';

// Solo guarda el resultado final de una partida completa.
// Las fichas, objetos y estado de las rondas NUNCA se guardan aquí:
// viven en memoria mientras dura la partida y se descartan al terminar.
const gameSchema = new mongoose.Schema({
  modo: {
    type: String,
    enum: ['singleplayer', 'pvp'],
    required: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null si el ganador fue el CrupierBot en singleplayer
  },
  scores: {
    player1: { type: Number, default: 0 },
    player2: { type: Number, default: 0 }
  },
  duration: {
    type: Number, // duración en segundos
    required: true
  }
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

export default Game;