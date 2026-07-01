# Payment.md - Donation & Support Payment
# TAMPARAN ANAK MUDA Website

**Versi:** 1.1  
**Status:** Draft - spec untuk integrasi Louvin payment gateway + error handling + analytics cross-ref

---

## 1. Tujuan

Memungkinkan pembaca yang ingin mendukung TAMPARAN ANAK MUDA secara finansial melalui donasi / support payment. Fitur ini adalah **voluntary support**, bukan paywall - semua konten tetap gratis.

---

## 2. Payment Provider

**Louvin** (louvin.dev) - payment gateway untuk penerimaan QRIS, GoPay, ShopeePay, dan Virtual Account tanpa verifikasi bisnis formal.

- **Base URL:** `https://api.louvin.dev`
- **Auth:** Header `x-api-key`
- **Webhook:** HTTP POST saat status transaksi berubah
- **Dokumentasi lengkap:** lihat `docx-payment.md` di root project

---

## 3. Fitur & Scope

### In Scope
- Halaman `/dukung` dengan pilihan nominal donasi
- Pilihan metode pembayaran: QRIS, GoPay, ShopeePay, BNI VA, BRI VA, Permata VA, CIMB Niaga VA
- Backend proxy untuk create transaction dan webhook
- Tabel `donations` untuk menyimpan record transaksi
- Halaman `/dukung/terima-kasih` setelah pembayaran sukses
- Email notifikasi (opsional via Brevo) setelah donasi settled

### Out of Scope
- Recurring donation / subscription
- Refund automation (manual via Louvin dashboard)
- Invoice PDF
- Multi-currency

---

## 4. User Flow

```
[User baca artikel / tentang]
      │
      ▼
[Melihat CTA "Dukung TAM"]
      │
      ▼
[Klik CTA] → Event: donation_cta_click
      │
      ▼
[Halaman /dukung]
      │
      ▼
[User pilih nominal: 25.000 / 50.000 / 100.000 / custom]
      │
      ▼
[User pilih metode pembayaran]
      │
      ▼
[Klik "Lanjutkan Pembayaran"] → Event: donation_checkout_initiated
      │
      ▼
[POST /api/donation/create] → Server call Louvin API
      │
      ▼
[Tampil QRIS / VA / deeplink]
      │
      ├── QRIS: tampil QR code + countdown expired
      ├── VA: tampil nomor VA + bank + countdown
      └── E-Wallet: redirect ke deeplink
      │
      ▼
[User bayar] → Webhook Louvin → /api/donation/webhook
      │
      ▼
[Status: settled] → Simpan ke tabel donations
      │
      ▼
[Redirect ke /dukung/terima-kasih]
      │
      ▼
[Event: donation_success]
```

---

## 5. API Endpoints (Internal)

### `POST /api/donation/create`

Create transaction via backend proxy.

**Request Body:**
```json
{
  "amount": 50000,
  "payment_type": "qris",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "message": "Terus berkarya!" // optional
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "uuid",
    "amount": 50750,
    "fee": 750,
    "net_amount": 50000,
    "status": "pending",
    "reference": "...",
    "created_at": "..."
  },
  "payment": {
    "order_id": "...",
    "payment_type": "qris",
    "qr_string": "...",
    "payment_number": "...",
    "expired_at": "...",
    "total_payment": 50750
  }
}
```

### `POST /api/donation/webhook`

Menerima webhook dari Louvin.

**Handler:**
- Verifikasi webhook secret (jika tersedia) atau signature
- Update record `donations` berdasarkan `transaction_id`
- Trigger event `donation_success` atau `donation_failed`
- Kirim email terima kasih (Brevo) jika settled
- Return HTTP 200

### `GET /api/donation/status?id=TRANSACTION_ID`

Check status untuk polling (fallback jika webhook terlambat/gagal).

---

## 6. Database Schema

Tambahkan tabel `donations`:

```sql
create table donations (
  id uuid primary key default gen_random_uuid(),
  louvin_transaction_id uuid unique not null,
  reference text unique not null,
  amount integer not null,               -- Total customer bayar (termasuk fee)
  fee integer not null,
  net_amount integer not null,           -- Yang diterima TAM
  payment_type text not null,
  status text not null default 'pending' check (status in ('pending', 'settled', 'failed')),
  customer_name text,
  customer_email text,
  message text,                          -- Pesan dari donor (opsional)
  payment_data jsonb,                    -- QR string / VA number / deeplink
  settled_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_donations_status on donations(status);
create index idx_donations_reference on donations(reference);
create index idx_donations_created_at on donations(created_at desc);
```

RLS:
```sql
alter table donations enable row level security;

-- Public: tidak bisa read/write langsung
-- Admin: read-only untuk dashboard

create policy "admin_read_donations"
  on donations for select to authenticated
  using (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
```

---

## 7. Environment Variables

Tambahkan di `.env`:

```env
# Louvin Payment Gateway
LOUVIN_API_KEY=                    # Server-only. Dimulai dengan lv_. JANGAN expose ke client.
LOUVIN_WEBHOOK_SECRET=              # Optional: jika Louvin support webhook signature verification
LOUVIN_PROJECT_SLUG=tamparananakmuda

# Public info
NEXT_PUBLIC_LOUVIN_ENABLED=false    # Toggle fitur donasi (true saat siap production)
```

---

## 8. Security & Privacy

- **API Key Louvin server-only.** Jangan pernah di frontend.
- **Webhook endpoint:** return 200 selalu, bahkan saat error internal.
- **Validasi input:** amount > 0, payment_type valid, QRIS min Rp 1.500.
- **Rate limiting:** max 5 create-transaction per IP per jam.
- **Jangan simpan data sensitif:** tidak perlu menyimpan nomor VA/QR setelah expired, kecuali untuk debugging.
- **Logging:** log transaction ID, jangan log API key atau webhook secret.

---

## 9. Analytics Events

Detail lengkap analytics events ada di `Analytics.md` Section 3 (Phase 2 Event Catalog). Tabel ini adalah ringkasan.

| Event | Trigger | Properties |
|---|---|---|
| `donation_cta_click` | Klik CTA dukung | `location` |
| `donation_page_view` | View `/dukung` | - |
| `donation_amount_selected` | Pilih nominal | `amount` |
| `donation_checkout_initiated` | Klik lanjutkan | `amount`, `paymentType` |
| `donation_checkout_success` | Server response OK | `amount`, `paymentType`, `transactionId` |
| `donation_checkout_fail` | Server response error | `amount`, `paymentType`, `error` |
| `donation_success` | Webhook settled | `amount`, `paymentType`, `transactionId` |
| `donation_failed` | Webhook failed | `amount`, `paymentType`, `transactionId` |
| `donation_thankyou_view` | View `/dukung/terima-kasih` | `amount`, `paymentType` |

---

## 10. UI/UX Notes

- CTA: "Dukung TAM" - bukan "Donasi" saja, lebih personal.
- Copy: "Semua konten TAM tetap gratis. Dukungan kamu membantu kami terus berkarya."
- Nominal preset: Rp 25.000, Rp 50.000, Rp 100.000, Rp 200.000, custom.
- Tampilkan fee transparan: "Total: Rp 50.750 (termasuk fee Rp 750)"
- QRIS: tampil QR code + expired countdown 15 menit.
- VA: tampil nomor VA + tombol copy + bank.
- E-Wallet: deeplink button.
- Loading state saat create transaction.
- Error state: actionable, tidak blame user.

---

## 11. Implementation Order

1. Setup `LOUVIN_API_KEY` env var di staging.
2. Buat tabel `donations` via migration.
3. Implement `/api/donation/create` dengan rate limiting.
4. Implement `/api/donation/webhook` dengan idempotency.
5. Buat halaman `/dukung`.
6. Tambahkan CTA di artikel dan footer.
7. Setup webhook URL di dashboard Louvin.
8. Test end-to-end dengan nominal kecil.
9. Enable `NEXT_PUBLIC_LOUVIN_ENABLED=true` di production.

---

## 12. Error Handling Flow

### Louvin API Down (create transaction)
```
[POST /api/donation/create]
      │
      ├── Louvin API timeout / 5xx
      │   ├── Return 503 ke client
      │   ├── Tampilkan: "Server pembayaran sedang sibuk. Coba lagi sebentar."
      │   ├── Log ke Sentry dengan context (amount, paymentType, IP)
      │   └── Jangan simpan record di tabel donations
      │
      └── Louvin API 4xx (invalid request)
          ├── Return 400 ke client
          ├── Tampilkan: "Ada yang salah dengan permintaan ini. Coba metode lain."
          └── Log ke Sentry
```

### Webhook Fail / Not Received
```
[Webhook tidak diterima dalam 5 menit]
      │
      ▼
[Polling fallback: GET /api/donation/status?reference=xxx]
      │
      ├── Status: pending (masih menunggu)
      │   └── Client polling setiap 30 detik, max 10 menit
      │
      ├── Status: settled
      │   └── Update tabel donations, redirect ke thank you page
      │
      └── Status: failed / expired
          └── Update tabel donations, tampilkan pesan error
```

### QRIS / VA Expired
```
[Countdown timer reaches 0]
      │
      ▼
[QR code blur + pesan: "QR expired, silakan buat transaksi baru"]
      │
      ▼
[Button: "Buat Transaksi Baru"] → redirect ke /dukung
```

### Idempotency Check
```
[Webhook diterima dengan reference yang sudah ada]
      │
      ▼
[Cek tabel donations: reference sudah exists?]
      │
      ├── Yes dan status sama → return 200, skip update (idempotent)
      └── Yes dan status beda → update status, return 200
```

---

## 13. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Jul 2026 | Initial spec Louvin donation integration. |
| 1.1 | Jul 2026 | Added error handling flow (API down, webhook fail, QRIS/VA expired, idempotency), analytics events cross-reference to Analytics.md. |
