import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

// Metadata fixes
const metaFixes: Record<number, Partial<{og_headline: string, seo_meta_description: string, excerpt: string}>> = {
  3: {
    og_headline: "Istirahat terasa kejahatan? Itu conditioning",
    seo_meta_description: "Rasa bersalah saat istirahat bukan sifat alami. Itu conditioning sistematis dari sekolah, media, dan kerja. 77% orang mengalami burnout.",
    excerpt: "Rasa bersalah saat istirahat bukan sifat alami. Itu conditioning sistematis dari sekolah, media, dan kerja. 77% orang mengalami burnout."
  },
  8: {
    seo_meta_description: "Otak Gen Z tidak rusak, tapi beradaptasi ke lingkungan yang dirancang untuk fragmentasi. Brain rot = Oxford Word of the Year 2024.",
    excerpt: "Otak Gen Z tidak rusak, tapi beradaptasi ke lingkungan yang dirancang untuk fragmentasi. Brain rot = Oxford Word of the Year 2024."
  },
  9: {
    og_headline: "Industri self-help butuh kamu merasa gagal"
  },
  10: {
    og_headline: "'Generasi stroberi' adalah pelarian sistem gagal"
  },
  11: {
    og_headline: "Krisis usia 20-an: sistemnya rusak, bukan kamu",
    seo_meta_description: "QLC bukan krisis individu, tapi krisis sistemik yang dikaburkan sebagai masalah pribadi. 98% partisipan Indonesia mengalami QLC.",
    excerpt: "QLC bukan krisis individu, tapi krisis sistemik yang dikaburkan sebagai masalah pribadi. 98% partisipan Indonesia mengalami QLC."
  },
  12: {
    og_headline: "User sembuh = churn. User sakit = subscribe."
  }
};

// Additional content to insert before "## Insight" for each part
const expansions: Record<number, string> = {
  2: `
## Sistem yang Untung dari Healing-mu

Pikirkan siapa yang untung dari healing yang tidak pernah selesai. Platform media sosial untung dari konten healing yang kamu post. Brand untung dari produk healing yang kamu beli. Destinasi wisata untung dari kunjungan healing kamu. Tapi kamu? Kamu tetap tidak sembuh.

Dan ini bukan kebetulan. Healing industry, seperti industri lain, dirancang untuk membuat kamu terus kembali. Kalau kamu benar-benar sembuh setelah satu retreat, kamu tidak akan beli retreat lagi. Kalau kamu benar-benar pulih setelah satu produk, kamu tidak akan beli produk lagi. Jadi sistem memastikan kamu tidak pernah benar-benar sembuh, tapi selalu merasa "sedang dalam proses."

Penelitian oleh Putri dan Hidayah pada 2024 menemukan bahwa Gen Z memaknai healing sebagai "kewajiban." Kewajiban kepada siapa? Kepada diri sendiri? Atau kepada sistem yang mengajarkan bahwa kalau tidak healing, kamu tidak peduli dengan dirimu? Pertanyaan ini tidak pernah diajukan, karena jawabannya tidak nyaman.`,
  4: `
## Sistem yang Untung dari Kehilanganmu

Sistem menawarkan healing (Part 2), yang ternyata adalah konsumsi. Sistem menawarkan toxic productivity (Part 3), yang ternyata adalah conditioning. Tidak ada yang mengajarkan cara mengisi ulang. Yang ada hanya cara menguras lebih efisien.

Aplikasi produktivitas, teknik time management, optimasi workflow. Semua dirancang untuk membuat kamu lebih efisien dalam menguras dirimu sendiri. Bukan lebih efisien dalam mencapai tujuan, tapi lebih efisien dalam menghasilkan output untuk sistem. Sistem tidak peduli kamu kosong, selama kamu masih menghasilkan.

Data dari Eagle Hill Consulting pada 2024 menunjukkan 54% karyawan Gen Z mengalami burnout, dibandingkan 52% Milenial dan 42% Gen X. Gen Z adalah generasi dengan tingkat burnout tertinggi. Dan ini bukan karena Gen Z lemah. Ini karena Gen Z adalah generasi yang paling terkoneksi dengan sistem yang menguras mereka, paling terpapar dengan algoritma yang mendesain kecemasan, dan paling dibombardir dengan narasi bahwa mereka harus terus produksi.

Penelitian di Jurnal Manajemen 2025 menemukan bahwa technostress dan burnout bersama-sama menjelaskan 63,1% varians kesehatan mental. Lebih dari separuh kondisi mental kamu bisa dijelaskan oleh kombinasi tekanan teknologi dan burnout. Ini bukan masalah individu. Ini masalah lingkungan.`,
  5: `
## Desain yang Tidak Accidental

Yang perlu dipahami: ini bukan accidental. Tech companies tidak secara kebetulan membuat aplikasi yang adiktif. Mereka merekrut psikolog kasino, ahli perilaku, dan data scientist untuk mendesain sistem yang mengeksploitasi cara kerja otak manusia.

Timms dan Spurrett pada 2023, yang dikutip Springer pada 2024, menyebut media sosial sebagai "digital slot machines." Mereka tidak menggunakan istilah ini sebagai metafora. Mereka menggunakan istilah ini karena mekanismenya secara harfiah sama: variable ratio reinforcement, yang dipelajari dari penelitian Skinner, dan ini adalah jadwal penguatan paling kuat yang menghasilkan perilaku paling persisten.

Pull-to-refresh di smartphone memetakan lever mesin slot: aksi fisik yang menghasilkan reward tidak terduga dan dapat diulang tanpa batas. Kamu tarik, mungkin dapat konten bagus, mungkin tidak. Kamu tarik lagi, mungkin dapat, mungkin tidak. Tidak terduga. Infinitely repeatable. Dan dopamin, yang bukan hormon kebahagiaan seperti yang sering disebut, tapi neurotransmitter yang mengatur antisipasi dan motivasi mencari reward, membuat kamu terus mencari, terus scroll, terus tarik lever.

Setiap interaksi mikro direkam, dijadikan data, dipakai untuk membuat kamu stay lebih lama. Kamu tidak kecanduan karena tidak punya willpower. Kamu kecanduan karena sistem dirancang oleh orang yang tahu persis cara kerja otakmu, dan mereka tidak peduli dengan kesembuhanmu. Mereka peduli dengan setiap detik kamu tetap di app, karena setiap detik adalah uang.`,
  6: `
## Ekonomi Perasaan Tidak Cukup

Vogel pada 2021 menemukan bahwa paparan konten ideal di media sosial menurunkan kepuasan diri. Ini bukan opini, ini temuan penelitian. Setiap kali kamu melihat konten ideal, kepuasan dirimu turun. Dan algoritma menampilkan konten ideal terus-menerus, karena konten ideal menghasilkan engagement tertinggi.

JOECY pada 2025 menemukan bahwa AI dan algoritma adalah penguat utama budaya FOMO: sistem rekomendasi dan iklan tertarget bekerja sama untuk membuat kamu merasa selalu kurang. Iklan yang muncul di feed kamu tidak acak. Iklan yang muncul adalah iklan yang algoritma tahu akan membuat kamu merasa butuh, berdasarkan data perilakumu.

Triwikrama pada 2025 menemukan bahwa FOMO mendorong perilaku konsumtif impulsif. Kamu lihat orang beli sesuatu, kamu merasa ketinggalan, kamu beli juga. FOMO bukan cuma bikin kamu cemas, FOMO bikin kamu belanjakan uang. Dan uang yang kamu belanjakan mengalir kembali ke sistem yang membuat kamu merasa tidak cukup di tempat pertama. Siklus ini sempurna: sistem membuat kamu merasa tidak cukup, kamu belanja untuk mengatasi perasaan tidak cukup, sistem dapat uang, sistem membuat kamu merasa tidak cukup lagi.

Data dari Pew Research Center pada 2022 menunjukkan 95% remaja Gen Z di Amerika menggunakan media sosial setiap hari, dan hampir separuh mengakui sulit berhenti. Di Indonesia, Rachmi dan rekan pada 2024 menemukan bahwa kelompok usia 18-24 tahun adalah pengguna media sosial terbesar, dengan rata-rata lebih dari 3 jam per hari. 3 jam per hari terpapar konten yang membuat kamu merasa tidak cukup. Dan ini bukan bug, tapi fitur.`,
  7: `
## Siklus Konsumsi Penderitaan

Inilah ironi terbesar dari trauma content: kamu mengkonsumsi penderitaan orang lain sebagai pengganti koneksi asli. Kamu menonton video tentang trauma orang lain dan merasa "tidak sendirian." Tapi itu bukan koneksi. Itu konsumsi. Koneksi butuh interaksi timbal balik, butuh kehadiran, butuh kerentanan bersama. Konsumsi hanya butuh kamu duduk dan scroll.

Algoritma tidak peduli dengan perbedaan ini. Algoritma butuh engagement. Dan penderitaan adalah engagement tertinggi. Jadi algoritma memberi kamu lebih banyak penderitaan, dan kamu mengkonsumsinya, dan algoritma memberi lebih banyak lagi. Lingkaran ini tidak pernah berakhir, karena algoritma tidak dirancang untuk berakhir. Algoritma dirancang untuk membuat kamu stay.

Penelitian oleh Diefenbach dan Anders pada 2021 menemukan bahwa konten paling emosional adalah yang paling viral. Video dengan ekspresi kesedihan dibagikan 34% lebih banyak daripada konten netral. Ini berarti algoritma secara sistematis memprioritaskan penderitaan di atas konten lain. Bukan karena algoritma "jahat", tapi karena algoritma dioptimasi untuk engagement, dan penderitaan menghasilkan engagement tertinggi.

Pew Research Center pada 2023 menemukan bahwa 43% Gen Z pernah membagikan pengalaman personal yang disesali, dengan 60% mengatakan dorongan utama adalah validasi sosial. Bukan penyembuhan. Bukan kesadaran. Validasi sosial. Gen Z membagikan penderitaan bukan untuk sembuh, tapi untuk divalidasi. Dan algoritma memberikan validasi ini dalam bentuk likes dan views, yang tidak pernah cukup, yang membuat kamu terus membagikan lebih banyak penderitaan.`,
  8: `
## Adaptasi yang Tidak Bisa Diundur

Lebih dari 4 miliar young adults menghabiskan 6,5 jam per hari online, dengan konsumsi pasif konten bernilai rendah. Ini bukan kebetulan. Ini desain. Sistem yang merancang lingkungan digital butuh fragmentasi perhatian, karena fragmentasi = lebih banyak scroll = lebih banyak ad revenue.

Attentiondebt.org menjelaskan konsep "critical window" untuk sustained attention: usia 3-7 tahun (primary) dan 11-14 tahun (secondary). Gen Alpha, yang lahir setelah 2007, tidak "kehilangan" sustained attention. Mereka tidak pernah mengembangkannya. Mereka adalah "attention native" yang otaknya terbentuk di lingkungan fragmentasi sejak awal.

Ini perbedaan penting: bukan otak yang rusak, tapi lingkungan yang dirancang. Otakmu beradaptasi dengan sempurna ke lingkungan yang salah. Dan adaptasi ini tidak bisa diundur, karena neuroplasticity bekerja dua arah: otak beradaptasi ke lingkungan baru, tapi tidak bisa "un-adapt" ketika lingkungan berubah. Kamu bisa mengurangi screen time, tapi otakmu sudah terbentuk oleh pola konsumsi konten pendek.

Scroll culture, yaitu kebiasaan scrolling cepat dan kontinu, berkontribusi pada penurunan attention span. Ini bukan opini, ini temuan penelitian JUPIN 2025. Dan brain rot, yang dipilih sebagai Oxford Word of the Year 2024, menggambarkan overconsumption konten trivial yang menghasilkan kelemahan perhatian dan kecemasan saat jauh dari perangkat. Kamu tidak bisa berhenti, dan ketika kamu berhenti, kamu cemas. Bukan karena kamu lemah, tapi karena otakmu sudah beradaptasi.`,
  9: `
## Siklus yang Tidak Pernah Berakhir

Self-help addiction adalah fenomena di mana consuming content menciptakan ilusi kemajuan tanpa perubahan nyata. Kamu baca buku self-help, kamu merasa sudah "bekerja pada dirimu." Tapi sebenarnya kamu hanya mengkonsumsi konten. Tidak ada perubahan. Dan karena tidak ada perubahan, kamu beli buku self-help berikutnya. Siklus ini meniru siklus kecanduan, persis seperti dopamin loop di Part 5.

Createhighervibrations.com pada 2025 menjelaskan konsep "manufactured gap": konten yang memperluas jarak antara siapa kamu dan siapa yang "seharusnya" kamu jadi. Semakin besar gap, semakin kamu merasa butuh produk self-improvement. Dan semakin kamu beli produk, semakin besar gap yang dibuat, karena selalu ada level "lebih baik" yang belum kamu capai. Sistem menciptakan gap, lalu menjual jembatan untuk menyeberangi gap, tapi jembatan tidak pernah cukup panjang.

Industri self-improvement bernilai $45,72 miliar pada 2024, dan diproyeksikan mencapai $84 miliar pada 2034. Ini industri yang tumbuh. Dan industri yang tumbuh butuh pelanggan yang terus bertumbuh. Tapi tunggu: kalau pelanggan benar-benar "improve", mereka berhenti jadi pelanggan. Jadi model bisnisnya harus membuat kamu terus merasa butuh improve. Ini bukan teori konspirasi. Ini insentif finansial yang bisa dijelaskan dengan logika sederhana.

House of Cultural Influence pada 2025 menyebut self-help sebagai "demobilization industry": membuat compliant citizens yang terlalu sibuk mengoptimalkan diri untuk organize. Kalau kamu terlalu sibuk "1% better everyday", kamu tidak punya waktu untuk bertanya: kenapa sistem ini dirancang seperti ini? Kenapa saya harus terus optimize diri untuk sistem yang tidak menghargai saya?`,
  10: `
## Ekonomi yang Berubah

Data Kompas 2025 menunjukkan 8,9 juta anak muda (20,31%) masuk kategori NEET (Not in Education, Employment, or Training), jauh di atas rata-rata global 13%. Ini bukan karena Gen Z malas. Ini karena sistem tidak menyediakan cukup peluang. Sistem tidak menciptakan cukup pekerjaan, tidak menyediakan pendidikan yang relevan, dan tidak menjamin kesejahteraan dasar.

Generasi yang menamamu lemah tumbuh di kondisi ekonomi yang jauh lebih mudah: pertumbuhan ekonomi tinggi, harga rumah terjangkau, dan ijazah menjamin pekerjaan. Sementara kamu tumbuh di kondisi ekonomi yang stagnan, harga rumah butuh 25 tahun gaji, dan ijazah menjadi trap, seperti yang dibahas dalam [S1 Rebutan Loker SMK: Pendidikan Tinggi Jadi Trap](/artikel/s1-rebutan-loker-smk-pendidikan-tinggi-jadi-trap).

Penelitian oleh KNS3YE07 pada 2025 menemukan bahwa stereotip "generasi stroberi" tidak sepenuhnya reflect realitas Gen Z, melainkan hasil gap pemahaman antar generasi. Yang lebih berbahaya, penelitian yang sama menemukan bahwa label bisa menjadi self-fulfilling prophecy. Gen Z yang menginternalisasi label "stroberi" cenderung menunjukkan perilaku sesuai stereotip. Kamu dipanggil lemah, kamu mulai percaya kamu lemah, kamu bertindak lemah. Bukan karena kamu lemah, tapi karena label berhasil.

Kompas pada 2025 menulis bahwa kemarahan Gen Z bukan kelemahan karakter, tapi hak politik dari realitas pahit. Ini perspective yang berbeda: bukan Gen Z yang lemah, tapi sistem yang membuat Gen Z marah. Dan kemarahan ini bukan "stroberi", tapi respons yang rasional terhadap kondisi yang tidak adil.`,
  11: `
## Standar yang Tidak Mungkin

Abadi pada 2026, menggunakan framework Berger's social construction, menemukan bahwa QLC adalah socially constructed reality, bukan sekadar isu individu atau psikologis. Artinya, QLC ada karena struktur sosial menciptakan kondisi yang membuat QLC tidak terhindarkan. Bukan kamu yang punya masalah. Sistem yang menciptakan masalah dan menyalahkan kamu karena merasakannya.

Agustina dan rekan pada 2022 menemukan bahwa 98% dari 125 partisipan Indonesia mengalami QLC, dengan 82% merasakan tekanan keuangan dan 79% merasa tidak layak. Ini bukan minoritas. Ini mayoritas. Kalau mayoritas mengalami hal yang sama, itu bukan masalah pribadi. Itu masalah struktural. Kalau 98% orang sakit di tempat yang sama, bukan orangnya yang rusak. Tempatnya yang rusak.

Sakernas 2022, yang dikutip Kaltimpedia, menunjukkan 33,50% lulusan pendidikan tinggi mengalami horizontal mismatch, yaitu bekerja tidak sesuai bidang. Sepertiga lulusan kuliah bekerja di luar bidang mereka. Ini bukan kegagalan individu. Ini kegagalan sistem pendidikan dan ketenagakerjaan. Sistem yang mengajarkan kamu satu hal, lalu memintamu bekerja di hal lain, lalu menyalahkanmu karena tidak sukses.

Suara.com pada 2026 menjelaskan bahwa jalur mobilitas sosial menyempit: pendidikan tinggi tidak lagi menjamin pekerjaan layak. Dulu, kuliah = kerja layak = beli rumah = stabil. Sekarang, kuliah = lulus = tidak dapat kerja, atau dapat kerja tapi gaji tidak cukup, atau dapat kerja layak tapi rumah butuh 25 tahun gaji. Standar itu sendiri yang tidak realistis untuk kondisi ekonomi saat ini. Bukan kamu yang gagal mencapai standar. Standar itu yang tidak mungkin dicapai.`,
  12: `
## Sistem yang Sama

Sekarang, ingat kembali semua yang kamu baca. Semua yang dari Part 1 sampai 11 bukan fenomena terpisah. Semuanya adalah satu sistem yang sama.

Ingat [Part 1](/artikel/kesehatan-mental-era-digital-part-1-tiktok-diagnosis)? TikTok bilang kamu ADHD. Algoritma menciptakan gejala, bukan mengidentifikasi. Kamu mulai merasa ada yang salah denganmu.

Ingat [Part 2](/artikel/kesehatan-mental-era-digital-part-2-healing-industri)? Kamu beli candle untuk healing. Healing jadi konsumsi yang dikemas sebagai perawatan. Kamu beli produk, tapi tidak sembuh.

Ingat [Part 5](/artikel/kesehatan-mental-era-digital-part-5-dopamin-loop)? Algoritma membuatmu kecanduan. Media sosial dirancang seperti mesin slot kasino. Kamu tidak bisa berhenti scroll.

Ingat [Part 9](/artikel/kesehatan-mental-era-digital-part-9-self-improvement)? Growth mindset menyalahkanmu. Industri self-improvement butuh kamu merasa inadequate. Kamu beli kursus, tapi tidak berubah.

Semua ini adalah satu sistem yang sama. Sistem yang membuatmu sakit adalah sistem yang menjual "solusi." Kondisi yang membuatmu sakit diciptakan oleh sistem yang sama yang menjual obatnya. TikTok membuatmu merasa sakit, healing industry menjual obat yang tidak menyembuhkan, self-improvement industry menyalahkanmu karena tidak sembuh, dan mental health app industry menghasilkan uang dari kamu yang tetap tidak sembuh. Siklus ini sempurna, dan kamu adalah pelanggan yang terjebak di dalamnya.`
};

// Process all parts
for (let i = 2; i <= 12; i++) {
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const data = JSON.parse(readFileSync(file, 'utf-8'));
  
  // Apply metadata fixes
  if (metaFixes[i]) {
    Object.assign(data, metaFixes[i]);
  }
  
  // Apply content expansion
  if (expansions[i]) {
    // Insert before "## Insight"
    const insightIdx = data.body.indexOf('## Insight');
    if (insightIdx > -1) {
      data.body = data.body.slice(0, insightIdx) + expansions[i] + '\n\n' + data.body.slice(insightIdx);
    }
  }
  
  writeFileSync(file, JSON.stringify(data, null, 2));
}

console.log('All patches applied');

// Verify
for (let i = 1; i <= 12; i++) {
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const d = JSON.parse(readFileSync(file, 'utf-8'));
  const wc = d.body.split(/\s+/).filter(w => w.length > 0).length;
  const og = (d.og_headline || '').length;
  const md = (d.seo_meta_description || '').length;
  const ex = (d.excerpt || '').length;
  const em = (d.body.match(/—/g) || []).length + (d.body.match(/–/g) || []).length;
  const issues: string[] = [];
  if (wc < 1000) issues.push('WC=' + wc);
  if (og > 50) issues.push('OG=' + og);
  if (md > 160) issues.push('MD=' + md);
  if (ex > 160) issues.push('EX=' + ex);
  if (em > 0) issues.push('EM=' + em);
  console.log(`Part ${i}: ${issues.length ? issues.join(' ') : 'OK'} (words=${wc})`);
}
