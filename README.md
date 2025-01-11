# Admin Dashboard - RSGM Unimus

Proyek ini adalah sebuah dashboard admin untuk RSGM Unimus yang memungkinkan pengelolaan dokter, layanan, janji temu, pasien, dan pengiriman notifikasi. Dashboard ini dibangun menggunakan HTML, CSS, dan JavaScript dengan komunikasi ke backend melalui API.

## Fitur

- **Login Admin**: Halaman login untuk admin.
- **Manajemen Dokter**: Tambah, edit, dan hapus dokter.
- **Manajemen Layanan**: Tambah, edit, dan hapus layanan.
- **Manajemen Janji Temu**: Melihat, mengupdate, dan menghapus janji temu.
- **Manajemen Pasien**: Melihat dan mencari pasien.
- **Broadcast Notifikasi**: Mengirim notifikasi ke peran tertentu.

## Struktur Proyek
/project-root
│
├── src
│ ├── backend
│ │ └── (kode backend Anda)
│ ├── frontend
│ │ ├── index.html
│ │ ├── login.html
│ │ ├── broadcast.html
│ │ ├── services.html
│ │ ├── doctors.html
│ │ ├── patients.html
│ │ ├── appointments.html
│ │ ├── script.js
│ │ ├── services.js
│ │ ├── doctors.js
│ │ ├── broadcast.js
│ │ └── styles.css
│ └── (file lainnya)
│
└── README.md

## Instalasi

1. Clone repositori ini:
   ```bash
   git clone <URL_REPOSITORI>
   ```

2. Masuk ke direktori proyek:
   ```bash
   cd <NAMA_FOLDER_PROYEK>
   ```

3. Jalankan server backend Anda (pastikan backend sudah berjalan di `http://localhost:5000/api`).

4. Buka file `index.html` di browser Anda untuk mengakses dashboard.

## Penggunaan

1. Masukkan kredensial admin di halaman login.
2. Setelah login, Anda dapat mengelola dokter, layanan, janji temu, dan pasien.
3. Gunakan fitur broadcast untuk mengirim notifikasi.

## Kontribusi

Jika Anda ingin berkontribusi, silakan buat pull request atau buka isu untuk diskusi.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).