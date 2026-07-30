'use client';

import { useState, useMemo } from 'react';

interface CalculatorConfig {
  type: 'inflation-impact' | 'farmer-share';
  title?: string;
  subtitle?: string;
  source?: string;
}

function formatRupiah(n: number): string {
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}

function InflationImpactCalculator({ title, subtitle, source }: Omit<CalculatorConfig, 'type'>) {
  const [gaji, setGaji] = useState(8000000);

  const porsiPangan = gaji * 0.4167;
  const inflasiBulanan = porsiPangan * 0.0488;
  const inflasiTahunan = inflasiBulanan * 12;
  const porsiPanganPersen = 41.67;

  return (
    <div className="my-8 rounded-xl border border-amber-500/20 bg-card overflow-hidden">
      <div className="border-b border-border px-5 py-4 md:px-6 md:py-5">
        {title && (
          <h3 className="font-display text-lg font-bold text-foreground md:text-xl">{title}</h3>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="px-5 py-5 md:px-6 md:py-6">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Gaji bulanan kamu
          </label>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Rp</span>
            <input
              type="range"
              min={3000000}
              max={30000000}
              step={500000}
              value={gaji}
              onChange={(e) => setGaji(Number(e.target.value))}
              className="flex-1 accent-amber-500"
            />
            <span className="w-32 text-right font-display text-sm font-bold text-amber-500">
              {formatRupiah(gaji)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-background/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pengeluaran pangan per bulan</span>
              <span className="font-display text-base font-bold text-foreground">
                {formatRupiah(porsiPangan)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{porsiPanganPersen}% dari gaji (Susenas 2024)</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-amber-500/60 transition-all"
                style={{ width: `${porsiPanganPersen}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Hilang ke inflasi pangan per bulan</span>
              <span className="font-display text-base font-bold text-red-400">
                -{formatRupiah(inflasiBulanan)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Inflasi pangan 4,88% (Bapanas 2024)</span>
            </div>
          </div>

          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Total hilang per tahun</span>
              <span className="font-display text-xl font-bold text-red-400">
                -{formatRupiah(inflasiTahunan)}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Itu uang yang hilang dari dompet kamu setiap tahun, tanpa kamu sadari. Cukup buat beli smartphone baru atau bayar kursus.
            </p>
          </div>
        </div>

        {source && (
          <p className="mt-4 text-xs text-muted-foreground/60">Sumber: {source}</p>
        )}
      </div>
    </div>
  );
}

function FarmerShareCalculator({ title, subtitle, source }: Omit<CalculatorConfig, 'type'>) {
  const [hargaBeras, setHargaBeras] = useState(15572);
  const [farmerShare, setFarmerShare] = useState(50);

  const petaniDapat = hargaBeras * (farmerShare / 100);
  const rantaiTengah = hargaBeras * ((100 - farmerShare) / 100);
  const channelLabel = farmerShare >= 65 ? 'Channel pendek (langsung)' : farmerShare >= 50 ? 'Channel menengah' : 'Channel panjang (tengkulak)';

  return (
    <div className="my-8 rounded-xl border border-amber-500/20 bg-card overflow-hidden">
      <div className="border-b border-border px-5 py-4 md:px-6 md:py-5">
        {title && (
          <h3 className="font-display text-lg font-bold text-foreground md:text-xl">{title}</h3>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="px-5 py-5 md:px-6 md:py-6">
        <div className="mb-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Harga beras per kg yang kamu bayar
            </label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Rp</span>
              <input
                type="range"
                min={8000}
                max={25000}
                step={100}
                value={hargaBeras}
                onChange={(e) => setHargaBeras(Number(e.target.value))}
                className="flex-1 accent-amber-500"
              />
              <span className="w-28 text-right font-display text-sm font-bold text-amber-500">
                {formatRupiah(hargaBeras)}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Farmer&apos;s share (porsi yang sampai ke petani)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={30}
                max={80}
                step={1}
                value={farmerShare}
                onChange={(e) => setFarmerShare(Number(e.target.value))}
                className="flex-1 accent-amber-500"
              />
              <span className="w-16 text-right font-display text-sm font-bold text-amber-500">
                {farmerShare}%
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {channelLabel}. Threshold efisien: 70%. Data nyata Indonesia: 42-68%.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex h-12 items-stretch">
              <div
                className="flex items-center justify-center bg-amber-500/20 transition-all"
                style={{ width: `${farmerShare}%` }}
              >
                <span className="text-xs font-bold text-amber-400">PETANI</span>
              </div>
              <div
                className="flex items-center justify-center bg-red-500/20 transition-all"
                style={{ width: `${100 - farmerShare}%` }}
              >
                <span className="text-xs font-bold text-red-400">RANTAI TENGAH</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-xs text-muted-foreground">Petani terima</p>
              <p className="mt-1 font-display text-lg font-bold text-amber-500">
                {formatRupiah(petaniDapat)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{farmerShare}% dari harga</p>
            </div>

            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-xs text-muted-foreground">Rantai tengah ambil</p>
              <p className="mt-1 font-display text-lg font-bold text-red-400">
                {formatRupiah(rantaiTengah)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{100 - farmerShare}% dari harga</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/50 p-4">
            <p className="text-sm text-muted-foreground">
              {farmerShare < 70 ? (
                <>
                  Farmer&apos;s share di bawah threshold efisien (70%). Artinya{' '}
                  <span className="font-semibold text-red-400">rantai distribusi ambil porsi lebih besar dari yang seharusnya</span>.
                  Kalau kamu beli langsung dari petani atau koperasi, farmer&apos;s share bisa naik ke 68%+.
                </>
              ) : (
                <>
                  Farmer&apos;s share di atas threshold efisien (70%). Artinya{' '}
                  <span className="font-semibold text-amber-400">petani dapat porsi yang layak</span>.
                  Ini yang terjadi di channel pendek (petani langsung ke konsumen).
                </>
              )}
            </p>
          </div>
        </div>

        {source && (
          <p className="mt-4 text-xs text-muted-foreground/60">Sumber: {source}</p>
        )}
      </div>
    </div>
  );
}

export function InteractiveCalculator({ config }: { config: CalculatorConfig }) {
  if (config.type === 'inflation-impact') {
    return <InflationImpactCalculator title={config.title} subtitle={config.subtitle} source={config.source} />;
  }
  if (config.type === 'farmer-share') {
    return <FarmerShareCalculator title={config.title} subtitle={config.subtitle} source={config.source} />;
  }
  return null;
}
