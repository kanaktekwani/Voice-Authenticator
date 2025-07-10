// server/routes/whoami.js
import express from 'express';
const router = express.Router();

router.get('/whoami', (req, res) => {
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

  // Normalize IPv6-wrapped IPv4 if needed
  const ipv4Match = rawIp.match(/(\d{1,3}\.){3}\d{1,3}/);
  const ipv4 = ipv4Match ? ipv4Match[0] : 'Not detected';
  const ipv6 = rawIp.includes(':') ? rawIp : 'Not detected';

  console.log(`🌐 /whoami requested from IP: ${rawIp}`);

  res.json({
    rawIp,
    ipv4,
    ipv6,
    timestamp: new Date().toISOString()
  });
});

export default router;
