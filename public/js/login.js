const form = document.getElementById('loginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (response.ok) {
    message.style.color = 'green';
    message.textContent = '✅ Login successful!';
  } else {
    message.style.color = 'red';
    message.textContent = result.error || '❌ Login failed.';
  }
});
