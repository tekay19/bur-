// Landing içeriği — tek kaynak (server-güvenli, bağımlılıksız).
// İkonlar bileşen tarafında eşlenir (bu dosya saf veri tutar).

export interface FeatureItem {
  icon: string; // lucide ikon anahtarı (bileşende eşlenir)
  title: string;
  desc: string;
  span?: "wide" | "tall"; // bento yerleşimi
}

export const FEATURES: FeatureItem[] = [
  {
    icon: "Orbit",
    title: "Doğum Haritası",
    desc: "Gezegenler, evler ve açılar; etkileşimli çark ve sade tablolarla tek ekranda.",
    span: "wide",
  },
  {
    icon: "Sparkles",
    title: "AI Yorum",
    desc: "Haritana özel, anlaşılır ve yapıcı Türkçe yorum — saniyeler içinde.",
  },
  {
    icon: "TrendingUp",
    title: "Gezegen & Ev Skorları",
    desc: "Her gezegen ve hayat alanı için net, sayısal bir güç göstergesi.",
  },
  {
    icon: "CalendarRange",
    title: "12 Aylık Zaman Çizelgesi",
    desc: "Önemli transitler, şanslı ve dikkatli olunacak günler — tarihli.",
    span: "tall",
  },
  {
    icon: "Briefcase",
    title: "Hayat Alanları",
    desc: "Kariyer, sınav, aşk, para ve sağlık için ayrı ayrı derin analiz.",
    span: "wide",
  },
  {
    icon: "ShieldCheck",
    title: "Gizli & Hızlı",
    desc: "Kayıt zorunlu değil. İlk analiz ücretsiz; bilgilerin sende kalır.",
  },
];

export interface StepItem {
  icon: string;
  title: string;
  desc: string;
}

export const STEPS: StepItem[] = [
  { icon: "PenLine", title: "Doğum bilgini gir", desc: "Tarih, saat ve yer — birkaç saniye." },
  { icon: "Orbit", title: "Harita hesaplansın", desc: "Çark, açılar ve transitler anında." },
  { icon: "Sparkles", title: "AI yorumu üretilsin", desc: "Hayat alanlarına göre, sade dille." },
  { icon: "BookOpen", title: "Oku & paylaş", desc: "Kaydet, PDF indir veya paylaş." },
];

export interface ZodiacSign {
  name: string;
  glyph: string;
  dates: string;
  blurb: string;
}

// Günlük burç önizleme şeridi (örnek, gerçek ürün tonunda Türkçe içerik).
export const ZODIAC: ZodiacSign[] = [
  { name: "Koç", glyph: "♈", dates: "21 Mar – 19 Nis", blurb: "Cesur bir başlangıç için enerji yüksek." },
  { name: "Boğa", glyph: "♉", dates: "20 Nis – 20 May", blurb: "Maddi konularda sağlam zemin günü." },
  { name: "İkizler", glyph: "♊", dates: "21 May – 20 Haz", blurb: "İletişim kapıları sonuna kadar açık." },
  { name: "Yengeç", glyph: "♋", dates: "21 Haz – 22 Tem", blurb: "Sezgilerin bugün yol gösterici." },
  { name: "Aslan", glyph: "♌", dates: "23 Tem – 22 Ağu", blurb: "Sahne senin; görünür olmaktan çekinme." },
  { name: "Başak", glyph: "♍", dates: "23 Ağu – 22 Eyl", blurb: "Detaylar bugün fark yaratacak." },
  { name: "Terazi", glyph: "♎", dates: "23 Eyl – 22 Eki", blurb: "İlişkilerde denge ve uzlaşı vakti." },
  { name: "Akrep", glyph: "♏", dates: "23 Eki – 21 Kas", blurb: "Derin bir dönüşüm fırsatı kapıda." },
  { name: "Yay", glyph: "♐", dates: "22 Kas – 21 Ara", blurb: "Yeni ufuklar seni çağırıyor." },
  { name: "Oğlak", glyph: "♑", dates: "22 Ara – 19 Oca", blurb: "Kararlılığın bugün ödüllenecek." },
  { name: "Kova", glyph: "♒", dates: "20 Oca – 18 Şub", blurb: "Özgün fikirlerin parlama günü." },
  { name: "Balık", glyph: "♓", dates: "19 Şub – 20 Mar", blurb: "Hayal gücün ve şefkatin yüksek." },
];

// AI önizleme — örnek yorum paragrafı (typewriter efekti için).
export const AI_SAMPLE =
  "Güneş'in Aslan burcundaki konumu, bu dönem kendini ifade etme ve liderlik temalarını öne çıkarıyor. Mars'ın 10. evine yaptığı transit, kariyer alanında cesur adımlar için güçlü bir kapı aralıyor; ancak Satürn'ün karşıt açısı sabır ve planlama gerektiriyor. Önümüzdeki üç hafta, özellikle ayın ilk yarısı, girişimlerin için verimli görünüyor.";

export interface TimelineEvent {
  date: string;
  title: string;
  tone: "positive" | "caution" | "neutral";
  desc: string;
}

export const TIMELINE: TimelineEvent[] = [
  { date: "12 Tem", title: "Venüs → 7. ev", tone: "positive", desc: "İlişkilerde uyum ve yeni bağlantılar." },
  { date: "24 Tem", title: "Mars karesi", tone: "caution", desc: "Aceleci kararlardan kaçın; sabırlı ol." },
  { date: "03 Ağu", title: "Jüpiter üçgeni", tone: "positive", desc: "Maddi ve mesleki genişleme fırsatı." },
  { date: "19 Ağu", title: "Merkür retro", tone: "caution", desc: "Sözleşme ve iletişimde dikkatli ol." },
];

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { name: "Elif K.", role: "Öğretmen", quote: "Astrolojiyi hiç bilmezdim; yorumlar o kadar sade ki ilk okuyuşta anladım." },
  { name: "Mert A.", role: "Yazılımcı", quote: "Transit zaman çizelgesi gerçekten işime yaradı — tarihler tutuyor." },
  { name: "Selin D.", role: "Tasarımcı", quote: "Kariyer analizi şaşırtıcı derecede isabetliydi. Arayüz de çok şık." },
  { name: "Burak T.", role: "Girişimci", quote: "Saniyeler içinde detaylı bir harita. Ödeme ve kredi sistemi de sorunsuz." },
  { name: "Ayşe Y.", role: "Doktor", quote: "Sağlık ve genel farkındalık bölümü çok düşündürücüydü, tavsiye ederim." },
  { name: "Can Ö.", role: "Öğrenci", quote: "Sınav dönemi analizi motivasyonumu artırdı. Bedava denedim, beğendim." },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "Astrotek AI nasıl çalışır?",
    a: "Doğum tarihin, saatin ve yerinle gerçek astronomik konumları hesaplar; natal haritanı, güncel transitleri ve skorları çıkarır, ardından yapay zeka ile sade Türkçe bir yoruma dönüştürür.",
  },
  {
    q: "İlk analiz ücretsiz mi?",
    a: "Evet. Yeni ziyaretçiler bir analizi ücretsiz oluşturur. Sonraki analizler için kredi paketi satın alabilir veya üye olarak kredilerini saklayabilirsin.",
  },
  {
    q: "Doğum saatimi bilmiyorsam olur mu?",
    a: "Gezegen burçların ve genel açılar yine hesaplanır. Ancak yükselen burç ve ev yorumları doğum saatine bağlı olduğundan, saat olmadan bu bölümler sınırlı gösterilir.",
  },
  {
    q: "Krediler nasıl satın alınır?",
    a: "Güvenli ödeme Creem üzerinden yapılır. Paket seçip ödeme sayfasına yönlendirilirsin; ödeme onaylanınca kredilerin anında hesabına eklenir.",
  },
  {
    q: "Üye olmam şart mı?",
    a: "Hayır. Misafir olarak da analiz oluşturabilirsin. Üyelik, analizlerini kaydetmen ve kredilerini cihazdan bağımsız saklaman için avantaj sağlar.",
  },
  {
    q: "Yorumlar ne kadar güvenilir?",
    a: "Yorumlar gerçek gök konumlarına dayanır ve sembolik eğilimleri açıklar. Astroloji bilimsel bir kesinlik değildir; içerik kişisel farkındalık amaçlıdır, kesin gelecek tahmini değildir.",
  },
];
