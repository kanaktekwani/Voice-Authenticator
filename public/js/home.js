window.addEventListener("DOMContentLoaded", async () => {
  const ipInfo = document.getElementById("ip-info");

  try {
    const response = await fetch("/whoami");
    const data = await response.json();

    ipInfo.textContent = `🌐 Your IP: ${data.ipv4 !== 'Not detected' ? data.ipv4 : data.ipv6}`;
  } catch (err) {
    console.error("Failed to fetch IP:", err);
    ipInfo.textContent = "⚠️ Unable to detect your IP address.";
  }
});
