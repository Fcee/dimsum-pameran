# Katalog Digital UMKM - Dimsum Titik Temu

Aplikasi Single Page Application (SPA) / Progressive Web App (PWA) Jamstack untuk katalog digital UMKM Dimsum pada ajang pameran kuliner (*Food Expo / Festival Jajanan*), dibangun sesuai standar **PRD Katalog UMKM Pro (Universal Jamstack E-commerce Standard)**.

## 1. Karakteristik Desain & Brand Identity

- **Palet 3 Warna Lucu (Fixed Base Palette):**
  - **Coral Dimsum (Primary):** `#FF6B6B` - Warna hangat, ceria, dan menggugah selera khas kukusan dimsum.
  - **Steamer Bamboo Cream (Secondary):** `#FFF9F0` / `#FFF2E0` - Latar belakang kanvas lembut dan ramah mata.
  - **Scallion Jade (Accent):** `#2E8B57` - Aksen hijau segar daun bawang untuk badge promo, rating, dan tombol aksi.
- **Tipografi Bubble Font:**
  - Menggunakan Google Font **Fredoka** untuk seluruh heading, tombol, badge, dan teks konten.
- **Nir-Emoji (0 Emoji):**
  - Seluruh antarmuka menggunakan vektor SVG dan ikon Lucide yang rapi, tajam, dan profesional.
- **Optimasi UI & UX Khusus Ponsel / HP (Mobile First):**
  - **Dock Navigasi Bawah (Mobile Bottom Nav):** Akses cepat 1 jempol untuk Daftar Menu, Koin Hadiah, Info Booth, dan Pengaturan Toko.
  - **Floating Cart Call-to-Action Pill:** Bar keranjang mengambang otomatis di layar bawah saat ada barang dipilih dengan info total porsi dan harga.
  - **Mobile Bottom-Sheet Modal:** Dialog kustomisasi pesanan dan nota WhatsApp beradaptasi menjadi lembar laci geser bawah (*bottom sheet*) dengan pegangan (*drag handle*) dan bantalan aman notch/gesture bar (`pb-safe`).
  - **Grid 2 Kolom Responsif:** Menu tampil 2 kolom di layar HP sehingga cepat ditelusuri tanpa scrolling berlebih.
  - **Pencegahan Zoom Otomatis iOS Safari:** Ukuran input dirancang agar tidak memicu zoom layar otomatis yang mengganggu saat mengetik.

---

## 2. Fitur Utama Sesuai PRD

### 2.1 Hyper-Personalization & PWA (PRD 4.1)
- **Kemampuan Offline Penuh:** Katalog dan keranjang belanja tetap dapat diakses saat koneksi internet pameran terputus dengan notifikasi ramah offline.
- **Sistem Tema Dinamis & Mock CMS:** Pengaturan toko (nama UMKM, nomor WhatsApp admin, jam buka/tutup) tersimpan dalam `storeConfig.json` dan dapat diubah langsung lewat laci pengaturan serta diunduh.
- **Multi-Language (i18n):** Mendukung pergantian bahasa instan antara Bahasa Indonesia (ID) dan Bahasa Inggris (EN).
- **Gamifikasi Koin Dimsum (Loyalty Points):** Pelanggan memperoleh +100 koin setiap kali mengirim pesanan ke WhatsApp, tersimpan di LocalStorage dengan tingkatan pangkat loyalti.

### 2.2 Advanced Product Engine (PRD 4.2)
- **Complex Variant & Add-on Matrix:** Mendukung logika varian bersarang (Penyajian Kukus Hangat vs Frozen Pack, Tingkat Pedas Chili Oil Szechuan, serta matriks add-ons saus mentai bakar).
- **Dynamic Bundling (Grosir):** Perhitungan diskon grosir otomatis di sisi klien (Beli 3 porsi diskon 10%, Beli 5 porsi diskon 15%) disertai banner panduan hemat interaktif.
- **Smart Availability:** Pengecekan jam operasional toko secara cerdas. Jika stand sedang tutup, tombol pesanan otomatis berubah menjadi mode **Pre-Order untuk Besok**. Terdapat simulator status buka/tutup untuk uji coba.
- **Faceted Search & Filter (Fuse.js):** Mesin pencari fuzzy berkecepatan tinggi di sisi browser tanpa server, terintegrasi filter level pedas dan sorting (populer, rating, harga).

### 2.3 Advanced Checkout & Omnichannel Integration (PRD 4.3)
- **Smart WhatsApp Order Router:**
  - Menghasilkan format nota teks yang rapi dan terstruktur dengan kode unik `#ORD-XXXXX`.
  - Mendukung pembagian pesanan (*round-robin multi-admin*) antara Admin Booth dan Admin Kasir.
  - Tombol salin teks nota dan tautan langsung ke aplikasi WhatsApp.
- **Deteksi Lokasi / Geotagging:** Tombol deteksi lokasi browser untuk mengisi otomatis catatan koordinat dan nama area pameran.
- **Pemulihan Keranjang (Abandonment Cart Recovery):** Banner pengingat otomatis jika terdapat barang yang belum diselesaikan saat membuka kembali web.

---

## 3. Tech Stack

- **Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **Search Engine:** Fuse.js
- **Icons:** Lucide React (Crisp SVG vector icons, Zero Emojis)
- **Visual Celebration:** Canvas-Confetti
- **State & Storage:** React Context API, LocalStorage

---

## 4. Cara Menjalankan Project

### Instalasi & Dev Server:
```bash
npm install
npm run dev
```
Akses aplikasi melalui browser di `http://localhost:3000`.

### Build untuk Produksi (GitHub Pages / Static Export):
```bash
npm run build
```
File siap di-deploy terletak pada folder `dist/`.

