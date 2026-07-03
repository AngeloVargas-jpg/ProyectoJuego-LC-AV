import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'cambia-esta-clave-en-produccion';

export function verificarToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No se envió un token válido' });
  }

  const token = header.split(' ')[1];

  try {
    const datos = jwt.verify(token, SECRET);
    req.user = datos;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

export { SECRET };