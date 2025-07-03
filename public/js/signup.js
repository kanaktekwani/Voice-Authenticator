const form = document.getElementById('signup-form');
const message = document.getElementById('message');
const signupBtn = document.getElementById('signupBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  message.textContent = '';
  signupBtn.disabled = true;

  const email = form.email.value.trim();
  const name = form.name.value.trim();
  const password = form.password.value;
  const deviceId = form.deviceId.value.trim();
  const isPremium = deviceId !== '';

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password, deviceId, isPremium }),
    });

    const data = await response.json();

    if (response.ok) {
      message.style.color = 'var(--success-color)';
      message.textContent = '✅ Signup successful! Redirecting...';
      setTimeout(() => window.location.href = '/login.html', 1500);
    } else {
      message.style.color = 'var(--error-color)';
      message.textContent = data.error || '❌ Signup failed.';
      signupBtn.disabled = false;
    }
  } catch (err) {
    console.error('Signup error:', err);
    message.style.color = 'var(--error-color)';
    message.textContent = '❌ An unexpected error occurred.';
    signupBtn.disabled = false;
  }
});
