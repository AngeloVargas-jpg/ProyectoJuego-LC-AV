import { Router } from 'express';
import { verificarToken } from '../middleware/auth.middleware.js';
import { obtenerPerfil, obtenerEstadisticas } from '../controllers/user.controller.js';

const router = Router();

// Ambas rutas requieren estar logueado (token JWT válido en el header Authorization)
router.get('/profile', verificarToken, obtenerPerfil);
router.get('/stats', verificarToken, obtenerEstadisticas);

export default router;