import { encrypt, decrypt } from './lib/session.js';

(async () => {
  const token = await encrypt({ userId: 'zoom_123', role: 'premium' });
  console.log('Encrypted token:', token);

  const data = await decrypt(token);
  console.log('Decrypted payload:', data);
})();
