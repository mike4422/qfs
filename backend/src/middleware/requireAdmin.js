// backend/src/middleware/requireAdmin.js
export function requireAdmin(req, res, next) {
  if (req.user?.role === 'ADMIN') return next();
  return res.status(403).json({ error: 'Admin only' });
}
