export const metadata = {
  title: 'Tentang',
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-serif text-3xl font-bold md:text-4xl">
          Tentang TAMPARAN ANAK MUDA
        </h1>
        <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
          <p>
            TAMPARAN ANAK MUDA adalah platform untuk anak muda Indonesia yang lagi
            berproses. Bukan motivasi murahan, bukan pula ajaran absolut. Kami
            percaya bahwa pertumbuhan dimulai dari kejujuran: mengakui bahwa hidup
            tidak selalu adil, bahwa kita seringkali bingung, dan bahwa mencari jalan
            sendiri adalah bagian dari proses.
          </p>
          <p>
            Setiap artikel dibuat dengan perspektif spesifik, pengalaman nyata, atau
            data yang relevan. Tidak ada konten generic. Tidak ada AI yang dipublish
            tanpa sentuhan manusia.
          </p>
          <p>
            Tamparan yang kamu butuhkan, bukan yang kamu inginkan.
          </p>
        </div>
      </div>
    </main>
  );
}
