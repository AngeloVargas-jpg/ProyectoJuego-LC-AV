import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { SECRET } from '../middleware/auth.middleware.js';

const RONDAS_BCRYPT = 10;

export async function registrar(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ mensaje: 'Falta usuario o contraseña' });
    }

    const existe = await User.findOne({ username });
    if (existe) {
      return res.status(409).json({ mensaje: 'Ese usuario ya existe' });
    }

    const passwordEncriptada = await bcrypt.hash(password, RONDAS_BCRYPT);

    const nuevoUsuario = await User.create({
      username,
      password: passwordEncriptada
    });

    return res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      usuario: { id: nuevoUsuario._id, username: nuevoUsuario.username }
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ mensaje: 'Falta usuario o contraseña' });
    }

    const usuario = await User.findOne({ username });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario._id, username: usuario.username },
      SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      mensaje: 'Inicio de sesión correcto',
      token,
      usuario: { id: usuario._id, username: usuario.username }
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
}

export function logout(req, res) {
  return res.json({ mensaje: 'Sesión cerrada' });
}