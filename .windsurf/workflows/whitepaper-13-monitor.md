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

## Checklist

- [ ] Whitepaper ter-index Google (H+1)
- [ ] Social engagement dicek (H+3)
- [ ] Metrics awal vs target (H+7)
- [ ] Full performance review (H+30)

## Next

Lanjut ke `/whitepaper-14-update`
