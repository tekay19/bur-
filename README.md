# 🌙 Astrotek AI

Modern, Türkçe, AI destekli astroloji analiz uygulaması. Kullanıcı doğum bilgilerini girer; uygulama **natal doğum haritasını**, **evleri**, **açıları** ve **güncel transit etkilerini** hesaplar, ardından bunları **olasılıkçı / sembolik** bir dille yorumlar.

> **Önemli:** Bu uygulama astrolojiyi bilimsel kesinlik olarak sunmaz. Tüm yorumlar **astrolojik sembolizm ve eğlence / kişisel farkındalık** amaçlıdır. Kesin gelecek tahmini değildir.

---

## ✨ Özellikler

- **Natal Harita** — Gezegen burç/derece/ev/retro durumu ve esansiyel onurlar
- **Ev Analizi** — 12 ev için çalışma durumu (destekleyici / zorlayıcı / sakin)
- **Açı Analizi** — Kavuşum, altmışlık, kare, üçgen, karşıt (orb ile)
- **Transit Analizi** — Yavaş / hızlı gezegen + Ay transitleri, etki pencereleri
- **Skorlama** — Kariyer, Sınav/Atanma, İlişki, Para, Sağlık, Eğitim, Genel
- **Sınav / Atanma Modülü** — 10/6/9. ev + Jüpiter-Satürn-Merkür-Mars göstergeleri
- **Zaman Çizelgesi** — Bugünden 1 yıla dönemsel temalar
- **AI Yorumu** — OpenAI uyumlu API ile doğal Türkçe yorum (anahtar yoksa kural-tabanlı yedek)
- **Dark mode**, responsive, premium SaaS arayüzü

---

## 🧱 Teknoloji

| Katman | Teknoloji |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS + shadcn/ui tarzı bileşenler |
| Doğrulama | Zod |
| ORM | Prisma (PostgreSQL — Neon / Supabase) |
| AI | OpenAI uyumlu Chat Completions API |
| Astroloji motoru | Saf JS efemeris (native binary **gerektirmez**) |

### Astroloji hesaplama mimarisi (adapter pattern)

Hesaplama motoru **değiştirilebilir** olacak şekilde tasarlandı:

```
lib/astrology/
  adapters/
    localAdapter.ts      # Varsayılan — saf JS Kepler efemeris (Vercel serverless uyumlu)
    externalAdapter.ts   # Harici efemeris API (iskelet)
    swissAdapter.ts      # Swiss Ephemeris / WASM (gelecek — pasif)
    index.ts             # ASTRO_ADAPTER env'ine göre seçer
  calculateNatalChart.ts # Public API
  calculateTransits.ts   # Public API
  aspects.ts • houses.ts • dignities.ts • scoring.ts • constants.ts • types.ts
```

`ASTRO_ADAPTER=local|external|swiss` ile motor seçilir. Eksik yapılandırmada güvenle `local`'e döner.

---

## 🚀 Kurulum (Lokal)

```bash
# 1) Bağımlılıkları kur
npm install

# 2) Ortam değişkenlerini ayarla
cp .env.example .env
#   -> .env içindeki değerleri doldur (hiçbiri zorunlu değil, aşağıya bak)

# 3) (Opsiyonel) Veritabanı şemasını uygula
npm run db:push

# 4) Geliştirme sunucusu
npm run dev
# http://localhost:3000
```

### Sıfır yapılandırmayla çalışır

Hiçbir ortam değişkeni vermesen bile uygulama çalışır:

- **DATABASE_URL yok** → analizler süreç-içi bellek + tarayıcı `sessionStorage`'da tutulur.
- **AI_API_KEY yok** → kural-tabanlı (rule-based) Türkçe yorum üreticisi devreye girer.
- **GEOCODING_API_URL yok** → dahili şehir veritabanı (81 il + dünya şehirleri) kullanılır.

Üretim için en azından `DATABASE_URL` ve `AI_API_KEY` önerilir.

---

## 🔑 Ortam Değişkenleri

`.env.example` dosyasına bakın. Özet:

| Değişken | Açıklama | Zorunlu |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL bağlantısı (Neon/Supabase) | Hayır (yoksa bellek) |
| `AI_API_KEY` | OpenAI uyumlu API anahtarı | Hayır (yoksa yedek) |
| `AI_BASE_URL` | API kök adresi (vars. OpenAI) | Hayır |
| `AI_MODEL` | Model adı (vars. `gpt-4o-mini`) | Hayır |
| `ASTRO_ADAPTER` | `local` / `external` / `swiss` | Hayır (vars. local) |
| `GEOCODING_API_URL` | Harici geocoding (OpenCage uyumlu) | Hayır |

> 🔒 **Güvenlik:** AI ve veritabanı çağrıları yalnızca **sunucu tarafında** yapılır. API anahtarları hiçbir zaman client'a gönderilmez.

---

## ☁️ Vercel'e Deploy

1. Bu repoyu GitHub'a push edin.
2. [vercel.com](https://vercel.com) → **New Project** → repoyu içe aktarın.
3. **Environment Variables** bölümüne `.env.example`'daki değerleri girin
   (en az `DATABASE_URL` ve `AI_API_KEY` önerilir).
4. **Deploy**'a basın. Build komutu otomatik olarak `prisma generate && next build` çalıştırır.

### Veritabanı

**Production (Neon önerilir):**
1. [neon.tech](https://neon.tech) üzerinde ücretsiz bir Postgres oluşturun.
2. Connection string'i `DATABASE_URL` olarak ekleyin (`?sslmode=require` ile).
3. Şemayı uygulamak için: `npm run db:push` (veya CI adımı ekleyin).

Supabase de aynı şekilde kullanılabilir (Connection Pooling URL'i tercih edin).

**Lokal geliştirme (macOS / Homebrew PostgreSQL):**
```bash
brew install postgresql@15
brew services start postgresql@15          # servisi başlat
createdb astrotransit                       # veritabanını oluştur
# .env içine:
# DATABASE_URL=postgresql://<kullanıcı>@localhost:5432/astrotransit?schema=public
npm run db:push                             # tabloları oluştur
```
Servisi durdurmak için: `brew services stop postgresql@15`.
Tabloları görsel incelemek için: `npm run db:studio` (Prisma Studio).

---

## 📁 Proje Yapısı

```
app/
  page.tsx                      # Landing
  harita-olustur/page.tsx       # Doğum formu
  analiz/[id]/page.tsx          # Analiz paneli
  api/chart/route.ts            # Analiz üret + kaydet/getir
  api/ai-interpretation/route.ts
  api/geocode/route.ts
components/                     # UI + dashboard bileşenleri
  ui/                           # shadcn tarzı primitive'ler
lib/
  astrology/                    # Hesaplama motoru (adapter mimarisi)
  ai/                           # AI yorum katmanı + promptlar
  db/                           # Prisma + depolama soyutlaması
  utils/                        # tarih, timezone, geocoding
prisma/schema.prisma
```

---

## ⚠️ Doğruluk Notu

Varsayılan `local` adapter, Paul Schlyter'in basitleştirilmiş Kepler yörünge
öğelerine dayanır. Gezegen **burçları** güvenilirdir; hassas derece/dakika için
ileride `swiss` (Swiss Ephemeris WASM) adapteri doldurulabilir. Ev sistemi
olarak **Placidus** kullanılır (astro.com ve çoğu Türkçe uygulamanın varsayılanı);
kutup bölgelerinde (>66° enlem) otomatik olarak **Whole Sign (Tam Burç)**'a düşülür.

---

## 🗺️ Yol Haritası (MVP sonrası — kodda `TODO`)

- [ ] Üyelik sistemi & kullanıcı paneli
- [ ] Stripe ödeme
- [ ] Günlük transit bildirimi & haftalık rapor
- [ ] PDF export
- [ ] Solar return & progresyon haritaları
- [ ] Synastry (ilişki uyumu)
- [ ] Mobil PWA
- [ ] Placidus/Koch ev sistemleri + Swiss Ephemeris adapteri

---

Sembolik analiz, kesin kehanet değildir. Yıldızlar eğilim gösterir; kararlar size aittir. ✨
