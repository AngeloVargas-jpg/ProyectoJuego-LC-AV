import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { login } from './auth.controller.js';

vi.mock('../models/User.js');

function crearRespuestaFalsa() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  };
}

describe('login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve un token si el usuario y la contraseña son correctos', async () => {
    const usuarioFalso = {
      _id: 'id123',
      username: 'pepe',
      password: await bcrypt.hash('clave123', 10)
    };

    User.findOne.mockResolvedValue(usuarioFalso);

    const req = { body: { username: 'pepe', password: 'clave123' } };
    const res = crearRespuestaFalsa();

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensaje: 'Inicio de sesión correcto' })
    );
  });

  it('rechaza si el usuario no existe', async () => {
    User.findOne.mockResolvedValue(null);

    const req = { body: { username: 'fantasma', password: 'clave123' } };
    const res = crearRespuestaFalsa();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('rechaza si falta el usuario o la contraseña en la petición', async () => {
    const req = { body: { username: 'pepe' } };
    const res = crearRespuestaFalsa();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});