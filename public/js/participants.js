document.addEventListener("DOMContentLoaded", async () => {
  const listEl = document.getElementById('participantList');
  listEl.innerHTML = 'Loading...';

  try {
    const res = await fetch('/api/meeting-participants');
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Failed to load participants');

    if (data.participants.length === 0) {
      listEl.innerHTML = '<li>No participants found.</li>';
      return;
    }

    listEl.innerHTML = '';
    data.participants.forEach((user) => {
      const li = document.createElement('li');
      li.textContent = `${user.name} (${user.email})`;
      listEl.appendChild(li);
    });
  } catch (err) {
    listEl.innerHTML = `<li>Error loading participants: ${err.message}</li>`;
  }
});
