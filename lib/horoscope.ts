// ============================================================
// Günlük/Haftalık/Aylık Burç Yorumu motoru — AI YOK, GERÇEK efemeris verisi.
// Uygulamanın kendi astronomi motorundan (computePlanets) bugünün gerçek
// gezegen konumlarını çeker: Ay'ın gerçek burcu, retro gezegenler vb.
// Ay'ın senin burcuna göre evi günün temasını belirler; içerik tarih+veri
// tohumuyla çeşitlenir. Saf fonksiyon (cache gerekmez).
// ============================================================

import { SIGNS } from "./zodiac";
import { julianDay, computePlanets } from "./astrology/ephemeris";

// --- Tohumlu RNG ---
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T>(arr: T[], r: () => number): T => arr[Math.floor(r() * arr.length)];

// --- GERÇEK gökyüzü (efemeris) ---
const PERSONAL_RETRO = ["Merkür", "Venüs", "Mars"] as const;

export interface SkyState {
  moonSign: number; // 0-11
  sunSign: number;
  moonLon: number;
  sunLon: number;
  retro: string[]; // retro kişisel gezegenler (Merkür/Venüs/Mars)
  positions: Record<string, { sign: number; retro: boolean }>;
}

// Aynı an için gökyüzü tekrar tekrar hesaplanmasın (hub 12 burç aynı günü
// paylaşır). Saat kovasıyla memoize; Ay ~0.5°/saat hareket eder, burç için
// ihmal edilebilir. Saf fonksiyon, risksiz.
const skyCache = new Map<number, SkyState>();
export function skyForDate(date: Date): SkyState {
  const bucket = Math.floor(date.getTime() / 3_600_000);
  const cached = skyCache.get(bucket);
  if (cached) return cached;

  const planets = computePlanets(julianDay(date));
  const byName = new Map(planets.map((p) => [p.name, p]));
  const positions: SkyState["positions"] = {};
  for (const p of planets) {
    positions[p.name] = { sign: Math.floor(p.lon / 30) % 12, retro: p.retrograde };
  }
  const retro = PERSONAL_RETRO.filter((n) => byName.get(n)?.retrograde);
  const moonLon = byName.get("Ay")?.lon ?? 0;
  const sunLon = byName.get("Güneş")?.lon ?? 0;
  const state: SkyState = {
    moonSign: Math.floor(moonLon / 30) % 12,
    sunSign: Math.floor(sunLon / 30) % 12,
    moonLon,
    sunLon,
    retro: [...retro],
    positions,
  };
  if (skyCache.size > 240) skyCache.clear();
  skyCache.set(bucket, state);
  return state;
}

// Ay evresi (gerçek Güneş-Ay açısından)
const PHASES: { name: string; meaning: string }[] = [
  { name: "Yeni Ay", meaning: "Yeni başlangıçlar ve niyetler için ideal zaman; tohum ekme dönemi." },
  { name: "Büyüyen Hilal", meaning: "Niyetlerini büyütme ve harekete geçme enerjisi yükseliyor." },
  { name: "İlk Dördün", meaning: "Karar ve eylem zamanı; engelleri aşmak için cesaret gerekiyor." },
  { name: "Büyüyen Şişkin Ay", meaning: "İnce ayar ve sabır dönemi; hedefe yaklaşıyorsun." },
  { name: "Dolunay", meaning: "Doruk, farkındalık ve sonuçlar; duygular yoğunlaşabilir." },
  { name: "Küçülen Şişkin Ay", meaning: "Şükran ve paylaşma; olgunlaşan bir döngünün meyveleri." },
  { name: "Son Dördün", meaning: "Bırakma ve gözden geçirme; gereksiz olandan arınma zamanı." },
  { name: "Küçülen Hilal", meaning: "Dinlenme ve içe dönüş; yeni döngüye hazırlanıyorsun." },
];
function moonPhase(moonLon: number, sunLon: number): { name: string; meaning: string } {
  let angle = (moonLon - sunLon) % 360;
  if (angle < 0) angle += 360;
  const idx = Math.floor((angle + 22.5) / 45) % 8;
  return PHASES[idx];
}

// Türkiye takvim günü (UTC+3, DST yok) — gün sınırı TR'ye göre belirlenir;
// böylece gece yarısı–03:00 arası "bugünün yorumu" doğru güne denk gelir.
export function dateKey(date: Date): string {
  return new Date(date.getTime() + 3 * 3_600_000).toISOString().slice(0, 10);
}
const TR_TZ = "Europe/Istanbul";

// --- İçerik havuzları (r = Ay'ın senin burcuna göre ev teması, 0-11) ---
const GENEL = [
  "Ay bugün senin burcunda; duyguların ve içgüdülerin ön planda. Kendini olduğun gibi ifade etmek için güçlü bir gün — ama ruh halin dalgalanabilir, kendine nazik ol.",
  "Bugün maddi konular ve kendine değer verme temaları öne çıkıyor. Bütçeni gözden geçirmek ya da sana iyi hissettiren bir şeye küçük bir yatırım yapmak için uygun.",
  "İletişim ve merak yüksek. Mesajlar, kısa yolculuklar ve sohbetler günü şekillendirecek; söylemek istediklerini bugün rahatça ifade edebilirsin.",
  "Ev, aile ve duygusal kökler bugün önemli. Güven alanına çekilmek isteyebilirsin; sevdiklerinle geçen zaman sana iyi gelecek.",
  "Yaratıcılığın ve neşen yüksek. Flört, hobiler ve kendini ifade etmek için keyifli bir gün. Kalbinin sesini dinle, biraz da eğlen.",
  "Düzen, rutin ve sağlık ön planda. Yapılacaklar listeni toparlamak, küçük iyi alışkanlıklar kurmak için verimli bir gün. Bedenini ihmal etme.",
  "İlişkiler ve ortaklıklar bugün merkezde. Karşındakini anlamak ve denge kurmak için güzel bir gün; ikili ilişkilerde uyum mümkün.",
  "Derin duygular, tutku ve dönüşüm teması güçlü. Yüzeyle yetinmek istemeyebilirsin; samimi bir paylaşım ya da içsel bir temizlik iyi gelecek.",
  "Ufkun genişliyor. Öğrenmek, keşfetmek ve yeni fikirlere açılmak için ilham dolu bir gün. Şans bugün senden yana olabilir.",
  "Kariyer, hedefler ve görünürlük öne çıkıyor. Sorumlulukların artabilir ama emeğin fark edilir; profesyonel adımlar için iyi bir gün.",
  "Arkadaşlıklar ve gelecek hayalleri bugün önemli. Sosyal çevren sana ilham verecek; bir hayalini paylaşmak için güzel bir zaman.",
  "İçe dönüş, dinlenme ve sezgi günü. Biraz yavaşlamak ve ruhsal olarak şarj olmak iyi gelecek; iç sesin sana bir şey fısıldıyor olabilir.",
];

const ASK = [
  "Duygusal ihtiyaçların yüzeye çıkıyor; partnerinle ya da ilgilendiğin kişiyle içten bir an yaşanabilir.",
  "İlişkide güven ve istikrar arıyorsun; küçük ama somut bir jest bağını güçlendirir.",
  "Sözlerin bugün etkileyici. İyi bir sohbet, gönlünü çeldiğin kişiyle araya köprü kurabilir.",
  "Yakınlık ve şefkat ihtiyacın yüksek; sevdiğin kişiyle huzurlu, ev sıcaklığında anlar mümkün.",
  "Romantizm ve flört yükselişte. Bugün kalbin biraz daha cesur; ilk adımı atmaktan çekinme.",
  "İlişkide gündelik detaylar önemli; partnerine yardımcı olmak yakınlığı artırır.",
  "İlişkiler tam merkezde. Uzlaşı ve karşılıklı anlayış bugün her zamankinden kolay.",
  "Tutku ve derin bağ teması güçlü; yüzeysel değil, gerçek bir yakınlık arıyorsun.",
  "Aşkta özgürlük ve macera çekici geliyor; birlikte yeni bir şey keşfetmek ilişkine renk katar.",
  "Sorumluluklar aşk hayatını gölgede bırakabilir; partnerine zaman ayırmayı unutma.",
  "Arkadaşlıktan doğan bir yakınlık ya da sosyal bir ortamda kıvılcım mümkün.",
  "İçsel bir farkındalık ilişkine ışık tutuyor; bugün dinlemek, konuşmaktan daha değerli.",
];

const KARIYER = [
  "Bugün inisiyatif almak için enerjin yüksek; bir konuda öncülük edebilirsin.",
  "Gelir ve kaynaklarına odaklan; finansal bir fırsatı değerlendirmek için iyi gün.",
  "Fikirlerini paylaşmak, sunum yapmak ve iletişim kurmak bugün lehine işliyor.",
  "İş yerinde duygusal denge önemli; sakin kalman seni öne çıkarır.",
  "Yaratıcı projeler ve özgün fikirler bugün parlıyor; cesur ol.",
  "Detaylar, düzen ve verimlilik günü; küçük işleri bitirmek büyük rahatlık verir.",
  "İş birlikleri ve ortaklıklar öne çıkıyor; bir anlaşma ya da uzlaşı mümkün.",
  "Stratejik düşünme ve derinlik bugün avantajın; bir konuyu kökten çözebilirsin.",
  "Yeni bir öğrenme ya da genişleme fırsatı kapıda; ufkunu açık tut.",
  "Kariyerinde görünürlüğün artıyor; emeğin fark edilebilir, sorumluluk al.",
  "Ekip çalışması ve sosyal ağın bugün sana kapı açabilir.",
  "Sahne arkasında çalışmak, planlamak ve hazırlanmak için verimli bir gün.",
];

const PARA = [
  "Harcamalarında dürtüsel davranma; bugün acele kararlar pahalıya patlayabilir.",
  "Maddi konular net biçimde gündemde; bütçeni gözden geçirmek için ideal gün.",
  "Küçük ek gelir fırsatları ya da faydalı bir bilgi gelebilir; kulağın açık olsun.",
  "Güvenlik hissi için tasarrufa yönelmek isteyebilirsin; bu sağlıklı bir içgüdü.",
  "Keyif harcamalarına eğilim yüksek; küçük bir ödül iyi ama dengeyi koru.",
  "Bütçe planı ve düzen bugün işine yarar; gereksizleri ayıklamak rahatlatır.",
  "Ortak kaynaklar ya da bir başkasıyla para konusu gündeme gelebilir; şeffaf ol.",
  "Yatırım ve uzun vadeli kazanç teması güçlü; aceleci olmadan değerlendir.",
  "Beklenmedik bir fırsat ya da şans bugün cüzdanına dokunabilir.",
  "Kariyer ve para iç içe; profesyonel bir adım gelirini olumlu etkileyebilir.",
  "Bir arkadaşın tavsiyesi ya da grup hareketi maddi açıdan faydalı olabilir.",
  "Bugün para konusunda sezgilerine güven; gösterişe değil ihtiyaca odaklan.",
];

const GENEL2 = [
  "Bugün kendine dürüst olmak ve ihtiyaçlarını öne koymak sana güç verir.",
  "Sağlam ve somut adımlar bugün uzun vadede karşılığını verecek.",
  "Bir fikri ya da haberi doğru kişiyle paylaşmak yeni bir kapı açabilir.",
  "Köklerine dönmek ve güven alanına çekilmek bugün şifa gibi gelecek.",
  "İçindeki çocuğa kulak ver; oyun ve yaratıcılık bugün ilaç gibi.",
  "Küçük bir düzen ya da sağlıklı bir alışkanlık günü toparlayacak.",
  "Bir başkasının gözünden bakmak bugün ilişkilerini yumuşatır.",
  "Yüzeyin altına inmekten korkma; gerçek güç orada saklı.",
  "Yeni bir bakış açısı ya da küçük bir keşif ufkunu genişletecek.",
  "Bir hedefe net bir adım atmak bugün seni görünür kılar.",
  "Doğru insanlarla bir araya gelmek bugün ilham ve fırsat getirir.",
  "Biraz yavaşlamak ve iç sesini dinlemek bugün en akıllıca seçim.",
];

const ASK_EK = [
  "Açık ve içten bir paylaşım bağını derinleştirir.",
  "Beklentini değil niyetini ifade etmek bugün daha çok yaklaştırır.",
  "Küçük bir jest, sözlerden daha etkili olabilir.",
  "Geçmişi değil şu anı konuşmak ilişkine iyi gelir.",
  "Bekârsan, beklenmedik bir tanışma kıvılcımı mümkün.",
];
const KARIYER_EK = [
  "Bir adım önden planlamak bugün seni öne çıkarır.",
  "Yardım istemek zayıflık değil; doğru destek işini hızlandırır.",
  "Detayları atlama; küçük bir özen büyük fark yaratır.",
  "Fikrini net ifade edersen dikkat çekersin.",
  "Acele bir karardan kaçın; bir gece düşünmek netlik getirir.",
];
const PARA_EK = [
  "Küçük bir tasarruf ileride rahatlık olarak geri döner.",
  "Gösterişe değil değere yatırım yap.",
  "Bir harcamayı ertelemek bugün akıllıca olabilir.",
  "Bütçeni yazıya dökmek kontrol hissini artırır.",
  "Bir fırsatı değerlendirmeden önce iki kez düşün.",
];
const SAGLIK = [
  "Enerjin dengeli; ama su içmeyi ve kısa molaları ihmal etme.",
  "Bugün dinlenmeye ihtiyacın olabilir; uykunu önemse.",
  "Hafif bir yürüyüş ya da hareket zihnini de açacak.",
  "Stresini bedeninde biriktirme; birkaç derin nefes iyi gelir.",
  "Beslenmene özen göster; bedenin bugün sana sinyal veriyor.",
  "Enerjin yüksek; bunu spora ya da üretkenliğe kanalize et.",
  "Zihinsel yorgunluğa dikkat; ekranlardan biraz uzaklaş.",
  "Küçük bir öz-bakım rutini bugün ruhunu da besleyecek.",
];
const TAVSIYE = [
  "Bugün kendini önceliklendir; 'hayır' demekten çekinme.",
  "Harcama yapmadan önce 'gerçekten ihtiyaç mı?' diye sor.",
  "Söylemeyi ertelediğin o şeyi bugün dile getir.",
  "Sevdiğin birini ara ya da evinde küçük bir düzen yarat.",
  "Bugün biraz eğlen; ciddiyetin arasına neşe kat.",
  "Listendeki tek bir maddeyi bitir; gerisi gelecek.",
  "Haklı olmak yerine anlamayı seç.",
  "Seni yoran bir şeyi bugün bırak; kendine alan aç.",
  "Yeni bir şey öğren: bir makale, podcast ya da kısa bir gezi.",
  "Hedefine dair tek bir somut adım at, ne kadar küçük olursa olsun.",
  "Bir arkadaşına ulaş; bağlantı bugün sana iyi gelecek.",
  "10 dakikanı sessizliğe ayır; iç sesin netleşsin.",
];

const TONES = [
  "Genel olarak akışına güvenebileceğin, dengeli bir gün.",
  "Sabırlı olursan günün ikinci yarısı lehine dönebilir.",
  "Beklenmedik küçük bir sürpriz moralini yükseltebilir.",
  "Kendine küçük bir mola vermeyi unutma; enerjini koru.",
  "Niyetini net tutarsan istediğine bir adım daha yaklaşırsın.",
  "Günün temposu değişken; esnek kalırsan her şeyi lehine çevirirsin.",
  "İçgüdülerin bugün keskin; ilk hissin çoğu zaman doğru olacak.",
  "Küçük bir cesaret, gününü beklenmedik bir yere taşıyabilir.",
];

// Burcun elementine göre günün enerji tonu (ücretsiz genel yorumu zenginleştirir)
const ELEMENT_NOTE: Record<string, string> = {
  Ateş: "Ateş enerjin bugün canlı; cesaretini ve girişkenliğini konuştur, ama sabırsızlığa teslim olma.",
  Toprak: "Toprak yanın bugün sağlam; somut, pratik adımlar sana güven ve huzur verecek.",
  Hava: "Hava enerjin zihnini hızlandırıyor; fikirler, sohbetler ve bağlantılar günü taşıyacak.",
  Su: "Su yanın derin ve sezgisel; duygularına kulak ver, içgüdülerin bugün yol gösterici.",
};

const RETRO_NOTE: Record<string, string> = {
  Merkür: "Merkür retrosu sürüyor: iletişim, sözleşme ve teknolojide acele etme, detayları iki kez kontrol et.",
  Venüs: "Venüs retrosu sürüyor: ilişkiler ve maddi konularda eski meseleler gündeme gelebilir, ani kararlardan kaçın.",
  Mars: "Mars retrosu sürüyor: enerjin dalgalı olabilir, öfke ve acelecilikten uzak dur, gücünü doğru yöne kanalize et.",
};

const COLORS = ["Mor", "Altın sarısı", "Lacivert", "Turkuaz", "Bordo", "Gümüş", "Yeşil", "Pembe", "Beyaz", "Turuncu"];
const LOVE_FAV = [4, 6, 7, 2];
const CAREER_FAV = [9, 5, 8, 1];
const MONEY_FAV = [1, 2, 8, 9];

function star(fav: number[], r: number, rnd: () => number): number {
  const base = fav.includes(r) ? 4 : 2 + Math.floor(rnd() * 2);
  return Math.max(1, Math.min(5, base + Math.floor(rnd() * 2)));
}

const SIGN_NAMES = SIGNS.map((s) => s.name);

export interface DailyHoroscope {
  signSlug: string;
  signName: string;
  glyph: string;
  date: string;
  dateLabel: string;
  moonSign: string;
  retro: string[];
  // Ücretsiz (herkese açık)
  genel: string;
  genelEnerji: number; // 1-5 günün genel enerjisi
  tema: string; // günün öne çıkan teması
  ayEvresi: { name: string; meaning: string };
  gununTavsiyesi: string;
  uyumluBurc: string;
  // Üyeye özel (derin)
  ask: string;
  kariyer: string;
  para: string;
  saglik: string;
  enerji: { ask: number; kariyer: number; para: number; saglik: number };
  sansliRenk: string;
  sansliSayi: number;
}

export function getDailyHoroscope(signSlug: string, date = new Date()): DailyHoroscope | null {
  const sunIdx = SIGNS.findIndex((s) => s.slug === signSlug);
  if (sunIdx < 0) return null;
  const sign = SIGNS[sunIdx];
  const key = dateKey(date);
  const sky = skyForDate(date);
  const r = (sky.moonSign - sunIdx + 12) % 12;
  const rnd = rng(hashStr(key + ":" + signSlug));

  let genel = `${GENEL[r]} ${GENEL2[r]} ${ELEMENT_NOTE[sign.element]} ${pick(TONES, rnd)}`;
  if (sky.retro.length) genel += ` ${RETRO_NOTE[sky.retro[0]]}`;

  // Kategori enerjileri (üyeye özel kartlarda da kullanılır)
  const enAsk = star(LOVE_FAV, r, rnd);
  const enKariyer = star(CAREER_FAV, r, rnd);
  const enPara = star(MONEY_FAV, r, rnd);
  const enSaglik = star([0, 3, 5, 11], r, rnd);
  // Günün genel enerjisi: dört alanın ortalaması (ücretsiz gösterilir)
  const genelEnerji = Math.max(
    1,
    Math.min(5, Math.round((enAsk + enKariyer + enPara + enSaglik) / 4)),
  );

  // Bugün uyumlu burç: Ay'ın elementini paylaşan burçlar (kendisi hariç)
  const moonElement = SIGNS[sky.moonSign].element;
  const uyumlular = SIGNS.filter(
    (s) => s.element === moonElement && s.slug !== signSlug,
  ).map((s) => s.name);
  const uyumluBurc = uyumlular.length ? pick(uyumlular, rnd) : SIGNS[sky.moonSign].name;

  return {
    signSlug,
    signName: sign.name,
    glyph: sign.glyph,
    date: key,
    dateLabel: date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
      timeZone: TR_TZ,
    }),
    moonSign: SIGN_NAMES[sky.moonSign],
    retro: sky.retro,
    genel,
    genelEnerji,
    tema: HOUSE_LABEL[r],
    ayEvresi: moonPhase(sky.moonLon, sky.sunLon),
    gununTavsiyesi: TAVSIYE[r],
    uyumluBurc,
    ask: `${ASK[r]} ${pick(ASK_EK, rnd)}`,
    kariyer: `${KARIYER[r]} ${pick(KARIYER_EK, rnd)}`,
    para: `${PARA[r]} ${pick(PARA_EK, rnd)}`,
    saglik: pick(SAGLIK, rnd),
    enerji: {
      ask: enAsk,
      kariyer: enKariyer,
      para: enPara,
      saglik: enSaglik,
    },
    sansliRenk: pick(COLORS, rnd),
    sansliSayi: 1 + Math.floor(rnd() * 49),
  };
}

// --- Haftalık (önümüzdeki 7 günün gerçek Ay geçişleri) ---
export interface PeriodHoroscope {
  title: string;
  range: string;
  paragraphs: string[];
}

export function getWeeklyHoroscope(signSlug: string, date = new Date()): PeriodHoroscope | null {
  const sunIdx = SIGNS.findIndex((s) => s.slug === signSlug);
  if (sunIdx < 0) return null;
  const themes: number[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(date.getTime() + i * 86_400_000);
    themes.push((skyForDate(d).moonSign - sunIdx + 12) % 12);
  }
  // En sık görülen 2 ev teması
  const freq = new Map<number, number>();
  themes.forEach((t) => freq.set(t, (freq.get(t) ?? 0) + 1));
  const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([r]) => r);
  const end = new Date(date.getTime() + 6 * 86_400_000);
  return {
    title: "Bu Hafta",
    range: `${date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", timeZone: TR_TZ })} – ${end.toLocaleDateString("tr-TR", { day: "numeric", month: "long", timeZone: TR_TZ })}`,
    paragraphs: [
      `Bu hafta Ay senin için özellikle ${top.map((r) => HOUSE_LABEL[r]).join(" ve ")} alanlarını harekete geçiriyor.`,
      ...top.map((r) => GENEL[r].split(".")[0] + "."),
    ],
  };
}

export function getMonthlyHoroscope(signSlug: string, date = new Date()): PeriodHoroscope | null {
  const sunIdx = SIGNS.findIndex((s) => s.slug === signSlug);
  if (sunIdx < 0) return null;
  const sky = skyForDate(date);
  const rSun = (sky.sunSign - sunIdx + 12) % 12;
  const paras = [
    `Bu ay Güneş ${SIGN_NAMES[sky.sunSign]} burcunda; senin için ${HOUSE_LABEL[rSun]} dönemi. ${MONTHLY[rSun]}`,
  ];
  if (sky.retro.length) paras.push(RETRO_NOTE[sky.retro[0]]);
  return {
    title: "Bu Ay",
    range: date.toLocaleDateString("tr-TR", { month: "long", year: "numeric", timeZone: TR_TZ }),
    paragraphs: paras,
  };
}

const HOUSE_LABEL = [
  "kimlik ve yenilenme",
  "para ve değerler",
  "iletişim ve öğrenme",
  "ev ve aile",
  "aşk ve yaratıcılık",
  "iş ve sağlık",
  "ilişkiler",
  "dönüşüm ve derinlik",
  "keşif ve şans",
  "kariyer ve hedefler",
  "sosyal çevre ve umutlar",
  "dinlenme ve sezgi",
];

const MONTHLY = [
  "Kendini yeniden tanımlamak, yeni bir başlangıç yapmak için güçlü bir dönem. Enerjin yüksek; istediğin yöne kanalize et.",
  "Maddi güvenlik ve öz değer ön planda. Gelirini artırmak ve kaynaklarını düzenlemek için verimli bir ay.",
  "Öğrenme, iletişim ve bağlantılar artıyor. Yeni fikirler ve kısa yolculuklar bu ayı renklendirecek.",
  "Ev, aile ve duygusal temeller gündemde. İç huzurunu güçlendirecek adımlar atmak için iyi bir dönem.",
  "Aşk, yaratıcılık ve keyif ön planda. Kalbini açmak ve kendini ifade etmek için ilham dolu bir ay.",
  "Düzen, sağlık ve verimlilik dönemi. Rutinlerini iyileştirmek ve hedeflerini sağlama almak için ideal.",
  "İlişkiler ve iş birlikleri merkezde. Önemli bir ortaklık ya da dengeleme süreci yaşanabilir.",
  "Derin dönüşüm ve yenilenme ayı. Eskiyi bırakıp güçlenerek çıkacağın bir süreç mümkün.",
  "Ufkun genişliyor; öğrenme, seyahat ve fırsatlar artıyor. Şans bu ay senden yana.",
  "Kariyer ve başarı dönemi. Görünürlüğün ve sorumlulukların artıyor; emeğin karşılık bulabilir.",
  "Sosyal çevren ve gelecek planların öne çıkıyor. İş birlikleri ve topluluklar sana kapı açabilir.",
  "İçe dönüş ve dinlenme ayı. Ruhsal olarak şarj olup yeni bir döngüye hazırlanıyorsun.",
];

// --- Transit/Retro uyarıları (gerçek veriden) ---
export interface TransitAlert {
  planet: string;
  title: string;
  text: string;
}

export function getTransitAlerts(date = new Date()): TransitAlert[] {
  const sky = skyForDate(date);
  return sky.retro.map((p) => ({
    planet: p,
    title: `${p} Retrosu`,
    text: RETRO_NOTE[p],
  }));
}
