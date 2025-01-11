// URL dasar API backend kamu. Ganti dengan URL yang sesuai.
const apiBaseUrl = "http://localhost:5000/api"; // Ganti dengan URL backend kamu

// Fungsi untuk handle login admin
async function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  try {
    const response = await fetch(`${apiBaseUrl}/users/admin/login`, {
      // Endpoint untuk login admin
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Simpan data admin di localStorage (sementara)
      localStorage.setItem("adminData", JSON.stringify(data.user)); // Data user dari backend (berisi username dan role)
      errorMessage.textContent = "";
      window.location.href = "index.html"; // Arahkan ke dashboard
    } else {
      errorMessage.textContent = data.message || "Login failed";
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    errorMessage.textContent = "Login failed";
  }
}

// Fungsi untuk cek apakah user sudah login sebagai admin
function checkAdminLogin() {
  const adminData = localStorage.getItem("adminData");
  if (!adminData) {
    // Redirect ke halaman login jika belum login
    window.location.href = "login.html";
  } else {
    // Parse data admin dan gunakan jika diperlukan
    const admin = JSON.parse(adminData);
    console.log("Admin logged in:", admin);
    // Di sini Anda bisa menampilkan informasi admin di halaman atau melakukan aksi lain
    if (admin.role !== "admin") {
      // Arahkan ke halaman login jika bukan admin
      window.location.href = "login.html";
    }
  }
}

// Fungsi untuk mengambil data appointments dan menampilkannya di tabel
async function loadAppointments() {
  try {
    const response = await fetch(`${apiBaseUrl}/appointments`, {
      headers: {
        "Content-Type": "application/json",
        "X-NoRM": "ADMIN00", // Ganti dengan NoRM admin yang valid (sementara)
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const appointments = await response.json();
    const tableBody = document.querySelector("#appointmentsTable tbody");
    tableBody.innerHTML = ""; // Clear existing data

    appointments.forEach((appointment) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${appointment._id}</td>
        <td>${appointment.nama}</td>
        <td>${appointment.dokter.nama}</td>
        <td>${appointment.layanan}</td>
        <td>${formatDate(appointment.tanggal)}</td>
        <td>${appointment.waktu}</td>
        <td>${appointment.status}</td>
        <td>
          <select data-id="${
            appointment._id
          }" onchange="updateAppointmentStatus(this)">
            <option value="Menunggu" ${
              appointment.status === "Menuggu" ? "selected" : ""
            }>Menunggu</option>
            <option value="Terkonfrimasi" ${
              appointment.status === "Terkonfirmasi" ? "selected" : ""
            }>Terkonfirmasi</option>
            <option value="Selesai" ${
              appointment.status === "Selesai" ? "selected" : ""
            }>Selesai</option>
            <option value="Dibatalkan" ${
              appointment.status === "Dibatalkan" ? "selected" : ""
            }>Dibatalkan</option>
          </select>
          <button class="update-btn" onclick="updateAppointment('${
            appointment._id
          }')">Update</button>
          <button class="delete-btn" onclick="deleteAppointment('${
            appointment._id
          }')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
}

// Fungsi untuk memperbarui status appointment
async function updateAppointmentStatus(selectElement) {
  const appointmentId = selectElement.dataset.id;
  const newStatus = selectElement.value;

  try {
    const response = await fetch(
      `${apiBaseUrl}/appointments/${appointmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-NoRM": "ADMIN00", // Ganti dengan NoRM admin yang valid (sementara)
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update appointment status");
    }

    console.log("Appointment status updated successfully");
  } catch (error) {
    console.error("Error updating appointment status:", error);
  }
}

// Fungsi untuk menghapus appointment
async function deleteAppointment(appointmentId) {
  if (!confirm("Are you sure you want to delete this appointment?")) return;

  try {
    const response = await fetch(
      `${apiBaseUrl}/appointments/${appointmentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-NoRM": "ADMIN00", // Ganti dengan NoRM admin yang valid (sementara)
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete appointment");
    }

    console.log("Appointment deleted successfully");
    loadAppointments(); // Reload the appointments list
  } catch (error) {
    console.error("Error deleting appointment:", error);
  }
}


// Fungsi untuk memformat tanggal
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

// Fungsi untuk mengambil data pasien dan menampilkannya di tabel
async function loadPatients() {
  try {
    const response = await fetch(`${apiBaseUrl}/users/pasien`, {
      headers: {
        "Content-Type": "application/json",
        "X-NoRM": "ADMIN00", // Ganti dengan NoRM admin yang valid (sementara)
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const patients = await response.json();
    const tableBody = document.querySelector("#patientsTable tbody");
    tableBody.innerHTML = ""; // Clear existing data

    patients.forEach((patient) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${patient.noRM}</td>
                <td>${patient.nama}</td>
                <td>${patient.noTelp}</td>
                <td>${patient.email}</td>
                <td>
                    <button class="edit-btn" onclick="viewPatientDetails('${patient._id}')">View Details</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
  }
}

// Fungsi untuk mencari pasien
function searchPatients() {
  const searchText = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const tableBody = document.querySelector("#patientsTable tbody");
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const noRM = row.cells[0].textContent.toLowerCase();
    const nama = row.cells[1].textContent.toLowerCase();
    const noTelp = row.cells[2].textContent.toLowerCase();
    const email = row.cells[3].textContent.toLowerCase();

    if (
      noRM.includes(searchText) ||
      nama.includes(searchText) ||
      noTelp.includes(searchText) ||
      email.includes(searchText)
    ) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Event listener untuk input pencarian
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", searchPatients);
}

// Fungsi untuk melihat detail pasien
function viewPatientDetails(userId) {
  // Implementasikan logika untuk menampilkan detail pasien
  console.log("View details for user ID:", userId);
}

// Event listener untuk form login admin
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", handleAdminLogin);
}

// Fungsi untuk logout admin
function logout() {
  localStorage.removeItem('adminData'); // Hapus data admin dari localStorage
  window.location.href = 'login.html'; // Redirect ke halaman login
}

// Fungsi untuk memuat data dashboard
async function loadDashboardData() {
  try {
    const response = await fetch(`${apiBaseUrl}/admin/dashboard`, {
        headers: {
            "Content-Type": "application/json",
            "X-NoRM": "ADMIN00", // Ganti dengan NoRM admin yang valid
        },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    const data = await response.json();

    // Update elemen HTML dengan data yang diterima
    document.getElementById('total-appointments').innerText = data.data.totalAppointments;
    document.getElementById('today-appointments').innerText = data.data.todayAppointments;
    document.getElementById('total-doctors').innerText = data.data.totalDoctors;
    document.getElementById('total-patients').innerText = data.data.totalPatients;
    // Update data lainnya sesuai kebutuhan
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
}

// Panggil fungsi untuk memuat data saat halaman dimuat
if (window.location.pathname.endsWith('appointments.html')) {
    checkAdminLogin();
    loadAppointments();
} else if (window.location.pathname.endsWith('patients.html')) {
    checkAdminLogin();
    loadPatients();
} else if (window.location.pathname.endsWith('index.html')) {
    checkAdminLogin();
    loadDashboardData(); // Memanggil fungsi loadDashboardData
}

document.getElementById('logoutButton').addEventListener('click', function () {
    // Simulasi logout
    const confirmLogout = confirm('Apakah Anda yakin ingin logout?');
    if (confirmLogout) {
      // Hapus data user dari localStorage/sessionStorage (jika ada)
      sessionStorage.clear();
      localStorage.clear();
  
      // Redirect ke halaman login
      window.location.href = 'login.html'; // Ganti dengan URL halaman login Anda
    }
  });
  