const apiBaseUrl = 'http://localhost:5000/api'; // Ganti dengan URL backend kamu

// Fungsi untuk menampilkan form tambah dokter
function showAddDoctorForm() {
    document.getElementById('addDoctorForm').style.display = 'block';
}

// Fungsi untuk menambahkan dokter baru
async function addDoctor() {
    const nama = document.getElementById('nama').value;
    const spesialis = document.getElementById('spesialis').value;
    const jam = document.getElementById('jam').value;
    const ruangan = document.getElementById('ruangan').value;

    try {
        const response = await fetch(`${apiBaseUrl}/doctors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-NoRM': 'ADMIN00' // Ganti dengan NoRM admin yang valid
            },
            body: JSON.stringify({ nama, spesialis, jam, ruangan })
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('addDoctorMessage').innerText = 'Dokter berhasil ditambahkan';
            document.getElementById('doctorForm').reset();
            loadDoctors(); // Muat ulang daftar dokter
        } else {
            throw new Error(result.message || 'Gagal menambahkan dokter');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('addDoctorMessage').innerText = error.message;
    }
}

// Fungsi untuk membatalkan penambahan dokter
function cancelAddDoctor() {
    document.getElementById('addDoctorForm').style.display = 'none';
    document.getElementById('doctorForm').reset();
    document.getElementById('addDoctorMessage').innerText = '';
}

// Fungsi untuk mengambil dan menampilkan data dokter
async function loadDoctors() {
    try {
        const response = await fetch(`${apiBaseUrl}/doctors`, {
            headers: {
                'X-NoRM': 'ADMIN00'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const doctors = await response.json();
        const tableBody = document.querySelector('#doctorsTable tbody');
        tableBody.innerHTML = '';

        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor._id}</td>
                <td>${doctor.nama}</td>
                <td>${doctor.spesialis}</td>
                <td>${doctor.jam}</td>
                <td>${doctor.ruangan}</td>
                <td>
                    <button class="edit-btn" onclick="editDoctor('${doctor._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteDoctor('${doctor._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}

// Fungsi untuk edit dokter
function editDoctor(doctorId) {
    // Implementasikan logika edit di sini
    console.log('Edit doctor:', doctorId);
}

// Fungsi untuk hapus dokter
async function deleteDoctor(doctorId) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    try {
        const response = await fetch(`${apiBaseUrl}/doctors/${doctorId}`, {
            method: 'DELETE',
            headers: {
                'X-NoRM': 'ADMIN00'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete doctor');
        }

        console.log('Doctor deleted successfully');
        loadDoctors(); // Muat ulang daftar dokter
    } catch (error) {
        console.error('Error deleting doctor:', error);
    }
}

// Panggil fungsi untuk memuat data dokter saat halaman dimuat
if (window.location.pathname.endsWith('doctors.html')) {
    checkAdminLogin();
    loadDoctors();
}