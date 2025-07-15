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
console.log("Login result:", result);

if (response.ok) {
  message.style.color = 'green';
  message.textContent = '✅ Login successful! Redirecting...';

  console.log("⏩ Redirecting to /participants.html...");
  setTimeout(() => {
    window.location.href = '/participants.html';
  }, 1000);
} else {
  console.error("❌ Login failed with:", result);
  message.style.color = 'red';
  message.textContent = result.error || '❌ Login failed.';
}

});
