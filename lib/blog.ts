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
  {
    slug: "koc-burcu-ozellikleri",
    category: "burclar",
    title: "Koç Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "Koç burcu özellikleri nelerdir? Ateş elementi ve Mars yönetimindeki Koç burcunun kişiliği, güçlü-zayıf yönleri, aşk hayatı ve kariyer eğilimleri.",
    keywords: ["koç burcu", "koç burcu özellikleri", "koç burcu kişiliği", "koç burcu aşk", "koç burcu kadını", "koç burcu erkeği"],
    date: "2026-07-01",
    readMinutes: 7,
    emoji: "♈",
    sections: [
      {
        h: "Koç burcu genel özellikleri",
        body: [
          "Koç burcu (21 Mart – 19 Nisan), zodyağın ilk burcudur ve Ateş elementine aittir. Yöneticisi savaşçı gezegen Mars'tır; bu yüzden Koçlar cesur, enerjik ve öncü bir ruha sahiptir.",
          "Bir Koç, hayata atılgan ve doğrudan yaklaşır. Yeni başlangıçlar, rekabet ve liderlik onların doğal alanıdır. Hızlı karar verir, çabuk harekete geçer ve engellerden yılmaz.",
        ],
      },
      {
        h: "Koç burcu güçlü ve zayıf yönleri",
        body: [
          "Koç'un enerjisi hem en büyük gücü hem de zaman zaman zorlayıcı yanıdır. Cesareti ilham verir ama sabırsızlığı aceleci kararlara yol açabilir.",
        ],
        list: [
          "Güçlü: cesaret, liderlik, dürüstlük, girişkenlik, enerji",
          "Güçlü: çabuk toparlanma ve mücadele azmi",
          "Zorlayıcı: sabırsızlık, ani öfke, rekabetçilik",
          "Zorlayıcı: detaylardan sıkılma, fevri davranış",
        ],
      },
      {
        h: "Koç burcu aşk ve ilişki",
        body: [
          "Aşkta Koç tutkulu ve doğrudan tek harekettir. Hoşlandığı kişiye açıkça yaklaşır, oyun sevmez. İlişkide heyecanın ve tazeliğin sürmesini ister.",
          "En uyumlu olduğu burçlar genelde diğer Ateş (Aslan, Yay) ve Hava (İkizler, Terazi, Kova) burçlarıdır. Gerçek uyum için iki kişinin tam doğum haritası karşılaştırılmalıdır.",
        ],
      },
      {
        h: "Koç burcu kariyer ve para",
        body: [
          "Koçlar girişimcilik, spor, liderlik ve hızlı karar gerektiren işlerde parlar. Kendi işini kurmaya ve inisiyatif almaya yatkındırlar.",
          "Para konusunda cömert ve biraz aceleci olabilirler; ani harcamalar yerine plan yapmak onlara fayda sağlar.",
        ],
      },
    ],
    faq: [
      { q: "Koç burcu hangi tarihler arası?", a: "Koç burcu 21 Mart – 19 Nisan tarihleri arasındadır." },
      { q: "Koç burcunun yönetici gezegeni nedir?", a: "Koç burcunu savaşçı ve enerjik gezegen Mars yönetir." },
      { q: "Koç burcu hangi burçlarla uyumlu?", a: "Genelde Aslan, Yay (Ateş) ve İkizler, Terazi, Kova (Hava) ile uyumludur; kesin sonuç tam harita karşılaştırmasıyla çıkar." },
    ],
  },
  {
    slug: "boga-burcu-ozellikleri",
    category: "burclar",
    title: "Boğa Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "Boğa burcu özellikleri nelerdir? Toprak elementi ve Venüs yönetimindeki Boğa burcunun kişiliği, güçlü-zayıf yönleri, aşk ve kariyer eğilimleri.",
    keywords: ["boğa burcu", "boğa burcu özellikleri", "boğa burcu kişiliği", "boğa burcu aşk", "boğa burcu kadını", "boğa burcu erkeği"],
    date: "2026-06-30",
    readMinutes: 7,
    emoji: "♉",
    sections: [
      {
        h: "Boğa burcu genel özellikleri",
        body: [
          "Boğa burcu (20 Nisan – 20 Mayıs) Toprak elementine aittir ve aşk-değer gezegeni Venüs tarafından yönetilir. Bu yüzden Boğalar istikrarlı, sadık ve güzelliğe düşkündür.",
          "Boğa sağlam, sabırlı ve güven verendir. Acele etmez; adım adım, emin biçimde ilerler. Konfor, kalite ve maddi güvenlik onun için önemlidir.",
        ],
      },
      {
        h: "Boğa burcu güçlü ve zayıf yönleri",
        body: [
          "Boğa'nın kararlılığı büyük bir güçtür ama aşırıya kaçınca inatçılığa dönüşebilir.",
        ],
        list: [
          "Güçlü: sadakat, kararlılık, sabır, güvenilirlik",
          "Güçlü: pratiklik ve maddi konularda sağduyu",
          "Zorlayıcı: inatçılık, değişime direnç",
          "Zorlayıcı: sahiplenme, konfora aşırı bağlılık",
        ],
      },
      {
        h: "Boğa burcu aşk ve ilişki",
        body: [
          "Boğa aşkta sadık, şefkatli ve fiziksel yakınlığa değer veren bir partnerdir. Acele etmez ama bağlandığında uzun vadeli ve sağlam bir ilişki kurar.",
          "Genelde Toprak (Başak, Oğlak) ve Su (Yengeç, Akrep, Balık) burçlarıyla uyumludur.",
        ],
      },
      {
        h: "Boğa burcu kariyer ve para",
        body: [
          "Boğalar istikrar ve somut sonuç isteyen işlerde başarılıdır: finans, gayrimenkul, sanat, gastronomi ve tasarım. Sabırlı çalışmaları uzun vadede kazanç getirir.",
          "Para yönetiminde doğal bir yetenekleri vardır; biriktirmeyi ve değer katmayı severler.",
        ],
      },
    ],
    faq: [
      { q: "Boğa burcu hangi tarihler arası?", a: "Boğa burcu 20 Nisan – 20 Mayıs tarihleri arasındadır." },
      { q: "Boğa burcunun yönetici gezegeni nedir?", a: "Boğa burcunu aşk ve değer gezegeni Venüs yönetir." },
      { q: "Boğa burcu neden inatçı sayılır?", a: "Sabit bir Toprak burcu olduğu için kararlarında sağlamdır; bu kararlılık bazen inatçılık gibi görünür." },
    ],
  },
  {
    slug: "ikizler-burcu-ozellikleri",
    category: "burclar",
    title: "İkizler Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "İkizler burcu özellikleri nelerdir? Hava elementi ve Merkür yönetimindeki İkizler burcunun kişiliği, güçlü-zayıf yönleri, aşk ve kariyer eğilimleri.",
    keywords: ["ikizler burcu", "ikizler burcu özellikleri", "ikizler burcu kişiliği", "ikizler burcu aşk", "ikizler burcu kadını", "ikizler burcu erkeği"],
    date: "2026-06-29",
    readMinutes: 7,
    emoji: "♊",
    sections: [
      {
        h: "İkizler burcu genel özellikleri",
        body: [
          "İkizler burcu (21 Mayıs – 20 Haziran) Hava elementine aittir ve iletişim gezegeni Merkür tarafından yönetilir. İkizler meraklı, konuşkan ve çok yönlüdür.",
          "Zihinsel olarak hızlı çalışır, yeni fikirlere açıktır ve sıkılmaktan hoşlanmaz. Sosyal, esprili ve uyumludur; farklı konular arasında kolayca geçiş yapar.",
        ],
      },
      {
        h: "İkizler burcu güçlü ve zayıf yönleri",
        body: [
          "İkizler'in çok yönlülüğü büyük bir avantajdır ama odaklanma zorluğu getirebilir.",
        ],
        list: [
          "Güçlü: zekâ, iletişim, uyum yeteneği, mizah",
          "Güçlü: merak ve hızlı öğrenme",
          "Zorlayıcı: kararsızlık, dağınıklık",
          "Zorlayıcı: çabuk sıkılma, yüzeysellik eğilimi",
        ],
      },
      {
        h: "İkizler burcu aşk ve ilişki",
        body: [
          "İkizler aşkta zihinsel uyumu ve iyi sohbeti her şeyin önüne koyar. Eğlenceli, oyunbaz ve meraklı bir partnerdir; monotonluktan kaçar.",
          "Genelde Hava (Terazi, Kova) ve Ateş (Koç, Aslan, Yay) burçlarıyla uyumludur.",
        ],
      },
      {
        h: "İkizler burcu kariyer ve para",
        body: [
          "İkizler iletişim, yazarlık, satış, medya, eğitim ve teknoloji gibi çeşitlilik ve zihinsel hareket sunan işlerde parlar.",
          "Para konusunda esnektirler; birden fazla gelir kaynağı onlara iyi gelir.",
        ],
      },
    ],
    faq: [
      { q: "İkizler burcu hangi tarihler arası?", a: "İkizler burcu 21 Mayıs – 20 Haziran tarihleri arasındadır." },
      { q: "İkizler burcunun yönetici gezegeni nedir?", a: "İkizler burcunu iletişim ve zihin gezegeni Merkür yönetir." },
      { q: "İkizler burcu neden kararsız sayılır?", a: "Çok yönlü ve meraklı oldukları için seçenekler arasında gidip gelebilirler; bu kararsızlık gibi görünür." },
    ],
  },
  {
    slug: "yengec-burcu-ozellikleri",
    category: "burclar",
    title: "Yengeç Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "Yengeç burcu özellikleri nelerdir? Su elementi ve Ay yönetimindeki Yengeç burcunun kişiliği, güçlü-zayıf yönleri, aşk ve kariyer eğilimleri.",
    keywords: ["yengeç burcu", "yengeç burcu özellikleri", "yengeç burcu kişiliği", "yengeç burcu aşk", "yengeç burcu kadını", "yengeç burcu erkeği"],
    date: "2026-06-28",
    readMinutes: 7,
    emoji: "♋",
    sections: [
      {
        h: "Yengeç burcu genel özellikleri",
        body: [
          "Yengeç burcu (21 Haziran – 22 Temmuz) Su elementine aittir ve duyguların gezegeni Ay tarafından yönetilir. Yengeçler duygusal, korumacı ve sezgisel kişilerdir.",
          "Aile, ev ve güven onlar için çok önemlidir. Sevdiklerine derinden bağlanır, şefkatli ve besleyici bir tavır sergilerler. Güçlü bir hafıza ve sezgiye sahiptirler.",
        ],
      },
      {
        h: "Yengeç burcu güçlü ve zayıf yönleri",
        body: [
          "Yengeç'in duygusal derinliği hem en güzel yanı hem de incinmeye açık tarafıdır.",
        ],
        list: [
          "Güçlü: şefkat, sadakat, sezgi, korumacılık",
          "Güçlü: empati ve güçlü aile bağı",
          "Zorlayıcı: alınganlık, ruh hali dalgalanmaları",
          "Zorlayıcı: geçmişe takılma, içe kapanma",
        ],
      },
      {
        h: "Yengeç burcu aşk ve ilişki",
        body: [
          "Yengeç aşkta derin, sadık ve korumacıdır. Duygusal güven hissettiğinde tüm kalbini açar; ilişkide şefkat ve aidiyet arar.",
          "Genelde Su (Akrep, Balık) ve Toprak (Boğa, Başak, Oğlak) burçlarıyla uyumludur.",
        ],
      },
      {
        h: "Yengeç burcu kariyer ve para",
        body: [
          "Yengeçler insanlara bakım ve destek sunan işlerde başarılıdır: sağlık, eğitim, gastronomi, gayrimenkul ve aile işleri. Güçlü sezgileri iş kararlarında işlerine yarar.",
          "Para konusunda temkinli ve tasarrufludurlar; geleceği güvence altına almayı severler.",
        ],
      },
    ],
    faq: [
      { q: "Yengeç burcu hangi tarihler arası?", a: "Yengeç burcu 21 Haziran – 22 Temmuz tarihleri arasındadır." },
      { q: "Yengeç burcunun yönetici gezegeni nedir?", a: "Yengeç burcunu duyguların gök cismi Ay yönetir." },
      { q: "Yengeç burcu neden duygusal sayılır?", a: "Ay tarafından yönetilen bir Su burcu olduğu için duyguları derin ve değişkendir." },
    ],
  },
  {
    slug: "aslan-burcu-ozellikleri",
    category: "burclar",
    title: "Aslan Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "Aslan burcu özellikleri nelerdir? Ateş elementi ve Güneş yönetimindeki Aslan burcunun kişiliği, güçlü-zayıf yönleri, aşk ve kariyer eğilimleri.",
    keywords: ["aslan burcu", "aslan burcu özellikleri", "aslan burcu kişiliği", "aslan burcu aşk", "aslan burcu kadını", "aslan burcu erkeği"],
    date: "2026-06-27",
    readMinutes: 7,
    emoji: "♌",
    sections: [
      {
        h: "Aslan burcu genel özellikleri",
        body: [
          "Aslan burcu (23 Temmuz – 22 Ağustos) Ateş elementine aittir ve Güneş tarafından yönetilir. Aslanlar kendinden emin, cömert ve doğal liderlerdir.",
          "Sıcak, sahnede olmayı seven ve karizmatik kişilerdir. Takdir edilmek onlar için önemlidir; sevdiklerine karşı koruyucu ve cömerttirler.",
        ],
      },
      {
        h: "Aslan burcu güçlü ve zayıf yönleri",
        body: [
          "Aslan'ın özgüveni ilham verir; ancak gurur incinmeye açıktır.",
        ],
        list: [
          "Güçlü: liderlik, cömertlik, sadakat, sıcaklık",
          "Güçlü: özgüven ve motive etme yeteneği",
          "Zorlayıcı: gurur, ilgi ihtiyacı",
          "Zorlayıcı: inatçılık, eleştiriye kapalılık",
        ],
      },
      {
        h: "Aslan burcu aşk ve ilişki",
        body: [
          "Aslan aşkta romantik, cömert ve gösterişlidir. Partnerini el üstünde tutar ama karşılığında sadakat ve takdir bekler. İlişkide tutku ve eğlence ister.",
          "Genelde Ateş (Koç, Yay) ve Hava (İkizler, Terazi, Kova) burçlarıyla uyumludur.",
        ],
      },
      {
        h: "Aslan burcu kariyer ve para",
        body: [
          "Aslanlar görünürlük, liderlik ve yaratıcılık sunan işlerde parlar: sanat, yönetim, sahne, eğitim ve girişimcilik. Doğal otoriteleri ekipleri motive eder.",
          "Para konusunda cömerttirler; statü ve kaliteye yatırım yapmayı severler.",
        ],
      },
    ],
    faq: [
      { q: "Aslan burcu hangi tarihler arası?", a: "Aslan burcu 23 Temmuz – 22 Ağustos tarihleri arasındadır." },
      { q: "Aslan burcunun yönetici gezegeni nedir?", a: "Aslan burcunu Güneş yönetir." },
      { q: "Aslan burcu neden ilgi ister?", a: "Güneş tarafından yönetildiği için doğal olarak parlamak ve takdir edilmek ister." },
    ],
  },
  {
    slug: "basak-burcu-ozellikleri",
    category: "burclar",
    title: "Başak Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "Başak burcu özellikleri nelerdir? Toprak elementi ve Merkür yönetimindeki Başak burcunun kişiliği, güçlü-zayıf yönleri, aşk ve kariyer eğilimleri.",
    keywords: ["başak burcu", "başak burcu özellikleri", "başak burcu kişiliği", "başak burcu aşk", "başak burcu kadını", "başak burcu erkeği"],
    date: "2026-06-26",
    readMinutes: 7,
    emoji: "♍",
    sections: [
      {
        h: "Başak burcu genel özellikleri",
        body: [
          "Başak burcu (23 Ağustos – 22 Eylül) Toprak elementine aittir ve Merkür tarafından yönetilir. Başaklar analitik, detaycı ve yardımseverdir.",
          "Düzen, verimlilik ve fayda onlar için önemlidir. Pratik zekâları ve gözlem yetenekleriyle sorunları çözmekte ustadırlar; mütevazı ama güvenilirdirler.",
        ],
      },
      {
        h: "Başak burcu güçlü ve zayıf yönleri",
        body: [
          "Başak'ın detaycılığı mükemmel sonuçlar üretir ama aşırı eleştiriye dönüşebilir.",
        ],
        list: [
          "Güçlü: analitik zekâ, titizlik, güvenilirlik, yardımseverlik",
          "Güçlü: pratiklik ve problem çözme",
          "Zorlayıcı: aşırı eleştiri, mükemmeliyetçilik",
          "Zorlayıcı: endişe, fazla detaya takılma",
        ],
      },
      {
        h: "Başak burcu aşk ve ilişki",
        body: [
          "Başak aşkta özenli, sadık ve hizmet odaklıdır. Sevgisini büyük jestlerle değil, küçük ve düşünceli davranışlarla gösterir. Güven ve istikrar arar.",
          "Genelde Toprak (Boğa, Oğlak) ve Su (Yengeç, Akrep, Balık) burçlarıyla uyumludur.",
        ],
      },
      {
        h: "Başak burcu kariyer ve para",
        body: [
          "Başaklar detay, analiz ve düzen gerektiren işlerde başarılıdır: sağlık, muhasebe, editörlük, mühendislik ve veri analizi. Titizlikleri kaliteyi yükseltir.",
          "Para konusunda dikkatli ve planlıdırlar; bütçe yapmayı ve tasarrufu severler.",
        ],
      },
    ],
    faq: [
      { q: "Başak burcu hangi tarihler arası?", a: "Başak burcu 23 Ağustos – 22 Eylül tarihleri arasındadır." },
      { q: "Başak burcunun yönetici gezegeni nedir?", a: "Başak burcunu zihin ve analiz gezegeni Merkür yönetir." },
      { q: "Başak burcu neden mükemmeliyetçi?", a: "Detaylara önem veren bir Toprak burcu olduğu için her şeyin düzgün olmasını ister." },
    ],
  },
  {
    slug: "terazi-burcu-ozellikleri",
    category: "burclar",
    title: "Terazi Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "Terazi burcu özellikleri nelerdir? Hava elementi ve Venüs yönetimindeki Terazi burcunun kişiliği, güçlü-zayıf yönleri, aşk ve kariyer eğilimleri.",
    keywords: ["terazi burcu", "terazi burcu özellikleri", "terazi burcu kişiliği", "terazi burcu aşk", "terazi burcu kadını", "terazi burcu erkeği"],
    date: "2026-06-25",
    readMinutes: 7,
    emoji: "♎",
    sections: [
      {
        h: "Terazi burcu genel özellikleri",
        body: [
          "Terazi burcu (23 Eylül – 22 Ekim) Hava elementine aittir ve Venüs tarafından yönetilir. Teraziler zarif, diplomatik ve uyum arayan kişilerdir.",
          "Adalet, denge ve estetik onlar için önemlidir. İlişkilerde ve ortamlarda huzuru korumaya çalışır; nazik, sosyal ve çekicidirler.",
        ],
      },
      {
        h: "Terazi burcu güçlü ve zayıf yönleri",
        body: [
          "Terazi'nin denge arayışı güzel ilişkiler kurar ama karar vermeyi zorlaştırabilir.",
        ],
        list: [
          "Güçlü: diplomasi, adalet duygusu, zarafet, uyum",
          "Güçlü: işbirliği ve estetik anlayış",
          "Zorlayıcı: kararsızlık, çatışmadan kaçma",
          "Zorlayıcı: onaylanma ihtiyacı, erteleme",
        ],
      },
      {
        h: "Terazi burcu aşk ve ilişki",
        body: [
          "Terazi ilişki burcudur; ortaklığa ve uyuma büyük değer verir. Romantik, kibar ve partner odaklıdır. İlişkide eşitlik ve karşılıklı saygı arar.",
          "Genelde Hava (İkizler, Kova) ve Ateş (Koç, Aslan, Yay) burçlarıyla uyumludur.",
        ],
      },
      {
        h: "Terazi burcu kariyer ve para",
        body: [
          "Teraziler diplomasi, estetik ve işbirliği gerektiren işlerde parlar: hukuk, tasarım, diplomasi, danışmanlık ve sanat. İnsan ilişkilerinde ustadırlar.",
          "Para konusunda kaliteyi ve güzelliği severler; bazen dengeyi tutturmak için bütçe planı iyi gelir.",
        ],
      },
    ],
    faq: [
      { q: "Terazi burcu hangi tarihler arası?", a: "Terazi burcu 23 Eylül – 22 Ekim tarihleri arasındadır." },
      { q: "Terazi burcunun yönetici gezegeni nedir?", a: "Terazi burcunu aşk ve estetik gezegeni Venüs yönetir." },
      { q: "Terazi burcu neden kararsız?", a: "Her şeyi dengelemeye ve adil olmaya çalıştığı için seçenekler arasında tartar; bu kararsızlık gibi görünür." },
    ],
  },
  {
    slug: "akrep-burcu-ozellikleri",
    category: "burclar",
    title: "Akrep Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "Akrep burcu özellikleri nelerdir? Su elementi ve Mars/Plüton yönetimindeki Akrep burcunun kişiliği, güçlü-zayıf yönleri, aşk ve kariyer eğilimleri.",
    keywords: ["akrep burcu", "akrep burcu özellikleri", "akrep burcu kişiliği", "akrep burcu aşk", "akrep burcu kadını", "akrep burcu erkeği"],
    date: "2026-06-24",
    readMinutes: 7,
    emoji: "♏",
    sections: [
      {
        h: "Akrep burcu genel özellikleri",
        body: [
          "Akrep burcu (23 Ekim – 21 Kasım) Su elementine aittir ve Mars ile Plüton tarafından yönetilir. Akrepler tutkulu, derin ve güçlü bir iradeye sahiptir.",
          "Gizemli, sezgisel ve dönüştürücüdürler. Yüzeysel ilişkilerden hoşlanmaz, derinlik ve gerçeklik ararlar. Bir şeye odaklandıklarında olağanüstü kararlı olurlar.",
        ],
      },
      {
        h: "Akrep burcu güçlü ve zayıf yönleri",
        body: [
          "Akrep'in yoğunluğu büyük bir güçtür ama kıskançlık ve kontrol ihtiyacına dönüşebilir.",
        ],
        list: [
          "Güçlü: tutku, kararlılık, sadakat, sezgi",
          "Güçlü: kriz yönetimi ve derin bağ kurma",
          "Zorlayıcı: kıskançlık, kontrol ihtiyacı",
          "Zorlayıcı: kin tutma, gizlilik",
        ],
      },
      {
        h: "Akrep burcu aşk ve ilişki",
        body: [
          "Akrep aşkta yoğun, tutkulu ve son derece sadıktır. Tüm kalbiyle bağlanır ve aynı derinlikte bağlılık bekler. Güven onun için her şeydir.",
          "Genelde Su (Yengeç, Balık) ve Toprak (Boğa, Başak, Oğlak) burçlarıyla uyumludur.",
        ],
      },
      {
        h: "Akrep burcu kariyer ve para",
        body: [
          "Akrepler araştırma, derinlik ve dönüşüm gerektiren işlerde başarılıdır: psikoloji, araştırmacılık, finans, cerrahi ve kriz yönetimi. Odaklandıklarında zirveye çıkarlar.",
          "Para konusunda stratejik ve temkinlidirler; uzun vadeli güç ve güvenlik ararlar.",
        ],
      },
    ],
    faq: [
      { q: "Akrep burcu hangi tarihler arası?", a: "Akrep burcu 23 Ekim – 21 Kasım tarihleri arasındadır." },
      { q: "Akrep burcunun yönetici gezegeni nedir?", a: "Akrep burcunu geleneksel olarak Mars, modern astrolojide Plüton yönetir." },
      { q: "Akrep burcu neden gizemli sayılır?", a: "Duygularını kolay açmaz, derinlik ve gerçeklik arar; bu yüzden gizemli görünür." },
    ],
  },
  {
    slug: "yay-burcu-ozellikleri",
    category: "burclar",
    title: "Yay Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "Yay burcu özellikleri nelerdir? Ateş elementi ve Jüpiter yönetimindeki Yay burcunun kişiliği, güçlü-zayıf yönleri, aşk ve kariyer eğilimleri.",
    keywords: ["yay burcu", "yay burcu özellikleri", "yay burcu kişiliği", "yay burcu aşk", "yay burcu kadını", "yay burcu erkeği"],
    date: "2026-06-23",
    readMinutes: 7,
    emoji: "♐",
    sections: [
      {
        h: "Yay burcu genel özellikleri",
        body: [
          "Yay burcu (22 Kasım – 21 Aralık) Ateş elementine aittir ve şans gezegeni Jüpiter tarafından yönetilir. Yaylar özgür ruhlu, iyimser ve maceracıdır.",
          "Yeni deneyimler, seyahat, felsefe ve öğrenme onları besler. Açık sözlü, neşeli ve geniş ufukludurlar; hayata büyük resimden bakarlar.",
        ],
      },
      {
        h: "Yay burcu güçlü ve zayıf yönleri",
        body: [
          "Yay'ın özgürlük sevgisi enerji verir ama bazen sorumluluktan kaçışa dönüşebilir.",
        ],
        list: [
          "Güçlü: iyimserlik, dürüstlük, macera ruhu, geniş vizyon",
          "Güçlü: öğrenme ve ilham verme",
          "Zorlayıcı: sabırsızlık, fazla açık sözlülük",
          "Zorlayıcı: bağlanma korkusu, savrukluk",
        ],
      },
      {
        h: "Yay burcu aşk ve ilişki",
        body: [
          "Yay aşkta özgür, samimi ve eğlencelidir. Partnerinde hem dost hem yol arkadaşı arar; kıskançlık ve baskıdan hoşlanmaz. Birlikte keşfetmek onları mutlu eder.",
          "Genelde Ateş (Koç, Aslan) ve Hava (İkizler, Terazi, Kova) burçlarıyla uyumludur.",
        ],
      },
      {
        h: "Yay burcu kariyer ve para",
        body: [
          "Yaylar özgürlük, seyahat ve anlam sunan işlerde parlar: akademi, yayıncılık, turizm, hukuk ve uluslararası işler. Motivasyonları yüksek olduğunda çok üretkendirler.",
          "Para konusunda cömert ve iyimserdirler; bazen plan yapmak savurganlığı dengeler.",
        ],
      },
    ],
    faq: [
      { q: "Yay burcu hangi tarihler arası?", a: "Yay burcu 22 Kasım – 21 Aralık tarihleri arasındadır." },
      { q: "Yay burcunun yönetici gezegeni nedir?", a: "Yay burcunu büyüme ve şans gezegeni Jüpiter yönetir." },
      { q: "Yay burcu neden özgürlüğüne düşkün?", a: "Ateş elementi ve Jüpiter etkisiyle keşfetmeyi ve sınırsız hissetmeyi sever." },
    ],
  },
  {
    slug: "oglak-burcu-ozellikleri",
    category: "burclar",
    title: "Oğlak Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "Oğlak burcu özellikleri nelerdir? Toprak elementi ve Satürn yönetimindeki Oğlak burcunun kişiliği, güçlü-zayıf yönleri, aşk ve kariyer eğilimleri.",
    keywords: ["oğlak burcu", "oğlak burcu özellikleri", "oğlak burcu kişiliği", "oğlak burcu aşk", "oğlak burcu kadını", "oğlak burcu erkeği"],
    date: "2026-06-22",
    readMinutes: 7,
    emoji: "♑",
    sections: [
      {
        h: "Oğlak burcu genel özellikleri",
        body: [
          "Oğlak burcu (22 Aralık – 19 Ocak) Toprak elementine aittir ve disiplin gezegeni Satürn tarafından yönetilir. Oğlaklar hırslı, sorumlu ve hedef odaklıdır.",
          "Sabırlı ve stratejik bir şekilde tırmanırlar; uzun vadeli başarı için bugünden fedakârlık yapabilirler. Ciddi, güvenilir ve olgun bir duruşları vardır.",
        ],
      },
      {
        h: "Oğlak burcu güçlü ve zayıf yönleri",
        body: [
          "Oğlak'ın disiplini büyük başarılar getirir ama aşırı ciddiyet ve katılık yaratabilir.",
        ],
        list: [
          "Güçlü: disiplin, sorumluluk, sabır, hırs",
          "Güçlü: stratejik düşünme ve dayanıklılık",
          "Zorlayıcı: katılık, aşırı ciddiyet",
          "Zorlayıcı: duyguları bastırma, mesafelilik",
        ],
      },
      {
        h: "Oğlak burcu aşk ve ilişki",
        body: [
          "Oğlak aşkta ciddi, sadık ve uzun vadelidir. Hızlı bağlanmaz ama bağlandığında güvenilir ve istikrarlı bir partner olur. Sözünün eridir.",
          "Genelde Toprak (Boğa, Başak) ve Su (Yengeç, Akrep, Balık) burçlarıyla uyumludur.",
        ],
      },
      {
        h: "Oğlak burcu kariyer ve para",
        body: [
          "Oğlaklar yapı, sorumluluk ve uzun vadeli başarı sunan işlerde zirveye çıkar: yönetim, finans, mühendislik, hukuk ve girişimcilik. Sabırlı çalışmaları meyvesini verir.",
          "Para konusunda disiplinli ve öngörülüdürler; birikim ve güvenlik önceliklidir.",
        ],
      },
    ],
    faq: [
      { q: "Oğlak burcu hangi tarihler arası?", a: "Oğlak burcu 22 Aralık – 19 Ocak tarihleri arasındadır." },
      { q: "Oğlak burcunun yönetici gezegeni nedir?", a: "Oğlak burcunu disiplin ve sorumluluk gezegeni Satürn yönetir." },
      { q: "Oğlak burcu neden mesafeli sayılır?", a: "Duygularını kolay göstermez; güveni zamanla kurar, bu yüzden başta mesafeli görünebilir." },
    ],
  },
  {
    slug: "kova-burcu-ozellikleri",
    category: "burclar",
    title: "Kova Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "Kova burcu özellikleri nelerdir? Hava elementi ve Satürn/Uranüs yönetimindeki Kova burcunun kişiliği, güçlü-zayıf yönleri, aşk ve kariyer eğilimleri.",
    keywords: ["kova burcu", "kova burcu özellikleri", "kova burcu kişiliği", "kova burcu aşk", "kova burcu kadını", "kova burcu erkeği"],
    date: "2026-06-21",
    readMinutes: 7,
    emoji: "♒",
    sections: [
      {
        h: "Kova burcu genel özellikleri",
        body: [
          "Kova burcu (20 Ocak – 18 Şubat) Hava elementine aittir ve Satürn ile Uranüs tarafından yönetilir. Kovalar özgün, bağımsız ve yenilikçidir.",
          "Geleceğe dönük, fikir odaklı ve insancıldırlar. Kalıpların dışında düşünür, özgürlüğe ve bireyselliğe değer verirler. Topluluk ve idealler onlar için önemlidir.",
        ],
      },
      {
        h: "Kova burcu güçlü ve zayıf yönleri",
        body: [
          "Kova'nın özgünlüğü ilham verir ama duygusal mesafeye yol açabilir.",
        ],
        list: [
          "Güçlü: yenilikçilik, bağımsızlık, vizyon, insancıllık",
          "Güçlü: özgün düşünce ve objektiflik",
          "Zorlayıcı: duygusal mesafe, inatçılık",
          "Zorlayıcı: asilik, öngörülemezlik",
        ],
      },
      {
        h: "Kova burcu aşk ve ilişki",
        body: [
          "Kova aşkta önce arkadaşlık ister; zihinsel uyum ve özgürlük onun için şarttır. Sıra dışı, dürüst ve bağımsız bir partnerdir; sahiplenilmekten hoşlanmaz.",
          "Genelde Hava (İkizler, Terazi) ve Ateş (Koç, Aslan, Yay) burçlarıyla uyumludur.",
        ],
      },
      {
        h: "Kova burcu kariyer ve para",
        body: [
          "Kovalar yenilik, teknoloji ve toplumsal fayda sunan işlerde parlar: bilim, teknoloji, sosyal girişim, tasarım ve araştırma. Özgün fikirleriyle fark yaratırlar.",
          "Para konusunda alışılmadık yaklaşımları olabilir; özgürlüklerini kısıtlamayan bir düzen onlara iyi gelir.",
        ],
      },
    ],
    faq: [
      { q: "Kova burcu hangi tarihler arası?", a: "Kova burcu 20 Ocak – 18 Şubat tarihleri arasındadır." },
      { q: "Kova burcunun yönetici gezegeni nedir?", a: "Kova burcunu geleneksel olarak Satürn, modern astrolojide Uranüs yönetir." },
      { q: "Kova burcu neden farklı sayılır?", a: "Kalıpların dışında düşünen, özgün ve bağımsız bir Hava burcu olduğu için sıra dışı görünür." },
    ],
  },
  {
    slug: "balik-burcu-ozellikleri",
    category: "burclar",
    title: "Balık Burcu Özellikleri: Kişilik, Aşk ve Kariyer (Tam Rehber)",
    excerpt:
      "Balık burcu özellikleri nelerdir? Su elementi ve Jüpiter/Neptün yönetimindeki Balık burcunun kişiliği, güçlü-zayıf yönleri, aşk ve kariyer eğilimleri.",
    keywords: ["balık burcu", "balık burcu özellikleri", "balık burcu kişiliği", "balık burcu aşk", "balık burcu kadını", "balık burcu erkeği"],
    date: "2026-06-20",
    readMinutes: 7,
    emoji: "♓",
    sections: [
      {
        h: "Balık burcu genel özellikleri",
        body: [
          "Balık burcu (19 Şubat – 20 Mart) Su elementine aittir ve Jüpiter ile Neptün tarafından yönetilir. Balıklar şefkatli, sezgisel ve hayalperesttir.",
          "Empati yetenekleri çok güçlüdür; başkalarının duygularını derinden hisseder. Sanatsal, romantik ve ruhsal eğilimleri vardır; sınırları yumuşaktır.",
        ],
      },
      {
        h: "Balık burcu güçlü ve zayıf yönleri",
        body: [
          "Balık'ın empatisi ve hayal gücü büyük bir armağandır ama gerçeklerden kaçışa açıktır.",
        ],
        list: [
          "Güçlü: empati, sezgi, yaratıcılık, şefkat",
          "Güçlü: uyum ve fedakârlık",
          "Zorlayıcı: gerçeklerden kaçış, sınır koyamama",
          "Zorlayıcı: aşırı duygusallık, kararsızlık",
        ],
      },
      {
        h: "Balık burcu aşk ve ilişki",
        body: [
          "Balık aşkta romantik, şefkatli ve fedakârdır. Ruhsal ve duygusal bir bağ arar; partnerine derin bir sevgiyle bağlanır. İncelik ve anlayış onun dilidir.",
          "Genelde Su (Yengeç, Akrep) ve Toprak (Boğa, Başak, Oğlak) burçlarıyla uyumludur.",
        ],
      },
      {
        h: "Balık burcu kariyer ve para",
        body: [
          "Balıklar yaratıcılık, şefkat ve sezgi gerektiren işlerde parlar: sanat, müzik, sağlık, psikoloji ve sosyal hizmet. Hayal güçleri ilham kaynağıdır.",
          "Para konusunda cömert ve bazen dağınık olabilirler; net bir bütçe ve sınır onlara fayda sağlar.",
        ],
      },
    ],
    faq: [
      { q: "Balık burcu hangi tarihler arası?", a: "Balık burcu 19 Şubat – 20 Mart tarihleri arasındadır." },
      { q: "Balık burcunun yönetici gezegeni nedir?", a: "Balık burcunu geleneksel olarak Jüpiter, modern astrolojide Neptün yönetir." },
      { q: "Balık burcu neden hayalperest sayılır?", a: "Neptün etkisindeki bir Su burcu olduğu için sezgisel, duygusal ve hayal gücü yüksektir." },
    ],
  },
  {
    slug: "ay-burcu-nedir-nasil-hesaplanir",
    category: "burclar",
    title: "Ay Burcu Nedir, Nasıl Hesaplanır? Duygularının Gizli Haritası",
    excerpt:
      "Ay burcu nedir, neden çoğu zaman güneş burcundan daha çok “gerçek sen”i anlatır ve doğum saatinle nasıl hesaplanır? 12 ay burcunun duygusal dünyasını sade bir dille açıklıyoruz.",
    keywords: [
      "ay burcu",
      "ay burcu nedir",
      "ay burcu hesaplama",
      "ay burcu nasıl bulunur",
      "ay burcu özellikleri",
      "duygusal burç",
      "moon sign",
    ],
    date: "2026-06-28",
    readMinutes: 8,
    emoji: "☽",
    sections: [
      {
        h: "Ay burcu nedir?",
        body: [
          "Ay burcu, sen doğduğun anda Ay’ın bulunduğu burçtur. Güneş burcun dünyaya gösterdiğin kimliği temsil ederken, ay burcun kapıları kapatıp yalnız kaldığında hissettiğin “içerideki sen”i anlatır: duygusal doğanı, güvende hissetme biçimini ve içsel ihtiyaçlarını.",
          "Pek çok kişi kendini güneş burcunda bulamaz; çünkü asıl duygusal dünyayı yöneten Ay’dır. Ay burcun, tepkilerinin, alışkanlıklarının ve neye “ev” dediğinin haritasıdır.",
        ],
      },
      {
        h: "Ay burcu neden bu kadar önemli?",
        body: [
          "Ay; bilinçaltını, otomatik tepkilerini ve duygusal güvenlik ihtiyacını yönetir. Bir ilişkide nasıl bağlandığın, stres altında neye sığındığın ve seni neyin gerçekten beslediği büyük ölçüde ay burcunla ilgilidir.",
        ],
        list: [
          "Duygusal ihtiyaçların ve güvenlik hissin",
          "İçgüdüsel, anlık tepkilerin",
          "Bağlanma ve şefkat biçimin",
          "Alışkanlıkların ve rahat hissettiğin ortam",
          "Bilinçaltı kalıpların ve geçmişle bağın",
        ],
      },
      {
        h: "Ay burcu nasıl hesaplanır?",
        body: [
          "Ay, gökyüzünde hızlı hareket eder ve yaklaşık her 2,5 günde bir burç değiştirir. Bu yüzden ay burcunu bulmak için yalnızca doğum tarihin yetmez; doğum saatin ve doğduğun yer de gerekir. Özellikle Ay’ın burç değiştirdiği gün doğduysan, saat olmadan ay burcun yanlış çıkabilir.",
          "Elle hesaplaması zordur. Astrotek AI’a doğum bilgilerini girerek ay burcunu — ve güneş, yükselen ile tüm haritanı — saniyeler içinde, ücretsiz öğrenebilirsin.",
        ],
      },
      {
        h: "12 ay burcunun kısa duygusal profili",
        body: ["Ay’ın hangi burçta olduğu, duygularını nasıl yaşadığını belirler:"],
        list: [
          "Ay Koç: hızlı, ateşli tepkiler; duygusunu hemen yaşar.",
          "Ay Boğa: huzur ve istikrar arar; rutin onu güvende hisseder.",
          "Ay İkizler: duygularını konuşarak işler; zihinsel uyaran ister.",
          "Ay Yengeç: derin, korumacı, evine ve sevdiklerine bağlı.",
          "Ay Aslan: sevilmeye ve fark edilmeye ihtiyaç duyar.",
          "Ay Başak: faydalı olarak, düzen kurarak sevgi gösterir.",
          "Ay Terazi: uyum ve birliktelik içinde rahatlar.",
          "Ay Akrep: yoğun, derin, tutkulu; yüzeysel bağ kuramaz.",
          "Ay Yay: özgürlük ve anlam arayışıyla beslenir.",
          "Ay Oğlak: duygularını kontrol eder; sorumlulukla güven bulur.",
          "Ay Kova: duygusal alana ve bağımsızlığa ihtiyaç duyar.",
          "Ay Balık: empatik, sezgisel, sünger gibi her şeyi hisseder.",
        ],
      },
      {
        h: "Ay burcu ile güneş burcu uyuşmazsa ne olur?",
        body: [
          "Güneş ve ay burcunun farklı olması bir çelişki değil, derinliktir. Örneğin Güneş Koç (atılgan, dışa dönük) ama Ay Balık (hassas, içe dönük) biri, dışarıdan cesur görünüp içeride çok yumuşak olabilir. İkisini birden tanımak, kendinle barışmanın anahtarıdır.",
        ],
      },
    ],
    faq: [
      { q: "Ay burcu mu güneş burcu mu daha önemli?", a: "İkisi de önemlidir; güneş burcu dışa vurduğun kimliği, ay burcu içsel duygusal dünyanı anlatır. Kendini güneş burcunda bulamıyorsan, ay burcuna bakman gerekir." },
      { q: "Ay burcu için doğum saati şart mı?", a: "Ay yaklaşık 2,5 günde burç değiştirdiği için, özellikle geçiş günlerinde doğduysan saat olmadan ay burcun yanlış çıkabilir. Doğru sonuç için saat önerilir." },
      { q: "Ay burcumu nasıl öğrenirim?", a: "Doğum tarihin, saatin ve yerinle Astrotek AI’dan ay burcunu ücretsiz hesaplayabilirsin." },
    ],
  },
  {
    slug: "lilith-kara-ay-nedir",
    category: "gezegenler",
    title: "Lilith (Kara Ay) Nedir? Doğum Haritasında Anlamı ve Etkisi",
    excerpt:
      "Lilith (Kara Ay) nedir, neden astrolojinin en gizemli noktası sayılır ve doğum haritandaki yeri sana ne anlatır? Bastırılmış arzuların, gücün ve tabuların haritasını keşfet.",
    keywords: [
      "lilith",
      "kara ay",
      "lilith nedir",
      "lilith burcu",
      "kara ay lilith",
      "lilith astroloji",
      "lilith doğum haritası",
    ],
    date: "2026-06-27",
    readMinutes: 7,
    emoji: "🌑",
    sections: [
      {
        h: "Lilith (Kara Ay) nedir?",
        body: [
          "Lilith ya da Kara Ay, gerçek bir gök cismi değil; Ay’ın Dünya çevresindeki yörüngesinin en uzak noktasını (apogee) temsil eden matematiksel bir noktadır. Astrolojide haritanın en ham, en bastırılmış ve “evcilleştirilmemiş” yanını simgeler.",
          "Lilith, toplumun ya da kendi içsel sansürünün bastırmaya çalıştığı arzularını, öfkeni ve gücünü gösterir. Onunla yüzleşmek rahatsız edici olabilir ama en derin özgürleşme de oradan gelir.",
        ],
      },
      {
        h: "Lilith mitolojisi: boyun eğmeyi reddeden kadın",
        body: [
          "Efsaneye göre Lilith, Adem’in Havva’dan önceki ilk eşidir ve eşitliği reddedildiği için cennetten ayrılmayı seçmiştir. Bu yüzden Lilith; başkaldırı, özgürlük, ham cinsellik ve teslim olmama enerjisini temsil eder. Astrolojide de bu sembolizmi taşır.",
        ],
      },
      {
        h: "Lilith doğum haritanda ne anlatır?",
        body: ["Lilith’in burcu ve evi, kendi “gölge” gücünün nerede saklandığını gösterir:"],
        list: [
          "Bastırdığın ya da utandığın arzular",
          "Öfken ve sınır koyma biçimin",
          "Cinselliğin ve tutkunun ham hali",
          "Toplumsal kurallara başkaldıran yanın",
          "Gücünü geri aldığın, ‘hayır’ dediğin alan",
        ],
      },
      {
        h: "Lilith’in burcu ve evi nasıl yorumlanır?",
        body: [
          "Lilith’in burcu enerjinin tonunu, evi ise bu enerjinin hayatının hangi alanında ortaya çıktığını anlatır. Örneğin 7. evde Lilith ilişkilerde güç mücadelesi ve özgürlük ihtiyacına, 10. evde kariyerde otoriteye meydan okumaya işaret edebilir.",
          "Lilith’i bastırmak genelde patlamalara yol açar; onu bilinçle sahiplenmek ise güçlü, özgün bir karakter kazandırır.",
        ],
      },
      {
        h: "Lilith’le barışmak",
        body: [
          "Lilith’le çalışmak, içindeki “kabul edilemez” bulduğun parçayı bir kusur değil bir güç olarak görmektir. Gölgeni sahiplendiğinde, başkalarının onayına ihtiyaç duymadan kendin olabilirsin. Astrotek AI doğum haritanda Lilith’in burcunu ve evini ücretsiz gösterir.",
        ],
      },
    ],
    faq: [
      { q: "Lilith bir gezegen mi?", a: "Hayır. Lilith (Kara Ay), Ay’ın yörüngesinin en uzak noktasını temsil eden matematiksel bir noktadır; fiziksel bir gök cismi değildir." },
      { q: "Lilith neyi temsil eder?", a: "Bastırılmış arzuları, ham gücü, cinselliği, öfkeyi ve toplumsal kurallara başkaldıran ‘gölge’ yanı temsil eder." },
      { q: "Lilith burcumu nasıl öğrenirim?", a: "Doğum bilgilerinle Astrotek AI’dan haritanı çıkararak Lilith’in burcunu ve evini görebilirsin." },
    ],
  },
  {
    slug: "sinastri-nedir-iliski-uyumu",
    category: "iliski-ask",
    title: "Sinastri Nedir? İki Doğum Haritasıyla İlişki Uyumu Analizi",
    excerpt:
      "Sinastri nedir, burç uyumundan farkı ne ve iki kişinin doğum haritası karşılaştırılınca ilişki hakkında ne öğrenilir? Venüs-Mars, Ay ve açıların aşktaki rolünü açıklıyoruz.",
    keywords: [
      "sinastri",
      "sinastri nedir",
      "ilişki haritası",
      "çift uyumu astroloji",
      "sinastri analizi",
      "aşk haritası karşılaştırma",
      "venüs mars uyumu",
    ],
    date: "2026-06-26",
    readMinutes: 8,
    emoji: "💞",
    sections: [
      {
        h: "Sinastri nedir?",
        body: [
          "Sinastri, iki kişinin doğum haritasının üst üste konularak gezegenleri arasındaki açıların incelenmesidir. Yani bir ilişkinin astrolojik “kimya” analizidir. Burç uyumu (sadece güneş burçlarına bakmak) yüzeysel bir fikir verirken, sinastri ilişkinin derin dinamiklerini ortaya koyar.",
        ],
      },
      {
        h: "Burç uyumundan farkı nedir?",
        body: [
          "Burç uyumu yalnızca iki güneş burcunu karşılaştırır — bu, koca bir resmin tek pikseli gibidir. Sinastri ise her iki haritadaki Güneş, Ay, Venüs, Mars, yükselen ve evleri birlikte değerlendirir. Bu yüzden “güneş burçları uyumsuz” görünen iki kişi, sinastride muhteşem bir uyum yakalayabilir.",
        ],
      },
      {
        h: "Sinastride en önemli bağlantılar",
        body: ["Aşk astrolojisinde şu gezegen ilişkileri öne çıkar:"],
        list: [
          "Güneş–Ay: temel uyum ve “tamamlanma” hissi",
          "Venüs–Mars: çekim, tutku ve cinsel kimya",
          "Ay–Ay: duygusal anlayış ve ev hissi",
          "Venüs–Venüs: sevgi dillerinin uyumu",
          "Yükselen bağlantıları: ilk çekim ve ‘tıkırında’ hissi",
          "Satürn açıları: bağlılık ama bazen ağırlık/ders",
        ],
      },
      {
        h: "Hangi açılar iyi, hangileri zorlayıcı?",
        body: [
          "Üçgen ve kavuşum açıları genelde akış ve kolaylık getirir; kare ve karşıt açılar gerilim yaratır ama çoğu zaman güçlü bir çekim de doğurur. İlginçtir, en tutkulu ilişkilerde zorlayıcı açılar sık görülür — mesele bu gerilimi yıkıcı değil, büyütücü kullanabilmektir.",
        ],
      },
      {
        h: "Sinastriye nasıl başlarsın?",
        body: [
          "Sinastri için iki kişinin de doğum tarihi, saati ve yeri gerekir. Hızlı bir fikir için Astrotek AI’ın ücretsiz burç uyumu testiyle başlayabilir, ardından kendi doğum haritanı çıkararak Venüs ve Mars’ının hangi burçta olduğunu öğrenebilirsin.",
        ],
      },
    ],
    faq: [
      { q: "Sinastri ile burç uyumu aynı şey mi?", a: "Hayır. Burç uyumu sadece güneş burçlarını karşılaştırır; sinastri iki haritanın tüm gezegenlerini ve açılarını inceleyen çok daha derin bir analizdir." },
      { q: "Sinastri için neye ihtiyaç var?", a: "Her iki kişinin de doğum tarihi, saati ve doğum yeri gerekir. Saat özellikle yükselen ve evler için önemlidir." },
      { q: "Güneş burçları uyumsuzsa ilişki yürümez mi?", a: "Yürüyebilir. Venüs, Mars ve Ay bağlantıları güçlüyse, güneş burçları ‘uyumsuz’ görünen çiftler çok iyi anlaşabilir." },
    ],
  },
  {
    slug: "dolunay-yeniay-etkileri",
    category: "transit-zamanlama",
    title: "Dolunay ve Yeniay Ne Anlama Gelir? Etkileri ve Niyet Zamanlaması",
    excerpt:
      "Dolunay ve yeniay astrolojik olarak ne anlama gelir, ruh halini nasıl etkiler ve hangi burçta olduğu neden önemli? Yeni başlangıçlar ve bırakma için doğru zamanlamayı öğren.",
    keywords: [
      "dolunay",
      "yeniay",
      "dolunay etkileri",
      "yeniay niyet",
      "dolunay ne zaman",
      "ay evreleri astroloji",
      "yeniay dolunay anlamı",
    ],
    date: "2026-06-29",
    readMinutes: 7,
    emoji: "🌕",
    sections: [
      {
        h: "Ay evreleri ve döngünün anlamı",
        body: [
          "Ay yaklaşık 29,5 günlük bir döngüde yeniaydan dolunaya, oradan tekrar yeniaya döner. Astrolojide bu döngü bir nefes gibidir: yeniay tohum ekme (başlangıç), dolunay ise hasat ve doruk (sonuç) anıdır. Aradaki evreler büyüme ve bırakma sürecini temsil eder.",
        ],
      },
      {
        h: "Yeniay ne anlama gelir?",
        body: [
          "Yeniayda Ay ile Güneş aynı burçta birleşir ve gökyüzü kararır. Bu, yeni bir başlangıç, niyet etme ve tohum ekme enerjisidir. Astrolojik olarak yeniay, hayatına ne çekmek istediğini netleştirmek için güçlü bir an sayılır.",
        ],
        list: [
          "Yeni bir niyet ya da hedef belirlemek",
          "Bir projeye veya alışkanlığa başlamak",
          "Geleceğe yönelik plan yapmak",
        ],
      },
      {
        h: "Dolunay ne anlama gelir?",
        body: [
          "Dolunayda Ay ile Güneş karşı burçlarda, tam karşıt konumdadır; Ay tümüyle aydınlanır. Bu, bir şeyin doruğa ulaştığı, görünür hale geldiği ve genelde duyguların yoğunlaştığı andır. Dolunay; sonuç almak, fark etmek ve artık işe yaramayanı bırakmakla ilgilidir.",
        ],
        list: [
          "Bir sürecin sonucunu görmek / hasat",
          "Duygusal farkındalık ve netlik",
          "Bırakmak, affetmek, yükten kurtulmak",
        ],
      },
      {
        h: "Hangi burçta olduğu neden önemli?",
        body: [
          "Bir dolunay ya da yeniay sadece genel bir enerji taşımaz; senin doğum haritandaki hangi eve denk geldiği, o ayın senin için hangi hayat alanını (aşk, kariyer, para, sağlık) öne çıkaracağını belirler. Bu yüzden aynı dolunay herkesi aynı şekilde etkilemez.",
        ],
      },
      {
        h: "Dolunay ve yeniay’da ne yapmalı?",
        body: [
          "Yeniayda niyet yaz, başla; dolunayda durup değerlendir, bırak. Bu bir kesin kehanet değil, doğanın ritmiyle uyumlanma pratiğidir — sembolik bir pusula. Astrotek AI’ın günlük yorumu, güncel ay evresinin senin burcun için ne söylediğini her gün gösterir.",
        ],
      },
    ],
    faq: [
      { q: "Dolunay insanları nasıl etkiler?", a: "Dolunay duyguların yoğunlaştığı, bir şeylerin doruğa ulaştığı bir an sayılır; farkındalık, netlik ve bırakma enerjisi taşır. Etkisi, haritandaki evine göre kişiden kişiye değişir." },
      { q: "Yeniayda niyet etmek ne demek?", a: "Yeniay yeni başlangıç enerjisi taşıdığı için, hayatına çekmek istediklerini netleştirip yazmak ‘niyet etmek’ olarak adlandırılır." },
      { q: "Dolunay ve yeniay bilimsel mi?", a: "Astrolojik yorumlar semboliktir, kesin bilimsel sonuç değildir. Ay döngüsünü kişisel farkındalık ve zamanlama için bir pusula olarak kullanabilirsin." },
    ],
  },
  {
    slug: "astrolojide-elementler-nitelikler",
    category: "temel-astroloji",
    title: "Astrolojide Elementler ve Nitelikler: Ateş, Toprak, Hava, Su",
    excerpt:
      "12 burç dört element (ateş, toprak, hava, su) ve üç niteliğe (öncü, sabit, değişken) ayrılır. Bu temel yapı burçların karakterini ve uyumunu nasıl belirler? Sade bir rehber.",
    keywords: [
      "astroloji elementleri",
      "ateş toprak hava su burçları",
      "öncü sabit değişken burçlar",
      "burç elementleri",
      "element uyumu",
      "nitelikler astroloji",
    ],
    date: "2026-06-25",
    readMinutes: 6,
    emoji: "🔥",
    sections: [
      {
        h: "Elementler ve nitelikler neden önemli?",
        body: [
          "12 burcu tek tek ezberlemek yerine, onları iki temel sistemle anlamak çok daha kolaydır: dört element (ateş, toprak, hava, su) ve üç nitelik (öncü, sabit, değişken). Bir burcun elementi “nasıl bir enerjiye sahip olduğunu”, niteliği ise “bu enerjiyi nasıl kullandığını” anlatır.",
        ],
      },
      {
        h: "Dört element",
        body: ["Her burç bir elemente aittir ve o elementin temel karakterini taşır:"],
        list: [
          "Ateş (Koç, Aslan, Yay): coşkulu, cesur, hareketli, ilham veren.",
          "Toprak (Boğa, Başak, Oğlak): pratik, güvenilir, sabırlı, somut.",
          "Hava (İkizler, Terazi, Kova): zihinsel, iletişimci, sosyal, fikir odaklı.",
          "Su (Yengeç, Akrep, Balık): duygusal, sezgisel, derin, empatik.",
        ],
      },
      {
        h: "Üç nitelik (modalite)",
        body: ["Nitelik, burcun enerjisini nasıl ifade ettiğini gösterir:"],
        list: [
          "Öncü (Koç, Yengeç, Terazi, Oğlak): başlatan, harekete geçiren, lider.",
          "Sabit (Boğa, Aslan, Akrep, Kova): sürdüren, kararlı, bazen inatçı.",
          "Değişken (İkizler, Başak, Yay, Balık): uyum sağlayan, esnek, çok yönlü.",
        ],
      },
      {
        h: "Element uyumu nasıl çalışır?",
        body: [
          "Genel kural: aynı element burçlar (örneğin iki ateş) doğal anlaşır; tamamlayıcı elementler de iyi gider — ateş ve hava birbirini körükler, toprak ve su birbirini besler. Ateş-su ve toprak-hava ise daha çok emek ister. Yine de bu sadece bir başlangıçtır; gerçek uyum tüm haritaya bakılarak anlaşılır.",
        ],
      },
      {
        h: "Kendi element dengeni keşfet",
        body: [
          "Sen sadece güneş burcunun elementinden ibaret değilsin; haritandaki tüm gezegenlerin elementleri bir denge oluşturur. Bir alanda baskın, bir alanda eksik element olabilir. Astrotek AI doğum haritanda element dağılımını çıkararak hangi enerjinin sende güçlü olduğunu gösterir.",
        ],
      },
    ],
    faq: [
      { q: "Hangi burç hangi elementtir?", a: "Ateş: Koç, Aslan, Yay. Toprak: Boğa, Başak, Oğlak. Hava: İkizler, Terazi, Kova. Su: Yengeç, Akrep, Balık." },
      { q: "Öncü, sabit, değişken ne demek?", a: "Öncü burçlar başlatır (Koç, Yengeç, Terazi, Oğlak), sabit burçlar sürdürür (Boğa, Aslan, Akrep, Kova), değişken burçlar uyum sağlar (İkizler, Başak, Yay, Balık)." },
      { q: "Hangi elementler birbiriyle uyumlu?", a: "Aynı element burçlar ve tamamlayıcı çiftler (ateş-hava, toprak-su) genelde uyumludur; ama gerçek uyum için tüm doğum haritasına bakmak gerekir." },
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

// Türkçe karakterleri normalize ederek URL/anchor-güvenli slug üretir.
// İçindekiler (TOC) bağlantıları ve bölüm id'leri için kullanılır.
export function slugifyTr(text: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return text
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (m) => map[m] ?? m)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// SEO: tüm makale anahtar kelimelerini birleştir (tekilleştirilmiş).
// Blog index meta keywords + entity zenginliği için.
export function getAllKeywords(): string[] {
  const seen = new Set<string>();
  for (const a of ARTICLES) {
    for (const k of a.keywords) {
      const key = k.toLowerCase().trim();
      if (!seen.has(key)) seen.add(key);
    }
  }
  return [...seen];
}

// GEO: makaleler arası SSS'leri topla (her makaleden ilk soru) — üretken
// arama motorları (AI) için doğrudan alıntılanabilir Soru/Cevap havuzu.
// İlgili makale slug'ı ile birlikte döner (iç linkleme için).
export function getAggregatedFaqs(
  limit = 8,
): { q: string; a: string; slug: string }[] {
  const out: { q: string; a: string; slug: string }[] = [];
  for (const article of getAllArticles()) {
    const first = article.faq[0];
    if (first) out.push({ q: first.q, a: first.a, slug: article.slug });
    if (out.length >= limit) break;
  }
  return out;
}
