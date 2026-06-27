// ============================================================
// Çin Burçları — 12 hayvan. Doğum yılına göre belirlenir (deterministik).
// 2020 = Fare yılı; index = (yıl - 2020) mod 12. Server-güvenli, AI yok.
// Not: Çin yeni yılı Ocak sonu–Şubat başında başlar; o aralıkta doğanlar
// bir önceki hayvana ait olabilir (sayfada uyarılır).
// ============================================================

export interface ChineseSign {
  slug: string;
  name: string;
  emoji: string;
  summary: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  description: string[];
  compatible: string[]; // uyumlu hayvanlar (üçgen grubu)
  luckyColor: string;
}

// Sıra: 2020'den itibaren (Fare=0). Değiştirme — yıl hesabı buna bağlı.
export const CHINESE: ChineseSign[] = [
  {
    slug: "fare", name: "Fare", emoji: "🐀",
    summary: "Zeki, becerikli ve uyanık. Fırsatları kimseden önce görür.",
    traits: ["Zeki", "Becerikli", "Uyanık", "Cana yakın", "Tutumlu"],
    strengths: ["Hızlı düşünür ve uyum sağlar", "Sosyal ve sevilen biridir", "Fırsatçı zekâsı güçlüdür"],
    weaknesses: ["Bazen fazla hesapçı olabilir", "Huzursuz ve telaşlı olabilir", "Kolay sıkılır"],
    description: [
      "Fare yılında doğanlar zeki, kurnaz ve son derece beceriklidir. Bir durumun avantajını herkesten önce fark eder, kaynaklarını akıllıca kullanır. Sosyal ve sevecendirler; çevreleriyle güçlü bağlar kurar.",
      "Para ve güvenlik onlar için önemlidir; tutumludurlar ama cömertlikten de kaçınmazlar. En büyük güçleri, değişen koşullara hızla uyum sağlayabilmeleridir.",
    ],
    compatible: ["Ejderha", "Maymun", "Öküz"],
    luckyColor: "Mavi",
  },
  {
    slug: "okuz", name: "Öküz", emoji: "🐂",
    summary: "Çalışkan, güvenilir ve sabırlı. Söz verdiğini mutlaka yapar.",
    traits: ["Çalışkan", "Güvenilir", "Sabırlı", "Kararlı", "Dürüst"],
    strengths: ["Olağanüstü çalışkandır", "Sözünün eridir", "Sabrı ve azmi yüksektir"],
    weaknesses: ["İnatçı olabilir", "Değişime direnir", "Duygularını göstermekte zorlanır"],
    description: [
      "Öküz yılında doğanlar sağlam, çalışkan ve güvenilirdir. Yavaş ama emin adımlarla ilerler, başladıkları işi mutlaka bitirir. Sabırları ve kararlılıkları sayesinde uzun vadede başarıya ulaşırlar.",
      "Sadıktırlar ve sözlerine bağlıdırlar. İnatçı olabilirler; bir kez karar verdiklerinde döndürmek zordur. Huzurlu, istikrarlı bir hayatı her şeyin üstünde tutarlar.",
    ],
    compatible: ["Yılan", "Horoz", "Fare"],
    luckyColor: "Sarı",
  },
  {
    slug: "kaplan", name: "Kaplan", emoji: "🐅",
    summary: "Cesur, güçlü ve lider ruhlu. Adaletsizliğe asla göz yummaz.",
    traits: ["Cesur", "Güçlü", "Lider", "Tutkulu", "Bağımsız"],
    strengths: ["Doğal liderlik enerjisi taşır", "Cesareti ve kararlılığı yüksektir", "Adalet duygusu güçlüdür"],
    weaknesses: ["Aceleci ve asi olabilir", "Risk almayı sever", "Otoriteyle çatışabilir"],
    description: [
      "Kaplan yılında doğanlar cesur, tutkulu ve karizmatiktir. Mücadeleden kaçmaz, haksızlığa dur demekten çekinmezler. Doğal bir liderlik ve enerjiyle çevrelerini peşlerinden sürüklerler.",
      "Bağımsızlıklarına düşkündürler; kurallara değil kendi içgüdülerine güvenirler. Bazen aceleci olabilirler ama cesaretleri ve içtenlikleriyle hayran bırakırlar.",
    ],
    compatible: ["At", "Köpek", "Domuz"],
    luckyColor: "Turuncu",
  },
  {
    slug: "tavsan", name: "Tavşan", emoji: "🐇",
    summary: "Nazik, zarif ve şanslı. Huzuru ve uyumu her yerde arar.",
    traits: ["Nazik", "Zarif", "Şanslı", "Diplomatik", "Sezgisel"],
    strengths: ["İncelikli ve diplomatiktir", "Estetik ve zarafet sahibidir", "Sezgileri güçlüdür"],
    weaknesses: ["Çatışmadan aşırı kaçar", "Kararsız olabilir", "Aşırı temkinli olabilir"],
    description: [
      "Tavşan yılında doğanlar nazik, zarif ve sevecendir. Huzurlu ortamları sever, çatışmadan kaçınır ve etrafına incelik yayarlar. Şanslı kabul edilirler; zorlukları zarafetle aşarlar.",
      "Estetik duyguları güçlüdür ve sanatsal bir yanları vardır. Sezgileri kuvvetlidir; insanları ve durumları sessizce okurlar. Güvende hissettikleri bir ortamda parlarlar.",
    ],
    compatible: ["Keçi", "Domuz", "Köpek"],
    luckyColor: "Yeşil",
  },
  {
    slug: "ejderha", name: "Ejderha", emoji: "🐉",
    summary: "Karizmatik, güçlü ve şanslı. Doğduğu yerde fark edilir.",
    traits: ["Karizmatik", "Güçlü", "Şanslı", "Hırslı", "Cömert"],
    strengths: ["Doğal bir cazibesi vardır", "Enerjik ve hırslıdır", "Şans onunla kabul edilir"],
    weaknesses: ["Gururlu olabilir", "Sabırsız olabilir", "Eleştiriye kapalı olabilir"],
    description: [
      "Ejderha yılında doğanlar Çin astrolojisinin en güçlü ve en şanslı kabul edilen hayvanıdır. Karizmatik, enerjik ve hırslıdırlar; girdikleri ortamda doğal olarak öne çıkarlar.",
      "Cömert ve koruyucudurlar. Gururları yüksektir ve liderlik onlara doğal gelir. Büyük hayaller kurar, peşlerinden cesaretle giderler.",
    ],
    compatible: ["Fare", "Maymun", "Horoz"],
    luckyColor: "Altın",
  },
  {
    slug: "yilan", name: "Yılan", emoji: "🐍",
    summary: "Bilge, gizemli ve sezgisel. Az konuşur, çok şey bilir.",
    traits: ["Bilge", "Gizemli", "Sezgisel", "Zarif", "Kararlı"],
    strengths: ["Derin sezgilere sahiptir", "Stratejik ve bilgedir", "Soğukkanlı kalır"],
    weaknesses: ["Kuşkucu olabilir", "İçine kapanık olabilir", "Kıskanç olabilir"],
    description: [
      "Yılan yılında doğanlar bilge, gizemli ve derindir. Az konuşur, çok gözlemler; yüzeyle yetinmez, her şeyin altındaki gerçeği ararlar. Sezgileri ve stratejik zekâları güçlüdür.",
      "Zarif ve çekicidirler; sakin görünümlerinin altında yoğun bir iç dünya taşırlar. Kararlarını sessizce ama emin biçimde verirler.",
    ],
    compatible: ["Öküz", "Horoz", "Maymun"],
    luckyColor: "Kırmızı",
  },
  {
    slug: "at", name: "At", emoji: "🐎",
    summary: "Özgür, enerjik ve sosyal. Yola çıkmak için sebep aramaz.",
    traits: ["Özgür", "Enerjik", "Sosyal", "Maceracı", "Açık sözlü"],
    strengths: ["Enerjisi ve coşkusu bulaşıcıdır", "Bağımsız ve cesurdur", "Sosyal ve sevilendir"],
    weaknesses: ["Sabırsız olabilir", "Çabuk sıkılır", "Dağınık olabilir"],
    description: [
      "At yılında doğanlar özgür ruhlu, enerjik ve maceracıdır. Hareket etmeyi, keşfetmeyi ve yeni insanlarla tanışmayı severler. Coşkuları ve içtenlikleriyle çevrelerine ilham verirler.",
      "Bağımsızlıklarına çok düşkündürler; kısıtlanmaktan hoşlanmazlar. Açık sözlü ve dürüsttürler. Sıkıcılıktan kaçar, hayatı dolu dolu yaşamak isterler.",
    ],
    compatible: ["Kaplan", "Köpek", "Keçi"],
    luckyColor: "Kahverengi",
  },
  {
    slug: "keci", name: "Keçi", emoji: "🐐",
    summary: "Şefkatli, sanatçı ruhlu ve nazik. Güzelliğe ve huzura âşık.",
    traits: ["Şefkatli", "Sanatçı", "Nazik", "Yaratıcı", "Hayalperest"],
    strengths: ["Şefkatli ve empatiktir", "Yaratıcı ve estetiktir", "Uyumlu ve barışçıldır"],
    weaknesses: ["Aşırı hassas olabilir", "Karamsarlığa kapılabilir", "Kararsız olabilir"],
    description: [
      "Keçi yılında doğanlar şefkatli, yaratıcı ve naziktir. Güzelliğe, sanata ve huzura düşkündürler. Çevrelerindekilere derin bir empatiyle yaklaşır, barışçıl bir tavır sergilerler.",
      "Hayal güçleri zengindir ve duygusal bir yanları vardır. Güvende ve sevildiklerini hissettiklerinde içlerindeki cevheri ortaya koyarlar.",
    ],
    compatible: ["Tavşan", "Domuz", "At"],
    luckyColor: "Krem",
  },
  {
    slug: "maymun", name: "Maymun", emoji: "🐒",
    summary: "Zeki, eğlenceli ve kıvrak. Bir çözüm yolu mutlaka bulur.",
    traits: ["Zeki", "Eğlenceli", "Kıvrak", "Meraklı", "Yaratıcı"],
    strengths: ["Çok zeki ve çözüm odaklıdır", "Esprili ve eğlencelidir", "Hızlı öğrenir"],
    weaknesses: ["Bazen kurnaz olabilir", "Çabuk sıkılır", "Dikkati dağılabilir"],
    description: [
      "Maymun yılında doğanlar zeki, esprili ve son derece beceriklidir. Bir sorunla karşılaştıklarında yaratıcı bir çözüm bulmakta ustadırlar. Eğlenceli ve sosyaldirler; ortama neşe katarlar.",
      "Meraklı ve çok yönlüdürler; sürekli yeni şeyler öğrenmek isterler. Zekâlarını bazen kurnazlığa çevirebilirler ama içtenlikleriyle sevilirler.",
    ],
    compatible: ["Fare", "Ejderha", "Yılan"],
    luckyColor: "Beyaz",
  },
  {
    slug: "horoz", name: "Horoz", emoji: "🐓",
    summary: "Dürüst, çalışkan ve kendine güvenen. Detayları asla kaçırmaz.",
    traits: ["Dürüst", "Çalışkan", "Özgüvenli", "Düzenli", "Açık sözlü"],
    strengths: ["Dürüst ve güvenilirdir", "Çalışkan ve titizdir", "Kendine güveni yüksektir"],
    weaknesses: ["Eleştirel olabilir", "Mükemmeliyetçi olabilir", "Fazla açık sözlü olabilir"],
    description: [
      "Horoz yılında doğanlar dürüst, çalışkan ve kendine güvenendir. Detaylara hâkim, düzenli ve titizdirler. Ne düşündüklerini açıkça söyler, sözlerinin arkasında dururlar.",
      "Görünüşlerine ve işlerine özen gösterirler. Mükemmeliyetçi olabilirler; bu hem güçleri hem de zaman zaman baskı kaynaklarıdır. Sadık ve koruyucudurlar.",
    ],
    compatible: ["Öküz", "Yılan", "Ejderha"],
    luckyColor: "Altın sarısı",
  },
  {
    slug: "kopek", name: "Köpek", emoji: "🐕",
    summary: "Sadık, dürüst ve koruyucu. Sevdiklerinin yanında her zaman.",
    traits: ["Sadık", "Dürüst", "Koruyucu", "Adaletli", "Güvenilir"],
    strengths: ["Olağanüstü sadıktır", "Adalet ve dürüstlüğe bağlıdır", "Sevdiklerini korur"],
    weaknesses: ["Kaygılı olabilir", "Kuşkucu olabilir", "Fazla eleştirel olabilir"],
    description: [
      "Köpek yılında doğanlar sadık, dürüst ve koruyucudur. Sevdiklerine sonuna kadar bağlıdırlar; güven ve adalet onlar için kutsaldır. Bir dostun yanında olması gerektiğinde mutlaka oradadırlar.",
      "Adalet duyguları güçlüdür, haksızlığa tahammül edemezler. Bazen kaygılı ve kuşkucu olabilirler ama içten ve güvenilir yapılarıyla sevilirler.",
    ],
    compatible: ["Kaplan", "At", "Tavşan"],
    luckyColor: "Lacivert",
  },
  {
    slug: "domuz", name: "Domuz", emoji: "🐖",
    summary: "Cömert, dürüst ve iyi kalpli. İyi niyetiyle herkesi kazanır.",
    traits: ["Cömert", "Dürüst", "İyi kalpli", "Sıcak", "Sadık"],
    strengths: ["Cömert ve paylaşımcıdır", "Samimi ve iyi niyetlidir", "Sadık bir dosttur"],
    weaknesses: ["Saf olabilir", "Kolay kandırılabilir", "Keyfine düşkün olabilir"],
    description: [
      "Domuz yılında doğanlar cömert, içten ve iyi kalplidir. İyi niyetleri ve sıcaklıklarıyla herkesi kazanırlar. Paylaşmayı sever, sevdikleri için fedakârlıktan kaçınmazlar.",
      "Dürüst ve güvenilirdirler; oyun oynamayı sevmezler. Hayatın güzelliklerinin tadını çıkarmayı bilirler. Bazen fazla saf olabilirler ama temiz kalpleriyle sevilirler.",
    ],
    compatible: ["Tavşan", "Keçi", "Kaplan"],
    luckyColor: "Pembe",
  },
];

// 2020 = Fare (index 0)
export function animalForYear(year: number): ChineseSign {
  const idx = (((year - 2020) % 12) + 12) % 12;
  return CHINESE[idx];
}

export function getAnimal(slug: string): ChineseSign | undefined {
  return CHINESE.find((a) => a.slug === slug);
}

// Bir hayvanın son/örnek yılları (gösterim için)
export function yearsForAnimal(slug: string, from = 1948, to = 2032): number[] {
  const out: number[] = [];
  for (let y = to; y >= from; y--) {
    if (animalForYear(y).slug === slug) out.push(y);
  }
  return out;
}
