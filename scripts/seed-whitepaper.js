const { Client } = require('pg');

const body = `# Konteks

TAMPARAN ANAK MUDA lahir dari sebuah keresahan sederhana: setiap hari, anak muda Indonesia dikonsumsi konten yang terlihat bermanfaat tapi sebenarnya tidak mengubah apa-apa. Video 60 detik, carousel motivasi, thread Twitter, semuanya dikonsumsi cepat, lalu dilupakan lebih cepat.

Whitepaper ini ditulis untuk menjawab dua pertanyaan: kondisi nyata generasi muda Indonesia hari ini, dan kenapa media tertulis dengan depth editorial dibutuhkan sekarang lebih dari sebelumnya.

## Data Generasi Muda Indonesia

### Keuangan

Data Survei OJK 2023 menunjukkan hanya 16,68% generasi muda (18-35 tahun) yang memiliki literasi keuangan. Angka ini naik dari tahun-tahun sebelumnya, tapi masih berarti 8 dari 10 anak muda tidak memahami produk keuangan dasar.

Sementara itu, data BPS 2023 mencatat tingkat pengangguran terbuka untuk kelompok usia 15-24 tahun mencapai 14,28%, jauh di atas rata-rata nasional 5,32%. Kelompok ini juga memiliki proporsi pekerja informal tertinggi.

### Karier dan Pendidikan

Laporan World Economic Forum (2023) menempatkan Indonesia di peringkat 65 dari 130 negara untuk Human Capital Index. Gap antara apa yang diajarkan di sekolah dan apa yang dibutuhkan industri masih lebar.

Data Kemendikbudristek 2023 menunjukkan 87,6% lulusan SMA melanjutkan ke perguruan tinggi, tapi hanya 21,4% yang merasa pendidikan mereka relevan dengan pekerjaan pertama (Survei BPS Transisi Sekolah-Kerja, 2022).

### Konsumsi Media

Riset Reuters Digital News Report 2023 menunjukkan konsumsi media anak muda Indonesia didominasi oleh video pendek (TikTok, Reels) dan carousel (Instagram). Hanya 18% yang rutin membaca artikel panjang di luar keperluan akademik.

Ini bukan masalah attention span. Ini masalah ekosistem: tidak banyak media Indonesia yang memproduksi konten tertulis dengan depth yang cukup untuk anak muda.

## Problem Media Indonesia

Media digital Indonesia hari ini menghadapi tiga masalah struktural:

1. **Clickbait economy**: Platform berbasis ad revenue mendorong judul sensasional. Konten yang penting jarang dapat distribusi yang layak.

2. **Konten pendek sebagai default**: Format video pendek dan carousel menjadi standar. Tidak ada ruang untuk analisis mendalam, nuansa, atau argumen berlapis.

3. **Tidak ada media tertulis untuk anak muda**: Ada banyak media berita, ada media lifestyle, tapi tidak ada editorial media tertulis yang khusus membahas uang, karier, bisnis, teknologi, dan kehidupan dengan tone yang jujur dan depth yang cukup.

## Posisi Editorial TAM

Kenapa kami memilih pendekatan "tamparan" bukan "pelukan"? Bukan karena kami senang mengkritik. Tapi karena terkadang yang kamu butuhkan bukan seseorang yang mengatakan "kamu pasti bisa", tapi seseorang yang mengatakan hal yang perlu didengar.

Kami tidak menulis "5 cara sukses". Kami menulis kenapa sistemnya begini, dan apa yang bisa kamu lakukan setelah memahaminya.

### Prinsip Editorial

- Setiap klaim ada sumbernya. Angka, data, dan kutipan selalu dicantumkan.
- Koreksi publik jika salah. Setiap artikel punya tanggal update dan catatan revisi.
- Tidak ada konten sponsored yang disamarkan. Konten editorial dan sponsored tidak pernah dicampur.
- Angle kritik sosial, bukan tips generik. Kami menulis kenapa, bukan hanya apa.

## Roadmap dan Solusi

TAM beroperasi dengan model yang berbeda dari media mainstream:

**Sekarang**: Editorial media tertulis di 6 topik (uang, karier, bisnis, teknologi, kehidupan, mindset), newsletter mingguan gratis, konten sosial sebagai distribution channel.

**6-12 bulan**: Digital products (template keuangan, career guide), sponsored content dari brand yang align, komunitas reader.

**12+ bulan**: Membership premium untuk deep dive series, kolaborasi penulis guest, event/workshop tertulis.

Akses gratis selamanya untuk konten editorial. Monetisasi lewat produk dan sponsorship, bukan membatasi akses.

## Referensi

1. Survei Nasional Literasi dan Inklusi Keuangan, OJK (2023)
2. BPS, Indikator Pasar Tenaga Kerja Indonesia (2023)
3. World Economic Forum, Human Capital Index (2023)
4. Kemendikbudristek, Statistik Pendidikan Tinggi (2023)
5. BPS, Survei Transisi Sekolah-Kerja (2022)
6. Reuters Institute, Digital News Report Indonesia (2023)
`;

const c = 'postgresql://postgres.ibjzssvimsmdxxekqshy:lGyVYuaIreHuD5UC@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';

(async () => {
  const cl = new Client({ connectionString: c, ssl: { rejectUnauthorized: false } });
  await cl.connect();
  const q = `INSERT INTO whitepapers (slug, title, subtitle, summary, body, reading_time, tags, status, published_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (slug) DO UPDATE SET body = $5, title = $2, summary = $4, updated_at = now()`;
  const vals = [
    'kondisi-generasi-muda-indonesia',
    'Kondisi Generasi Muda Indonesia: Data, Tantangan, dan Kenapa Media Tertulis Dibutuhkan',
    'Data, problem media, dan posisi editorial TAM',
    'Whitepaper pertama TAM: analisis kondisi nyata generasi muda Indonesia berbasis data, problem media digital, dan kenapa pendekatan tamparan dibutuhkan.',
    body,
    15,
    ['riset', 'media', 'generasi muda', 'data'],
    'published',
    new Date().toISOString(),
  ];
  await cl.query(q, vals);
  console.log('INSERTED');
  await cl.end();
})();
