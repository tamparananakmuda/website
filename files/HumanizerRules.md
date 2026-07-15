# Humanizer Rules TAM

Single source of truth untuk mendeteksi dan menghilangkan pola tulisan AI. Berlaku untuk semua konten TAM: artikel, newsletter, social media, meta descriptions.

## 1. Punctuation

- **DILARANG em dash (—) dan en dash (–)** di semua copy. Gunakan koma, titik dua, atau pecah jadi kalimat terpisah.
- Maks 1 exclamation mark per artikel
- Tidak pakai ellipsis (...) sebagai desain
- Tidak ada curly quotes ("...") -> gunakan straight quotes ("...")
- Tidak ada title case di headings (gunakan sentence case)

## 2. AI Vocabulary (English)

Dilarang: crucial, pivotal, vibrant, tapestry, delve, showcase, underscore, testament, foster, garner, intricate, landscape, additionally, enduring, enhance, highlight, interplay, multifaceted, nuanced, robust, holistic, paradigm, leverage, realm, beacon, bastion, quintessential, epitome, harbinger, catalyst, conduit, formidable, profound, resolute, steadfast, unwavering.

## 3. AI Vocabulary (Indonesia)

Dilarang: signifikan, krusial, esensial, vital, mendalam, memperhatikan, pada dasarnya, secara fundamental, pada intinya, pada akhirnya, menariknya, yang menarik, perlu dicatat, perlu diingat, tidak dapat dipungkiri, tidak diragukan lagi, sungguh-sungguh, sepenuhnya, benar-benar (overuse >2x).

## 4. Structural Patterns

- **Staccato drama**: 3+ kalimat pendek beruntun (<=6 kata) untuk manufactured drama
- **Rule of three abuse**: pola "X, Y, dan Z" lebih dari 2x per artikel
- **Fragmented headers**: heading diikuti 1 kalimat yang hanya restates heading
- **Negative parallelisms**: "tidak hanya... tapi juga", "bukan hanya... melainkan", "it's not just...it's" lebih dari 1x
- **Aphorism formulas**: "X adalah Y dari Z", "X becomes a trap"
- **-ing superficial analysis**: "highlighting...", "underscoring...", "emphasizing...", "reflecting...", "symbolizing..." lebih dari 2x

## 5. Promotional Language

Dilarang: game-changing, revolutionary, boasts, stunning, breathtaking, nestled, renowned, groundbreaking, cutting-edge, state-of-the-art, world-class, seamless, empower, transform, unlock, unleash, supercharge, skyrocket, game-changer.

## 6. Vague Attribution

- "Studi menunjukkan..." tanpa sumber spesifik -> WAJIB sebut nama studi + tahun + link
- "Para ahli mengatakan..." tanpa nama -> WAJIB sebut nama + afiliasi
- "Banyak orang berpikir..." -> OK jika diikuti data atau observasi konkret

## 7. Copula Avoidance

Dilarang: "serves as", "stands as", "represents a", "acts as", "functions as" untuk pengganti "adalah/merupakan". Gunakan "adalah" atau langsung kalimat aktif.

## 8. Signposting

Dilarang: "let's dive in", "here's what you need to know", "let's break this down", "marilah kita bahas", "berikut adalah hal yang perlu kamu tahu", "tanpa berpanjang lebar".

## 9. Filler Phrases

Dilarang: "in order to" (gunakan "untuk"), "due to the fact that" (gunakan "karena"), "at this point in time" (gunakan "sekarang"), "it is important to note" (langsung stating), "perlu diketahui bahwa" (langsung stating).

## 10. Generic Conclusions

Dilarang: "the future looks bright", "exciting times lie ahead", "masa depan yang cerah menanti", "ini adalah awal dari sesuatu yang besar", "peluang tak terbatas".

## 11. Authority Tropes

Dilarang: "the real question is", "at its core", "what really matters", "fundamentally", "yang sebenarnya", "pada hakikatnya", "inti permasalahannya".

## 12. Conversational Rhetorical Openers

Dilarang: "Honestly?", "Look,", "Here's the thing", "Jujur saja,", "Coba lihat,", "Begini".

## 13. Hyphenated Word Pair Overuse

Batas: maks 2x per artikel. "high-quality" -> "high quality", "long-term" -> "jangka panjang".

## 14. Boldface Overuse

Bold hanya untuk: key terms pertama kali diperkenalkan, angka penting, atau 1-2 kata emphasis per paragraf. Tidak untuk istilah umum atau seluruh kalimat.

## 15. Human Signature (Wajib)

- Minimal 1 paragraf dari pengalaman/observasi/opini spesifik penulis
- Gunakan "kita" dan "kamu" secara inklusif, bukan "Anda"
- Ada opinions/reactions, bukan hanya neutral reporting
- Ada acknowledgment of uncertainty atau mixed feelings jika relevan
- Tone: jujur, rasional, berani, tidak menggurui

## Audit Script

```bash
# Jalankan setelah draft selesai, sebelum insert ke DB
# Cek semua pattern di atas secara otomatis
python3 -c "
import json, re, sys
d = json.load(open(sys.argv[1]))
body = d.get('body', '')
title = d.get('title', '')
excerpt = d.get('excerpt', '')
full = body + ' ' + title + ' ' + excerpt
issues = []

# 1. Em/en dash
if '—' in full or '–' in full:
    issues.append('Em/en dash found')

# 2. AI vocab EN
ai_en = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash']
found_en = [w for w in ai_en if w in body.lower()]
if found_en: issues.append('AI vocab EN: ' + ', '.join(found_en))

# 3. AI vocab ID
ai_id = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri']
found_id = [w for w in ai_id if w in body.lower()]
if found_id: issues.append('AI vocab ID: ' + ', '.join(found_id))

# 4. Staccato drama
sentences = re.split(r'[.!?]\s+', body)
current_run = max_run = 0
for s in sentences:
    if len(s.split()) <= 6: current_run += 1; max_run = max(max_run, current_run)
    else: current_run = 0
if max_run >= 3: issues.append('Staccato drama (max run: %d)' % max_run)

# 5. Rule of three
triples = re.findall(r'(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)', body)
if len(triples) > 2: issues.append('Rule of three: %d' % len(triples))

# 6. Negative parallelisms
neg = re.findall(r'(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also|it.s not just.*it.s)', body, re.I)
if neg: issues.append('Negative parallelisms: %d' % len(neg))

# 7. Curly quotes
if '\u201c' in body or '\u201d' in body:
    issues.append('Curly quotes')

# 8. -ing superficial
ing = re.findall(r'(\w+ing (?:the|its|a|this|that))', body)
if len(ing) > 2: issues.append('-ing superficial: %d' % len(ing))

# 9. Promotional
promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','state-of-the-art','world-class','seamless','empower','transform','unlock','unleash','supercharge','skyrocket']
found_promo = [w for w in promo if w in body.lower()]
if found_promo: issues.append('Promotional: ' + ', '.join(found_promo))

# 10. Signposting
signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar']
found_signs = [w for w in signs if re.search(w, body, re.I)]
if found_signs: issues.append('Signposting')

# 11. Filler
fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa']
found_fillers = [w for w in fillers if w in body.lower()]
if found_fillers: issues.append('Filler: ' + ', '.join(found_fillers))

# 12. Generic conclusions
generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas']
found_generic = [w for w in generic if w in body.lower()]
if found_generic: issues.append('Generic conclusion: ' + ', '.join(found_generic))

# 13. Exclamation marks
if body.count('!') > 1: issues.append('Exclamation marks: %d' % body.count('!'))

# 14. Human signature check
personal = len(re.findall(r'\bkita\b|\bkamu\b|\bsaya\b', body, re.I))
if personal < 3: issues.append('Human signature weak (kita/kamu/saya: %d)' % personal)

print('=== HUMANIZER AUDIT ===')
if issues:
    for i in issues: print('  FAIL:', i)
    print('\nTOTAL ISSUES:', len(issues))
else:
    print('  CLEAN: No issues detected.')
" "$ARTICLE_JSON"
```
