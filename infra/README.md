# Arsitektur & Panduan Load Balancer — Tamparan Anak Muda

Dokumen ini menjelaskan strategi dan metode load balancing terbaik untuk memastikan website **Tamparan Anak Muda** memiliki ketersediaan tinggi (*high availability*), toleran terhadap lonjakan trafik (*traffic spikes*), dan **tidak membebani CPU, memori, maupun koneksi database server**.

---

## 1. Apa Metode Load Balancing Terbaik untuk Next.js?

Dalam arsitektur web modern dengan Next.js (yang melayani kombinasi Server-Side Rendering / SSR, Dynamic API, dan Aset Statis), algoritma load balancing yang **paling optimal dan teruji** adalah:

### ⭐ **`least_conn` (Least Connections)**

### Mengapa Bukan Round Robin atau IP Hash?
* ❌ **Round Robin:** Membagi request secara berurutan (1, 2, 3...) secara "buta". Jika Server A sedang mengeksekusi request berat (misal AI digest cron atau SSR halaman panjang) yang memakan waktu 2 detik, Round Robin tetap akan mengirim request baru ke Server A. Akibatnya Server A bisa kehabisan RAM/CPU dan crash (*cascade failure*).
* ❌ **IP Hash / Sticky Session:** Memetakan user berdasarkan IP ke server tertentu. Untuk Next.js yang *stateless* (auth ditangani token JWT / Supabase Auth), sticky session tidak diperlukan dan justru menyebabkan ketimpangan beban jika banyak user berada di bawah satu IP ISP / kantor yang sama.
* ✅ **`least_conn` (Metode Terbaik):** Mengarahkan request baru secara dinamis **hanya ke instance yang memiliki koneksi aktif paling sedikit pada milidetik tersebut**. Jika Server A sedang sibuk, request berikutnya otomatis dialihkan ke Server B atau C yang sedang longgar.

---

## 2. Dua Skenario Penerapan

### Skenario A: Produksi Vercel + Cloudflare (Setup Utama TAM Saat Ini)
Jika website di-host di **Vercel** dengan DNS di **Cloudflare**:
1. **Edge Anycast Load Balancing (Layer 7):**
   Cloudflare dan Vercel secara otomatis mendistribusikan request ke 300+ data center terdekat dari pengunjung berdasarkan *latency-based routing*.
2. **Kunci agar Server Tidak Berat:**
   * **Static Assets Offloading:** Semua bundle `/_next/static` sudah dikonfigurasi dengan cache `immutable` 1 tahun di `vercel.json`.
   * **Stale-While-Revalidate (SWR):** Di `vercel.json`, halaman publik memiliki header `s-maxage=60, stale-while-revalidate=300`. Artinya pengunjung membaca dari Edge Cache CDN, dan server hanya melakukan render ulang di background setiap 60 detik sekali.
   * **Database Connection Load Balancing:** Di `.env.local`, pastikan selalu memakai `POSTGRES_URL=...?pgbouncer=true`. PgBouncer bertindak sebagai connection pooler sehingga 5.000 concurrent user tidak membuka 5.000 koneksi PostgreSQL (yang bisa mematikan database).
   * **Distributed Rate Limiting:** Menggunakan Upstash Redis (`UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`) di `lib/rate-limit.ts` untuk memblokir bot / serangan DDoS sebelum menyentuh logika aplikasi.

---

### Skenario B: Self-Hosted VPS / Multi-Server (Docker / Nginx / PM2)
Jika aplikasi di-deploy di VPS mandiri (DigitalOcean, AWS EC2, Hetzner, GCP), gunakan konfigurasi yang telah disediakan di folder `infra/`:

#### 1. Nginx Reverse Proxy & Load Balancer (`infra/nginx/nginx.conf`)
* Menggunakan algoritma **`least_conn`**.
* **Passive Health Check:** `max_fails=3 fail_timeout=10s` (otomatis mengisolasi instance yang mati atau error tanpa downtime bagi user).
* **Keepalive Connections:** `keepalive 64;` untuk menghindari overhead CPU dari pembuatan koneksi TCP berulang kali ke upstream.
* **Microcaching:** Cache respons SSR selama 30 detik untuk pengunjung anonim. 1.000 pengunjung bersamaan hanya menghasilkan 1x render CPU di Node.js, sisanya 999 request dilayani instan dari RAM Nginx.
* **Direct Static Serving:** Bypass Node.js sepenuhnya untuk file gambar, font, dan bundle JS/CSS.

#### 2. PM2 Cluster Mode di Single VPS (`infra/ecosystem.config.js`)
Node.js bersifat *single-threaded*. Jika server memiliki 4 atau 8 core CPU, jalankan:
```bash
pm2 start infra/ecosystem.config.js
```
PM2 akan otomatis membuat worker sejumlah core CPU (`instances: 'max'`) dan membagi beban antar-core secara internal dengan zero-downtime reload.

#### 3. Docker Compose 3-Replica Cluster (`infra/docker-compose.yml`)
Untuk menjalankan 3 container Next.js di belakang Nginx Load Balancer:
```bash
cd infra
docker compose up -d --build
```
Struktur topologi:
```
Internet / User
       │
       ▼
[ Cloudflare CDN & DDoS Protection ]
       │
       ▼
[ Nginx Load Balancer (least_conn + Microcache) ]
       ├───► [ Next.js Instance 1 (Port 3000) ]
       ├───► [ Next.js Instance 2 (Port 3000) ]
       └───► [ Next.js Instance 3 (Port 3000) ]
                      │
                      ▼
         [ Supabase / PgBouncer Pool ]
```

---

## 3. Checklist Tiga Lapis Pertahanan Server

1. **Lapis 1 (Edge / CDN):** Cloudflare Turnstile + Caching (Menghalau 80–90% trafik sebelum sampai ke server).
2. **Lapis 2 (Load Balancer):** Nginx `least_conn` + Keepalive + Microcache (Menyeimbangkan sisa trafik ke worker yang paling longgar).
3. **Lapis 3 (Database):** PgBouncer Transaction Pooling (Mencegah lonjakan koneksi database).
