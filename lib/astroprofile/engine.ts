// ============================================================
// AstroProfil™ — karar motoru + dinamik paragraf üretici (AI YOK).
// Burç başlangıç matrisi + cevap etkileri → 12 özellik puanı →
// kurallara göre kişiye özel, "kahin" sesinde analiz.
// İçerik tamamen deterministik: aynı burç + aynı cevaplar = aynı metin.
// ============================================================

import { getSign, SIGNS } from "../zodiac";
import {
  QUESTIONS,
  SIGN_BASE,
  TRAIT_KEYS,
  TRAIT_LABELS,
  type Scores,
  type TraitKey,
} from "./data";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

// Burç tabanı + seçilen cevapların etkileri → final puanlar.
export function computeScores(signSlug: string, answers: number[]): Scores {
  const base = SIGN_BASE[signSlug] ?? SIGN_BASE.koc;
  const out = { ...base };
  answers.forEach((optIdx, qIdx) => {
    const opt = QUESTIONS[qIdx]?.options[optIdx];
    if (!opt) return;
    for (const [k, v] of Object.entries(opt.effects)) {
      out[k as TraitKey] = (out[k as TraitKey] ?? 0) + (v as number);
    }
  });
  for (const k of TRAIT_KEYS) out[k] = clamp(out[k]);
  return out;
}

export type ProfileCategory = "portre" | "guc" | "ask" | "kariyer" | "kehanet";

export interface ProfileSection {
  id: string;
  category: ProfileCategory;
  title: string;
  paragraphs: string[];
  tags?: string[];
}

export interface TraitScore {
  key: TraitKey;
  label: string;
  value: number;
}

export interface ProfileResult {
  signSlug: string;
  signName: string;
  glyph: string;
  scores: Scores;
  ordered: TraitScore[];
  top: TraitScore[];
  low: TraitScore[];
  bestSigns: string[];
  challengingSigns: string[];
  headline: string;
  sections: ProfileSection[];
}

// --- İçerik havuzları (özellik bazlı, kahin sesinde) ---
const STRENGTH: Record<TraitKey, string> = {
  liderlik:
    "Bir grup yön ararken, gözler sen istemesen bile sana döner. Liderlik sende bir poz değil, bir refleks — öne çıkmayı seçmesen bile enerjin çoktan öne geçmiş olur.",
  mantik:
    "Kaosun ortasında bile berrak kalabilen bir zihnin var. Herkes duyguya kapılırken sen bir adım geri çekilir, olayın iskeletini görürsün; bu serinkanlılık çoğu insanda yoktur.",
  empati:
    "İnsanların söylemediğini duyabiliyorsun. Bir bakış, bir sessizlik sana yetiyor; karşındakinin içinden geçeni, o daha ağzını açmadan biliyorsun.",
  duygusallik:
    "Hislerini yarım yaşamıyorsun. Sevdiğinde tüm kalbinle, üzüldüğünde tüm derinliğinle — bu yoğunluk bir yük değil, seni canlı kılan şeyin ta kendisi.",
  ozguven:
    "İçinde sarsılmayan bir zemin var. Dünya itip kaktığında bile en dipte hâlâ kendine tutunabiliyorsun; ve bu güven, farkında olmadan etrafındakilere de bulaşıyor.",
  sabir:
    "Acele etmeyi reddediyorsun. Doğru anın geleceğini biliyor, onu bekleyebiliyorsun — ve çoğu zaman, koşanların yorgun düştüğü yerde sen hâlâ ayaktasın.",
  risk:
    "Belirsizlik seni korkutmuyor, çağırıyor. İnsanlar kapının önünde dururken sen eşiği çoktan geçmiş oluyorsun; cesaretin, hayatının kapılarını açan anahtar.",
  disiplin:
    "Söz verdiğin işi, kimse bakmasa bile bitiriyorsun. Bu sessiz tutarlılık, parlak ama dağınık olanların asla ulaşamadığı yere taşıyor seni.",
  bagimsizlik:
    "Kendi yolunu kendin çiziyorsun. Kalabalık bir yöne akarken sen durup 'peki ben ne istiyorum?' diye soruyorsun — bu, çok azının sahip olduğu bir özgürlük.",
  sosyallik:
    "İnsanların arasında ışığın artıyor. Bir odaya girdiğinde havayı değiştiriyor, birbirini tanımayanları birbirine bağlıyorsun; bu sıcaklık senin doğal hediyen.",
  sezgisellik:
    "İçinde, mantığın henüz yetişemediği bir pusula var. Bir şeyin doğru ya da yanlış olduğunu nedenini açıklayamadan 'biliyorsun' — ve şaşırtıcı biçimde, çoğu zaman haklı çıkıyorsun.",
  kararlilik:
    "Bir hedefe kilitlendiğinde seni durdurmak zordur. Yorulursun ama vazgeçmezsin; bu inat, hayallerini sessizce gerçeğe çeviren güç.",
};

const GROWTH: Record<TraitKey, string> = {
  liderlik:
    "Bazen sahip olduğun gücü kendinden bile saklıyorsun. Fikirlerin söylenmeyi bekliyor; sustuğunda kaybeden yalnızca sen olmuyorsun.",
  mantik:
    "Kalbin yükseldiğinde aklın susabiliyor. Önemli anlarda bir nefes alıp olayın soğuk yüzüne bakmak, sonradan pişman olacağın kararlardan korur seni.",
  empati:
    "Kendi telaşına kapıldığında, karşındakinin sessiz çığlığını kaçırabiliyorsun. Bazen sadece 'sen nasılsın?' diye sormak bütün bir bağı değiştirir.",
  duygusallik:
    "Hislerini içine gömme alışkanlığın var. Oysa paylaşılmayan duygu kaybolmaz, sadece içeride birikir; onları söze döktüğünde hafifliyorsun.",
  ozguven:
    "İçindeki o zemin zaman zaman sarsılıyor. Küçük zaferlerini görmezden geliyorsun; oysa onları saymaya başladığın an, güvenin kendiliğinden büyüyor.",
  sabir:
    "Sonucu hemen görmek istiyorsun. Bekleyiş seni geriyor; ama bazı şeyler ancak demlendiğinde olgunlaşır — tıpkı senin en güzel yanların gibi.",
  risk:
    "Güvenli olanı seçme eğilimin, bazı kapıları sen fark etmeden kapatıyor. Hayatın en güzel sürprizleri çoğu zaman konfor alanının bir adım ötesinde bekliyor.",
  disiplin:
    "Düzen sana sıkıcı gelebiliyor. Ama tek bir küçük alışkanlık bile dağılan enerjini bir nehir gibi tek yöne akıtabilir.",
  bagimsizlik:
    "Zaman zaman başkalarının onayına fazla yaslanıyorsun. Oysa içindeki ses, dışarıdaki bütün seslerden daha çok şey biliyor.",
  sosyallik:
    "Kalabalık seni yorabiliyor — ve bu bir eksiklik değil. Sen enerjini gürültüde değil derinlikte topluyorsun; bunu kabul etmek seni rahatlatıyor.",
  sezgisellik:
    "Her şeyi mantığa sığdırmaya çalışmak, içindeki o ince sesi bastırabiliyor. Bazen açıklayamadığın hisse güvenmek en doğru kararını verdiriyor sana.",
  kararlilik:
    "Karar verdikten sonra bile geri dönüp aynı kapıyı çalıyorsun. İlk içgüdüne güvenmeyi öğrendiğin gün, içindeki o huzursuzluk diniyor.",
};

const ADVICE: Record<TraitKey, string> = {
  liderlik:
    "Küçük kararlarda inisiyatifi ele almayı dene. Liderlik bir kas gibidir; kullandıkça güçlenir, sustukça körelir.",
  mantik:
    "Önemli bir karardan önce artıları ve eksileri kâğıda dök. Zihnindeki sis, yazıya döküldüğünde dağılır.",
  empati:
    "Sevdiğine 'sen ne hissediyorsun?' diye sormayı alışkanlık edin. O küçük soru, çoğu büyük cümleden daha çok yaklaştırır.",
  duygusallik:
    "Hislerini bastırmak yerine güvendiğin bir kalbe aç. Paylaşılan yük, yarıya iner.",
  ozguven:
    "Her günün sonunda iyi yaptığın üç şeyi yaz. Özgüven büyük zaferlerle değil, fark edilen küçük anlarla büyür.",
  sabir:
    "Büyük hedefi küçük adımlara böl. Sabırsızlığın, ulaşılabilir bir sonraki adım gördüğünde sakinleşir.",
  risk:
    "Küçük ve kontrollü riskler almakla başla. Konfor alanı zorlanınca değil, nazikçe itildiğinde genişler.",
  disiplin:
    "Tek bir küçük günlük ritüel seç ve ona sadık kal. Bir alışkanlık, bütün bir düzenin tohumudur.",
  bagimsizlik:
    "Kimseye danışmadan küçük kararlar vermeyi dene. Kendi sesini duydukça, dış seslere daha az ihtiyacın olur.",
  sosyallik:
    "Kalabalık yerine birebir, derin sohbetleri seç. Senin kuyun gürültüde değil, yakınlıkta doluyor.",
  sezgisellik:
    "Bazen 'mantıklı' olanı değil, içinden geleni dinle. İlk hissin, en eski öğretmenin.",
  kararlilik:
    "Bir karar verdiğinde onu 24 saat sorgulamamayı dene. Netlik, ısrarla değil, teslimiyetle gelir.",
};

const TENSION: Record<string, string> = {
  Ateş: "Su",
  Su: "Ateş",
  Toprak: "Hava",
  Hava: "Toprak",
};

const ELEMENT_IMAGERY: Record<string, string> = {
  Ateş: "içinde hiç sönmeyen bir ateş",
  Toprak: "sağlam, köklerini derine salmış bir toprak",
  Hava: "durmadan esen, hiçbir yere ait olmayan bir rüzgâr",
  Su: "dibi görünmeyen, derin bir su",
};

function fire(rules: { when: boolean; text: string }[], fallback: string): string[] {
  const hits = rules.filter((r) => r.when).map((r) => r.text);
  return hits.length ? hits : [fallback];
}

export function generateProfile(signSlug: string, scores: Scores): ProfileResult {
  const sign = getSign(signSlug) ?? getSign("koc")!;
  const s = scores;

  const ordered: TraitScore[] = TRAIT_KEYS.map((k) => ({
    key: k,
    label: TRAIT_LABELS[k],
    value: s[k],
  })).sort((a, b) => b.value - a.value);
  const top = ordered.slice(0, 4);
  const low = ordered.slice(-3).reverse();
  const t0 = top[0].label.toLowerCase();
  const t1 = top[1].label.toLowerCase();

  const headline = `${sign.name} ateşini ${t0} ve ${t1} ile harmanlayan biri`;

  // ---- PORTRE: açılış kehaneti ----
  const balance =
    s.mantik - s.duygusallik > 12
      ? "Karar anlarında aklın sesi, duygularından her zaman bir adım önde yürüyor. Sen hissetmeden önce anlamak istiyorsun — bu, seni acelenin tuzaklarından koruyan bir kalkan."
      : s.duygusallik - s.mantik > 12
        ? "Dünyayı önce kalbinle okuyor, ancak sonra aklınla yorumluyorsun. Bir şeyin 'doğru' olması yetmez sana; aynı zamanda iyi hissettirmesi gerekir."
        : "Mantık ile duygu arasında, çoğu insanda göremeyeceğin dengeli bir köprü kurmuşsun. Kalbin konuştuğunda aklın dinler, aklın konuştuğunda kalbin susmaz.";

  const energy =
    s.risk > 70 && s.sabir < 45
      ? "İçinde durmak bilmeyen, cesur bir kıpırtı var; beklemek senin için dünyanın en zor işlerinden biri. Hareket ettiğinde nefes alıyorsun."
      : s.sabir > 70 && s.risk < 45
        ? "Acele etmeyen, sağlam ve ölçülü bir iç dünyan var. Fırtınalar geçer, sen kalırsın; bu sükûnet senin en sessiz gücün."
        : "Enerjini ne tamamen frenliyor ne de başıboş bırakıyorsun; ne zaman hızlanıp ne zaman duracağını içgüdüyle biliyorsun.";

  const hidden =
    s.sosyallik >= 65 && s.bagimsizlik >= 65
      ? "Dışarıdan bakan seni sosyal ve uyumlu görür; oysa içeride, kimseye söylemediğin bir köşe var — orada yalnızca kendinle kalmak istiyorsun. İkisini birden taşımak seni çelişkili değil, derin yapıyor."
      : s.ozguven >= 68 && s.duygusallik >= 65
        ? "Güçlü ve toparlı görünüyorsun; ama bu kabuğun altında, çoğu kişinin tahmin edemeyeceği kadar ince bir kalp atıyor. Güçlü olman, az hisseden biri olduğun anlamına gelmiyor — tam tersine."
        : s.mantik >= 68 && s.sezgisellik >= 62
          ? "Mantığına güvenirsin ama bir sırrın var: en doğru kararlarını çoğu zaman 'içine doğduğu' için verdin. Akıl ile sezgi sende kavga etmiyor, el ele yürüyor."
          : s.kararlilik >= 66 && s.sabir < 50
            ? "Bir şeyi istediğinde tüm gücünle istersin — ama beklemek sana âdeta işkence gibi gelir. Bu yangın, seni hem ileri taşıyan hem zaman zaman yakan ateşin."
            : "Görünen yüzünün altında, henüz tam tanımadığın bir derinlik var. Bu profil, o derinliğin haritasının yalnızca ilk sayfası.";

  const genel: ProfileSection = {
    id: "genel",
    category: "portre",
    title: "Açılış: Yıldızlar Seni Anlatıyor",
    paragraphs: [
      `Karşımda bir ${sign.name} duruyor — ve burcun sana ${ELEMENT_IMAGERY[sign.element] ?? "kendine özgü bir enerji"} verdi. Ama yıldızların söylediği yalnızca bu değil. Verdiğin yanıtların ardında, herkesin göremediği bir desen var: en çok ${t0} ve ${t1} ile titreşiyorsun. Bu ikisi, senin sessiz imzanı oluşturuyor.`,
      balance,
      energy,
      hidden,
    ],
  };

  // ---- GÜÇ & GÖLGE ----
  const guclu: ProfileSection = {
    id: "guclu",
    category: "guc",
    title: "Işığın — Güçlü Yönlerin",
    paragraphs: top.slice(0, 3).map((t) => STRENGTH[t.key]),
  };
  const gelisim: ProfileSection = {
    id: "gelisim",
    category: "guc",
    title: "Gölgen — Henüz Uyanmamış Yönlerin",
    paragraphs: low.map((t) => GROWTH[t.key]),
  };

  // ---- AŞK & UYUM ----
  const iliski: ProfileSection = {
    id: "iliski",
    category: "ask",
    title: "Aşkta Sen",
    paragraphs: fire(
      [
        { when: s.empati >= 72 && s.duygusallik >= 68, text: "Sevdiğinde yarım sevmezsin. Karşındakinin duygularını neredeyse kendi teninde hissedersin; bu derinlik doğru kişiyle eşsiz bir yakınlığa, yanlış kişiyle ise sessiz bir tükenmeye dönüşebilir. Kalbini kime açtığına çok dikkat et." },
        { when: s.bagimsizlik >= 75, text: "Sevmek senin için kendini kaybetmek değildir. Bir ilişkinin içinde bile kendi alanına, kendi nefesine ihtiyaç duyarsın; seni sürekli kontrol etmeye çalışan biri, farkında olmadan seni kendinden uzaklaştırır." },
        { when: s.duygusallik < 48, text: "Duygularını göstermek yerine korumayı seçersin. Bu mesafe seni güvende tutar ama bazen sevdiklerin, içinde olup biteni göremediği için kendini uzakta hisseder. Aralanan küçük bir kapı, sandığından az şey kaybettirir." },
        { when: s.empati < 50, text: "İlişkide bazen 'haklı olmak' ile 'anlamak' arasında bir seçim çıkar karşına. Sen ilkine yatkınsın — oysa çoğu zaman seni sevdiğine yaklaştıran şey haklılığın değil, onu gerçekten duyduğunu hissettirmen." },
      ],
      "İlişkilerinde hem sevgine hem özgürlüğüne yer açarsın. Ne tümüyle kaybolur ne de tümüyle uzak durursun; bu denge, uzun soluklu bağların sessiz sırrı.",
    ),
  };

  const tensionEl = TENSION[sign.element];
  const challengingSigns = SIGNS.filter((x) => x.element === tensionEl)
    .map((x) => x.name)
    .slice(0, 3);
  const burcEnerji: ProfileSection = {
    id: "burc-enerji",
    category: "ask",
    title: "Seni Yükseltenler, Seni Sınayanlar",
    paragraphs: [
      `${sign.compatibility.best.slice(0, 3).join(", ")} burçları senin enerjini yükseltir; onların yanında nefes alır, hiç çabalamadan akıcı bir uyum bulursun. Onlarla birlikteyken en doğal hâlin ortaya çıkar.`,
      `${challengingSigns.join(", ")} gibi ${tensionEl} burçları ise seni zorlayabilir — ilk bakışta seninle aynı dili konuşmuyor gibidirler. Ama yıldızların cilvesi şudur: çoğu zaman en çok onlardan öğrenir, onların yanında gelişirsin.`,
    ],
  };

  // ---- KARİYER & ZİHİN ----
  const karar: ProfileSection = {
    id: "karar",
    category: "kariyer",
    title: "Karar Anında Sen",
    paragraphs: fire(
      [
        { when: s.mantik >= 70 && s.empati < 65, text: "Karar anında duygular masaya oturmaz; önce gerçeği, veriyi, mantığı dinlersin. Bu soğukkanlılık seni acele hatalarından korur — yine de bazen kalbin de bir oy hak ediyor." },
        { when: s.risk >= 70 && s.kararlilik >= 68, text: "Belirsizliğin tam ortasında bile adım atabiliyorsun. Çoğu insan garanti beklerken sen riski göze alıyor, hareketin içinde düşünmeyi seçiyorsun. Cesaret, kararlarının imzası." },
        { when: s.sezgisellik >= 72 && s.mantik < 62, text: "Senin pusulan içeride. Bir şeyin doğru olduğunu nedenini sıralayamadan 'biliyorsun' — ve şaşırtıcı biçimde, o ses çoğu zaman haklı çıkıyor." },
        { when: s.risk < 42, text: "Aklına yatmadan adım atmazsın. Önce tartar, ölçer, içine sindirirsin; bu yüzden senin kararların sağlamdır, kolay kolay geri dönmezsin." },
        { when: s.kararlilik < 42, text: "Kararı verirsin ama zihnin geri dönüp aynı kapıyı çalar. 'Ya yanlışsa?' sorusu peşini bırakmaz — oysa ilk içgüdün, sandığından çok daha bilge." },
      ],
      "Mantık ile sezgi arasında gidip gelir, duruma göre birinin diğerine yol vermesine izin verirsin. Bu esneklik seni hem temkinli hem cesur kılıyor.",
    ),
  };

  const kariyer: ProfileSection = {
    id: "kariyer",
    category: "kariyer",
    title: "Çalışırken Parladığın Yer",
    paragraphs: fire(
      [
        { when: s.liderlik >= 72 && s.ozguven >= 68, text: "Bir ekibin önünde durmak sana doğal gelir. Karar almak, sorumluluğu üstlenmek, yön göstermek — başkalarını yoran bu yükler seni canlandırır. Takip eden değil, takip edilen olmak için doğmuşsun." },
        { when: s.disiplin >= 72 && s.mantik >= 66, text: "Düzen, sistem ve uzmanlık isteyen işlerde fark yaratıyorsun. Başkalarının gözden kaçırdığı detaylar senin elinde sağlama alınıyor; bu titizlik, zamanla itibara dönüşür." },
        { when: s.mantik >= 74, text: "Analiz, strateji ve problem çözme gerektiren her alan tam sana göre. Karmaşık bir bulmaca çoğu kişiyi yorar, seni ise uyandırır." },
        { when: s.bagimsizlik >= 78, text: "Sana en uygun ortam, kendi kararlarını verebildiğin, özgürce çalışabildiğin bir alan. Tepende sürekli birinin durduğu işler, içindeki en iyi şeyi söndürür." },
        { when: s.sezgisellik >= 74 || s.duygusallik >= 74, text: "Yaratıcılık ve sezgi isteyen işlerde içindeki cevher ortaya çıkıyor. Sen kuralları uygulamak için değil, yenisini hayal etmek için varsın." },
      ],
      "Hem ekip çalışmasına hem bireysel üretime uyum sağlayabilen, esnek bir kariyer ruhun var. Seni asıl yoran iş değil, anlamsız hissettiğin iştir.",
    ),
  };

  const stres: ProfileSection = {
    id: "stres",
    category: "kariyer",
    title: "Baskı Altında Sen",
    paragraphs: fire(
      [
        { when: s.sabir < 45 && s.risk >= 65, text: "Stres altında harekete geçme ihtiyacı duyuyorsun; durup beklemek seni daha da geriyor. Sana iyi gelen şey, enerjini somut bir adıma dönüştürmek." },
        { when: s.empati >= 70, text: "Zorlandığında çevrendekilerin yükünü de sırtlanma eğilimin var. Önce kendi maskeni takmayı öğren; başkalarını ancak ayakta kalırsan taşıyabilirsin." },
        { when: s.duygusallik >= 72, text: "Stres seni duygusal olarak yıpratabiliyor. Hisleri bastırmak fırtınayı dindirmez, sadece erteler; onları ifade ettiğinde daha hızlı toparlanıyorsun." },
        { when: s.disiplin >= 70 && s.sabir >= 58, text: "Baskı altında soğukkanlılığını koruyorsun; herkes panikteyken sen plana, sisteme, rutine tutunarak ilerliyorsun. Bu sükûnet çevrene de güven veriyor." },
      ],
      "Stresle baş ederken duruma göre bazen geri çekiliyor, bazen harekete geçiyorsun. Bu uyum sağlama yeteneği, fark etmesen de bir güç.",
    ),
  };

  const clusters: { when: boolean; items: string[] }[] = [
    { when: s.liderlik >= 68 && s.ozguven >= 65, items: ["Yöneticilik", "Girişimcilik", "Proje liderliği"] },
    { when: s.mantik >= 68 && s.disiplin >= 62, items: ["Mühendislik", "Finans / Analiz", "Hukuk", "Yazılım"] },
    { when: s.empati >= 70 && s.sosyallik >= 58, items: ["Psikoloji", "Eğitim", "Sağlık", "Danışmanlık", "İnsan Kaynakları"] },
    { when: s.sezgisellik >= 70 || s.duygusallik >= 72, items: ["Sanat", "Tasarım", "Yazarlık", "Müzik"] },
    { when: s.bagimsizlik >= 75 && s.risk >= 58, items: ["Serbest meslek", "Girişimcilik", "Yaratıcı yönetmenlik"] },
    { when: s.sosyallik >= 72, items: ["Satış", "Pazarlama", "Halkla İlişkiler", "Etkinlik yönetimi"] },
  ];
  const profSet = new Set<string>();
  clusters.filter((c) => c.when).forEach((c) => c.items.forEach((i) => profSet.add(i)));
  if (profSet.size === 0)
    ["Eğitim", "Danışmanlık", "İletişim", "Proje yönetimi"].forEach((i) => profSet.add(i));
  const meslekler: ProfileSection = {
    id: "meslekler",
    category: "kariyer",
    title: "Yıldızların İşaret Ettiği Alanlar",
    paragraphs: [
      "Özellik haritan, potansiyelini en çok şu alanlarda gösterebileceğini fısıldıyor. Bunlar bir kader değil, içindeki cevherin en kolay parladığı zeminler:",
    ],
    tags: [...profSet].slice(0, 8),
  };

  // ---- YILDIZLARIN SÖZÜ (kehanet kapanışı) ----
  const lowest = low[0];
  const second = low[1];
  const tavsiyeParas = [ADVICE[lowest.key]];
  if (second && second.value < 50) tavsiyeParas.push(ADVICE[second.key]);
  const tavsiye: ProfileSection = {
    id: "tavsiye",
    category: "kehanet",
    title: "Sana Özel Reçete",
    paragraphs: tavsiyeParas,
  };

  const kapanis: ProfileSection = {
    id: "kapanis",
    category: "kehanet",
    title: "Yıldızların Son Sözü",
    paragraphs: [
      `Sen, ${t0} ile ${t1} arasında kurulmuş bir köprüsün. Gücün tam burada: ${sign.name} burcunun enerjisini bu iki yönle harmanladığında, çoğu insanın ömrü boyunca aradığı o dengeyi yakalıyorsun.`,
      `Yolun, ${lowest.label.toLowerCase()} ile barışmaktan geçiyor. Onu bir eksik gibi değil, henüz uyandırmadığın bir güç gibi gör. O kapıyı araladığın gün, kendini ilk kez bütün hissedeceksin.`,
      "Ve şunu hiç unutma: burcun sana bir başlangıç verdi, ama kim olacağını her gün yeniden sen seçiyorsun. Yıldızlar yalnızca eğilim fısıldar — son sözü her zaman sen söylersin.",
    ],
  };

  return {
    signSlug: sign.slug,
    signName: sign.name,
    glyph: sign.glyph,
    scores: s,
    ordered,
    top,
    low,
    bestSigns: sign.compatibility.best.slice(0, 3),
    challengingSigns,
    headline,
    sections: [
      genel,
      guclu,
      gelisim,
      iliski,
      burcEnerji,
      karar,
      kariyer,
      stres,
      meslekler,
      tavsiye,
      kapanis,
    ],
  };
}
