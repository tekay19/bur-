import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Üyelik Sözleşmesi & Kullanım Koşulları",
  description:
    "Astrotek AI üyelik sözleşmesi ve kullanım koşulları: hizmet kapsamı, üyelik, ücretlendirme, sorumluluk sınırları ve uygulanacak hukuk.",
  alternates: { canonical: "/kullanim-kosullari" },
};

export default function KosullarPage() {
  return (
    <LegalShell
      title="Üyelik Sözleşmesi & Kullanım Koşulları"
      current="/kullanim-kosullari"
      lead="Astrotek AI’ı kullanarak ve üye olarak aşağıdaki koşulları kabul etmiş olursun. Lütfen dikkatlice oku."
    >
      <h2>1. Taraflar ve Konu</h2>
      <p>
        Bu sözleşme; <strong>{LEGAL.platformName}</strong> (“Platform”) ile
        Platform’a üye olan veya Platform’u kullanan kişi (“Kullanıcı”) arasında,
        hizmetin kullanım koşullarını düzenler.
      </p>

      <h2>2. Hizmetin Tanımı</h2>
      <p>
        Platform; doğum haritası hesaplaması, astrolojik yorumlar, burç içerikleri
        ve kişilik testleri sunar. Sunulan içerikler{" "}
        <strong>bilgilendirme ve eğlence amaçlıdır</strong>; kesin bir kehanet,
        bilimsel sonuç ya da tıbbi, hukuki, finansal veya psikolojik tavsiye
        niteliği taşımaz. Alacağın kararların sorumluluğu sana aittir.
      </p>

      <h2>3. Üyelik ve Hesap Güvenliği</h2>
      <ul>
        <li>Üyelik için geçerli bir e-posta ve şifre belirlemen gerekir.</li>
        <li>
          18 yaşından büyük olduğunu ve verdiğin bilgilerin doğru olduğunu kabul
          edersin.
        </li>
        <li>
          Hesabının güvenliğinden ve şifrenin gizliliğinden sen sorumlusun.
        </li>
      </ul>

      <h2>4. Ücretlendirme ve Ödeme</h2>
      <ul>
        <li>
          Platform’un belirli özellikleri ücretsizdir; bazı analizler ise{" "}
          <strong>kredi</strong> ile açılır.
        </li>
        <li>
          Tüm ödemeler <strong>{LEGAL.paymentProcessor}</strong> tarafından,{" "}
          <strong>Merchant of Record</strong> (yasal satıcı) sıfatıyla işlenir.
          Faturalandırma, vergiler ve ödeme süreçleri {LEGAL.paymentProcessor}’un
          koşullarına tabidir; ödeme kartı bilgilerin Platform tarafından
          görülmez veya saklanmaz.
        </li>
        <li>
          Krediler, satın alındıktan sonra hesabına tanımlanır ve dijital hizmet
          olarak anında kullanıma sunulur.
        </li>
      </ul>

      <h2>5. Cayma Hakkı (Dijital Hizmet)</h2>
      <p>
        Krediler ve analiz çıktıları, elektronik ortamda anında ifa edilen{" "}
        <strong>dijital hizmet/içerik</strong> niteliğindedir. Mesafeli
        Sözleşmeler Yönetmeliği uyarınca, onayınla anında ifaya başlanan ve
        elektronik olarak teslim edilen dijital içeriklerde{" "}
        <strong>cayma hakkı kullanılamaz</strong>. Henüz kullanılmamış krediler
        için iade talepleri, ödeme sağlayıcısı {LEGAL.paymentProcessor}’un iade
        politikası çerçevesinde değerlendirilir. Talepler için:{" "}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
      </p>

      <h2>6. Fikri Mülkiyet</h2>
      <p>
        Platform’daki tasarım, metin, yazılım ve içerikler {LEGAL.platformName}’a
        aittir ve izinsiz kopyalanamaz, çoğaltılamaz veya ticari amaçla
        kullanılamaz. Oluşturduğun kişisel analiz çıktıların kendi kullanımına
        açıktır.
      </p>

      <h2>7. Kullanıcı Yükümlülükleri</h2>
      <ul>
        <li>Platform’u hukuka aykırı amaçlarla kullanmamak,</li>
        <li>
          Sistemin güvenliğini tehdit edecek (otomatik istek, kötü amaçlı yazılım
          vb.) eylemlerde bulunmamak,
        </li>
        <li>Başkalarının haklarını ihlal eden içerik veya davranıştan kaçınmak.</li>
      </ul>

      <h2>8. Sorumluluğun Sınırlandırılması</h2>
      <p>
        Hizmet “olduğu gibi” sunulur. {LEGAL.platformName}; astrolojik
        yorumların bağlayıcı olmamasından, hizmetteki kesintilerden veya üçüncü
        taraf sağlayıcılardan (ödeme, barındırma vb.) kaynaklanan dolaylı
        zararlardan, yürürlükteki mevzuatın izin verdiği ölçüde sorumlu tutulamaz.
      </p>

      <h2>9. Hizmette Değişiklik ve Fesih</h2>
      <p>
        {LEGAL.platformName}, hizmeti ve bu koşulları güncelleme hakkını saklı
        tutar; önemli değişiklikler bu sayfada yayımlanır. Kullanıcı, dilediği
        zaman hesabını sonlandırabilir.
      </p>

      <h2>10. Uygulanacak Hukuk ve Yetki</h2>
      <p>
        Bu sözleşme <strong>Türkiye Cumhuriyeti hukukuna</strong> tabidir.
        Uyuşmazlıklarda, ilgili parasal sınırlar dâhilinde Tüketici Hakem
        Heyetleri ile Türkiye Cumhuriyeti mahkemeleri ve icra daireleri
        yetkilidir.
      </p>

      <h2>11. İletişim</h2>
      <p>
        Her türlü soru ve talep için:{" "}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
      </p>
    </LegalShell>
  );
}
