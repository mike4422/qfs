// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'; // or use process.env.JWT_SECRET

function _authImpl(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' '); // "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET || process.env.JWT_SECRET || '');
    req.user = {
      id: payload.sub ?? payload.id,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Export both names to satisfy all imports in your codebase
export const auth = _authImpl;
export const authMiddleware = _authImpl;
export default _authImpl; // (optional, for any default imports)
