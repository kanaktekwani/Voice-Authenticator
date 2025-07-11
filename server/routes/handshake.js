// routes/handshake.js
import express from 'express';
const router = express.Router();

router.post('/handshake', (req, res) => {
  const { device_id, mac, local_ip, public_ip } = req.body;

  console.log('🤝 Handshake received from device:', device_id);
  console.log(`   MAC: ${mac}, Local IP: ${local_ip}, Public IP: ${public_ip}`);

  res.json({
    message: "pong",
    timestamp: new Date().toISOString(),
    server_ack: true
  });
});

export default router;
