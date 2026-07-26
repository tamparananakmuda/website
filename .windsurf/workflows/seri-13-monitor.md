---
description: Seri step 13 - Retention, completion rate, dan engagement
---

# 13-monitor

Retention, completion rate, dan engagement.

## Prev

Dari `/seri-12-distribution`

## Metrics to track (via Umami)

- Page views per part
- Completion rate: berapa % pembaca lanjut ke part berikutnya
- Retention: drop-off antar part
- Social engagement per part
- Newsletter CTR per part

## Review schedule

- **H+1:** Cek indexing Google per part
- **H+3:** Cek social engagement per part
- **H+7:** Cek completion rate antar part
- **H+30:** Full performance review seri

## Command cek Google indexing per part

```bash
curl -s "https://www.google.com/search?q=site:tamparananakmuda.com/artikel/SERIES-SLUG-PART-N" \
  -H "User-Agent: Mozilla/5.0" \
  | grep -o "tamparananakmuda.com/artikel/SERIES-SLUG-PART-N" \
  && echo "INDEXED" || echo "NOT INDEXED YET"
```

## Seri-specific metrics

| Metric | Target | Alert jika |
|--------|--------|------------|
| Completion rate part 1 → 2 | > 40% | < 20% |
| Completion rate part 2 → 3 | > 30% | < 15% |
| Avg reading time per part | > 3 menit | < 1 menit |
| Social engagement per part | > 50 total | < 20 |
| Newsletter open rate | > 25% | < 15% |

## Checklist

- [ ] Indexing Google dicek per part (H+1)
- [ ] Social engagement dicek per part (H+3)
- [ ] Completion rate antar part dicek (H+7)
- [ ] Full performance review seri (H+30)
- [ ] AI Citation Tracking: Perplexity + ChatGPT + Google AI Overview (H+14)
- [ ] Drop-off Analysis: identifikasi part dengan drop-off tertinggi
- [ ] Series Arc Effectiveness: engine question answered, arc completed
- [ ] Action Research Spiral: hypothesis + reflect per seri
- [ ] Series Monitor Quality Score: min 7 (dari 10)

## AI Citation Tracking (seri)

| Check | Cara | Timing | Target |
|-------|------|--------|--------|
| **Perplexity** | Query keyword seri, cek apakah part TAM di-cite | H+14 | 1+ part di-cite |
| **ChatGPT** | Query keyword seri dengan web, cek source | H+14 | 1+ part di-cite |
| **Google AI Overview** | Query keyword seri, cek AI Overview | H+14 | Seri muncul di overview |
| **Bing Copilot** | Query keyword seri | H+30 | 1+ part di-cite |

Jika belum di-cite H+14: cek format data self-contained, definisi jelas, FAQ format per part.

## Drop-off Analysis

Identifikasi di part mana reader drop-off tertinggi:

| Metric | Cara hitung | Target | Alert |
|--------|------------|--------|-------|
| **Part 1 -> 2 completion** | (Views part 2 / Views part 1) x 100 | > 40% | < 20% |
| **Part 2 -> 3 completion** | (Views part 3 / Views part 2) x 100 | > 30% | < 15% |
| **Part N-1 -> N completion** | (Views part N / Views part N-1) x 100 | > 25% | < 10% |
| **Overall completion** | (Views part N / Views part 1) x 100 | > 15% | < 5% |

Jika drop-off alert di part X: analisis kenapa (hook lemah? terlalu panjang? tidak ada cliffhanger yang kuat?).

## Series Arc Effectiveness

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **Engine question** | Apakah engine question dijawab di part terakhir? | Ya |
| **Emotional arc** | Apakah reader merasakan perubahan emosi? | Sesuai plan |
| **Cliffhanger effectiveness** | Apakah cliffhanger drive reader ke part berikutnya? | Completion rate > target |
| **Climax impact** | Apakah klimaks di Act 3 paling impactful? | Engagement tertinggi di part terakhir atau near-ending |
| **Standalone value** | Apakah reader yang baca 1 part saja tetap dapat value? | Bounce rate < 60% |

## Action Research Spiral (seri)

| Phase | Activity | Output |
|-------|----------|--------|
| **Plan** | Sebelum publish, hypothesis: "Seri ini akan perform karena [angle/arc/timing]" | Hypothesis |
| **Act** | Publish + distribute sesuai workflow | Execution log |
| **Observe** | Collect metrics per part di H+1, H+3, H+7, H+30 | Data table per part |
| **Reflect** | Bandingkan hypothesis vs reality. Part mana yang over/under perform? | Learning note per seri |

## Series Monitor Quality Score (0-10)

Target: min 7.

| Factor | Weight | 0 | 1 | 2 |
|--------|--------|---|---|---|
| **Metrics collected** | 2 | < 3 metric | 3-5 metric | 6+ metric |
| **Completion rate** | 2 | Tidak dicek | Dicek tapi no action | Checked + analyzed |
| **AI citation** | 1 | Tidak dicek | Dicek tapi no action | Citation teridentifikasi |
| **Drop-off analysis** | 1 | Tidak ada | Ada tapi no action | Identified + action plan |
| **Arc effectiveness** | 1 | Tidak dicek | Dicek tapi vague | Clear assessment |
| **Action research** | 1 | Tidak ada | Hypothesis only | Full spiral |
| **Decision made** | 1 | Tidak ada | Vague | Clear: iterate/refresh/biarkan |
| **Learning note** | 1 | Tidak ada | Thin | Detailed + actionable |

Jika score < 7: tambah metric atau analisis.

## Next

Lanjut ke `/seri-14-iterate`
