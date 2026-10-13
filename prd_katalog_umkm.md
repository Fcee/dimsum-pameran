# Master Product Requirements Document (PRD)

**Nama Produk:** Katalog UMKM Pro (Universal Jamstack E-commerce Standard)
**Versi:** 3.0 (Enterprise-Level Static Architecture)
**Status:** Approved for Implementation

## 1. Pendahuluan

### 1.1 Latar Belakang
UMKM dari berbagai sektor (Retail, F&B, Jasa) membutuhkan platform e-commerce mandiri yang profesional dan *feature-rich* untuk bersaing dengan *marketplace* besar, namun terhalang oleh biaya server dan kompleksitas maintenance. Dengan memanfaatkan arsitektur Jamstack (JavaScript, API, Markup), kita dapat membangun *Single Page Application* (SPA) atau *Progressive Web App* (PWA) berskala besar yang 100% gratis di-hosting di GitHub Pages (github.io).

### 1.2 Tujuan Produk
Menciptakan "Master Template" atau standar industri untuk katalog UMKM berbasis web statis. Sistem ini harus sangat modular, mendukung berbagai jenis bisnis, memiliki fitur interaksi pelanggan kelas atas secara *client-side*, dan tetap menggunakan WhatsApp sebagai gerbang pembayaran/penyelesaian akhir (Zero Payment Gateway Fees).

## 2. Target Pengguna & Kasus Penggunaan (Use Cases)

1. **Retail/Fashion:** Membutuhkan manajemen varian (ukuran, warna), *lookbook*, dan manajemen stok multi-item.
2. **Food & Beverage (F&B):** Membutuhkan opsi *add-ons* (topping, level pedas), jam buka/tutup toko dinamis, dan estimasi waktu.
3. **Jasa/Pemesanan:** Membutuhkan sistem kalender (*client-side booking*), slot waktu, dan portofolio layanan.
4. **Pelanggan:** Membutuhkan pengalaman UI/UX sekelas aplikasi *native*, sangat cepat, dan bisa diakses *offline*.

## 3. Tech Stack (Advanced Jamstack Ecosystem)

* **Hosting & CI/CD:** GitHub Pages + GitHub Actions (Automated build & deploy).
* **Frontend Framework:** Next.js (Static Export) / Nuxt.js / React.js + Vite.
* **Styling & UI:** Tailwind CSS, Headless UI, Framer Motion (untuk animasi setara *native app*).
* **Database & Content Management (Zero-Cost):**
  * **Decap CMS (sebelumnya Netlify CMS):** Terintegrasi langsung dengan GitHub. Pemilik UMKM login via UI admin ramah pengguna, data tersimpan otomatis sebagai Markdown/JSON di *repository*.
  * **Google Sheets API:** Alternatif untuk UMKM yang lebih nyaman menggunakan Spreadsheet (di-fetch secara statis saat *build time*).
* **Search Engine:** Fuse.js atau FlexSearch (Pencarian *full-text* dan *fuzzy* berkecepatan tinggi di sisi klien, tanpa server database).
* **State & Data Persistence:** Zustand / Redux Toolkit, LocalStorage, IndexedDB.
* **Performance:** Workbox (Advanced Service Workers untuk PWA tingkat lanjut).

## 4. Fitur Utama Terpusat (Enterprise-Level Features)

### 4.1 Hyper-Personalization & PWA
* **Full Offline Capability:** Katalog lengkap dan keranjang belanja tetap berfungsi tanpa internet (Sinkronisasi WA tertunda hingga online).
* **Dynamic Theming System:** Pemilik UMKM dapat mengubah warna (Primary, Secondary, Accent), font, dan layout *grid* hanya dengan mengubah satu file konfigurasi JSON.
* **Multi-Language (i18n):** Deteksi bahasa browser pengguna secara otomatis dan terjemahan konten (ID/EN) via JSON.
* **Loyalty Points (Local):** Sistem gamifikasi sederhana. Pelanggan mendapatkan "poin" tiruan yang tersimpan di browser setiap kali mereka menekan tombol "Beli via WA" (meningkatkan retensi).

### 4.2 Advanced Product Engine
* **Complex Variant & Add-on Matrix:** Mendukung logika bersarang. Contoh: Pilih "Kopi" -> Muncul opsi "Ukuran" -> Muncul opsi "Topping" -> Harga berubah otomatis.
* **Dynamic Bundling (Grosir):** Kalkulasi diskon *client-side* jika pelanggan membeli jumlah tertentu (e.g., Beli 3 diskon 10%).
* **Smart Availability:** Peringatan "Toko Tutup" berdasarkan jam operasi lokal (*client-side time check*), mengubah tombol "Beli" menjadi "Pre-Order".
* **Faceted Search & Filter:** Filter berlapis (Kategori + Harga + Rating + Ketersediaan) yang diaplikasikan seketika tanpa *loading* halaman.

### 4.3 Advanced Checkout & Omnichannel Integration
* **Smart WhatsApp Order Router:** 
  * Pesan tidak hanya rapi, tapi juga dienkode secara unik (e.g., menambahkan Order ID generik #ORD-1234) agar penjual mudah melacak.
  * Mendukung pembagian pesanan (Jika UMKM punya lebih dari 1 admin, sistem bisa merandom / *round-robin* nomor WA admin mana yang akan dihubungi).
* **Geotagging Sederhana:** Meminta izin lokasi browser untuk mengisi otomatis nama kota/kecamatan pelanggan di form pemesanan (opsional).
* **Abandonment Cart Recovery (Local):** Notifikasi PWA/Browser (*Push Notification* lokal) jika pengguna meninggalkan web saat ada barang di keranjang.

### 4.4 Analitik, SEO, dan Tracking
* **Dynamic OpenGraph SEO:** Meta tag dinamis saat web di-share ke WhatsApp, Facebook, atau Twitter (menampilkan gambar dan harga produk yang spesifik).
* **Event Tracking Terperinci:** Terhubung ke GA4/Meta Pixel untuk *scroll depth*, *add to cart*, *remove from cart*, dan *initiate checkout*.

## 5. Arsitektur Data Standar (Schema Mockup)

Skema dibuat sangat modular untuk mendukung berbagai UMKM:

```json
{
  "store_config": {
    "merchant_id": "MCHT-991",
    "name": "Klinik Sepatu & Kopi",
    "theme_preset": "elegant-dark",
    "business_type": "hybrid_retail_service",
    "operating_hours": {
      "timezone": "Asia/Jakarta",
      "open": "09:00",
      "close": "22:00"
    },
    "whatsapp_routers": ["628111111", "628222222"]
  },
  "catalog": [
    {
      "id": "ITEM-001",
      "type": "physical", 
      "title": "Sepatu Compass (Custom)",
      "base_price": 450000,
      "stock_status": "in_stock",
      "variants": [
        { "group": "Ukuran", "options": [{"name": "40", "price_add": 0}, {"name": "41", "price_add": 0}] },
        { "group": "Layanan Tambahan", "options": [{"name": "Waterproof Spray", "price_add": 50000}]}
      ]
    },
    {
      "id": "SRV-001",
      "type": "service",
      "title": "Cuci Sepatu Premium",
      "base_price": 75000,
      "booking_slots": ["10:00", "13:00", "15:00"]
    }
  ]
}
```

## 6. Rencana Implementasi & Deployment

1. **Fase 1: Core Engine (Web)** - Pembuatan UI/UX PWA, integrasi keranjang, Fuse.js, dan generator pesan WA.
2. **Fase 2: Headless CMS Integration** - Menghubungkan Decap CMS ke repositori GitHub agar klien UMKM bisa edit produk tanpa menyentuh kode.
3. **Fase 3: Multi-Template System** - Membuat *branch* atau direktori terpisah untuk *layout* spesifik (F&B layout, Fashion layout, Service layout).
4. **Fase 4: CI/CD Pipeline** - Konfigurasi GitHub Actions untuk *auto-build* setiap kali ada perubahan konten di CMS atau Google Sheets.