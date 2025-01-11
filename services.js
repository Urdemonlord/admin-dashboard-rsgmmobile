const apiBaseUrl = 'http://localhost:5000/api'; // Ganti dengan URL backend kamu

// Fungsi untuk menampilkan form tambah layanan
function showAddServiceForm() {
    document.getElementById('addServiceForm').style.display = 'block';
}

// Fungsi untuk menambahkan layanan baru
async function addService() {
    const serviceName = document.getElementById('serviceName').value;

    try {
        const response = await fetch(`${apiBaseUrl}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-NoRM': 'ADMIN00' // Ganti dengan NoRM admin yang valid
            },
            body: JSON.stringify({ nama: serviceName }) // 'nama' adalah field untuk nama layanan
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('addServiceMessage').innerText = 'Layanan berhasil ditambahkan';
            document.getElementById('serviceForm').reset();
            loadServices(); // Muat ulang daftar layanan
        } else {
            throw new Error(result.message || 'Gagal menambahkan layanan');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('addServiceMessage').innerText = error.message;
    }
}

// Fungsi untuk membatalkan penambahan layanan
function cancelAddService() {
    document.getElementById('addServiceForm').style.display = 'none';
    document.getElementById('serviceForm').reset();
    document.getElementById('addServiceMessage').innerText = '';
}

// Fungsi untuk mengambil dan menampilkan data layanan
async function loadServices() {
    try {
        const response = await fetch(`${apiBaseUrl}/services`, {
            headers: {
                'X-NoRM': 'ADMIN00'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const services = await response.json();
        const tableBody = document.querySelector('#servicesTable tbody');
        tableBody.innerHTML = '';

        services.forEach(service => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service._id}</td>
                <td>${service.nama}</td>
                <td>
                    <button class="edit-btn" onclick="editService('${service._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteService('${service._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching services:', error);
    }
}

// Fungsi untuk edit layanan
function editService(serviceId) {
    // Implementasikan logika edit di sini
    console.log('Edit service:', serviceId);
}

// Fungsi untuk hapus layanan
async function deleteService(serviceId) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
        const response = await fetch(`${apiBaseUrl}/services/${serviceId}`, {
            method: 'DELETE',
            headers: {
                'X-NoRM': 'ADMIN00'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete service');
        }

        console.log('Service deleted successfully');
        loadServices(); // Muat ulang daftar layanan
    } catch (error) {
        console.error('Error deleting service:', error);
    }
}

// Panggil fungsi untuk memuat data layanan saat halaman dimuat
if (window.location.pathname.endsWith('services.html')) {
    checkAdminLogin();
    loadServices();
}