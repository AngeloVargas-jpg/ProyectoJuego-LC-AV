import User from '../models/User.js';

// GET /api/user/profile — datos del usuario autenticado
export async function obtenerPerfil(req, res) {
  try {
    const usuario = await User.findById(req.user.id).select('-password');

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    return res.json({ usuario });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el perfil', error: error.message });
  }
}

// GET /api/user/stats — victorias y derrotas históricas de la cuenta
export async function obtenerEstadisticas(req, res) {
  try {
    const usuario = await User.findById(req.user.id).select('victorias derrotas');

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    return res.json({
      victorias: usuario.victorias,
      derrotas: usuario.derrotas
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener estadísticas', error: error.message });
  }
}