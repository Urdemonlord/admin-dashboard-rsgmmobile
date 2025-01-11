const apiBaseUrl = 'http://localhost:5000/api'; // Ganti dengan URL backend kamu

async function sendBroadcast() {
  const message = document.getElementById('message').value;
  const role = document.getElementById('role').value;

  try {
    const response = await fetch(`${apiBaseUrl}/notifications/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NoRM': 'ADMIN00', // Ganti dengan NoRM admin yang valid
      },
      body: JSON.stringify({ message, role }),
    });

    const result = await response.json();
    if (response.ok) {
      document.getElementById('broadcastMessage').innerText = 'Notifikasi berhasil dikirim';
    } else {
      throw new Error(result.message || 'Terjadi kesalahan saat mengirim notifikasi');
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('broadcastMessage').innerText = `Gagal mengirim notifikasi: ${error.message}`;
  }
}
