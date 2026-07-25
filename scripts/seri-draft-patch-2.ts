import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

// Additional content to insert after "## Konteks" section (before first ## subtopic)
const patches: Record<number, string> = {
  2: `Fenomena ini tidak terjadi dalam ruang kosong. Healing industry tumbuh di tengah generasi yang paling stres dalam sejarah. Gen Z menghabiskan rata-rata lebih dari 3 jam per hari di media sosial, terpapar konten ideal yang membuat mereka merasa tidak cukup, lalu mencari "healing" di platform yang sama yang membuat mereka stres. Siklus ini tidak accidental. Siklus ini menguntungkan.`,
  3: `Yang jarang disadari adalah bahwa toxic productivity tidak sama dengan kerja keras. Kerja keras adalah pilihan: kamu memilih untuk bekerja keras karena ada tujuan yang ingin kamu capai. Toxic productivity adalah kompulsi: kamu tidak bisa berhenti, bahkan ketika tubuhmu sudah memberi sinyal untuk berhenti. Perbedaan ini crucial, karena sistem mengaburkan keduanya. Sistem menyebut toxic productivity sebagai "dedikasi" dan menyebut istirahat sebagai "malas." Dengan framing ini, sistem membuat kamu merasa bersalah saat istirahat dan merasa bangga saat menguras diri. Ini bukan sifat alami, ini conditioning yang dimulai dari sekolah dan diperkuat oleh dunia kerja.`,
  4: `Yang membuat emotional exhaustion berbahaya adalah invisibility-nya. Capek terlihat: mata merah, badan lemas, mengantuk. Kosong tidak terlihat. Kamu bisa tampak normal dari luar, bisa masih berfungsi, bisa masih tersenyum. Tapi di dalam, tidak ada apa-apa. Dan karena tidak terlihat, sistem tidak mengakuinya. Sistem hanya mengakui kelelahan yang menghentikan produksi. Kosong yang masih produksi tidak diakui, karena sistem tidak peduli dengan kesehatanmu, sistem peduli dengan output-mu.`,
  5: `Yang membuat ini lebih berbahaya adalah bahwa kamu tidak bisa "memilih" untuk tidak terpengaruh. Dopamin loop bekerja di level neurokimia, di bawah kesadaran. Kamu tidak memutuskan untuk kecanduan. Kamu tidak memilih untuk scroll 3 jam. Otakmu yang sudah ter-conditioning oleh variable reward terus mencari, terus menarik lever, terus mengantisipasi reward yang mungkin datang next scroll. Willpower tidak bisa melawan neurokimia yang dirancang oleh ahli. Ini bukan pertarungan adil.`,
  6: `Pikirkan juga: FOMO tidak hanya tentang barang atau pengalaman. FOMO juga tentang identitas. Kamu melihat orang lain yang "sudah nemu passion", "sudah punya career path", "sudah stable", dan kamu merasa ketinggalan. Algoritma menampilkan highlight reel ini tepat saat kamu sedang ragu dengan dirimu sendiri. Dan algoritma tahu kapan kamu ragu, karena algoritma merekam setiap interaksi mikro yang menunjukkan keraguanmu. Ini bukan kebetulan. Ini desain yang sangat presisi.`,
  7: `Yang juga perlu diperhatikan: trauma content tidak hanya dikonsumsi, tapi juga diproduksi. Gen Z tidak hanya menonton video tentang trauma, mereka juga membuatnya. Dan ketika membuat konten tentang trauma menghasilkan engagement, ada insentif untuk memproduksi lebih banyak penderitaan. Bukan penderitaan yang asli, tapi penderitaan yang diproduksi untuk kamera. Performative grief, yang ditemukan Jurnal Komunikasi BSI pada 2025, adalah ekspresi kesedihan yang dikonstruksi secara visual, naratif, dan musikal untuk engagement. Bukan kesedihan yang dibagi, tapi kesedihan yang diproduksi.`,
  8: `Yang membuat ini lebih menakutkan adalah bahwa adaptasi ini terjadi tanpa kamu sadari. Kamu tidak merasa otakmu berubah. Kamu hanya merasa semakin sulit fokus, semakin cepat bosan, semakin butuh stimulasi baru. Dan kamu menyalahkan dirimu, menganggap ini kelemahan pribadi, padahal ini adaptasi neurologis yang sempurna ke lingkungan yang dirancang untuk fragmentasi. Sistem yang merancang lingkungan ini tidak akan mengakui dampaknya, karena sistem menguntungkan dari fragmentasi perhatianmu. Fragmentasi = scroll lebih banyak = ad revenue lebih tinggi.`,
  9: `Pikirkan juga: industri self-improvement tidak hanya menjual produk, mereka menjual narasi. Narasi bahwa kamu "harus" terus berkembang. Narasi bahwa diam adalah stagnasi. Narasi bahwa 1% better everyday adalah kewajiban, bukan pilihan. Narasi ini menguntungkan industri, karena narasi ini menciptakan permintaan yang tidak pernah habis. Tapi narasi ini juga merusak, karena narasi ini membuat kamu tidak pernah merasa cukup. Kamu tidak pernah "selesai" berkembang, karena selalu ada level berikutnya. Dan industri berdiri di setiap level, menjual produk untuk membantumu mencapai level berikutnya.`,
  10: `Pikirkan juga: label "generasi stroberi" tidak hanya menyalahkan individu, tapi juga mengalihkan pembicaraan dari solusi sistemik. Selama pembicaraan tentang "Gen Z lemah", tidak ada yang membahas kenapa 8,9 juta anak muda menganggur. Selama pembicaraan tentang "Gen Z pilih-pilih", tidak ada yang membahas kenapa ijazah tidak lagi menjamin pekerjaan. Label ini berfungsi sebagai smokescreen: sementara sistem sibuk menyalahkan generasi, sistem tidak perlu mengakui kegagalannya. Dan generasi yang disalahkan terlalu sibuk membela diri untuk menuntut sistem berubah.`,
  11: `Pikirkan juga: QLC tidak hanya tentang uang. QLC juga tentang identitas. Kamu tumbuh dengan narasi bahwa sukses di usia 25 adalah norma: punya kerjaan stabil, punya rumah, punya tabungan. Narasi ini berasal dari generasi yang tumbuh di kondisi ekonomi di mana hal itu memang mungkin. Tapi kondisi ekonomi telah berubah, dan narasi tidak berubah. Kamu tetap dinilai dengan standar lama, di ekonomi baru. Dan ketika kamu tidak mencapai standar lama, kamu merasa gagal. Bukan kamu yang gagal. Standar itu yang tidak mungkin.`,
  12: `Pikirkan juga: ini bukan tentang menghentikan orang mencari bantuan. Bantuan profesional yang asli penting. Tapi kita perlu membedakan antara bantuan yang asli dan bantuan yang dikemas sebagai produk. Bantuan asli tidak butuh kamu tetap sakit. Bantuan asli bertujuan untuk membuat kamu tidak membutuhkannya lagi. Mental health app yang baik ingin kamu berhenti menggunakan app-nya. Tapi business model tidak mengizinkan ini. Business model butuh kamu tetap menggunakan app, tetap subscribe, tetap "dalam proses." Konflik antara klinis dan komersial ini adalah inti masalahnya.`
};

for (let i = 2; i <= 12; i++) {
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const data = JSON.parse(readFileSync(file, 'utf-8'));
  
  if (patches[i]) {
    // Insert after the Konteks section (before the first ## that's not Hook/Konteks)
    // Find the second ## heading (after Hook and Konteks)
    const body = data.body;
    const hookIdx = body.indexOf('## Hook');
    const konteksIdx = body.indexOf('## Konteks');
    
    // Find the next ## after Konteks
    let insertIdx = -1;
    if (konteksIdx > -1) {
      const afterKonteks = body.indexOf('\n## ', konteksIdx + 10);
      if (afterKonteks > -1) {
        insertIdx = afterKonteks;
      }
    }
    
    if (insertIdx > -1) {
      data.body = body.slice(0, insertIdx) + '\n' + patches[i] + '\n' + body.slice(insertIdx);
    }
  }
  
  writeFileSync(file, JSON.stringify(data, null, 2));
}

console.log('Patch 2 applied');

// Final verification
let allOk = true;
for (let i = 1; i <= 12; i++) {
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const d = JSON.parse(readFileSync(file, 'utf-8'));
  const wc = d.body.split(/\s+/).filter(w => w.length > 0).length;
  const og = (d.og_headline || '').length;
  const md = (d.seo_meta_description || '').length;
  const ex = (d.excerpt || '').length;
  const em = (d.body.match(/—/g) || []).length + (d.body.match(/–/g) || []).length;
  const links = (d.body.match(/\/artikel\//g) || []).length;
  const h2 = (d.body.match(/^## /gm) || []).length;
  const issues: string[] = [];
  if (wc < 1000) issues.push('WC=' + wc);
  if (wc > 2500) issues.push('WC_HIGH=' + wc);
  if (og > 50) issues.push('OG=' + og);
  if (md > 160) issues.push('MD=' + md);
  if (ex > 160) issues.push('EX=' + ex);
  if (em > 0) issues.push('EM=' + em);
  if (links < 2) issues.push('LINKS=' + links);
  if (h2 < 3) issues.push('H2=' + h2);
  if (issues.length > 0) allOk = false;
  console.log(`Part ${i}: ${issues.length ? issues.join(' ') : 'PASS'} (words=${wc}, links=${links}, h2=${h2})`);
}

console.log('\nOverall: ' + (allOk ? 'ALL PASS' : 'HAS ISSUES'));
