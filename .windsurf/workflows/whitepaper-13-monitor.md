---
description: Whitepaper step 13 - Ranking, traffic, dan engagement
---

# 13-monitor

Ranking, traffic, dan engagement.

## Prev

Dari `/whitepaper-12-distribution`

## Metrics to track (via Umami)

- Page views, unique visitors, average reading time
- Scroll depth, email subscribe rate, social referral traffic
- PDF download count (jika `downloadUrl` di-set)
- Bounce rate

## Review schedule

- **H+1:** Cek apakah whitepaper ter-index Google (site:search)
- **H+3:** Cek social engagement (likes, shares, saves)
- **H+7:** Review metrics awal vs target
- **H+30:** Full performance review, decide if refresh needed

## Command cek Google indexing

```bash
curl -s "https://www.google.com/search?q=site:tamparananakmuda.com/whitepaper/SLUG" \
  -H "User-Agent: Mozilla/5.0" \
  | grep -o "tamparananakmuda.com/whitepaper/SLUG" \
  && echo "INDEXED" || echo "NOT INDEXED YET"
```

## Whitepaper-specific metrics

| Metric | Target | Alert jika |
|--------|--------|------------|
| Page views (30 hari) | > 500 | < 100 |
| Avg reading time | > 10 menit | < 3 menit |
| PDF downloads (jika ada) | > 50 | < 10 |
| Newsletter CTR | > 15% | < 5% |
| Social shares | > 30 total | < 10 |
| LinkedIn engagement | > 20 reactions | < 5 |

## AI Citation Tracking (GEO Metrics)

Whitepaper = most citable asset untuk AI search. Track AI citation:

| Platform | Method | Frequency |
|----------|--------|-----------|
| **ChatGPT** | Query: "apa hasil riset TAM tentang [topik]?" | Monthly |
| **Perplexity** | Query: "whitepaper [topik] Indonesia" | Monthly |
| **Google AI Overview** | Search: [keyword whitepaper] | Monthly |
| **Gemini** | Query: "riset [topik] generasi muda Indonesia" | Monthly |

Track: apakah whitepaper di-cite? Apakah claim di-lift dengan akurat? Apakah author attribution correct?

GEO runs on days (models cite good new page dalam ~1 minggu). Cek H+7, H+14, H+30.

## Content Atomization Performance

Track performance per derivative asset:

| Derivative | Metric | Target | Alert |
|-----------|--------|--------|-------|
| Blog post 1-3 | Page views 30 hari | > 200 each | < 50 |
| Carousel | IG saves + shares | > 30 | < 5 |
| Thread | Impressions + replies | > 5.000 | < 500 |
| LinkedIn Article | Views + reactions | > 500 views | < 50 |
| Newsletter | Open rate + CTR | > 25% open, > 10% CTR | < 15% open |
| Infographic | Saves + shares | > 20 | < 3 |

Hub-and-spoke: whitepaper = hub, derivatives = spokes. Jika spoke perform baik, feed traffic ke hub. Jika spoke underperform, analyze kenapa.

## E-E-A-T Signal Monitoring

| Signal | Check | Frequency |
|--------|-------|-----------|
| **Author provenance** | Google cross-reference author bio dengan LinkedIn, published work | Quarterly |
| **Backlinks** | External sites linking ke whitepaper | Monthly |
| **Brand mentions** | Mention TAM atau whitepaper title di external sites | Monthly |
| **Wikipedia presence** | Apakah TAM atau whitepaper di-cite di Wikipedia? | Quarterly |
| **Third-party reviews** | Apakah ada review/discussion di external platforms? | Monthly |

## Action Research Spiral (Kurt Lewin)

Whitepaper TAM = iterative, bukan one-shot. Monitor = observe phase dari action research cycle:

| Phase | Whitepaper application |
|-------|----------------------|
| **Plan** | Riset whitepaper (01-05) |
| **Act** | Publish whitepaper (11) + distribute (12) |
| **Observe** | This step: track metrics, reader response, AI citation, engagement |
| **Reflect** | What worked? What didn't? What insights baru? |
| **Re-plan** | Update whitepaper (14) atau plan whitepaper baru dengan insights |

Observe + reflect = input untuk cycle berikutnya. Jangan publish dan lupa.

## Bayesian Calibration Tracking

Track apakah claims di whitepaper terbukti akurat dari waktu ke waktu:

| Claim di whitepaper | Evidence setelah publish | Calibration |
|---------------------|------------------------|-------------|
| [Claim 1] | Data baru mendukung/menentang? | Update jika perlu |
| [Claim 2] | Data baru mendukung/menentang? | Update jika perlu |
| [Claim 3] | Data baru mendukung/menentang? | Update jika perlu |

Good forecasters update incrementally. Bad forecasters: never update (conservatism) atau make rare dramatic updates (base rate neglect). TAM = Bayesian: update proportionate ke evidence baru.

## Checklist

- [ ] Whitepaper ter-index Google (H+1)
- [ ] Social engagement dicek (H+3)
- [ ] Metrics awal vs target (H+7)
- [ ] AI citation tracking: cek ChatGPT, Perplexity, Google AI Overview, Gemini (H+7, H+14, H+30)
- [ ] Content atomization performance: track per derivative asset
- [ ] E-E-A-T signal monitoring: backlinks, brand mentions, author provenance
- [ ] Action research spiral: observe + reflect documented
- [ ] Bayesian calibration: claims tracked, update jika evidence baru
- [ ] Full performance review (H+30)

## Next

Lanjut ke `/whitepaper-14-update`
