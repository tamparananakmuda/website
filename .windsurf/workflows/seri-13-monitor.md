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

## Next

Lanjut ke `/seri-14-iterate`
