// ============================================================
// Blog içeriği — SEO + GEO odaklı, uzun-form astroloji rehberleri.
// Her makale: güçlü başlık, anahtar kelimeler, bölümler, listeler ve SSS.
// ============================================================

export interface ArticleSection {
  h: string;
  body: string[];
  list?: string[]; // tarama dostu maddeler (SEO/GEO snippet'leri için)
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "temel-astroloji",
    name: "Temel Astroloji",
    description:
      "Doğum haritası nedir, nasıl okunur? Astrolojiye yeni başlayanlar için temel rehberler.",
    emoji: "✨",
  },
  {
    slug: "burclar",
    name: "Burçlar",
    description:
      "Güneş, ay ve yükselen burçlar; burç özellikleri ve aralarındaki farklar.",
    emoji: "⭐",
  },
  {
    slug: "gezegenler",
    name: "Gezegenler & Retro",
    description:
      "Gezegenlerin anlamları, retro dönemler ve önemli astrolojik döngüler.",
    emoji: "🪐",
  },
  {
    slug: "evler-acilar",
    name: "Evler & Açılar",
    description:
      "Doğum haritasındaki 12 ev ve gezegen açılarının anlamları.",
    emoji: "🏠",
  },
  {
    slug: "transit-zamanlama",
    name: "Transit & Zamanlama",
    description:
      "Gezegen geçişleri ve hayatındaki dönemsel etkiler; astrolojik zamanlama.",
    emoji: "🔭",
  },
  {
    slug: "iliski-ask",
    name: "İlişki & Aşk",
    description: "Burç uyumu, sinastri ve aşk astrolojisi rehberleri.",
    emoji: "❤️",
  },
];

export interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  keywords: string[];
  date: string; // ISO
  readMinutes: number;
  emoji: string;
  sections: ArticleSection[];
  faq: { q: string; a: string }[];
}

export const ARTICLES: Article[] = [
  {
    slug: "yukselen-burc-nedir-nasil-hesaplanir",
    category: "burclar",
    title: "Yükselen Burç Nedir, Nasıl Hesaplanır? (Kapsamlı 2026 Rehberi)",
    excerpt:
      "Yükselen burç nedir, neden bu kadar önemli ve doğum saatinle nasıl hesaplanır? Yükselenin kişiliğine, dış görünüşüne ve evlerine etkisini, 12 yükselen burcun özelliklerini sade bir dille anlatıyoruz.",
    keywords: [
      "yükselen burç",
      "yükselen burç hesaplama",
      "yükselen burç nedir",
      "yükselen nasıl hesaplanır",
      "doğum saati yükselen",
      "yükselen burç özellikleri",
      "ascendant nedir",
    ],
    date: "2026-06-01",
    readMinutes: 9,
    emoji: "↑",
    sections: [
      {
        h: "Yükselen burç nedir?",
        body: [
          "Yükselen burç (Ascendant), sen doğduğun anda doğu ufkunda yükselmekte olan burçtur. Güneş burcun “ne” olduğunu anlatırken, yükselen burcun dünyaya “nasıl” göründüğünü, verdiğin ilk izlenimi ve hayata yaklaşım tarzını temsil eder.",
          "Astrolojide yükselen, doğum haritasının başlangıç noktasıdır: 1. evin kapısıdır ve haritadaki tüm evlerin sıralanışını belirler. Bu yüzden kişisel haritanın en kişiye özel ve en hızlı değişen parçalarından biridir. İki kişi aynı gün doğsa bile, farklı saatlerde doğdularsa yükselenleri farklı olabilir.",
          "Yükselen sıkça “maske” olarak tanımlanır ama bu eksik bir benzetmedir. Daha doğrusu, yükselen senin hayata açılan penceren, dış dünyayla ilk temas noktandır; bedeninle, fiziksel görünüşünle ve içgüdüsel tepkilerinle ilgilidir.",
        ],
      },
      {
        h: "Yükselen burç neden önemli?",
        body: [
          "Yükselen, doğum haritasının iskeletini kurar. Hangi gezegenin hangi evde olduğunu yükselen belirler; dolayısıyla kariyer, ilişki, para gibi hayat alanlarının nasıl yorumlanacağı doğrudan yükselene bağlıdır.",
          "Ayrıca yükselenin yöneticisi (örneğin Terazi yükselen için Venüs) senin “harita patronun” sayılır ve onun konumu genel gidişatın hakkında güçlü ipuçları verir.",
        ],
        list: [
          "Dış görünüş ve ilk izlenim",
          "Hayata ve yeni durumlara yaklaşım tarzı",
          "Bedensel yapı ve fiziksel enerji",
          "Doğum haritasındaki tüm evlerin başlangıcı",
          "İçgüdüsel, otomatik tepkiler",
        ],
      },
      {
        h: "Yükselen burç nasıl hesaplanır?",
        body: [
          "Yükselen üç bilgiye dayanır: doğum tarihin, doğum saatin ve doğum yerinin coğrafi konumu (enlem/boylam). Dünya yaklaşık her 2 saatte bir burcu ufukta değiştirir; bu yüzden doğum saatindeki küçük farklar bile yükseleni tamamen değiştirebilir.",
          "Elle hesaplaması karmaşıktır çünkü yıldız zamanı (sidereal time) ve coğrafi konum hesabı gerekir. Astrotek AI ile doğum bilgilerini girerek yükselenini saniyeler içinde, ücretsiz ve doğru şekilde öğrenebilirsin.",
        ],
      },
      {
        h: "12 yükselen burcun kısa özellikleri",
        body: [
          "Her yükselen, hayata farklı bir tonla yaklaşır. Aşağıda kısa bir özet bulabilirsin; ancak tam tablo için yükselenin yöneticisinin konumu da değerlendirilmelidir.",
        ],
        list: [
          "Koç yükselen: enerjik, doğrudan, girişken",
          "Boğa yükselen: sakin, güven veren, istikrarlı",
          "İkizler yükselen: meraklı, konuşkan, hareketli",
          "Yengeç yükselen: korumacı, duygusal, sıcak",
          "Aslan yükselen: kendinden emin, sıcak, dikkat çeken",
          "Başak yükselen: düzenli, mütevazı, detaycı",
          "Terazi yükselen: zarif, diplomatik, uyumlu",
          "Akrep yükselen: yoğun, gizemli, etkileyici",
          "Yay yükselen: özgür, iyimser, maceracı",
          "Oğlak yükselen: ciddi, sorumlu, hedef odaklı",
          "Kova yükselen: özgün, bağımsız, farklı",
          "Balık yükselen: sezgisel, yumuşak, hayalperest",
        ],
      },
      {
        h: "Doğum saatini bilmiyorsan ne olur?",
        body: [
          "Doğum saatin yoksa yükselen ve ev konumları kesin hesaplanamaz. Bu durumda gezegen burçların ve genel açıların yine yorumlanabilir; sadece yükselen ve evlere dayalı yorumlar sınırlı kalır.",
          "Nüfus kaydı, doğum belgesi, hastane kaydı veya aile büyüklerinden öğreneceğin yaklaşık bir saat bile analizin doğruluğunu ciddi şekilde artırır. Saat aralığı biliniyorsa (örneğin “sabaha karşı”), yükselen birkaç burca daraltılabilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Yükselen burç güneş burcundan daha mı önemli?",
        a: "İkisi de önemlidir. Güneş burcun özünü, yükselen ise dışa yansımanı ve hayata yaklaşımını anlatır. Birlikte değerlendirildiğinde çok daha doğru bir tablo çıkar.",
      },
      {
        q: "Yükselen burç değişir mi?",
        a: "Hayır, doğum anına bağlı olduğu için ömür boyu sabittir. Değişen şey, gökyüzündeki gezegenlerin yükselenine yaptığı geçici transit etkileridir.",
      },
      {
        q: "Yükselen burcuma mı yoksa güneş burcuma göre mi yorum okumalıyım?",
        a: "Günlük burç yorumlarını yükselen burcuna göre okumak çoğu zaman daha isabetli sonuç verir, çünkü yükselen evlerin akışını belirler.",
      },
      {
        q: "Yükselen burcumu ücretsiz nasıl öğrenirim?",
        a: "Astrotek AI'a doğum tarihi, saati ve yerini girerek yükselen burcunu ve tüm doğum haritanı ücretsiz öğrenebilirsin.",
      },
    ],
  },
  {
    slug: "dogum-haritasi-nasil-okunur",
    category: "temel-astroloji",
    title: "Doğum Haritası Nasıl Okunur? Yeni Başlayanlar İçin Adım Adım Rehber",
    excerpt:
      "Doğum haritası nedir, hangi parçalardan oluşur ve nasıl okunur? Gezegenler, burçlar, evler ve açıları adım adım anlattığımız, yeni başlayanlar için kapsamlı başlangıç rehberi.",
    keywords: [
      "doğum haritası",
      "doğum haritası nasıl okunur",
      "natal harita",
      "doğum haritası yorumu",
      "doğum haritası anlamı",
      "doğum haritası okuma",
      "astroloji haritası",
    ],
    date: "2026-06-03",
    readMinutes: 10,
    emoji: "🗺️",
    sections: [
      {
        h: "Doğum haritası nedir?",
        body: [
          "Doğum haritası (natal harita), doğduğun anda gökyüzündeki gezegenlerin konumunu gösteren dairesel bir şemadır. Senin için kişiye özel bir “gökyüzü fotoğrafı” gibidir ve ömür boyu değişmez.",
          "Harita dört temel bileşenden oluşur: gezegenler (hangi enerji), burçlar (nasıl bir tarzla), evler (hayatın hangi alanında) ve açılar (gezegenlerin birbiriyle ilişkisi). Bu dördünü birlikte okumayı öğrenince harita konuşmaya başlar.",
        ],
      },
      {
        h: "Adım 1: Güneş, Ay ve Yükselen ile başla",
        body: [
          "Bir haritayı okumaya her zaman bu üçlüyle başla. Güneş özünü ve bilinçli kimliğini, Ay duygusal dünyanı ve ihtiyaçlarını, Yükselen ise dışa yansıyan tarzını anlatır.",
          "Bu üçlü, kişiliğin omurgasıdır. Yalnızca güneş burcuna bakmak, bir kitabın sadece kapağını okumak gibidir.",
        ],
      },
      {
        h: "Adım 2: Gezegenleri ve burçlarını incele",
        body: [
          "Her gezegen bir yaşam temasını temsil eder ve bulunduğu burç bu enerjinin tarzını verir. Örneğin Merkür Terazi'deyse düşünmeden konuşmak yerine tartıp ölçen, diplomatik bir ifade tarzına işaret eder.",
        ],
        list: [
          "Güneş: kimlik, öz, canlılık",
          "Ay: duygular, ihtiyaçlar, iç dünya",
          "Merkür: zihin, iletişim, öğrenme",
          "Venüs: aşk, zevkler, değerler, para",
          "Mars: enerji, motivasyon, cesaret",
          "Jüpiter: şans, büyüme, fırsat",
          "Satürn: disiplin, sorumluluk, sınırlar",
          "Uranüs, Neptün, Plüton: değişim, ilham, dönüşüm (kuşak gezegenleri)",
        ],
      },
      {
        h: "Adım 3: Evleri oku",
        body: [
          "12 ev, hayatının farklı alanlarıdır: kariyer, aşk, para, aile, sağlık ve daha fazlası. Bir gezegenin hangi evde olduğu, o enerjinin hayatının hangi alanında en çok hissedileceğini gösterir.",
          "Örneğin Venüs 10. evdeyse aşk ve estetik enerjisi kariyer alanında öne çıkabilir; 4. evdeyse aile ve ev hayatında belirginleşir.",
        ],
      },
      {
        h: "Adım 4: Açıları değerlendir",
        body: [
          "Açılar, gezegenler arasındaki açısal ilişkilerdir ve enerjilerin nasıl etkileşeceğini gösterir. Üçgen ve altmışlık genelde akışı ve yeteneği, kare ve karşıt ise gerilim ve gelişim alanlarını temsil eder.",
          "Açının orbu (tam dereceden sapması) ne kadar küçükse etkisi o kadar güçlüdür. Önce ışıkları (Güneş-Ay) ilgilendiren açılara bak.",
        ],
      },
      {
        h: "Adım 5: Bütünü birleştir",
        body: [
          "Tek tek parçalar yerine bütüne bakmak gerçek astrolojinin sırrıdır. Tekrarlayan temalar (örneğin birden fazla yerde öne çıkan Satürn) haritanın ana mesajını verir.",
          "Astrotek AI bu adımları senin için yapar: haritanı hesaplar, en güçlü temaları bulur ve hepsini sade Türkçe bir yoruma dönüştürür.",
        ],
      },
    ],
    faq: [
      {
        q: "Doğum haritası okumayı kendim öğrenebilir miyim?",
        a: "Evet. Önce Güneş, Ay ve yükselenle başla; sonra gezegenlerin ev ve burçlarını, en son açıları incele. Astrotek AI haritanı hesaplayıp sade dille yorumlayarak öğrenmeni kolaylaştırır.",
      },
      {
        q: "Doğum haritası ücretsiz mi çıkarılıyor?",
        a: "Evet, Astrotek AI ile doğum haritanı ücretsiz hesaplayabilir ve yapay zeka destekli yorumunu okuyabilirsin.",
      },
      {
        q: "Doğum haritası için neye ihtiyacım var?",
        a: "Doğum tarihin, doğum saatin ve doğum yerin yeterli. Saat ne kadar kesinse yükselen ve ev yorumları o kadar doğru olur.",
      },
      {
        q: "Doğum haritası kaderimi mi gösterir?",
        a: "Hayır. Doğum haritası eğilimleri ve potansiyelleri gösterir, kesin kader değildir. Kararlar her zaman senindir.",
      },
    ],
  },
  {
    slug: "merkur-retrosu-nedir-etkileri",
    category: "gezegenler",
    title: "Merkür Retrosu Nedir? Etkileri, Tarihleri ve Yapılmaması Gerekenler",
    excerpt:
      "Merkür retrosu nedir, neden olur ve iletişim, teknoloji, seyahat üzerindeki etkileri nelerdir? Retro dönemde nelere dikkat etmeli, neler yapmalısın? Sade bir rehber.",
    keywords: [
      "merkür retrosu",
      "merkür retrosu nedir",
      "retrograde nedir",
      "merkür retro etkileri",
      "retro dönem",
      "merkür retrosu ne yapmalı",
      "merkür retro aşk",
    ],
    date: "2026-06-05",
    readMinutes: 8,
    emoji: "☿",
    sections: [
      {
        h: "Merkür retrosu nedir?",
        body: [
          "Merkür retrosu, Merkür'ün gökyüzünde geriye doğru hareket ediyormuş gibi göründüğü dönemdir. Aslında bu bir optik etkidir; gezegen gerçekten geri gitmez ama Dünya'dan bakınca yavaşlayıp geri çekiliyormuş gibi görünür.",
          "Merkür iletişim, düşünce, teknoloji ve kısa yolculukların gezegeni olduğu için bu dönem sembolik olarak bu alanlarda “yeniden gözden geçirme” temasıyla ilişkilendirilir.",
        ],
      },
      {
        h: "Merkür retrosu hayatı nasıl etkiler?",
        body: [
          "İletişimde yanlış anlaşılmalar, gecikmeler, teknolojik aksaklıklar veya eski konuların yeniden gündeme gelmesi sık anlatılan temalardır. Bu kesin bir kural değil, dikkat edilebilecek bir eğilimdir.",
        ],
        list: [
          "Mesaj ve e-postalarda yanlış anlaşılmalar",
          "Ulaşım ve seyahatte gecikmeler",
          "Elektronik cihaz ve yazılım sorunları",
          "Eski arkadaş veya eski sevgilinin geri dönmesi",
          "Sözleşme ve detaylarda gözden kaçan noktalar",
        ],
      },
      {
        h: "Retro döneminde ne yapmalı, ne yapmamalı?",
        body: [
          "Olumlu tarafı da var: retro, “re-” ile başlayan işler için idealdir — gözden geçirmek (review), düzeltmek (revise), tamamlamak, eski projeleri bitirmek ve eski bağlantıları yeniden değerlendirmek.",
        ],
        list: [
          "Yap: yedek al, planları gözden geçir, eski işleri bitir",
          "Yap: önemli mesajları göndermeden önce iki kez oku",
          "Dikkat: büyük alımlar ve sözleşmelerde ayrıntıya bak",
          "Dikkat: yeni ve aceleci başlangıçlarda temkinli ol",
        ],
      },
      {
        h: "Merkür retrosu aşk hayatını etkiler mi?",
        body: [
          "İlişkilerde geçmişin yeniden gündeme gelmesi sık görülen bir temadır: eski sevgililer mesaj atabilir, kapanmamış konular su yüzüne çıkabilir. Bu, yüzleşme ve kapanış için bir fırsat da olabilir.",
          "Yeni ilişkiler için ise iletişimi netleştirmek önemlidir; yanlış anlaşılmalara karşı sabırlı ve açık olmak fark yaratır.",
        ],
      },
    ],
    faq: [
      {
        q: "Merkür retrosunda sözleşme imzalanır mı?",
        a: "Astrolojik gelenek temkinli olmayı önerir; ayrıntıları iki kez okumak iyi olur. Ancak bu bir yasak değildir — kararlarını yalnızca retroya değil somut verilere de dayandır.",
      },
      {
        q: "Merkür retrosu ne kadar sürer?",
        a: "Genellikle yılda 3-4 kez, her seferinde yaklaşık üç hafta sürer.",
      },
      {
        q: "Merkür retrosu herkesi aynı şekilde etkiler mi?",
        a: "Hayır. Etkisi, retronun senin doğum haritandaki hangi eve ve gezegene denk geldiğine göre değişir. Astrotek AI bunu kişisel haritana göre yorumlar.",
      },
    ],
  },
  {
    slug: "astroloji-evleri-12-ev-anlamlari",
    category: "evler-acilar",
    title: "12 Astroloji Evi ve Anlamları (Tam Liste ve Açıklamalar)",
    excerpt:
      "Astrolojideki 12 ev neyi temsil eder? 1. evden 12. eve kadar her evin hayat alanını, yöneticisini ve anlamını net bir listeyle, örneklerle açıklıyoruz.",
    keywords: [
      "astroloji evleri",
      "12 ev anlamları",
      "doğum haritası evleri",
      "1. ev 2. ev anlamı",
      "astroloji ev sistemi",
      "evlerin anlamları",
      "10. ev kariyer",
    ],
    date: "2026-06-07",
    readMinutes: 9,
    emoji: "🏠",
    sections: [
      {
        h: "Astroloji evleri ne anlatır?",
        body: [
          "Doğum haritasındaki 12 ev, hayatının farklı alanlarını temsil eder. Bir gezegen hangi evdeyse, o enerji o yaşam alanında daha belirgin çalışır.",
          "Evlerin sıralaması yükselen burcuna göre belirlenir; bu yüzden doğru ev analizi için doğum saatin gereklidir. Evler, haritanın “nerede” sorusunu yanıtlar.",
        ],
      },
      {
        h: "Köşe evler (en güçlü evler)",
        body: [
          "1, 4, 7 ve 10. evler “köşe evler” olarak bilinir ve genelde en güçlü hissedilen evlerdir. İçlerinde gezegen bulunması, o temaların hayatında belirgin olduğunu gösterir.",
        ],
        list: [
          "1. Ev: kimlik, dış görünüş, ilk izlenim",
          "4. Ev: aile, ev, kökler, özel hayat",
          "7. Ev: ilişkiler, evlilik, ortaklık",
          "10. Ev: kariyer, statü, başarı, toplumdaki yer",
        ],
      },
      {
        h: "12 evin tam listesi ve anlamları",
        body: [
          "Aşağıda her evin temsil ettiği temel hayat alanını bulabilirsin. Bir evi yorumlarken hem içindeki gezegenlere hem de evin yöneticisinin konumuna bakılır.",
        ],
        list: [
          "1. Ev: kimlik, beden, görünüş",
          "2. Ev: para, öz değer, kazanç, sahip olunanlar",
          "3. Ev: iletişim, kardeşler, kısa yolculuklar, öğrenme",
          "4. Ev: aile, ev, kökler",
          "5. Ev: aşk, yaratıcılık, çocuklar, hobiler",
          "6. Ev: iş rutini, sağlık, hizmet, günlük düzen",
          "7. Ev: ilişkiler, evlilik, ortaklıklar",
          "8. Ev: kriz, dönüşüm, ortak kaynaklar, derinlik",
          "9. Ev: yüksek eğitim, yurt dışı, inanç, felsefe",
          "10. Ev: kariyer, statü, otorite, başarı",
          "11. Ev: arkadaşlar, hedefler, sosyal çevre, gelecek",
          "12. Ev: bilinçaltı, geri çekilme, kapanışlar, ruhsal konular",
        ],
      },
      {
        h: "Bir evi nasıl yorumlarsın?",
        body: [
          "Bir evi okurken üç şeye bak: evin burcu (hangi tarz), içindeki gezegenler (hangi enerji) ve evin yöneticisinin haritadaki konumu. Bu üçü birleşince evin nasıl çalıştığı netleşir.",
          "Örneğin 10. evi (kariyer) Boğa burcundaysa istikrarlı ve sağlam bir kariyer eğilimi; içinde Jüpiter varsa büyüme ve fırsat potansiyeli okunabilir.",
        ],
      },
    ],
    faq: [
      {
        q: "En önemli ev hangisidir?",
        a: "Tek bir “en önemli” ev yoktur; içinde gezegen bulunan ve yükselen/MC gibi köşe evler genelde daha güçlü hissedilir.",
      },
      {
        q: "Boş ev kötü mü?",
        a: "Hayır. İçinde gezegen olmayan ev “çalışmıyor” demek değildir; o evin konusu, evin yöneticisi gezegen üzerinden işler.",
      },
      {
        q: "Evlerimi nasıl öğrenirim?",
        a: "Doğum saatini içeren bir doğum haritasına ihtiyacın var. Astrotek AI evlerini hesaplayıp her birini ayrı ayrı yorumlar.",
      },
    ],
  },
  {
    slug: "gunes-ay-yukselen-farki",
    category: "burclar",
    title: "Güneş, Ay ve Yükselen Burç Arasındaki Fark Nedir?",
    excerpt:
      "Güneş burcun, ay burcun ve yükselen burcun ne anlatır? Astrolojinin bu üç temel taşını, aralarındaki farkı ve birlikte neyi gösterdiklerini örneklerle açıklıyoruz.",
    keywords: [
      "güneş ay yükselen",
      "ay burcu nedir",
      "güneş burcu ay burcu farkı",
      "üçlü astroloji",
      "ay burcu hesaplama",
      "güneş ay yükselen farkı",
    ],
    date: "2026-06-09",
    readMinutes: 7,
    emoji: "☉",
    sections: [
      {
        h: "Üç temel taş: Güneş, Ay, Yükselen",
        body: [
          "Astrolojide kişiliğin omurgasını üç nokta oluşturur: Güneş, Ay ve Yükselen. Sadece güneş burcuna bakmak, kitabın yalnızca kapağını okumak gibidir.",
        ],
        list: [
          "Güneş: özün, bilinçli kimliğin, hayat enerjin",
          "Ay: duygusal dünyan, ihtiyaçların, içgüdülerin",
          "Yükselen: dışa yansıyan tarzın, ilk izlenimin",
        ],
      },
      {
        h: "Güneş burcu ne anlatır?",
        body: [
          "Güneş burcun, doğduğun gün Güneş'in bulunduğu burçtur ve en çok bilinen burcundur. Özünü, neye doğru büyüdüğünü ve hayatta neyle parladığını temsil eder.",
          "“Burcun ne?” sorusunun cevabı genelde güneş burcudur, ama tek başına kişiliğini anlatmaya yetmez.",
        ],
      },
      {
        h: "Ay burcu ne anlatır?",
        body: [
          "Ay burcun, duygusal ihtiyaçlarını ve kendini ne zaman güvende hissettiğini gösterir. Ay yaklaşık 2,5 günde burç değiştirdiği için ay burcu çoğu zaman doğum saatine de bağlıdır.",
          "İçsel dünyanı, alışkanlıklarını ve sevdiklerinle kurduğun bağı anlamak için ay burcuna bakılır.",
        ],
      },
      {
        h: "Üçü birlikte nasıl çalışır?",
        body: [
          "Örneğin Güneş'i Aslan, Ay'ı Balık, Yükselen'i Başak olan biri özünde gösterişli ve cömert (Aslan), içten içe duygusal ve sezgisel (Balık), dışarıdan ise düzenli ve mütevazı (Başak) görünebilir.",
          "Bu üçlüyü birlikte okumak, “neden bazen böyle bazen şöyleyim?” sorusunun cevabını verir. Gerçek kişilik bu katmanların toplamıdır.",
        ],
      },
    ],
    faq: [
      {
        q: "Ay burcumu nasıl öğrenirim?",
        a: "Ay burcu doğum tarihine ve genellikle saatine bağlıdır çünkü Ay yaklaşık 2,5 günde burç değiştirir. Astrotek AI ile ay burcunu da içeren tam haritanı çıkarabilirsin.",
      },
      {
        q: "Hangisi 'gerçek' burcum?",
        a: "Hepsi senin parçan. Genel sohbette güneş burcu kullanılır, ama gerçek bir tablo için üçünü birlikte değerlendirmek gerekir.",
      },
      {
        q: "Güneş ve ay burcum aynı olabilir mi?",
        a: "Evet, doğduğun gün Güneş ve Ay aynı burçtaysa olur (genelde Yeni Ay'a yakın doğumlarda). Bu, öz ile duygunun aynı yönde aktığı anlamına gelir.",
      },
    ],
  },
  {
    slug: "saturn-donusu-nedir-29-yas",
    category: "gezegenler",
    title: "Satürn Dönüşü Nedir? 29 Yaş Dönüm Noktası ve Anlamı",
    excerpt:
      "Satürn dönüşü nedir, neden 29 yaş civarı yaşanır ve hayatında neleri değiştirir? Bu önemli astrolojik döngüyü, belirtilerini ve nasıl yöneteceğini anlatıyoruz.",
    keywords: [
      "satürn dönüşü",
      "satürn dönüşü nedir",
      "29 yaş krizi",
      "satürn return",
      "satürn transiti",
      "satürn dönüşü belirtileri",
    ],
    date: "2026-06-11",
    readMinutes: 7,
    emoji: "♄",
    sections: [
      {
        h: "Satürn dönüşü nedir?",
        body: [
          "Satürn, Güneş'in etrafındaki turunu yaklaşık 29,5 yılda tamamlar. Doğduğun andaki konumuna geri döndüğünde ilk “Satürn dönüşünü” yaşarsın — genellikle 28-30 yaş arası.",
          "Bu dönem, olgunlaşma, sorumluluk alma ve gerçekten kim olduğunu netleştirme dönemi olarak bilinir. Bir tür yetişkinliğe geçiş sınavı gibidir.",
        ],
      },
      {
        h: "Satürn dönüşü belirtileri",
        body: [
          "Bu döneme girince hayatın “artık ciddiye binmiş” gibi hissedilir. Sık görülen temalar şunlardır:",
        ],
        list: [
          "Kariyer veya yaşam yönünü sorgulama",
          "İlişkilerde ciddileşme ya da ayrılma",
          "Artık işe yaramayan alışkanlıkları bırakma isteği",
          "Sorumluluk ve “gerçek hayat” baskısı hissetme",
          "Kim olduğun ve ne istediğin konusunda netleşme",
        ],
      },
      {
        h: "Bu dönemi nasıl yönetirsin?",
        body: [
          "Satürn disiplin ve sabır gezegenidir; bu döneme direnmek yerine sorumluluk almak işleri kolaylaştırır. Sağlam, gerçekçi hedefler koymak ve adım adım ilerlemek en iyi stratejidir.",
          "Zorlayıcı gibi görünse de Satürn dönüşü genelde daha sağlam, daha bilinçli bir hayatın temellerini atar. Bu dönemde kurduğun yapılar uzun ömürlü olma eğilimindedir.",
        ],
      },
    ],
    faq: [
      {
        q: "Satürn dönüşü herkeste olur mu?",
        a: "Evet, herkes yaklaşık 29 yaşında ilk Satürn dönüşünü yaşar. İkincisi ~58, üçüncüsü ~87 yaşlarında gelir.",
      },
      {
        q: "Satürn dönüşü kötü bir şey mi?",
        a: "Hayır. Zorlayıcı olabilir ama yapıcıdır; gelişim ve olgunlaşma getirir. Kesin kötü bir kehanet değildir.",
      },
      {
        q: "Satürn dönüşüm ne zaman başlıyor?",
        a: "Tam tarih, doğum haritandaki Satürn'ün konumuna bağlıdır. Astrotek AI transit takviminde Satürn'ün natal Satürn'üne döndüğü dönemi gösterir.",
      },
    ],
  },
  {
    slug: "burc-uyumu-hangi-burclar-uyumlu",
    category: "iliski-ask",
    title: "Burç Uyumu: Hangi Burçlar Birbiriyle Uyumlu? (Element Tablosu)",
    excerpt:
      "Burç uyumu nasıl belirlenir, elementler ne rol oynar ve hangi burçlar birbiriyle daha uyumludur? İlişki astrolojisine ve sinastriye sade bir giriş.",
    keywords: [
      "burç uyumu",
      "hangi burçlar uyumlu",
      "burç uyumları",
      "ilişki astrolojisi",
      "aşk uyumu",
      "sinastri",
      "burç eşleşmeleri",
    ],
    date: "2026-06-13",
    readMinutes: 8,
    emoji: "❤️",
    sections: [
      {
        h: "Burç uyumu sadece güneş burcu değildir",
        body: [
          "Popüler burç uyumu tabloları yalnızca güneş burcuna bakar. Gerçek ilişki uyumu (sinastri) ise iki kişinin tüm haritalarının karşılaştırılmasıyla anlaşılır — özellikle Venüs, Mars, Ay ve yükselen.",
          "Yine de elementler iyi bir başlangıç noktasıdır ve genel eğilim hakkında fikir verir.",
        ],
      },
      {
        h: "Elementlere göre genel uyum",
        body: [
          "Burçlar dört elemente ayrılır ve aynı veya uyumlu elementten burçlar genelde birbirini daha kolay anlar.",
        ],
        list: [
          "Ateş (Koç, Aslan, Yay): Hava ile uyumlu — enerji ve heyecan",
          "Hava (İkizler, Terazi, Kova): Ateş ile uyumlu — fikir ve iletişim",
          "Toprak (Boğa, Başak, Oğlak): Su ile uyumlu — istikrar ve güven",
          "Su (Yengeç, Akrep, Balık): Toprak ile uyumlu — duygu ve derinlik",
        ],
      },
      {
        h: "Sinastri: gerçek uyum analizi",
        body: [
          "Sinastri, iki kişinin doğum haritalarını üst üste koyarak bakmaktır. Burada en çok şu eşleşmelere bakılır: Venüs-Mars (çekim), Ay-Ay (duygusal uyum), Güneş-Ay (denge) ve yükselen temasları.",
          "İki kişinin güneş burcu “uyumsuz” olsa bile, Venüs ve Ay açıları güçlüyse ilişki çok uyumlu olabilir. Bu yüzden tabela uyumuna takılıp kalmamak gerekir.",
        ],
      },
    ],
    faq: [
      {
        q: "Uyumsuz burçlar birlikte olamaz mı?",
        a: "Olabilir. 'Uyumsuz' sayılan kombinasyonlar bile farkındalık ve çabayla çok güçlü ilişkiler kurabilir. Astroloji garanti değil, eğilim gösterir.",
      },
      {
        q: "Gerçek uyumu nasıl ölçerim?",
        a: "İki kişinin tam doğum haritalarını karşılaştıran sinastri analizi en doğru sonucu verir; sadece güneş burcuna bakmak yüzeysel kalır.",
      },
      {
        q: "En uyumlu burç çiftleri hangileri?",
        a: "Genel olarak aynı elementten ya da Ateş-Hava ve Toprak-Su kombinasyonları akıcı kabul edilir; ancak kesin sonuç tam harita karşılaştırmasıyla çıkar.",
      },
    ],
  },
  {
    slug: "venus-burcu-ask-hayati",
    category: "iliski-ask",
    title: "Venüs Burcun Aşk Hayatını Nasıl Etkiler? (12 Venüs Burcu)",
    excerpt:
      "Venüs burcu nedir, aşk ve ilişki tarzını nasıl belirler? Venüs'ün doğum haritandaki konumunun anlamını ve 12 Venüs burcunun aşk tarzını açıklıyoruz.",
    keywords: [
      "venüs burcu",
      "venüs burcu nedir",
      "venüs aşk hayatı",
      "venüs burcu hesaplama",
      "aşk astrolojisi",
      "venüs burçları",
    ],
    date: "2026-06-15",
    readMinutes: 8,
    emoji: "♀",
    sections: [
      {
        h: "Venüs neyi temsil eder?",
        body: [
          "Venüs; aşkı, çekimi, zevkleri, değerleri ve parayla ilişkini temsil eden gezegendir. Doğum haritandaki Venüs burcun, nasıl sevdiğini, nelerden hoşlandığını ve ilişkide neye değer verdiğini anlatır.",
          "Güneş burcun 'kim olduğunu', Venüs burcun ise ilişkilerde 'nasıl davrandığını' ve neyle mutlu olduğunu gösterir.",
        ],
      },
      {
        h: "Venüs burcun aşk tarzını belirler",
        body: [
          "Venüs'ün bulunduğu burç, romantik tarzını şekillendirir. İşte kısa örnekler:",
        ],
        list: [
          "Venüs Koç: tutkulu, hızlı, doğrudan",
          "Venüs Boğa: sadık, fiziksel, istikrarlı",
          "Venüs İkizler: zihinsel, oyunbaz, sohbet seven",
          "Venüs Yengeç: korumacı, duygusal, bağlı",
          "Venüs Aslan: cömert, romantik, gösterişli",
          "Venüs Başak: özenli, sadık, gösterişten uzak",
          "Venüs Terazi: zarif, uyumlu, ortaklık odaklı",
          "Venüs Akrep: yoğun, derin, tutkulu",
          "Venüs Yay: özgür, maceracı, samimi",
          "Venüs Oğlak: ciddi, sadık, uzun vadeli",
          "Venüs Kova: özgün, bağımsız, arkadaşça",
          "Venüs Balık: romantik, şefkatli, fedakâr",
        ],
      },
      {
        h: "Venüs'ün evi ve açıları",
        body: [
          "Venüs'ün hangi evde olduğu, aşkı ve değerleri hayatının hangi alanında aradığını gösterir. Örneğin 5. evde flört ve eğlence, 7. evde ciddi ortaklık öne çıkar.",
          "Venüs'ün diğer gezegenlerle açıları da önemlidir: Venüs-Mars çekimi, Venüs-Satürn ise bağlılık ve sınamayı anlatabilir. Tam tablo için haritanın bütününe bakmak gerekir.",
        ],
      },
    ],
    faq: [
      {
        q: "Venüs burcum güneş burcumdan farklı olabilir mi?",
        a: "Evet, çok yaygındır. Venüs Güneş'e yakın hareket eder ama genellikle komşu burçlarda olabilir; bu yüzden Venüs burcun farklı çıkabilir.",
      },
      {
        q: "Venüs burcumu nasıl öğrenirim?",
        a: "Astrotek AI ile doğum haritanı çıkardığında Venüs burcun ve aşk hayatına etkisi yorumda yer alır.",
      },
      {
        q: "İlişki uyumunda Venüs neden önemli?",
        a: "Venüs çekimi ve değerleri temsil ettiği için iki kişinin Venüs konumları uyumun en güçlü göstergelerinden biridir.",
      },
    ],
  },
  {
    slug: "transit-nedir-gezegen-gecisleri",
    category: "transit-zamanlama",
    title: "Transit Nedir? Gezegen Geçişleri Hayatını Nasıl Etkiler?",
    excerpt:
      "Transit nedir, doğum haritanı nasıl etkiler ve hangi gezegen geçişleri daha önemlidir? Dönemsel astroloji yorumlarına ve zamanlamaya kapsamlı bir giriş.",
    keywords: [
      "transit nedir",
      "gezegen geçişleri",
      "transit astroloji",
      "transit yorumu",
      "satürn jüpiter transiti",
      "transit hesaplama",
    ],
    date: "2026-06-17",
    readMinutes: 8,
    emoji: "🪐",
    sections: [
      {
        h: "Transit nedir?",
        body: [
          "Transit, gökyüzündeki gezegenlerin bugünkü konumlarının senin doğum haritandaki noktalara yaptığı etkidir. Doğum haritan sabittir; transitler ise sürekli hareket eden 'güncel gökyüzü hava durumudur'.",
          "Bir transit, gezegen natal bir noktanla açı yaptığında en güçlü hissedilir. Bu, belirli bir yaşam temasının öne çıktığı dönemleri işaret eder.",
        ],
      },
      {
        h: "Yavaş gezegen transitleri (en önemli)",
        body: [
          "Yavaş gezegenler en kalıcı ve hayat değiştiren etkileri yapar çünkü bir noktada aylarca kalabilirler.",
        ],
        list: [
          "Jüpiter: büyüme, fırsat, şans (yaklaşık 1 yıl bir burçta)",
          "Satürn: sorumluluk, sınav, olgunlaşma (~2,5 yıl)",
          "Uranüs: ani değişim, özgürleşme (~7 yıl)",
          "Neptün: ilham, belirsizlik, ruhsallık (~14 yıl)",
          "Plüton: derin dönüşüm, güç (~12-20 yıl)",
        ],
      },
      {
        h: "Hızlı gezegen transitleri",
        body: [
          "Güneş, Merkür, Venüs ve Mars hızlı hareket eder ve kısa vadeli, günlük temalar getirir. Ay ise en hızlısıdır ve günlük ruh halini etkiler.",
          "Bu transitler büyük dönüşümler yapmaz ama gününü ve haftanı renklendirir; özellikle yavaş bir transitle aynı anda gelirse tetikleyici olabilir.",
        ],
      },
      {
        h: "Transitleri zamanlama için kullanmak",
        body: [
          "Transitler, “ne zaman” sorusunun astrolojik cevabıdır. Önemli kararlar, başvurular veya yeni başlangıçlar için destekleyici dönemleri görmek faydalıdır.",
          "Astrotek AI önümüzdeki 12 ay için önemli transitlerin tam tarihlerini ve hangi hayat alanını etkileyeceğini sade dille gösterir.",
        ],
      },
    ],
    faq: [
      {
        q: "Transit kesin olaylar mı gösterir?",
        a: "Hayır. Transitler olası temaları ve eğilimleri gösterir; kesin olay tahmini değildir. Kararlar her zaman senindir.",
      },
      {
        q: "En önemli transit hangisidir?",
        a: "Kişiye göre değişir, ama Satürn ve Jüpiter transitleri kariyer ve hayat yönü açısından sık sık belirleyici kabul edilir.",
      },
      {
        q: "Transitlerimi nasıl öğrenirim?",
        a: "Doğum haritanı çıkardığında Astrotek AI bugünkü ve önümüzdeki dönemdeki transitleri tarihleriyle birlikte yorumlar.",
      },
    ],
  },
  {
    slug: "astrolojik-acilar-kare-ucgen-kavusum",
    category: "evler-acilar",
    title: "Astrolojik Açılar: Kavuşum, Kare, Üçgen Ne Demek? (Tam Rehber)",
    excerpt:
      "Astrolojik açılar nedir? Kavuşum, altmışlık, kare, üçgen ve karşıt açıların anlamlarını, orb kavramını ve doğum haritandaki etkilerini açıklıyoruz.",
    keywords: [
      "astrolojik açılar",
      "kare açı",
      "üçgen açı",
      "kavuşum nedir",
      "açı anlamları astroloji",
      "orb nedir",
      "karşıt açı",
    ],
    date: "2026-06-19",
    readMinutes: 8,
    emoji: "△",
    sections: [
      {
        h: "Astrolojik açı nedir?",
        body: [
          "Açılar, doğum haritandaki gezegenlerin birbirine göre yaptığı açısal ilişkilerdir. Gezegenlerin enerjilerinin nasıl etkileşeceğini — uyumlu mu yoksa gergin mi — gösterirler.",
          "Açılar haritanın “nasıl bağlandığını” anlatır; gezegenler tek başına değil, birbirleriyle konuşarak çalışır.",
        ],
      },
      {
        h: "Ana açılar ve anlamları",
        body: [
          "Beş ana (major) açı vardır. Yumuşak açılar akış, sert açılar ise gerilim ve gelişim getirir.",
        ],
        list: [
          "Kavuşum (0°): enerjiler birleşir ve yoğunlaşır",
          "Altmışlık (60°): fırsat, kolay akış, destek",
          "Üçgen (120°): doğal yetenek, uyum, şans",
          "Kare (90°): gerilim, çaba, gelişim itici gücü",
          "Karşıt (180°): denge arayışı, karşıtlıkların yönetimi",
        ],
      },
      {
        h: "Orb nedir ve neden önemli?",
        body: [
          "Orb, açının tam dereceden sapma miktarıdır. Örneğin tam kare 90°'dir; 88° veya 92° de hâlâ kare sayılır çünkü orb toleransı vardır.",
          "Orb ne kadar küçükse (açı ne kadar “tam”sa) etkisi o kadar güçlüdür. 0-1° orblu açılar haritanın en baskın temalarındandır.",
        ],
      },
      {
        h: "Sert açılar kötü mü?",
        body: [
          "Hayır. Kare ve karşıt gibi sert açılar gerilim yaratır ama bu gerilim çoğu zaman motivasyon, çaba ve büyümenin kaynağıdır. Birçok başarılı insanın haritasında güçlü sert açılar vardır.",
          "Yumuşak açılar (üçgen, altmışlık) yetenek verir ama bazen tembelliğe de yol açabilir. İkisinin dengesi sağlıklı bir haritadır.",
        ],
      },
    ],
    faq: [
      {
        q: "Sert açılar kötü mü?",
        a: "Hayır. Kare ve karşıt gibi sert açılar gerilim yaratır ama bu gerilim çoğu zaman motivasyon, çaba ve büyüme kaynağıdır.",
      },
      {
        q: "Orb ne demek?",
        a: "Orb, açının tam dereceden sapma miktarıdır. Orb ne kadar küçükse açı o kadar güçlü kabul edilir.",
      },
      {
        q: "Açılarımı nasıl görürüm?",
        a: "Astrotek AI doğum haritandaki tüm major açıları orb değerleriyle birlikte listeler ve her birinin ne anlama geldiğini açıklar.",
      },
    ],
  },
];

export function getAllArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getArticlesByCategory(slug: string): Article[] {
  return getAllArticles().filter((a) => a.category === slug);
}

// Yazı sayısı olan kategoriler (her birinin kaç yazısı var)
export function getCategoriesWithCounts(): (Category & { count: number })[] {
  return CATEGORIES.map((c) => ({
    ...c,
    count: ARTICLES.filter((a) => a.category === c.slug).length,
  }));
}
