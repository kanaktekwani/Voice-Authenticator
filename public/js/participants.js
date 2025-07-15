window.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('participantList');
  list.textContent = 'Loading...';

  try {
    const res = await fetch('/api/meeting-participants');
    const data = await res.json();

    const users = data.participants || [];

    list.innerHTML = ''; // Clear loading text

    if (!users.length) {
      list.innerHTML = '<li>No participants found in this meeting.</li>';
      return;
    }

    for (const user of users) {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong style="color: ${user.ispremium ? '#FFD700' : '#fff'}">
          ${user.ispremium ? '⭐ ' : ''}${user.name}
        </strong><br/>
        <span style="font-size: 0.9em; color: #ccc;">(${user.email})</span>
      `;
      list.appendChild(li);
    }

  } catch (err) {
    console.error('❌ Failed to fetch participants:', err);
    list.textContent = 'Error loading participants.';
  }
});
