# Android / Play Store Yol Haritası

Bu belge, mevcut Next.js web uygulamasını **backend'e dokunmadan** Android uygulamasına
çevirip Play Store'a yayınlamak için izlenecek adımları anlatır. Henüz kod yazılmadı;
bu sadece "ne yapacağız" planı.

---

## 0. Karar: Hangi yöntem?

**Seçilen yön: Capacitor ile sarmalama (WebView kabuğu).**

Gerekçe:
- Backend (`app/api/...` + Prisma + Postgres) **hiç değişmez**.
- UI yeniden yazılmaz; mevcut sayfalar olduğu gibi çalışır.
- `sid` httpOnly çerezi, Creem ödeme, cron, e-posta — hepsi tarayıcıdaki gibi işler.
- Play Store'a gerçek bir `.aab` paketi olarak çıkar.

Alternatifler (şimdilik seçilmedi):
- **TWA (Trusted Web Activity)**: Daha hafif ama uygulama tamamen canlı siteye bağımlı;
  offline/native eklenti esnekliği az. Capacitor ileride push/native özellik için daha rahat.
- **React Native**: En native his ama UI'ın tamamı yeniden yazılır + auth token'a çevrilir.
  Şu anki "sade, hızlı çıkalım" hedefine uymuyor.

---

## 1. Ön koşullar (mimari gereksinimler)

Capacitor bir WebView'dir; içinde **canlı bir URL** veya **statik export** çalışır.
Mevcut uygulama SSR + API rotaları kullandığı için en sağlıklı kurulum:

> **Uygulama kabuğu, yayındaki Next.js sitesine (örn. `https://app.alanadi.com`) bağlanır.**
> Yani Vercel'deki mevcut deploy hem web hem de Android'in backend'i olur. Tek kaynak.

Bunun anlamı:
- Statik export (`output: export`) **gerekmez** ve istemeyiz (API rotaları + SSR kaybolurdu).
- Android paketi yalnızca ince bir kabuk; tüm mantık sunucuda kalır.
- Site güncellendiğinde uygulama da otomatik güncel olur (mağaza güncellemesi gerekmez).

### Yapılacak hazırlıklar (kod tarafı, sırası geldiğinde)
- [ ] Üretim domaini netleştir (örn. `app.alanadi.com`) ve HTTPS doğrula.
- [ ] CORS gerekmez (aynı origin'e bağlanılıyor) — ama Capacitor `server.url` ayarı yapılacak.
- [ ] Çerez ayarı kontrol: `SID_COOKIE_OPTS` üretimde `secure: true`, `sameSite: "lax"`.
      WebView aynı origin'e gittiği için `lax` sorun çıkarmaz; test edilecek.
- [ ] Creem ödeme akışı WebView içinde harici tarayıcı mı açıyor, in-app mı?
      → Play Store dijital içerik kuralları açısından **kritik**. Bkz. Bölüm 6.

---

## 2. Capacitor kurulum adımları (sırası geldiğinde)

> Not: Bu adımlar ileride uygulanacak; şimdi sadece referans.

1. Geliştirme makinesine **Android Studio** + JDK kurulumu.
2. Projeye Capacitor ekle (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`).
3. `capacitor.config.ts` içinde:
   - `appId`: ters domain (örn. `com.alanadi.astrotek`)
   - `appName`: uygulama adı
   - `server.url`: yayındaki site URL'i (kabuk buraya bağlanır)
4. Android platformunu ekle ve aç (`npx cap add android`, `npx cap open android`).
5. İlk derleme + emülatör/cihazda çalıştırma testi.

---

## 3. Native varlıklar (tasarım)

- [ ] **Uygulama ikonu** (adaptive icon: ön plan + arka plan, 512×512 master).
- [ ] **Splash screen** (açılış ekranı, marka rengiyle uyumlu, sade).
- [ ] Tema rengi / durum çubuğu (status bar) rengi.
- [ ] Mevcut `app/icon.svg`'den türetilebilir.

---

## 4. Native davranış inceleri (test edilecek)

- [ ] **Geri tuşu**: Android donanım geri tuşu WebView geçmişinde gezsin, kök sayfada
      uygulamadan çıksın.
- [ ] **Dış linkler**: Blog/harici bağlantılar sistem tarayıcısında açılsın
      (`@capacitor/browser`), uygulama içinde kaybolmasın.
- [ ] **Derin link / dönüş URL'i**: Ödeme sonrası Creem'den geri dönüş uygulamaya
      düşmeli (bkz. Bölüm 6).
- [ ] **Çevrimdışı durum**: İnternet yoksa düzgün bir hata ekranı.
- [ ] **Klavye / form**: Doğum tarihi-saati girişleri, geocode arama alanı.

---

## 5. İzinler ve gizlilik

- [ ] Hangi izinler gerçekten gerekli? (İnternet zaten var; konum **gerekmiyorsa**
      istemeyelim — geocode sunucu tarafında.)
- [ ] **Gizlilik Politikası URL'i** zorunlu (Play Console'da istenir).
- [ ] **Veri güvenliği formu**: e-posta + şifre topluyoruz, ödeme Creem üzerinden.
      Toplanan veriler doğru beyan edilecek.

---

## 6. ÖDEME — en kritik konu ⚠️

Play Store, **uygulama içinde tüketilen dijital içerik/kredi** satışında genelde
**Google Play Billing** kullanılmasını ister. Mevcut sistem Creem (harici ödeme).

İncelenecek / karar verilecek:
- [ ] Kredi paketleri "dijital içerik" sayılır → Google bunu kendi faturalandırmasına
      zorlayabilir (%15–30 komisyon).
- [ ] Olası yollar:
  1. **Google Play Billing entegrasyonu** (Android'de ayrı ödeme yolu) — komisyon var,
     en güvenli mağaza onayı.
  2. **Ödemeyi sistem tarayıcısında aç** (uygulama dışı web ödemesi) — kuralları
     dikkatli okumak gerek; reddedilme riski olabilir.
  3. Uygulamayı ödeme olmadan yayınla, satın almayı yalnızca web'e yönlendir — riskli.
- [ ] **Bu karar verilmeden Play Store yayını yapılmamalı.** Önce Google Play ödeme
      politikası mevcut iş modeline göre netleştirilecek.

---

## 7. Play Console yayın hazırlığı

- [ ] Google Play Developer hesabı (tek seferlik 25 USD).
- [ ] Uygulama listesi: başlık, kısa/uzun açıklama, ekran görüntüleri, özellik grafiği.
- [ ] İçerik derecelendirme anketi.
- [ ] Hedef kitle + reklam beyanı.
- [ ] İmzalı **release `.aab`** üretimi (Play App Signing).
- [ ] Önce **internal testing** kanalına yükle, kendi cihazında dene.
- [ ] Closed/Open test → Production.

---

## 8. Özet kontrol listesi (sıra)

1. [ ] Yöntem onayı (Capacitor) — ✅ bu belge
2. [ ] Üretim domaini + HTTPS hazır
3. [ ] Ödeme politikası kararı (Bölüm 6) — **yayından önce şart**
4. [ ] Capacitor kurulumu + `server.url`
5. [ ] İkon + splash
6. [ ] Geri tuşu / dış link / ödeme dönüşü testleri
7. [ ] Gizlilik politikası + veri güvenliği formu
8. [ ] Play Console hesap + liste
9. [ ] Internal test → Production

---

## Notlar
- Backend, veritabanı, API rotaları, auth mantığı **değişmiyor**. Risk düşük.
- En büyük belirsizlik **ödeme** (Bölüm 6); ikinci belirsizlik çerez/WebView davranışı.
- Site güncellemeleri otomatik yansır; yalnızca native kabuk değişirse mağaza güncellemesi gerekir.
