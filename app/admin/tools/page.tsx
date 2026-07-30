'use client';

import { useState, useCallback } from 'react';
import { CheckCircle2, Circle, XCircle, Link2, BarChart3, ClipboardCopy, Check, Info } from 'lucide-react';

// ─────────────────────────────────────────────
// ANGLE TEST CHECKLIST
// ─────────────────────────────────────────────

const ANGLE_TEST_ITEMS = [
  {
    id: 'unique',
    label: 'Artikel ini punya angle yang tidak ada di 3 hasil teratas Google untuk topik yang sama.',
    weight: 25,
  },
  {
    id: 'human',
    label: 'Ada minimal satu paragraf dari pengalaman langsung, observasi lapangan, atau opini spesifik penulis.',
    weight: 25,
  },
  {
    id: 'fact',
    label: 'Semua klaim faktual punya sumber (link, footnote, atau inline reference). Tidak ada angka tanpa sumber.',
    weight: 25,
  },
  {
    id: 'pov',
    label: 'Artikel punya satu dari 9 POV yang jelas: kontra-narasi, refleksi, data, framework, tamparan, riset, opini, panduan, atau inspirasi.',
    weight: 25,
  },
];

const POV_TAGS = ['kontra-narasi', 'refleksi', 'data', 'framework', 'tamparan', 'riset', 'opini', 'panduan', 'inspirasi'];

function AngleTestSection() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [selectedPov, setSelectedPov] = useState('');
  const [hasFormula, setHasFormula] = useState<boolean | null>(null);

  const toggleCheck = (id: string) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const score = ANGLE_TEST_ITEMS.reduce((acc, item) => {
    return acc + (checks[item.id] ? item.weight : 0);
  }, 0);

  const povBonus = selectedPov ? 0 : 0;
  const formulaBonus = hasFormula === true ? 0 : 0;
  const finalScore = score + povBonus + formulaBonus;

  const allPassed = score === 100 && selectedPov !== '' && hasFormula === true;

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Layak publish';
    if (s >= 50) return 'Perlu revisi minor';
    return 'Belum siap publish';
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Angle Test Checklist</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Wajib diisi sebelum artikel di-publish. Pastikan semua item lolos.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-3xl font-bold ${getScoreColor(finalScore)}`}>{finalScore}</div>
          <div className={`text-xs font-medium ${getScoreColor(finalScore)}`}>{getScoreLabel(finalScore)}</div>
        </div>
      </div>

      <div className="mb-5 space-y-3">
        {ANGLE_TEST_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className="flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary/50"
          >
            {checks[item.id] ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            ) : (
              <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            )}
            <span className={`text-sm ${checks[item.id] ? 'text-foreground' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
            <span className="ml-auto shrink-0 text-xs text-muted-foreground/60">+{item.weight}</span>
          </button>
        ))}
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">POV Tag</label>
          <div className="flex flex-wrap gap-2">
            {POV_TAGS.map((pov) => (
              <button
                key={pov}
                onClick={() => setSelectedPov(pov === selectedPov ? '' : pov)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedPov === pov
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {pov}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Formula Tamparan-Penjelasan-Solusi
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setHasFormula(true)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                hasFormula === true
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" /> Ada semua 3
            </button>
            <button
              onClick={() => setHasFormula(false)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                hasFormula === false
                  ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <XCircle className="h-4 w-4" /> Belum lengkap
            </button>
          </div>
        </div>
      </div>

      {allPassed && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Artikel lulus angle test. Siap masuk ke tahap review/fact-check.
        </div>
      )}
      {!allPassed && finalScore > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
          <Info className="h-4 w-4 shrink-0" />
          Selesaikan semua checklist, pilih POV tag, dan pastikan formula Tamparan-Penjelasan-Solusi lengkap.
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// UTM LINK GENERATOR
// ─────────────────────────────────────────────

const UTM_PRESETS = [
  { label: 'IG Bio', source: 'instagram', medium: 'bio', campaign: 'organic' },
  { label: 'IG Story', source: 'instagram', medium: 'story', campaign: 'organic' },
  { label: 'IG Post', source: 'instagram', medium: 'post', campaign: 'organic' },
  { label: 'Newsletter', source: 'newsletter', medium: 'email', campaign: '' },
  { label: 'WhatsApp', source: 'whatsapp', medium: 'share', campaign: 'organic' },
  { label: 'TikTok Bio', source: 'tiktok', medium: 'bio', campaign: 'organic' },
];

function UtmGeneratorSection() {
  const [baseUrl, setBaseUrl] = useState('https://tamparananakmuda.com');
  const [source, setSource] = useState('instagram');
  const [medium, setMedium] = useState('bio');
  const [campaign, setCampaign] = useState('organic');
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  const buildUrl = useCallback(() => {
    try {
      const url = new URL(baseUrl);
      if (source) url.searchParams.set('utm_source', source);
      if (medium) url.searchParams.set('utm_medium', medium);
      if (campaign) url.searchParams.set('utm_campaign', campaign);
      if (content) url.searchParams.set('utm_content', content);
      return url.toString();
    } catch {
      return '';
    }
  }, [baseUrl, source, medium, campaign, content]);

  const generatedUrl = buildUrl();

  const applyPreset = (preset: typeof UTM_PRESETS[0]) => {
    setSource(preset.source);
    setMedium(preset.medium);
    setCampaign(preset.campaign);
  };

  const copyToClipboard = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">UTM Link Generator</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Buat link dengan UTM parameters untuk tracking traffic dari berbagai platform.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {UTM_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => applyPreset(preset)}
            className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Base URL
          </label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="https://tamparananakmuda.com/artikel/slug"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
            utm_source
          </label>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="instagram"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
            utm_medium
          </label>
          <input
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="bio"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
            utm_campaign
          </label>
          <input
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="organic"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
            utm_content (opsional)
          </label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="header-cta"
          />
        </div>
      </div>

      {generatedUrl && (
        <div className="rounded-lg border border-border bg-secondary/30 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Generated URL
            </span>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? (
                <><Check className="h-3.5 w-3.5 text-emerald-500" /> Disalin</>
              ) : (
                <><ClipboardCopy className="h-3.5 w-3.5" /> Salin</>
              )}
            </button>
          </div>
          <p className="break-all text-xs text-foreground">{generatedUrl}</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CONTENT QUALITY SCORE CALCULATOR
// ─────────────────────────────────────────────

const QUALITY_CRITERIA = [
  {
    id: 'angle_first',
    group: 'Angle Test',
    label: 'Lolos angle test pada percobaan pertama',
    score: 25,
    alt: [
      { label: 'Lolos percobaan kedua', score: 15 },
      { label: 'Lolos percobaan ketiga+', score: 5 },
    ],
  },
  {
    id: 'human_sig',
    group: 'Human Signature',
    label: 'Punya pengalaman personal penulis',
    score: 25,
    alt: [
      { label: 'Punya observasi lapangan spesifik', score: 20 },
      { label: 'Punya opini spesifik ke penulis', score: 15 },
    ],
  },
  {
    id: 'fact_check',
    group: 'Fact Check',
    label: 'Semua klaim punya sumber, terverifikasi',
    score: 25,
    alt: [
      { label: 'Ada minor issues / sumber sebagian', score: 15 },
      { label: 'Flagged / sumber tidak ada', score: 0 },
    ],
  },
  {
    id: 'pov_clarity',
    group: 'POV Clarity',
    label: 'POV tag dipilih dan konsisten dengan konten',
    score: 25,
    alt: [
      { label: 'POV tag dipilih tapi tidak konsisten', score: 10 },
      { label: 'Tidak ada POV tag', score: 0 },
    ],
  },
];

function ContentQualitySection() {
  const [selections, setSelections] = useState<Record<string, number>>({});

  const select = (criteriaId: string, score: number) => {
    setSelections((prev) => ({ ...prev, [criteriaId]: score }));
  };

  const totalScore = Object.values(selections).reduce((a, b) => a + b, 0);
  const allSelected = Object.keys(selections).length === QUALITY_CRITERIA.length;

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Kualitas tinggi';
    if (s >= 60) return 'Kualitas cukup';
    return 'Perlu peningkatan';
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Content Quality Score</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Hitung skor kualitas artikel sebelum publish. Target: skor &ge; 80.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-3xl font-bold ${allSelected ? getScoreColor(totalScore) : 'text-muted-foreground'}`}>
            {allSelected ? totalScore : '--'}
          </div>
          {allSelected && (
            <div className={`text-xs font-medium ${getScoreColor(totalScore)}`}>{getScoreLabel(totalScore)}</div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {QUALITY_CRITERIA.map((criteria) => (
          <div key={criteria.id} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {criteria.group}
              </span>
              {selections[criteria.id] !== undefined && (
                <span className={`text-sm font-bold ${getScoreColor(selections[criteria.id])}`}>
                  +{selections[criteria.id]}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <button
                onClick={() => select(criteria.id, criteria.score)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left transition-colors ${
                  selections[criteria.id] === criteria.score
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-foreground'
                    : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/70'
                }`}
              >
                <CheckCircle2 className={`h-4 w-4 shrink-0 ${selections[criteria.id] === criteria.score ? 'text-emerald-500' : 'text-muted-foreground/40'}`} />
                {criteria.label}
                <span className="ml-auto text-xs text-muted-foreground/60">+{criteria.score}</span>
              </button>
              {criteria.alt.map((alt) => (
                <button
                  key={alt.label}
                  onClick={() => select(criteria.id, alt.score)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left transition-colors ${
                    selections[criteria.id] === alt.score
                      ? alt.score >= 15
                        ? 'bg-amber-500/15 border border-amber-500/30 text-foreground'
                        : 'bg-red-500/15 border border-red-500/30 text-foreground'
                      : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/70'
                  }`}
                >
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  {alt.label}
                  <span className="ml-auto text-xs text-muted-foreground/60">+{alt.score}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {allSelected && totalScore < 80 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Skor di bawah 80. Revisi artikel sebelum publish untuk meningkatkan kualitas.
        </div>
      )}
      {allSelected && totalScore >= 80 && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Skor memenuhi target. Artikel siap untuk di-publish.
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function AdminToolsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Editorial Tools</h1>
        <p className="mt-1 text-muted-foreground">
          Tools untuk membantu proses editorial dan distribusi konten TAM.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AngleTestSection />
        <ContentQualitySection />
        <div className="lg:col-span-2">
          <UtmGeneratorSection />
        </div>
      </div>
    </div>
  );
}
