export default function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }

  // 👇 You can now access this user in routes
  res.locals.user = req.session.user;
  next();
}
