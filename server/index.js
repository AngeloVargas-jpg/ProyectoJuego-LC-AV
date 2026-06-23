import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { initSocket } from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middlewares generales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Socket.io (toda la lógica de la partida en curso vive en memoria, no en MongoDB)
initSocket(server);

// Conexión a la base de datos y arranque del servidor
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/contrato21';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    server.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  });