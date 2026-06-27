// ============================================================
// Burçlar — 12 burcun kadın & erkek özellikleri (tek kaynak).
// SEO/GEO için zengin, özgün Türkçe içerik. Server-güvenli, bağımlılıksız.
// ============================================================

export interface GenderProfile {
  personality: string[];
  love: string[];
  career: string[];
}

export interface Sign {
  slug: string;
  name: string;
  glyph: string;
  dates: string;
  element: "Ateş" | "Toprak" | "Hava" | "Su";
  quality: "Öncü" | "Sabit" | "Değişken";
  ruler: string;
  keywords: string[];
  summary: string;
  general: string[];
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  woman: GenderProfile;
  man: GenderProfile;
  compatibility: { best: string[]; note: string };
  faq: { q: string; a: string }[];
}

export const SIGNS: Sign[] = [
  {
    slug: "koc",
    name: "Koç",
    glyph: "♈",
    dates: "21 Mart – 19 Nisan",
    element: "Ateş",
    quality: "Öncü",
    ruler: "Mars",
    keywords: ["koç burcu", "koç burcu kadını", "koç burcu erkeği", "koç burcu özellikleri", "koç burcu aşk"],
    summary:
      "Zodyağın ilk burcu Koç; cesur, girişken ve enerjik bir öncüdür. Mars yönetiminde, harekete geçmekten asla korkmaz.",
    general: [
      "Koç burcu, ateş grubunun öncü enerjisini taşır. Yeni başlangıçların, rekabetin ve cesaretin burcudur. Bir Koç, istediği şeyi gördüğünde tereddüt etmeden hedefine yönelir; bekleyip düşünmek yerine harekete geçmeyi tercih eder.",
      "Doğal liderlerdir ve otorite altında ezilmekten hoşlanmazlar. Dürüst, doğrudan ve bazen aceleci olabilirler. Enerjileri bulaşıcıdır; bir Koç odaya girdiğinde fark edilir.",
    ],
    traits: ["Cesur ve girişken", "Lider ruhlu", "Enerjik ve dinamik", "Dürüst ve doğrudan", "Rekabetçi"],
    strengths: ["Hızlı karar verir", "Cesareti yüksektir", "Tutkulu ve motive edicidir", "Bağımsız ve özgüvenlidir"],
    weaknesses: ["Sabırsız olabilir", "Aceleci davranabilir", "Çabuk öfkelenebilir", "Bencilliğe kaçabilir"],
    woman: {
      personality: [
        "Koç kadını güçlü, bağımsız ve kendinden emindir. Ne istediğini bilir ve bunu elde etmek için mücadeleden kaçmaz. Pasif kalmak ona göre değildir; hayatın merkezinde, aktif bir rol üstlenmek ister.",
        "Tutkulu ve canlıdır; sıkıcılıktan nefret eder. Açık sözlüdür, oyun oynamayı sevmez ve karşısındakinden de samimiyet bekler.",
      ],
      love: [
        "Aşkta cesur ve doğrudandır. İlgilendiği kişiye adım atmaktan çekinmez; beklemek yerine inisiyatif alır. Heyecan ve tutku onun için ilişkinin vazgeçilmezidir.",
        "Sadık bir partnerdir ama bağımsızlığına düşkündür. Kendisine alan tanıyan, onu kısıtlamayan ama enerjisine ayak uydurabilen bir partnerle mutlu olur.",
      ],
      career: [
        "Liderlik gerektiren, hızlı tempolu işlerde parlar. Girişimcilik, spor, yöneticilik ve rekabetin olduğu alanlar ona göredir. Patron olmayı emir almaya tercih eder.",
      ],
    },
    man: {
      personality: [
        "Koç erkeği maceracı, hırslı ve korkusuzdur. Hedef odaklıdır ve engeller onu yıldırmak yerine motive eder. Doğal bir özgüveni vardır.",
        "Bazen sabırsız ve dürtüsel olabilir; düşünmeden harekete geçtiği anlar olur. Yine de samimiyeti ve enerjisiyle çevresini etkiler.",
      ],
      love: [
        "İlişkide kovalamayı seven, tutkulu bir avcıdır. İlgilendiği kişiyi etkilemek için elinden geleni yapar ve romantik jestlerden kaçınmaz.",
        "Korunmacı ve sahiplenici olabilir. Partnerine sadıktır ama ilişkinin heyecanını canlı tutmak ister; rutin onu boğar.",
      ],
      career: [
        "Rekabet ve aksiyon içeren kariyerlerde başarılıdır. Kendi işini kurmak, takım liderliği ya da fiziksel enerji gerektiren meslekler ona uygundur.",
      ],
    },
    compatibility: {
      best: ["Aslan", "Yay", "İkizler", "Kova"],
      note: "Ateş ve hava burçlarıyla enerjisi uyumludur; Terazi ile çekim güçlü ama dengeyi öğrenmeleri gerekir.",
    },
    faq: [
      { q: "Koç burcu hangi burçla uyumlu?", a: "Koç; Aslan ve Yay gibi ateş burçlarıyla ve İkizler, Kova gibi hava burçlarıyla yüksek uyum gösterir. Bu eşleşmeler enerji ve özgürlük açısından dengelidir." },
      { q: "Koç burcu kadını nasıl sever?", a: "Koç kadını doğrudan, tutkulu ve cesurca sever. İlgilendiği kişiye açıkça yaklaşır, oyun oynamaz ve ilişkide heyecan ile bağımsızlığı bir arada arar." },
      { q: "Koç burcu erkeği sadık mıdır?", a: "Koç erkeği gerçekten âşık olduğunda sadıktır; ancak ilişkide heyecanın ve tutkunun sürmesine ihtiyaç duyar. Rutin ve monotonluk onu zorlar." },
    ],
  },
  {
    slug: "boga",
    name: "Boğa",
    glyph: "♉",
    dates: "20 Nisan – 20 Mayıs",
    element: "Toprak",
    quality: "Sabit",
    ruler: "Venüs",
    keywords: ["boğa burcu", "boğa burcu kadını", "boğa burcu erkeği", "boğa burcu özellikleri", "boğa burcu aşk"],
    summary:
      "Boğa; sadık, kararlı ve güven veren bir toprak burcudur. Venüs yönetiminde konfor, güzellik ve istikrarı sever.",
    general: [
      "Boğa burcu, sabit toprak enerjisiyle istikrarın, sabrın ve maddi güvenliğin temsilcisidir. Aceleci değildir; kararlarını yavaş ama emin adımlarla verir ve bir kez karar verdiğinde geri dönmesi zordur.",
      "Konfor düşkünüdür ve hayatın güzel şeylerinden keyif alır: lezzetli yemekler, kaliteli kumaşlar, huzurlu bir ev. Sadakat onun için en önemli değerlerden biridir.",
    ],
    traits: ["Sadık ve güvenilir", "Kararlı ve sabırlı", "Pratik ve gerçekçi", "Konfor ve güzelliğe düşkün", "İstikrarlı"],
    strengths: ["Son derece güvenilirdir", "Sabırlı ve dengelidir", "Maddi konularda akıllıdır", "Sevdiklerine bağlıdır"],
    weaknesses: ["İnatçı olabilir", "Değişime direnç gösterir", "Sahiplenici olabilir", "Konfor alanına fazla bağlanır"],
    woman: {
      personality: [
        "Boğa kadını sıcak, güvenilir ve zarif bir duruşa sahiptir. Sakinliği ve dinginliğiyle çevresine huzur verir. Hayatı koşturmaca içinde değil, tadını çıkararak yaşamayı sever.",
        "İnatçı tarafı vardır; ikna olması zordur ama bir kez güvendiğinde sonuna kadar sadıktır. Estetiğe ve konfora önem verir.",
      ],
      love: [
        "Aşkta yavaş ve emin ilerler. Hemen tutuşmaz ama bağlandığında derin ve kalıcı sever. Sadakat ve güven onun için pazarlık konusu değildir.",
        "Romantik, şefkatli ve fiziksel temasa değer veren bir partnerdir. İstikrarlı, güven veren bir ilişkide en iyi halini gösterir.",
      ],
      career: [
        "Sabır ve istikrar gerektiren işlerde başarılıdır. Finans, sanat, gayrimenkul, gastronomi ve estetikle ilgili alanlar ona uygundur.",
      ],
    },
    man: {
      personality: [
        "Boğa erkeği sakin, kararlı ve güven veren bir yapıya sahiptir. Sözünün eri olmasıyla tanınır. Aceleci kararlardan kaçınır, attığı her adımı düşünür.",
        "İnatçılığı meşhurdur; bir konuda kararını verdiyse onu döndürmek güçtür. Maddi güvenlik ve huzurlu bir yaşam onun önceliğidir.",
      ],
      love: [
        "Ağırdan alan ama bağlandığında son derece sadık bir partnerdir. İlişkide güveni ve istikrarı her şeyin üstünde tutar.",
        "Sevgisini abartılı sözlerle değil, somut davranışlarla gösterir. Sahiplenici olabilir; kıskançlığını yönetmeyi öğrenmesi gerekir.",
      ],
      career: [
        "İstikrarlı ve uzun vadeli kariyerlerde parlar. Bankacılık, mühendislik, üretim, tarım ve sanatla ilgili meslekler ona göredir.",
      ],
    },
    compatibility: {
      best: ["Başak", "Oğlak", "Yengeç", "Balık"],
      note: "Toprak ve su burçlarıyla derin, istikrarlı bağlar kurar; Akrep ile güçlü ama yoğun bir çekim yaşar.",
    },
    faq: [
      { q: "Boğa burcu hangi burçla uyumlu?", a: "Boğa; Başak ve Oğlak gibi toprak burçlarıyla ve Yengeç, Balık gibi su burçlarıyla çok uyumludur. Bu eşleşmeler güven ve istikrar üzerine kuruludur." },
      { q: "Boğa burcu kadını nasıl sever?", a: "Boğa kadını yavaş ama derin sever. Güven oluştuğunda son derece sadık ve şefkatlidir; istikrarlı, romantik bir ilişkide mutlu olur." },
      { q: "Boğa burcu erkeği neden inatçıdır?", a: "Boğa sabit bir toprak burcu olduğu için kararlarında ısrarcıdır. Bu inat, aynı zamanda onu güvenilir ve tutarlı kılan özelliğin bir yansımasıdır." },
    ],
  },
  {
    slug: "ikizler",
    name: "İkizler",
    glyph: "♊",
    dates: "21 Mayıs – 20 Haziran",
    element: "Hava",
    quality: "Değişken",
    ruler: "Merkür",
    keywords: ["ikizler burcu", "ikizler burcu kadını", "ikizler burcu erkeği", "ikizler burcu özellikleri", "ikizler aşk"],
    summary:
      "İkizler; meraklı, zeki ve iletişimi güçlü bir hava burcudur. Merkür yönetiminde fikirler ve sözcüklerle yaşar.",
    general: [
      "İkizler burcu, değişken hava enerjisiyle merakın, iletişimin ve çok yönlülüğün simgesidir. Zihinleri sürekli hareket halindedir; yeni bilgiler, insanlar ve deneyimler onları besler.",
      "Esnek ve uyumludurlar, ama aynı anda birçok şeyle ilgilendikleri için kararsız görünebilirler. Konuşkan, esprili ve sosyaldirler; sıkılmaktan korkarlar.",
    ],
    traits: ["Meraklı ve zeki", "İletişimi güçlü", "Esnek ve uyumlu", "Sosyal ve esprili", "Çok yönlü"],
    strengths: ["Hızlı öğrenir ve uyum sağlar", "İletişimde ustadır", "Esprili ve sosyaldir", "Açık fikirlidir"],
    weaknesses: ["Kararsız olabilir", "Çabuk sıkılır", "Dağınık ve tutarsız olabilir", "Yüzeysel kalabilir"],
    woman: {
      personality: [
        "İkizler kadını canlı, konuşkan ve zekidir. Sohbeti, mizahı ve değişen ilgileriyle dikkat çeker. Tek bir kalıba sığmaz; çok yönlü ve değişken bir doğası vardır.",
        "Zihinsel uyarıma ihtiyaç duyar; sıkıcı ortamlardan ve monoton ilişkilerden kaçar. Özgürlüğüne ve sosyal çevresine değer verir.",
      ],
      love: [
        "Aşkta önce zihni etkilenmelidir. Onu güldüren, zekâsıyla meydan okuyan biri kalbini kazanır. Derin sohbetler onun için romantizmden daha çekicidir.",
        "Bağımsızlığına düşkündür ve sahiplenilmekten hoşlanmaz. Ona alan tanıyan, birlikte yeni şeyler keşfedebileceği bir partnerle mutludur.",
      ],
      career: [
        "İletişim, yazarlık, medya, pazarlama, eğitim ve sosyal etkileşim gerektiren işlerde parlar. Tek düze işlerde sıkılır.",
      ],
    },
    man: {
      personality: [
        "İkizler erkeği esprili, meraklı ve sosyaldir. Her konuda bir şeyler bilir, sohbeti akıcıdır ve insanlarla kolayca bağ kurar.",
        "Değişken ruh hali ve kararsızlığı zaman zaman çevresini zorlayabilir. Rutinden kaçar, sürekli yeni uyaranlar arar.",
      ],
      love: [
        "Flörtöz ve çekicidir; sohbetiyle gönül çelmeyi sever. İlişkide zihinsel uyum onun için fiziksel çekimden bile önemli olabilir.",
        "Bağlanmadan önce özgürlüğünden emin olmak ister. Onu sıkmayan, birlikte gülüp keşfedebileceği bir partnerle uzun süreli bağ kurar.",
      ],
      career: [
        "Çok yönlülüğünü kullanabileceği işlerde başarılıdır: gazetecilik, satış, halkla ilişkiler, teknoloji ve eğitim ona uygundur.",
      ],
    },
    compatibility: {
      best: ["Terazi", "Kova", "Koç", "Aslan"],
      note: "Hava ve ateş burçlarıyla zihinsel ve sosyal uyumu yüksektir; Yay ile karşıt ama tamamlayıcı bir çekim yaşar.",
    },
    faq: [
      { q: "İkizler burcu hangi burçla uyumlu?", a: "İkizler; Terazi ve Kova gibi hava burçlarıyla ve Koç, Aslan gibi ateş burçlarıyla çok uyumludur. Bu eşleşmelerde zihinsel uyum ve sosyallik öne çıkar." },
      { q: "İkizler burcu kadını nasıl sever?", a: "İkizler kadını önce zihinsel olarak etkilenir. İyi bir sohbet, mizah ve özgürlük tanıyan bir ilişkide kendini en mutlu hisseder." },
      { q: "İkizler burcu erkeği neden kararsızdır?", a: "İkizler değişken bir hava burcu olduğu için aynı anda birçok seçeneği değerlendirir. Bu çok yönlülük, bazen kararsızlık olarak görünür." },
    ],
  },
  {
    slug: "yengec",
    name: "Yengeç",
    glyph: "♋",
    dates: "21 Haziran – 22 Temmuz",
    element: "Su",
    quality: "Öncü",
    ruler: "Ay",
    keywords: ["yengeç burcu", "yengeç burcu kadını", "yengeç burcu erkeği", "yengeç burcu özellikleri", "yengeç aşk"],
    summary:
      "Yengeç; duygusal, korumacı ve sezgisel bir su burcudur. Ay yönetiminde aile, ev ve duygusal bağlar onun dünyasıdır.",
    general: [
      "Yengeç burcu, öncü su enerjisiyle duyguların, sezginin ve şefkatin burcudur. Sevdiklerine derinden bağlanır ve onları korumak için elinden geleni yapar. Güçlü bir aile ve yuva duygusu taşır.",
      "Dış kabuğu sert görünse de içi yumuşaktır. Ruh halleri Ay gibi değişkendir; bir an neşeli, bir an içine kapanık olabilir. Hafızası kuvvetlidir ve duygusal anıları asla unutmaz.",
    ],
    traits: ["Duygusal ve şefkatli", "Korumacı ve sadık", "Sezgisel", "Aile odaklı", "Hassas"],
    strengths: ["Empati yeteneği yüksektir", "Sevdiklerine son derece sadıktır", "Sezgileri güçlüdür", "Şefkatli ve destekleyicidir"],
    weaknesses: ["Aşırı duygusal olabilir", "Alıngan ve içine kapanık olabilir", "Geçmişe takılabilir", "Ruh hali dalgalanır"],
    woman: {
      personality: [
        "Yengeç kadını şefkatli, sezgisel ve korumacıdır. Sevdiklerini kanatları altına alır; annelik içgüdüsü güçlüdür. Sıcak, güven veren bir varlığı vardır.",
        "Hassas ve duygusaldır; incinmekten korkar ve bu yüzden bazen sert bir kabuğun arkasına saklanır. Güven kazanıldığında ise son derece sevecendir.",
      ],
      love: [
        "Aşkta derin, koşulsuz ve sadık sever. Duygusal güvenlik onun için her şeyden önemlidir; partnerinden sıcaklık ve istikrar bekler.",
        "Romantik ve fedakârdır. Sevdiği kişi için yuva kurmak, onu beslemek ve korumak ister. Sahiplenici olabileceği için güven duyabileceği bir ilişkiye ihtiyaç duyar.",
      ],
      career: [
        "İnsanlara bakım ve destek sağlayan işlerde parlar: sağlık, eğitim, psikoloji, gastronomi ve aileyle ilgili alanlar ona uygundur.",
      ],
    },
    man: {
      personality: [
        "Yengeç erkeği duygusal, sadık ve korumacıdır. Sert bir dış görünüşün altında derin bir duygusallık taşır. Ailesine ve sevdiklerine son derece bağlıdır.",
        "Sezgileri güçlüdür ve çevresindeki duyguları kolayca hisseder. İncindiğinde içine kapanabilir; güvenli bir ortamda açılır.",
      ],
      love: [
        "Romantik ve fedakâr bir partnerdir. Sevdiği kişiyi korur, destekler ve onunla derin bir duygusal bağ kurmak ister.",
        "Güven onun için temeldir; bir kez bağlandığında kalıcı ve sadıktır. Duygusal güvenlik hissettiği bir ilişkide en iyi halini gösterir.",
      ],
      career: [
        "İstikrar ve duygusal tatmin sunan işlerde başarılıdır: aile işletmeleri, sağlık, gayrimenkul, yemek ve bakım sektörleri ona göredir.",
      ],
    },
    compatibility: {
      best: ["Akrep", "Balık", "Boğa", "Başak"],
      note: "Su ve toprak burçlarıyla derin duygusal bağlar kurar; Oğlak ile karşıt ama tamamlayıcı bir denge yakalar.",
    },
    faq: [
      { q: "Yengeç burcu hangi burçla uyumlu?", a: "Yengeç; Akrep ve Balık gibi su burçlarıyla ve Boğa, Başak gibi toprak burçlarıyla çok uyumludur. Bu eşleşmelerde duygusal derinlik ve güven öne çıkar." },
      { q: "Yengeç burcu kadını nasıl sever?", a: "Yengeç kadını koşulsuz, derin ve sadık sever. Duygusal güvenlik ve istikrar onun için en önemli ihtiyaçtır." },
      { q: "Yengeç burcu erkeği neden içine kapanır?", a: "Yengeç hassas bir su burcu olduğu için incindiğinde korunmak amacıyla kabuğuna çekilir. Güven hissettiğinde yeniden açılır." },
    ],
  },
  {
    slug: "aslan",
    name: "Aslan",
    glyph: "♌",
    dates: "23 Temmuz – 22 Ağustos",
    element: "Ateş",
    quality: "Sabit",
    ruler: "Güneş",
    keywords: ["aslan burcu", "aslan burcu kadını", "aslan burcu erkeği", "aslan burcu özellikleri", "aslan aşk"],
    summary:
      "Aslan; cömert, kendinden emin ve karizmatik bir ateş burcudur. Güneş yönetiminde parlamak ve sevilmek ister.",
    general: [
      "Aslan burcu, sabit ateş enerjisiyle gururun, cömertliğin ve yaratıcılığın simgesidir. Doğuştan bir liderlik ve sahne enerjisi taşır; fark edilmek, takdir görmek onun için doğaldır.",
      "Sıcakkanlı ve cömerttir; sevdiklerini korur ve onlara bağlılığı yüksektir. Gururu yüksektir, eleştiriye karşı hassastır ama özünde iyi niyetli ve sadık bir kalbe sahiptir.",
    ],
    traits: ["Kendinden emin", "Cömert ve sıcakkanlı", "Karizmatik ve lider", "Yaratıcı", "Sadık"],
    strengths: ["Doğal liderlik enerjisi", "Cömert ve koruyucudur", "Özgüveni ilham verir", "Sevdiklerine sadıktır"],
    weaknesses: ["Gururlu ve egosu yüksek olabilir", "Takdir görmeye fazla ihtiyaç duyar", "İnatçı olabilir", "Eleştiriye alıngandır"],
    woman: {
      personality: [
        "Aslan kadını gururlu, çekici ve kendinden emindir. Bulunduğu ortamda doğal olarak dikkat çeker; cömertliği ve sıcaklığıyla insanları kendine bağlar.",
        "Takdir ve hayranlık görmekten hoşlanır. Güçlü bir kişiliği vardır; küçük görülmeye tahammül edemez ama sevdiklerine karşı son derece koruyucudur.",
      ],
      love: [
        "Aşkta tutkulu, sadık ve cömerttir. Partnerine kendini özel hissettirir ve karşılığında ilgi, sadakat ve hayranlık bekler.",
        "Romantik jestleri sever ve ilişkide gurur duyabileceği bir partner ister. İhmal edilmek ya da değer görmemek onu derinden incitir.",
      ],
      career: [
        "Sahne, liderlik ve yaratıcılık gerektiren işlerde parlar: yöneticilik, sanat, eğlence, eğitim ve halkla ilişkiler ona uygundur.",
      ],
    },
    man: {
      personality: [
        "Aslan erkeği karizmatik, cömert ve özgüvenlidir. Liderlik içgüdüsü güçlüdür; çevresinde saygı ve hayranlık uyandırır.",
        "Gururludur ve egosu zaman zaman öne çıkabilir. Ancak sevdiklerine karşı koruyucu, sadık ve fedakârdır.",
      ],
      love: [
        "Romantik ve gösterişli bir sevgilidir. Partnerini el üstünde tutar, ona özel hissettirir ve ilişkide cömertçe davranır.",
        "Sadakate ve takdire önem verir. Hayranlık duyduğu, kendisiyle gurur duyabileceği bir partnerle en iyi halini gösterir.",
      ],
      career: [
        "Otorite ve görünürlük sunan kariyerlerde başarılıdır: yöneticilik, girişimcilik, sanat ve liderlik pozisyonları ona göredir.",
      ],
    },
    compatibility: {
      best: ["Koç", "Yay", "İkizler", "Terazi"],
      note: "Ateş ve hava burçlarıyla enerjisi yükselir; Kova ile karşıt ama büyüleyici bir çekim yaşar.",
    },
    faq: [
      { q: "Aslan burcu hangi burçla uyumlu?", a: "Aslan; Koç ve Yay gibi ateş burçlarıyla ve İkizler, Terazi gibi hava burçlarıyla çok uyumludur. Bu eşleşmelerde tutku ve sosyallik öne çıkar." },
      { q: "Aslan burcu kadını nasıl sever?", a: "Aslan kadını tutkulu, cömert ve sadık sever. İlgi, takdir ve hayranlık görmek onun için ilişkinin temel ihtiyacıdır." },
      { q: "Aslan burcu erkeği neden gururludur?", a: "Aslan, Güneş yönetimindeki sabit bir ateş burcudur; öz değer ve takdir onun için merkezîdir. Bu, gurur olarak görünse de aslında sevgi ve saygı ihtiyacının yansımasıdır." },
    ],
  },
  {
    slug: "basak",
    name: "Başak",
    glyph: "♍",
    dates: "23 Ağustos – 22 Eylül",
    element: "Toprak",
    quality: "Değişken",
    ruler: "Merkür",
    keywords: ["başak burcu", "başak burcu kadını", "başak burcu erkeği", "başak burcu özellikleri", "başak aşk"],
    summary:
      "Başak; titiz, analitik ve yardımsever bir toprak burcudur. Merkür yönetiminde detaylar ve mükemmellik peşindedir.",
    general: [
      "Başak burcu, değişken toprak enerjisiyle düzenin, analizin ve hizmetin simgesidir. Detaylara hâkim, pratik ve çözüm odaklıdır. Bir işi en doğru şekilde yapmak ister.",
      "Mütevazı ve çalışkandır; gösterişten hoşlanmaz ama güvenilirliğiyle fark yaratır. Eleştirel zihni hem kendisine hem çevresine yöneliktir; mükemmeliyetçiliği bazen kaygıya dönüşebilir.",
    ],
    traits: ["Titiz ve analitik", "Çalışkan ve güvenilir", "Yardımsever", "Pratik ve düzenli", "Mütevazı"],
    strengths: ["Detaylara hâkimdir", "Son derece güvenilirdir", "Problem çözmede ustadır", "Özverili ve yardımseverdir"],
    weaknesses: ["Aşırı eleştirel olabilir", "Mükemmeliyetçilik kaygı yaratabilir", "Endişeli olabilir", "Kendini fazla sorgular"],
    woman: {
      personality: [
        "Başak kadını zeki, düzenli ve özenlidir. Hayata pratik bir gözle bakar; detayları kaçırmaz ve işleri kusursuz yapmak ister. Sakin, mütevazı bir zarafeti vardır.",
        "Analitik zihni hem en büyük gücü hem de en büyük baskısıdır. Sevdiklerine pratik yollarla, somut destekle gösterir sevgisini.",
      ],
      love: [
        "Aşkta temkinli ve seçicidir. Hemen tutuşmaz; güven ve uyum gördüğünde derin ve sadık bir bağ kurar. Sevgisini somut davranışlarla, ilgiyle gösterir.",
        "Güvenilir, düzenli ve istikrarlı bir partner arar. Aşırı dramatik ilişkiler yerine huzurlu, anlamlı bir birliktelikte mutludur.",
      ],
      career: [
        "Detay ve titizlik gerektiren işlerde parlar: sağlık, editörlük, analiz, muhasebe, araştırma ve organizasyon ona uygundur.",
      ],
    },
    man: {
      personality: [
        "Başak erkeği titiz, mantıklı ve güvenilirdir. Düzenli bir yaşamı sever, sorumluluklarını ciddiye alır ve işini özenle yapar.",
        "Eleştirel zihni bazen onu fazla seçici ya da endişeli yapabilir. Ancak sadık, çalışkan ve sevdiklerine destek olan bir yapıya sahiptir.",
      ],
      love: [
        "Sevgisini büyük sözlerle değil, ilgili ve yardımsever davranışlarla gösterir. İlişkide güveni ve istikrarı önemser.",
        "Bağlanmadan önce dikkatli değerlendirir; ama bağlandığında sadık ve özverili bir partner olur. Anlayışlı ve sakin bir ilişkide huzur bulur.",
      ],
      career: [
        "Analiz ve uzmanlık gerektiren kariyerlerde başarılıdır: mühendislik, sağlık, finans, yazılım ve kalite kontrol ona göredir.",
      ],
    },
    compatibility: {
      best: ["Boğa", "Oğlak", "Yengeç", "Akrep"],
      note: "Toprak ve su burçlarıyla istikrarlı, anlayışlı bağlar kurar; Balık ile karşıt ama tamamlayıcı bir çekim yaşar.",
    },
    faq: [
      { q: "Başak burcu hangi burçla uyumlu?", a: "Başak; Boğa ve Oğlak gibi toprak burçlarıyla ve Yengeç, Akrep gibi su burçlarıyla çok uyumludur. Bu eşleşmeler güven ve uyum üzerine kuruludur." },
      { q: "Başak burcu kadını nasıl sever?", a: "Başak kadını temkinli ama derin sever. Güven oluştuğunda sadık ve özverilidir; sevgisini somut, ilgili davranışlarla gösterir." },
      { q: "Başak burcu erkeği neden mükemmeliyetçidir?", a: "Başak, Merkür yönetimindeki analitik bir toprak burcudur. Detaylara olan hâkimiyeti, işleri doğru yapma arzusunu ve mükemmeliyetçiliği besler." },
    ],
  },
  {
    slug: "terazi",
    name: "Terazi",
    glyph: "♎",
    dates: "23 Eylül – 22 Ekim",
    element: "Hava",
    quality: "Öncü",
    ruler: "Venüs",
    keywords: ["terazi burcu", "terazi burcu kadını", "terazi burcu erkeği", "terazi burcu özellikleri", "terazi aşk"],
    summary:
      "Terazi; uyumlu, zarif ve adaletli bir hava burcudur. Venüs yönetiminde denge, ilişki ve estetik onun merkezindedir.",
    general: [
      "Terazi burcu, öncü hava enerjisiyle dengenin, uyumun ve ilişkilerin simgesidir. Çatışmadan hoşlanmaz; herkesin memnun olacağı bir orta yol bulmaya çalışır. Adalet duygusu güçlüdür.",
      "Estetiğe ve güzelliğe düşkündür; zarif, sosyal ve çekici bir duruşu vardır. Karar verirken her açıyı tarttığı için kararsız görünebilir, ama bu aslında adil olma çabasıdır.",
    ],
    traits: ["Uyumlu ve diplomatik", "Zarif ve estetik", "Adaletli", "Sosyal ve çekici", "İşbirlikçi"],
    strengths: ["Diplomasi ve uzlaşmada ustadır", "Adil ve dengeli yaklaşır", "Zarif ve sosyaldir", "İlişkilere değer verir"],
    weaknesses: ["Kararsız olabilir", "Çatışmadan kaçar", "Onaylanmaya ihtiyaç duyar", "Yüzeysel uyum için ödün verebilir"],
    woman: {
      personality: [
        "Terazi kadını zarif, çekici ve sosyaldir. Uyumlu bir atmosfer yaratma konusunda yeteneklidir; nezaketi ve diplomasisiyle dikkat çeker.",
        "Adalet ve denge onun için önemlidir; haksızlığa tahammül edemez. Karar verirken zorlanabilir çünkü her zaman en adil ve uyumlu seçeneği arar.",
      ],
      love: [
        "Aşk ve ilişki onun doğal alanıdır. Romantik, ilgili ve uyumlu bir partnerdir; ilişkide eşitlik ve ortaklık arar.",
        "Zarafete ve inceliğe değer verir. Kaba davranışlardan ve çatışmadan kaçar; huzurlu, dengeli ve romantik bir birliktelikte mutludur.",
      ],
      career: [
        "İlişki, estetik ve uzlaşma gerektiren işlerde parlar: hukuk, diplomasi, tasarım, moda, sanat ve halkla ilişkiler ona uygundur.",
      ],
    },
    man: {
      personality: [
        "Terazi erkeği nazik, çekici ve uyumludur. Sosyal ortamlarda rahattır, insanlarla kolayca bağ kurar ve dengeli bir kişiliğe sahiptir.",
        "Çatışmadan hoşlanmaz; barışı korumak için bazen kararsız kalabilir. Estetiğe, inceliğe ve adalete önem verir.",
      ],
      love: [
        "Romantik ve incelikli bir partnerdir. İlişkide uyum, eşitlik ve güzellik arar; partnerine değer verdiğini zarif jestlerle gösterir.",
        "Yalnızlıktan hoşlanmaz; ilişki onun için doğal bir ihtiyaçtır. Uyumlu ve dengeli bir birliktelikte huzur bulur.",
      ],
      career: [
        "Uzlaşma ve estetik gerektiren kariyerlerde başarılıdır: hukuk, danışmanlık, tasarım, sanat ve insan ilişkileri ona göredir.",
      ],
    },
    compatibility: {
      best: ["İkizler", "Kova", "Aslan", "Yay"],
      note: "Hava ve ateş burçlarıyla sosyal ve zihinsel uyumu yüksektir; Koç ile karşıt ama dengeleyici bir çekim yaşar.",
    },
    faq: [
      { q: "Terazi burcu hangi burçla uyumlu?", a: "Terazi; İkizler ve Kova gibi hava burçlarıyla ve Aslan, Yay gibi ateş burçlarıyla çok uyumludur. Bu eşleşmelerde uyum ve sosyallik öne çıkar." },
      { q: "Terazi burcu kadını nasıl sever?", a: "Terazi kadını romantik, ilgili ve uyumlu sever. İlişkide eşitlik, incelik ve huzur onun için vazgeçilmezdir." },
      { q: "Terazi burcu erkeği neden kararsızdır?", a: "Terazi, dengeyi arayan öncü bir hava burcudur. Her seçeneğin adil ve uyumlu yanını tarttığı için karar vermesi zaman alabilir." },
    ],
  },
  {
    slug: "akrep",
    name: "Akrep",
    glyph: "♏",
    dates: "23 Ekim – 21 Kasım",
    element: "Su",
    quality: "Sabit",
    ruler: "Mars / Plüton",
    keywords: ["akrep burcu", "akrep burcu kadını", "akrep burcu erkeği", "akrep burcu özellikleri", "akrep aşk"],
    summary:
      "Akrep; yoğun, tutkulu ve derin bir su burcudur. Plüton yönetiminde dönüşüm, sır ve güç onun temalarıdır.",
    general: [
      "Akrep burcu, sabit su enerjisiyle tutkunun, derinliğin ve dönüşümün simgesidir. Yüzeyle yetinmez; her şeyin altındaki gerçeği bilmek ister. Güçlü bir irade ve sezgiye sahiptir.",
      "Duyguları yoğundur ama bunları kolayca göstermez; gizemli bir hava taşır. Sadakate çok önem verir, ihanete asla tahammül etmez. Bir kez güvendiğinde son derece bağlı ve koruyucudur.",
    ],
    traits: ["Tutkulu ve yoğun", "Sezgisel ve derin", "Kararlı ve güçlü", "Sadık", "Gizemli"],
    strengths: ["İradesi çok güçlüdür", "Sezgileri keskindir", "Sevdiklerine tutkuyla bağlıdır", "Zorluklarda dönüşür ve güçlenir"],
    weaknesses: ["Kıskanç olabilir", "Kin tutabilir", "Kontrolcü olabilir", "Aşırı şüpheci olabilir"],
    woman: {
      personality: [
        "Akrep kadını çekici, gizemli ve güçlüdür. Yoğun bir iç dünyası vardır; duygularını herkese açmaz ama hissettikleri derindir. Manyetik bir aurası vardır.",
        "Sezgileri çok kuvvetlidir; insanların gerçek niyetlerini kolayca okur. Sadakate önem verir ve karşısındakinden de aynı bağlılığı bekler.",
      ],
      love: [
        "Aşkta tutkulu, derin ve sahiplenicidir. Bağlandığında tüm kalbiyle bağlanır; yüzeysel ilişkilerle ilgilenmez, ruhsal ve duygusal bütünleşme arar.",
        "Güven onun için kutsaldır; ihanet affetmesi en zor şeydir. Kendisine sadık, derinlikli ve dürüst bir partnerle en iyi halini gösterir.",
      ],
      career: [
        "Derinlik, araştırma ve güç gerektiren işlerde parlar: psikoloji, araştırma, finans, tıp, kriminoloji ve stratejik alanlar ona uygundur.",
      ],
    },
    man: {
      personality: [
        "Akrep erkeği yoğun, kararlı ve gizemlidir. Güçlü bir iradesi ve keskin sezgileri vardır. Duygularını kolayca açığa vurmaz; derinlerde tutkulu bir yapı taşır.",
        "Sadakate ve güvene büyük önem verir. Kontrolcü ve kıskanç olabilir; ama sevdiğine karşı koruyucu, tutkulu ve son derece bağlıdır.",
      ],
      love: [
        "Tutkulu ve sahiplenici bir partnerdir. Yüzeysel ilişkilerden kaçar; derin, sadık ve dürüst bir bağ arar.",
        "Güven sarsıldığında affetmesi çok zordur. Kendisine tamamen güvenebileceği, ruhen bağlanabileceği bir partnerle bütünleşir.",
      ],
      career: [
        "Strateji, derinlik ve dönüşüm içeren kariyerlerde başarılıdır: araştırma, finans, cerrahi, psikoloji ve güvenlik alanları ona göredir.",
      ],
    },
    compatibility: {
      best: ["Yengeç", "Balık", "Başak", "Oğlak"],
      note: "Su ve toprak burçlarıyla derin, sadık bağlar kurar; Boğa ile yoğun ve manyetik bir çekim yaşar.",
    },
    faq: [
      { q: "Akrep burcu hangi burçla uyumlu?", a: "Akrep; Yengeç ve Balık gibi su burçlarıyla ve Başak, Oğlak gibi toprak burçlarıyla çok uyumludur. Bu eşleşmelerde duygusal derinlik ve sadakat öne çıkar." },
      { q: "Akrep burcu kadını nasıl sever?", a: "Akrep kadını tutkulu, derin ve sadık sever. Yüzeysel ilişkilerle ilgilenmez; ruhsal bütünleşme ve mutlak güven arar." },
      { q: "Akrep burcu erkeği neden kıskançtır?", a: "Akrep, sadakate çok önem veren tutkulu bir su burcudur. Yoğun bağlılığı ve güven ihtiyacı, kıskançlık olarak yansıyabilir." },
    ],
  },
  {
    slug: "yay",
    name: "Yay",
    glyph: "♐",
    dates: "22 Kasım – 21 Aralık",
    element: "Ateş",
    quality: "Değişken",
    ruler: "Jüpiter",
    keywords: ["yay burcu", "yay burcu kadını", "yay burcu erkeği", "yay burcu özellikleri", "yay aşk"],
    summary:
      "Yay; özgür, iyimser ve maceracı bir ateş burcudur. Jüpiter yönetiminde keşif, bilgi ve genişleme onun yoludur.",
    general: [
      "Yay burcu, değişken ateş enerjisiyle özgürlüğün, iyimserliğin ve maceranın simgesidir. Yeni yerler, kültürler ve fikirler onu heyecanlandırır. Hayata geniş bir perspektiften bakar.",
      "Dürüst, samimi ve esprilidir; bazen fazla açık sözlü olabilir. Sınırlanmaktan nefret eder; özgürlüğü ve bağımsızlığı her şeyin üstünde tutar.",
    ],
    traits: ["Özgür ve bağımsız", "İyimser ve neşeli", "Maceracı", "Dürüst ve açık", "Felsefi"],
    strengths: ["İyimserliği bulaşıcıdır", "Maceracı ve cesurdur", "Dürüst ve samimidir", "Geniş vizyonludur"],
    weaknesses: ["Sabırsız olabilir", "Aşırı açık sözlü olabilir", "Sorumluluktan kaçabilir", "Bağlanmakta zorlanabilir"],
    woman: {
      personality: [
        "Yay kadını özgür ruhlu, neşeli ve maceracıdır. Hayatı bir keşif olarak görür; yeni deneyimler, seyahatler ve fikirler onu canlı tutar. Enerjisi ve gülümsemesi bulaşıcıdır.",
        "Dürüst ve doğrudandır; içten konuşur. Bağımsızlığına çok düşkündür ve kısıtlanmaktan hoşlanmaz.",
      ],
      love: [
        "Aşkta özgürlük ve macera arar. Onu sıkmayan, birlikte yeni şeyler keşfedebileceği bir partnerle mutlu olur. Sahiplenici ilişkilerden kaçar.",
        "Samimi ve eğlencelidir; ilişkiye neşe katar. Güven ve özgürlük dengesi sağlandığında derin ve sadık bir bağ kurar.",
      ],
      career: [
        "Özgürlük, seyahat ve öğrenme içeren işlerde parlar: akademi, turizm, yayıncılık, hukuk ve uluslararası alanlar ona uygundur.",
      ],
    },
    man: {
      personality: [
        "Yay erkeği maceracı, iyimser ve özgürlüğüne düşkündür. Hayata pozitif bakar, yeni deneyimler peşinde koşar ve felsefi bir merakı vardır.",
        "Dürüstlüğü bazen fazla açık sözlülüğe dönüşebilir. Bağlanmakta acele etmez; özgürlüğünden ödün vermeden sevmeyi öğrenir.",
      ],
      love: [
        "Eğlenceli, samimi ve maceracı bir partnerdir. İlişkide özgürlük alanına ihtiyaç duyar; birlikte keşfetmeyi ve gülmeyi sever.",
        "Bağlandığında sadıktır ama kısıtlanmaya tahammülü yoktur. Ona güven ve alan tanıyan bir partnerle uzun süreli bir bağ kurar.",
      ],
      career: [
        "Hareket ve vizyon gerektiren kariyerlerde başarılıdır: girişimcilik, eğitim, seyahat, spor ve uluslararası ticaret ona göredir.",
      ],
    },
    compatibility: {
      best: ["Koç", "Aslan", "Terazi", "Kova"],
      note: "Ateş ve hava burçlarıyla enerjisi ve özgürlüğü uyum içindedir; İkizler ile karşıt ama tamamlayıcı bir çekim yaşar.",
    },
    faq: [
      { q: "Yay burcu hangi burçla uyumlu?", a: "Yay; Koç ve Aslan gibi ateş burçlarıyla ve Terazi, Kova gibi hava burçlarıyla çok uyumludur. Bu eşleşmelerde özgürlük ve macera öne çıkar." },
      { q: "Yay burcu kadını nasıl sever?", a: "Yay kadını özgürce, neşeyle ve maceracı bir ruhla sever. Onu kısıtlamayan, birlikte keşfedebileceği bir ilişkide mutlu olur." },
      { q: "Yay burcu erkeği neden bağlanmaktan kaçar?", a: "Yay özgürlüğüne düşkün bir ateş burcudur. Bağlanmaktan değil, özgürlüğünü kaybetmekten çekinir; güven ve alan tanındığında sadık olur." },
    ],
  },
  {
    slug: "oglak",
    name: "Oğlak",
    glyph: "♑",
    dates: "22 Aralık – 19 Ocak",
    element: "Toprak",
    quality: "Öncü",
    ruler: "Satürn",
    keywords: ["oğlak burcu", "oğlak burcu kadını", "oğlak burcu erkeği", "oğlak burcu özellikleri", "oğlak aşk"],
    summary:
      "Oğlak; disiplinli, hırslı ve sorumlu bir toprak burcudur. Satürn yönetiminde başarı, yapı ve istikrar peşindedir.",
    general: [
      "Oğlak burcu, öncü toprak enerjisiyle disiplinin, hırsın ve sorumluluğun simgesidir. Hedeflerine ulaşmak için sabırla, planlı ve kararlı çalışır. Uzun vadeli düşünür.",
      "Ciddi ve olgun bir duruşu vardır; sorumluluklarını asla ihmal etmez. Duygularını kolayca göstermese de sadık ve güvenilirdir. Zamanla yumuşar ve içindeki sıcaklığı gösterir.",
    ],
    traits: ["Disiplinli ve hırslı", "Sorumlu ve güvenilir", "Sabırlı ve kararlı", "Gerçekçi", "Olgun"],
    strengths: ["Hedeflerine kararlılıkla ulaşır", "Son derece sorumludur", "Sabırlı ve dayanıklıdır", "Pratik ve stratejiktir"],
    weaknesses: ["Fazla katı olabilir", "Duygularını bastırabilir", "İş odaklılık ilişkiyi zorlayabilir", "Karamsarlığa kayabilir"],
    woman: {
      personality: [
        "Oğlak kadını güçlü, hırslı ve kendine güvenir. Hedeflerine odaklıdır ve sorumluluklarını ciddiye alır. Olgun, ölçülü ve zarif bir duruşu vardır.",
        "Duygularını kolayca açmaz; mesafeli görünebilir ama içinde derin bir sadakat ve sıcaklık taşır. Güven kazanıldığında bambaşka, şefkatli bir yüzü ortaya çıkar.",
      ],
      love: [
        "Aşkta ciddi ve seçicidir. Geçici heveslerle ilgilenmez; uzun vadeli, istikrarlı bir ilişki arar. Sevgisini somut destekle ve sadakatle gösterir.",
        "Güven ve istikrar onun için temeldir. Sorumluluk sahibi, hedefli bir partnerle derin ve kalıcı bir bağ kurar.",
      ],
      career: [
        "Hırs ve disiplin gerektiren işlerde parlar: yöneticilik, finans, hukuk, mühendislik ve kendi işini kurma ona uygundur.",
      ],
    },
    man: {
      personality: [
        "Oğlak erkeği hırslı, disiplinli ve sorumluluk sahibidir. Kariyerine ve hedeflerine büyük önem verir; başarıya giden yolda sabırla ilerler.",
        "Ciddi ve ölçülü görünür; duygularını ifade etmesi zaman alabilir. Ancak güvendiği kişiye karşı sadık, koruyucu ve kararlıdır.",
      ],
      love: [
        "Ağırdan alan ama bağlandığında son derece sadık bir partnerdir. İlişkide güveni, istikrarı ve ortak hedefleri önemser.",
        "Sevgisini büyük sözlerle değil, somut adımlarla ve fedakârlıkla gösterir. Olgun, güvenilir bir birliktelikte huzur bulur.",
      ],
      career: [
        "Uzun vadeli başarı sunan kariyerlerde parlar: yöneticilik, girişimcilik, finans, mimarlık ve devlet kademeleri ona göredir.",
      ],
    },
    compatibility: {
      best: ["Boğa", "Başak", "Akrep", "Balık"],
      note: "Toprak ve su burçlarıyla istikrarlı, güvenilir bağlar kurar; Yengeç ile karşıt ama tamamlayıcı bir denge yakalar.",
    },
    faq: [
      { q: "Oğlak burcu hangi burçla uyumlu?", a: "Oğlak; Boğa ve Başak gibi toprak burçlarıyla ve Akrep, Balık gibi su burçlarıyla çok uyumludur. Bu eşleşmeler güven ve istikrar üzerine kuruludur." },
      { q: "Oğlak burcu kadını nasıl sever?", a: "Oğlak kadını ciddi, sadık ve uzun vadeli sever. Güven ve istikrar gördüğünde derin bağlanır; sevgisini somut destekle gösterir." },
      { q: "Oğlak burcu erkeği neden mesafeli görünür?", a: "Oğlak, Satürn yönetimindeki ölçülü bir toprak burcudur. Duygularını ifade etmesi zaman alır; bu mesafe, aslında ciddiyet ve temkinin yansımasıdır." },
    ],
  },
  {
    slug: "kova",
    name: "Kova",
    glyph: "♒",
    dates: "20 Ocak – 18 Şubat",
    element: "Hava",
    quality: "Sabit",
    ruler: "Satürn / Uranüs",
    keywords: ["kova burcu", "kova burcu kadını", "kova burcu erkeği", "kova burcu özellikleri", "kova aşk"],
    summary:
      "Kova; özgün, bağımsız ve vizyoner bir hava burcudur. Uranüs yönetiminde özgürlük, yenilik ve insanlık onun temalarıdır.",
    general: [
      "Kova burcu, sabit hava enerjisiyle özgünlüğün, bağımsızlığın ve geleceğe dair vizyonun simgesidir. Kalıpların dışında düşünür; özgür, yenilikçi ve insancıldır.",
      "Toplumsal konulara ilgilidir, eşitlik ve adalet onun için önemlidir. Duygusal olarak biraz mesafeli görünebilir çünkü ilişkileri zihinsel bir düzlemde kurar. Arkadaşlığa büyük değer verir.",
    ],
    traits: ["Özgün ve yenilikçi", "Bağımsız", "Vizyoner", "İnsancıl", "Zihinsel ve analitik"],
    strengths: ["Yaratıcı ve özgün düşünür", "Bağımsız ve özgürdür", "İnsancıl ve adildir", "Geleceği görebilir"],
    weaknesses: ["Duygusal olarak mesafeli olabilir", "İnatçı olabilir", "Soğuk görünebilir", "Öngörülemez olabilir"],
    woman: {
      personality: [
        "Kova kadını özgün, bağımsız ve zekidir. Kalıplara sığmaz; kendine has bir tarzı ve dünya görüşü vardır. Özgürlüğüne ve bireyselliğine çok düşkündür.",
        "Duygusal olarak biraz mesafeli görünebilir ama sadık ve gerçek bir dosttur. Zihinsel uyum ve özgürlük onun için ilişkinin temelidir.",
      ],
      love: [
        "Aşkta önce arkadaşlık ve zihinsel uyum arar. Onu anlayan, özgürlüğüne saygı duyan bir partnerle derin bir bağ kurar. Sahiplenici ilişkilerden kaçar.",
        "Sıradanlıktan hoşlanmaz; ilişkide özgünlük ve entelektüel bağ ister. Güven ve alan tanındığında sadık ve kalıcıdır.",
      ],
      career: [
        "Yenilik ve özgünlük gerektiren işlerde parlar: teknoloji, bilim, sosyal projeler, tasarım ve insan hakları alanları ona uygundur.",
      ],
    },
    man: {
      personality: [
        "Kova erkeği özgür ruhlu, yenilikçi ve bağımsızdır. Geleneksel kalıpları sorgular; kendine özgü bir düşünce yapısı vardır. Arkadaşlığa ve özgürlüğe değer verir.",
        "Duygularını ifade etmekte zorlanabilir; zihinsel düzlemde daha rahattır. Sadık ama bağımsızlığına düşkün bir partnerdir.",
      ],
      love: [
        "İlişkide önce zihinsel uyum ve arkadaşlık arar. Onu sıkmayan, fikirlerine değer veren bir partnerle mutlu olur.",
        "Bağlandığında sadıktır ama özgürlüğüne ihtiyaç duyar. Özgün, eşitlikçi ve entelektüel bir birliktelikte en iyi halini gösterir.",
      ],
      career: [
        "Vizyon ve yenilik içeren kariyerlerde başarılıdır: teknoloji, mühendislik, bilim, sosyal girişimcilik ve sanat ona göredir.",
      ],
    },
    compatibility: {
      best: ["İkizler", "Terazi", "Koç", "Yay"],
      note: "Hava ve ateş burçlarıyla zihinsel ve özgürlükçü uyumu yüksektir; Aslan ile karşıt ama büyüleyici bir çekim yaşar.",
    },
    faq: [
      { q: "Kova burcu hangi burçla uyumlu?", a: "Kova; İkizler ve Terazi gibi hava burçlarıyla ve Koç, Yay gibi ateş burçlarıyla çok uyumludur. Bu eşleşmelerde özgürlük ve zihinsel uyum öne çıkar." },
      { q: "Kova burcu kadını nasıl sever?", a: "Kova kadını önce arkadaşlık ve zihinsel uyum üzerinden sever. Özgürlüğüne saygı duyan, onu anlayan bir partnerle derin bağ kurar." },
      { q: "Kova burcu erkeği neden mesafeli görünür?", a: "Kova, ilişkileri zihinsel düzlemde kuran bir hava burcudur. Duygusal mesafesi soğukluk değil, bağımsızlığa ve özgürlüğe verdiği değerin yansımasıdır." },
    ],
  },
  {
    slug: "balik",
    name: "Balık",
    glyph: "♓",
    dates: "19 Şubat – 20 Mart",
    element: "Su",
    quality: "Değişken",
    ruler: "Jüpiter / Neptün",
    keywords: ["balık burcu", "balık burcu kadını", "balık burcu erkeği", "balık burcu özellikleri", "balık aşk"],
    summary:
      "Balık; sezgisel, şefkatli ve hayalperest bir su burcudur. Neptün yönetiminde empati, sanat ve ruhsallık onun dünyasıdır.",
    general: [
      "Balık burcu, değişken su enerjisiyle empatinin, hayal gücünün ve ruhsallığın simgesidir. Son derece duyarlı ve sezgiseldir; çevresindeki duyguları süzgeç gibi içine alır. Sınırları belirsiz, akışkan bir doğası vardır.",
      "Şefkatli ve fedakârdır; başkalarının acısını kendi acısı gibi hisseder. Yaratıcı ve sanatsal bir ruhu vardır. Bazen gerçeklerden kaçıp kendi hayal dünyasına sığınabilir.",
    ],
    traits: ["Sezgisel ve empatik", "Şefkatli ve fedakâr", "Yaratıcı ve sanatsal", "Romantik", "Uyumlu"],
    strengths: ["Empati ve şefkati çok güçlüdür", "Yaratıcı ve hayal gücü zengindir", "Uyumlu ve anlayışlıdır", "Ruhsal derinliği vardır"],
    weaknesses: ["Aşırı hassas olabilir", "Gerçeklerden kaçabilir", "Sınır koymakta zorlanır", "Kolayca etkilenir"],
    woman: {
      personality: [
        "Balık kadını şefkatli, hayalperest ve sezgiseldir. Yumuşak, romantik ve sanatsal bir ruhu vardır. Çevresindekilere derin bir empatiyle yaklaşır.",
        "Çok duyarlıdır; incinmeye açıktır ve bazen kendi sınırlarını korumakta zorlanır. Sevgi dolu, fedakâr ve büyüleyici bir kadındır.",
      ],
      love: [
        "Aşkta romantik, fedakâr ve derindir. Masalsı bir aşka inanır; partneriyle ruhsal bir bütünleşme arar. Sevgisini koşulsuz verir.",
        "Duygusal güvenliğe ihtiyaç duyar. Onu anlayan, hassasiyetine değer veren ve hayallerini paylaşan bir partnerle en mutlu halindedir.",
      ],
      career: [
        "Yaratıcılık ve şefkat gerektiren işlerde parlar: sanat, müzik, psikoloji, sağlık, sosyal hizmet ve tasarım ona uygundur.",
      ],
    },
    man: {
      personality: [
        "Balık erkeği duyarlı, sezgisel ve şefkatlidir. Romantik ve hayal gücü zengin bir ruhu vardır; çevresindeki duyguları derinden hisseder.",
        "Hassasiyeti onu hem değerli hem kırılgan kılar. Sınır koymakta zorlanabilir; ama sevdiklerine karşı fedakâr, anlayışlı ve sıcaktır.",
      ],
      love: [
        "Romantik ve fedakâr bir partnerdir. Derin duygusal bağlar kurar; sevgisini şefkat, ilgi ve incelikle gösterir.",
        "Duygusal güven onun için temeldir. Hayallerini ve hassasiyetini paylaşabileceği, onu anlayan bir partnerle ruhsal bir bütünlük yakalar.",
      ],
      career: [
        "Sanat, şefkat ve hayal gücü içeren kariyerlerde başarılıdır: müzik, sinema, psikoloji, sağlık ve yardım alanları ona göredir.",
      ],
    },
    compatibility: {
      best: ["Yengeç", "Akrep", "Boğa", "Oğlak"],
      note: "Su ve toprak burçlarıyla derin, şefkatli bağlar kurar; Başak ile karşıt ama tamamlayıcı bir çekim yaşar.",
    },
    faq: [
      { q: "Balık burcu hangi burçla uyumlu?", a: "Balık; Yengeç ve Akrep gibi su burçlarıyla ve Boğa, Oğlak gibi toprak burçlarıyla çok uyumludur. Bu eşleşmelerde duygusal derinlik ve şefkat öne çıkar." },
      { q: "Balık burcu kadını nasıl sever?", a: "Balık kadını romantik, fedakâr ve koşulsuz sever. Ruhsal bütünleşme ve duygusal güvenlik onun için en önemli ihtiyaçtır." },
      { q: "Balık burcu erkeği neden bu kadar duygusaldır?", a: "Balık, Neptün yönetimindeki en duyarlı su burcudur. Güçlü sezgileri ve empatisi, onu derinden duygusal ve şefkatli kılar." },
    ],
  },
];

export function getAllSigns(): Sign[] {
  return SIGNS;
}

export function getSign(slug: string): Sign | undefined {
  return SIGNS.find((s) => s.slug === slug);
}

// Doğum tarihinden (tropikal) Güneş burcu. "YYYY-MM-DD" veya Date kabul eder.
export function getSignByDate(input: string | Date): Sign {
  let m: number, d: number;
  if (typeof input === "string") {
    const [, mo, da] = input.split("-").map(Number);
    m = mo;
    d = da;
  } else {
    m = input.getMonth() + 1;
    d = input.getDate();
  }
  const slug =
    (m === 3 && d >= 21) || (m === 4 && d <= 19)
      ? "koc"
      : (m === 4 && d >= 20) || (m === 5 && d <= 20)
        ? "boga"
        : (m === 5 && d >= 21) || (m === 6 && d <= 20)
          ? "ikizler"
          : (m === 6 && d >= 21) || (m === 7 && d <= 22)
            ? "yengec"
            : (m === 7 && d >= 23) || (m === 8 && d <= 22)
              ? "aslan"
              : (m === 8 && d >= 23) || (m === 9 && d <= 22)
                ? "basak"
                : (m === 9 && d >= 23) || (m === 10 && d <= 22)
                  ? "terazi"
                  : (m === 10 && d >= 23) || (m === 11 && d <= 21)
                    ? "akrep"
                    : (m === 11 && d >= 22) || (m === 12 && d <= 21)
                      ? "yay"
                      : (m === 12 && d >= 22) || (m === 1 && d <= 19)
                        ? "oglak"
                        : (m === 1 && d >= 20) || (m === 2 && d <= 18)
                          ? "kova"
                          : "balik";
  return getSign(slug) ?? SIGNS[0];
}

// SEO: tüm burç anahtar kelimelerini birleştir (tekilleştirilmiş).
export function getAllSignKeywords(): string[] {
  const seen = new Set<string>();
  for (const s of SIGNS) for (const k of s.keywords) seen.add(k.toLowerCase());
  return [...seen];
}
