import { writeFileSync, mkdirSync } from 'fs';

mkdirSync('/tmp/tam-seri-drafts', { recursive: true });

const SERIES = "kesehatan-mental-era-digital";

// ============================================================
// PART 1: TikTok Self-Diagnosis
// ============================================================
const part1 = {
  title: "TikTok Bukan Terapis: Algoritma Menciptakan Gejala, Bukan Mengidentifikasi",
  slug: "kesehatan-mental-era-digital-part-1-tiktok-diagnosis",
  excerpt: "76% pengguna TikTok adalah Gen Z. Algoritma tidak mengidentifikasi penyakit, algoritma menciptakan gejala melalui self-fulfilling prophecy kesehatan mental.",
  body: `## Hook

Semua bilang TikTok bikin Gen Z sadar kesehatan mental. Data bilang sebaliknya: TikTok tidak mengidentifikasi penyakit, TikTok menciptakan gejala.

Buka FYP kamu sekarang. Hitung berapa video yang menampilkan seseorang menjelaskan gejala ADHD, autism, trauma, atau anxiety. Lalu hitung berapa video yang menampilkan solusi profesional. Angka pertama akan jauh lebih banyak. Dan itu bukan kebetulan.

## Konteks

TikTok punya 194 juta pengguna aktif pada 2025, dengan kelompok usia 18-24 tahun sebagai dominan, menurut data Jurnal Pendidikan dan Ilmu Islam 2025. Penelitian oleh Febriana dan Amalia pada 2024 menemukan bahwa 76% pengguna TikTok didominasi Gen Z. Di saat yang sama, 81% Gen Z mencari informasi kesehatan secara online, menurut Pew Research Center yang dikutip Normansyah pada 2025.

Kenapa ini masalah? Karena sumber informasi kesehatan mental di TikTok bukanlah psikolog atau psikiater. Sumbernya adalah kreator konten yang mungkin punya pengalaman personal, tapi tidak punya kualifikasi klinis. Dan algoritma tidak membedakan antara keduanya.

Fenomena ini sudah mulai dibahas, termasuk di artikel [TikTok Bukan Terapis: Bahaya Self-Diagnosis Kesehatan Mental](/artikel/tiktok-bukan-terapis-bahaya-self-diagnosis-kesehatan-mental). Tapi masalahnya lebih dalam dari sekadar "sumber tidak kredibel."

## Algoritma sebagai Terapis Palsu

Algoritma TikTok bekerja dengan prinsip sederhana: konten yang mendapat engagement tinggi ditampilkan ke lebih banyak orang. Konten tentang kesehatan mental mendapat engagement tinggi karena emosi. Dan algoritma tidak peduli apakah konten itu akurat atau tidak.

Penelitian oleh Pariser pada 2011 dan Cindelli et al. pada 2021, yang dikutip K-PIN Bulletin 2025, menunjukkan bahwa algoritma menciptakan filter bubble dan echo chamber. Artinya, setelah kamu menonton satu video tentang gejala ADHD, algoritma menampilkan video serupa lagi dan lagi. Semakin banyak kamu tonton, semakin kuat keyakinanmu bahwa kamu memang memiliki kondisi tersebut.

Yang jarang disadari: algoritma merekam interaksi mikro. Bukan hanya like atau comment, tapi milidetik kamu berhenti scroll, repeat view, dan berapa lama kamu membaca komentar. Semua ini menjadi data yang dipakai untuk memperkuat filter bubble. Kamu tidak sadar dianalisis, tapi setiap gerakanmu direkam dan dijadikan input untuk menentukan apa yang muncul berikutnya di FYP.

## Self-Fulfilling Prophecy

Inilah bagian yang tidak dibahas banyak orang. Self-diagnosis di TikTok tidak sekadar "salah diagnosa." Ini lebih kejam dari itu.

Penelitian oleh Febriana dan Amalia pada 2024 menemukan bahwa self-diagnosis menyebabkan gangguan aktivitas harian, penurunan energi, penurunan mood, dan meningkatnya kepekaan emosional. Artinya, sebelum kamu "tahu" kamu punya ADHD, kamu mungkin hanya kadang susah fokus. Setelah kamu "tahu" dari TikTok, kamu mulai memperhatikan setiap kali kamu susah fokus, mengkonfirmasi diagnosa sendiri, dan perilaku kamu berubah sesuai label yang kamu tempel pada dirimu.

Yang lebih mengejutkan: penelitian oleh Ocktaviani pada 2025 di Universitas Mercu Buana menemukan bahwa literasi kesehatan mental tidak berpengaruh signifikan terhadap kecenderungan self-diagnosis. Artinya, masalahnya bukan kamu kurang pengetahuan. Masalahnya adalah desain algoritma yang terlalu efektif membuat kamu percaya.

Self-diagnosis kesehatan mental di TikTok terjadi ketika algoritma menampilkan konten tentang kondisi mental tertentu secara berulang, menciptakan filter bubble yang memperkuat keyakinan individu bahwa mereka memiliki kondisi tersebut. Studi menunjukkan literasi kesehatan mental tidak berpengaruh signifikan terhadap kecenderungan self-diagnosis, yang berarti masalahnya bukan kurang pengetahuan, tapi desain algoritma yang menciptakan self-fulfilling prophecy.

## Dari "Tahu" ke "Candu"

Setelah kamu "tahu" sakitmu, kamu cari obat. Dan kamu mencarinya di platform yang sama: TikTok. Obat yang kamu temukan terlihat seperti perawatan diri. Video-video tentang self-care, healing, dan mindfulness membanjiri FYP kamu.

Tapi apakah ini benar-benar menyembuhkan, atau hanya mengganti satu candu dengan candu yang lebih estetik?

Coba perhatikan polanya. Kamu tonton video tentang gejala ADHD, algoritma menampilkan lebih banyak, kamu mulai percaya kamu punya ADHD, lalu algoritma beralih ke konten "healing" yang juga membuat kamu stay di app. Dari diagnosa ke "obat", semuanya terjadi di platform yang sama. Dan platform yang sama menghasilkan uang dari setiap detik kamu scroll.

Ini yang disebut candu yang dikemas ulang: kamu pikir kamu mencari kesembuhan, tapi sebenarnya kamu tetap berada dalam sistem yang membuatmu butuh terus scroll. Sistem yang membuatmu sakit sekaligus menjual obatnya, seperti yang dibahas dalam [Perbandingan Diri di Era Media Sosial](/artikel/perbandingan-diri-era-media-sosial).

## Insight

Gue perhatikan pola ini di teman-teman gue. Seseorang yang sebelumnya tidak pernah bicara tentang kesehatan mental, tiba-tiba punya daftar diagnosa setelah dua minggu intensif TikTok. Bukan karena mereka tiba-tila sadar. Tapi karena algoritma berhasil meyakinkan mereka bahwa setiap perilaku normal manusia adalah gejala dari suatu kondisi.

Sulit fokus? ADHD. Suka sendirian? Introvert yang ternyata autism spectrum. Mudah emosi? Trauma. Semua label tersedia, semua "relatable", dan algoritma pasti menemukan label yang pas untuk kamu.

Algoritma tidak peduli apakah kamu benar-benar ADHD atau tidak. Yang penting adalah kamu stay di app, scroll lebih lama, engage lebih banyak. Self-diagnosis adalah engagement goldmine. Setiap video tentang gejala menghasilkan jutaan views, dan setiap view adalah uang.

## Conclusion

Diagnosis dari algoritma bukan diagnosis. Tapi tidak peduli diagnosis itu akurat atau tidak, rasa sakit yang kamu alami setelah percaya itu nyata. Dan sistem yang membuatmu percaya kamu sakit tidak akan membantu kamu sembuh. Sistem itu hanya butuh kamu terus scroll.

---

**Selanjutnya di Mental Health di Era Digital:** Tapi setelah "tahu" sakitmu, kamu cari obat. Dan obat yang kamu temukan terlihat seperti perawatan diri. Tapi apakah benar-benar menyembuhkan, atau hanya mengganti satu candu dengan candu yang lebih estetik? [Lanjut ke Part 2](/artikel/kesehatan-mental-era-digital-part-2-healing-industri)`,
  category: "mindset",
  subcategory: "psikologi",
  author: "yovie-setiawan",
  status: "scheduled",
  seo_keywords: ["self diagnosis gen z tiktok", "algoritma tiktok kesehatan mental", "fenomena self diagnosis", "kesehatan mental gen z"],
  pov_tag: "kontra-narasi",
  human_signature: true,
  source_references: [
    { type: "link", url: "https://ejurnal.politeknikpratama.ac.id/index.php/Lencana/article/view/4063", label: "Febriana & Amalia (2024) - TikTok self-diagnosis Gen Z" },
    { type: "link", url: "https://repository.mercubuana.ac.id/94534/", label: "Ocktaviani (2025) - Literasi kesehatan mental self-diagnosis" },
    { type: "link", url: "http://www.buletin.k-pin.org/index.php/arsip-artikel/1885", label: "K-PIN Bulletin (2025) - Self-diagnosis era algoritma" }
  ],
  featured: true,
  seo_meta_title: "Self-Diagnosis TikTok: Algoritma Menciptakan Gejala | TAM",
  seo_meta_description: "76% pengguna TikTok adalah Gen Z. Algoritma tidak mengidentifikasi penyakit, algoritma menciptakan gejala. Self-fulfilling prophecy kesehatan mental.",
  og_headline: "Algoritma TikTok menciptakan gejala, bukan diagnosis",
  published_at: "2026-07-26T01:00:00.000Z",
  series: SERIES,
  series_order: 1
};

// ============================================================
// PART 2: Healing Industry
// ============================================================
const part2 = {
  title: "Healing Industry: Self-Care yang Dijual Bukan Penyembuhan, Tapi Konsumsi",
  slug: "kesehatan-mental-era-digital-part-2-healing-industri",
  excerpt: "Healing bergeser dari pemulihan psikologis menjadi praktik konsumsi simbolik. Gen Z memaknai healing sebagai kewajiban, beban, dan unjuk diri di media sosial.",
  body: `> **Sebelumnya di Mental Health di Era Digital:** Algoritma TikTok tidak mengidentifikasi penyakit, tapi menciptakan gejala melalui self-fulfilling prophecy. Baca [Part 1](/artikel/kesehatan-mental-era-digital-part-1-tiktok-diagnosis).

## Hook

Coba ingat healing terakhir kamu. Ada kamera? Ada story? Ada check-in location? Kalau ada, mungkin yang kamu lakukan bukan healing. Itu performansi.

Healing sekarang bukan tentang menyembuhkan diri. Healing tentang menunjukkan bahwa kamu sedang menyembuhkan diri. Dan perbedaan itu sangat penting, karena satu adalah proses internal, yang lain adalah konsumsi.

## Konteks

Penelitian oleh Assa pada 2026 di Tebar Science menemukan bahwa self healing bergeser dari pemulihan psikologis menjadi praktik konsumsi simbolik. Artinya, healing tidak lagi dinilai dari hasilnya (apakah kamu benar-benar lebih baik), tapi dari simbolnya (apakah kamu terlihat sedang healing).

Lebih spesifik, penelitian oleh Putri dan Hidayah pada 2024 di Universitas Lambung Mangkurat menemukan bahwa Gen Z memaknai healing sebagai empat hal: kewajiban, beban, cara mendapat pengakuan, dan unjuk diri di media sosial. Healing bukan lagi pilihan, tapi kewajiban. Kalau tidak healing, kamu dianggap tidak peduli dengan dirimu sendiri. Dan kalau healing tapi tidak mempostingnya, apakah kamu benar-benar healing?

Artikel [Healing Culture: Self-Care atau Performance untuk Konten?](/artikel/healing-culture-self-care-atau-performance-untuk-konten) sudah membahas permukaan masalah ini. Tapi di sini kita akan lebih dalam.

## Healing sebagai Komoditas

Logika konsumsi healing bukan lagi pada kesembuhan, tapi pada kebutuhan yang harus selalu dipenuhi. Artinya, healing bukan sesuatu yang kamu lakukan sekali dan selesai. Healing adalah produk yang kamu beli terus-menerus.

Brand kecantikan, makanan, minuman, bahkan destinasi wisata menggunakan narasi "healing" untuk menjual produk. Pesonakebun.com pada 2025 mencatat bagaimana industri kecantikan memakai kata "healing" sebagai marketing tool. Kompas pada Juli 2025 melaporkan pergeseran konsumsi dari kebutuhan dasar ke leisure dan healing, dengan prinsip YOLO sebagai pendorong, berdasarkan data dari Huda/Celios.

Ini bukan sekadar tren. Ini adalah komodifikasi: mengambil konsep pemulihan psikologis dan mengubahnya menjadi produk yang bisa dibeli dan dijual.

Healing industry adalah komodifikasi praktik self-care menjadi produk konsumsi. Self healing bergeser dari pemulihan psikologis menjadi praktik konsumsi simbolik, di mana Gen Z memaknai healing sebagai kewajiban dan cara mendapat pengakuan sosial, bukan sebagai proses penyembuhan yang privat.

## Performansi Penyembuhan

Kalau healing butuh kamera, itu bukan healing. Kalau healing butuh audience, itu bukan healing. Kalau healing butuh validasi likes, itu bukan healing.

Tapi sistem membuat kamu percaya bahwa healing yang tidak terlihat sama dengan healing yang tidak terjadi. Karena healing yang tidak diposting tidak menghasilkan engagement, tidak menghasilkan data, tidak menghasilkan uang bagi platform.

Penelitian oleh Putri dan Hidayah pada 2024 menemukan bahwa Gen Z memaknai healing sebagai "unjuk diri di media sosial." Ini bukan kesalahan individu. Ini adalah hasil dari sistem yang mengajarkan: jika tidak diposting, tidak terjadi. Jika tidak terlihat, tidak nyata.

## Ketika Healing Menjadi Beban

Inilah paradoks yang tidak banyak dibahas. Healing yang seharusnya melepaskan beban justru menambah beban.

Healing yang tidak "aesthetic" dianggap gagal. Healing yang tidak diposting dianggap tidak terjadi. Healing yang tidak dapat likes dianggap tidak valid. Dan kalau healing tidak berhasil, kamu pikir masalahnya adalah kamu tidak cukup berusaha.

Ini sama dengan pola [Doom Spending: Bukan Self-Care, Itu Gejala Menyerah](/artikel/doom-spending-bukan-self-care-itu-gejala-menyerah), di mana belanja dikemas sebagai self-care padahal sebenarnya gejala menyerah. Healing industry melakukan hal yang sama: mengemas konsumsi sebagai pemulihan.

## Insight

Gue pernah ngobrol dengan teman yang habis "healing" ke Bali. Dia pulang dengan foto bagus, story aesthetic, dan perasaan yang sama persis seperti sebelum berangkat. Karena healing-nya bukan tentang menyembuhkan diri, tapi tentang mengumpulkan konten. Dan setelah konten habis diposting, kekosongan kembali.

Industri self-care tidak menjual kesembuhan. Mereka menjual perasaan sedang menyembuhkan diri. Healing jadi konsumsi yang dikemas sebagai perawatan. Dan konsumsi tidak pernah benar-benar menyembuhkan, karena konsumsi dirancang untuk membuat kamu terus butuh.

## Conclusion

Jadi healing tidak berhasil. Dan kamu pikir masalahnya adalah kamu tidak cukup berusaha. Kamu dorong lebih keras. Tapi siapa yang mengajarkan kamu bahwa berhenti berusaha adalah kegagalan?

---

**Selanjutnya di Mental Health di Era Digital:** Kamu dorong lebih keras. Tapi siapa yang mengajarkan kamu bahwa berhenti berusaha adalah kegagalan? [Lanjut ke Part 3](/artikel/kesehatan-mental-era-digital-part-3-toxic-productivity)`,
  category: "mindset",
  subcategory: "psikologi",
  author: "yovie-setiawan",
  status: "scheduled",
  seo_keywords: ["healing industry gen z", "self care konsumtif", "komodifikasi healing", "budaya healing indonesia"],
  pov_tag: "kontra-narasi",
  human_signature: true,
  source_references: [
    { type: "link", url: "https://doi.org/10.20527/h-js.v3i3.230", label: "Putri & Hidayah (2024) - Self healing konsumtif ULM" },
    { type: "link", url: "https://ejournal.tebarscience.com/index.php/JKSB/article/view/267", label: "Assa (2026) - Budaya healing konsumsi simbolik" },
    { type: "link", url: "https://money.kompas.com/read/2025/07/24/201307626/healing-jadi-prioritas-konsumsi-bisa-dongkrak-ekonomi-domestik", label: "Kompas (2025) - Healing prioritas konsumsi" }
  ],
  featured: false,
  seo_meta_title: "Healing Industry: Self-Care atau Konsumsi yang Dikemas? | TAM",
  seo_meta_description: "Healing bergeser dari pemulihan psikologis menjadi praktik konsumsi simbolik. Gen Z memaknai healing sebagai kewajiban, beban, dan unjuk diri di media sosial.",
  og_headline: "Healing kamu butuh kamera? Itu bukan healing",
  published_at: "2026-07-26T05:00:00.000Z",
  series: SERIES,
  series_order: 2
};

// ============================================================
// PART 3: Toxic Productivity
// ============================================================
const part3 = {
  title: "Toxic Productivity: Rasa Bersalah saat Istirahat Bukan Sifat Alami, Tapi Conditioning",
  slug: "kesehatan-mental-era-digital-part-3-toxic-productivity",
  excerpt: "Rasa bersalah saat istirahat bukan sifat alami. Itu conditioning sistematis dari sekolah, media, dan kerja. 77% orang mengalami burnout, 42% meninggalkan pekerjaan.",
  body: `> **Sebelumnya di Mental Health di Era Digital:** Healing industry menjual perasaan sedang menyembuhkan diri, bukan kesembuhan. Healing jadi konsumsi yang dikemas sebagai perawatan. Baca [Part 2](/artikel/kesehatan-mental-era-digital-part-2-healing-industri).

## Hook

Kapan terakhir kali kamu istirahat tanpa rasa bersalah? Kalau jawabannya "tidak ingat", bukan kamu yang rusak. Sistem yang mengajarkan kamu bahwa istirahat adalah kegagalan.

## Konteks

Toxic productivity adalah dorongan ekstrem untuk selalu produktif tanpa henti, mengorbankan kesehatan fisik dan mental. Definisi ini berasal dari penelitian oleh Diandra Adjiwibowo dan rekan pada 2023. Bukan produktivitas sehat, tapi obsesi yang dikemas sebagai dedikasi.

Datanya mencengangkan. Deloitte, yang dikutip Tsabita et al. pada 2023, melaporkan 77% orang pernah mengalami burnout dan 42% meninggalkan pekerjaan karena kelelahan. HiredToday, yang dikutip Depok Pos pada 2026, menemukan 37% Gen Z meninggalkan pekerjaan karena kurang work-life balance, dan 57% mengalami lembur.

Artikel [Toxic Productivity: Istirahat Terasa Seperti Kejahatan](/artikel/toxic-productivity-istirahat-terasa-seperti-kejahatan) dan [Hustle Culture: Kenapa Gen Z Berhenti Berlari](/artikel/hustle-culture-kenapa-gen-z-berhenti-berlari) sudah menyentuh permukaan masalah ini. Tapi pertanyaannya adalah: kenapa rasa bersalah ini ada?

## Asal Rasa Bersalah

Rasa bersalah saat istirahat bukan sifat alami. Tidak ada bayi yang lahir dengan rasa bersalah karena tidur. Rasa bersalah ini dipelajari, dan dipelajari dari sistem.

Self-worth theory menjelaskan bahwa individu mengaitkan nilai diri dengan prestasi. Artinya, kalau kamu tidak menghasilkan apa-apa, kamu tidak bernilai. Istirahat tidak menghasilkan apa-apa, jadi istirahat membuat kamu tidak bernilai. Ini bukan filosofi, ini conditioning.

Penelitian oleh Tsabita et al. pada 2023 di Bandung menemukan bahwa FOMO akan capaian orang lain di media sosial adalah pemicu utama toxic productivity. Kamu scroll LinkedIn, lihat temanmu dapat promosi, lalu merasa bersalah karena sedang istirahat. Algoritma media sosial memperkuat ini dengan menampilkan highlight reel orang lain tepat saat kamu butuh istirahat.

## Sistem Butuh Kamu Terus Produksi

Conditioning ini tidak datang dari satu sumber. Datang dari sekolah, media, dan kerja. Dari sistem yang butuh kamu terus produksi.

Sekolah: nilai sama dengan worth. Kerja: output sama dengan worth. Media sosial: engagement sama dengan worth. Semua institusi yang membentuk kamu mengajarkan pesan yang sama: nilai dirimu ditentukan oleh apa yang kamu hasilkan.

Data dari I-NAMHS 2022, yang dikutip Kompasiana 2026, menunjukkan 1 dari 3 remaja Indonesia mengalami masalah kesehatan mental, dengan gangguan kecemasan sebagai yang paling umum. BKM FISIP UI pada 2026 menemukan 371 mahasiswa mengalami gejala kecemasan dan depresi, dengan 19% membutuhkan konselor.

Toxic productivity adalah dorongan ekstrem untuk selalu produktif tanpa henti, mengorbankan kesehatan fisik dan mental. Fenomena ini bukan sifat alami individu, melainkan hasil conditioning sistematis dari institusi sekolah, media sosial, dan dunia kerja yang mengaitkan nilai diri dengan prestasi. Self-worth theory menjelaskan bahwa individu yang mengaitkan nilai diri dengan pencapaian akan merasa istirahat sebagai kegagalan.

## Dari Produktif ke Kosong

Kamu dorong terus sampai tidak bisa lagi. Sampai suatu hari kamu bangun dan tidak merasa capek. Kamu merasa kosong.

Dan kosong adalah sesuatu yang berbeda dari capek. Capek bisa diistirahatkan. Kosong tidak bisa. Tapi itu cerita untuk part berikutnya.

Yang penting di sini: kamu tidak sampai ke titik kosong ini karena kamu lemah. Kamu sampai ke sini karena sistem mengajarkan kamu bahwa berhenti adalah kegagalan, dan kamu percaya. Sistem yang menguntungkan dari produktivitasmu tidak akan mengajarkan kamu kapan harus berhenti.

## Insight

Gue dulu termasuk orang yang bangga dengan toxic productivity. Bangga kerja sampai pagi, bangga tidak ada weekend, bangun jam 4 pagi untuk "grind". Sampai gue sadar bahwa bangga dengan kelelahan adalah bukan bangga, tapi gejala. Gejala dari conditioning yang berhasil.

Rasa bersalah saat istirahat bukan tanda kamu dedikasi tinggi. Itu tanda conditioning berhasil. Sistem butuh kamu terus produksi, dan sistem berhasil membuat kamu merasa bersalah saat tidak produksi. Ini bukan sifat alami, ini hasil desain.

## Conclusion

Kita diajari takut berhenti. Padahal yang harus ditakuti adalah tidak pernah berhenti sampai tidak bisa berjalan lagi. Istirahat bukan kegagalan. Istirahat adalah hal yang sistem lupa mengajarkan karena sistem tidak menguntungkan dari kamu yang beristirahat.

---

**Selanjutnya di Mental Health di Era Digital:** Sampai suatu hari kamu bangun dan tidak merasa capek. Kamu merasa kosong. Dan "kosong" adalah sesuatu yang tidak bisa diistirahatkan. [Lanjut ke Part 4](/artikel/kesehatan-mental-era-digital-part-4-emotional-exhaustion)`,
  category: "mindset",
  subcategory: "psikologi",
  author: "yovie-setiawan",
  status: "scheduled",
  seo_keywords: ["toxic productivity gen z", "rasa bersalah saat istirahat", "hustle culture burnout", "burnout gen z indonesia"],
  pov_tag: "kontra-narasi",
  human_signature: true,
  source_references: [
    { type: "link", url: "https://doi.org/10.55123/sosmaniora.v2i4.2774", label: "Tsabita et al. (2023) - Toxic productivity burnout Bandung" },
    { type: "link", url: "https://www.depokpos.com/2026/06/gen-z-dan-toxic-productivity-ketika-istirahat-menjadi-rasa-bersalah/", label: "Depok Pos (2026) - Toxic productivity Gen Z" },
    { type: "link", url: "https://mindset.viva.co.id/tren/9694-produktif-tapi-burnout-paradoks-gen-z-di-era-serba-cepat", label: "Viva Mindset - Produktif tapi burnout Gen Z" }
  ],
  featured: false,
  seo_meta_title: "Toxic Productivity: Istirahat Bukan Kejahatan | TAM",
  seo_meta_description: "Rasa bersalah saat istirahat bukan sifat alami. Itu conditioning sistematis dari sekolah, media, dan kerja. 77% orang mengalami burnout, 42% meninggalkan pekerjaan.",
  og_headline: "Istirahat terasa seperti kejahatan? Itu conditioning",
  published_at: "2026-07-26T10:00:00.000Z",
  series: SERIES,
  series_order: 3
};

// Write all parts
writeFileSync('/tmp/tam-seri-drafts/part-01.json', JSON.stringify(part1, null, 2));
writeFileSync('/tmp/tam-seri-drafts/part-02.json', JSON.stringify(part2, null, 2));
writeFileSync('/tmp/tam-seri-drafts/part-03.json', JSON.stringify(part3, null, 2));

console.log('Batch 1 done: Part 1-3 written to /tmp/tam-seri-drafts/');
