import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Astrotek AI",
  description:
    "Astrotek AI olarak hangi verileri topladığımızı, neden işlediğimizi ve nasıl koruduğumuzu açıklayan gizlilik politikası.",
  alternates: { canonical: "/gizlilik" },
};

export default function GizlilikPage() {
  return (
    <LegalShell
      title="Gizlilik Politikası"
      current="/gizlilik"
      lead="Gizliliğine önem veriyoruz. Bu politika; hangi verileri topladığımızı, neden işlediğimizi, kimlerle paylaştığımızı ve verilerini nasıl koruduğumuzu sade bir dille açıklar."
    >
      <h2>1. Hangi verileri topluyoruz?</h2>
      <ul>
        <li>
          <strong>Verdiğin bilgiler:</strong> e-posta, ad (isteğe bağlı), şifre
          ve doğum bilgilerin (tarih, saat, yer).
        </li>
        <li>
          <strong>Otomatik oluşan bilgiler:</strong> IP adresi, oturum ve
          güvenlik kayıtları, işlevsel çerezler.
        </li>
        <li>
          <strong>Kullanım verileri:</strong> oluşturduğun analizler ve hesap
          tercihlerin.
        </li>
      </ul>

      <h2>2. Verileri neden işliyoruz?</h2>
      <p>
        Hesabını oluşturmak ve yönetmek, doğum haritası ve yorum hizmetini
        sunmak, ödemeleri yürütmek, güvenliği sağlamak ve (yalnızca onay
        verdiysen) sana günlük yorum/bilgilendirme e-postaları göndermek için.
      </p>

      <h2>3. Şifren ve hassas veriler</h2>
      <p>
        Şifreni <strong>asla düz metin olarak saklamayız</strong>; şifreler
        endüstri standardı <strong>scrypt</strong> algoritmasıyla ve rastgele
        “tuz” (salt) ile geri döndürülemez biçimde özetlenir. Oturum
        çerezlerin <strong>httpOnly</strong> olarak ayarlanır ve üretimde yalnızca
        şifreli (HTTPS) bağlantı üzerinden iletilir.
      </p>

      <h2>4. Ödeme bilgilerin</h2>
      <p>
        Ödemeler <strong>{LEGAL.paymentProcessor}</strong> tarafından, Merchant
        of Record (yasal satıcı) sıfatıyla işlenir. Kart numaran gibi ödeme
        bilgileri <strong>bize hiç ulaşmaz</strong>; bunlar doğrudan ödeme
        sağlayıcısının güvenli altyapısında işlenir.
      </p>

      <h2>5. Kimlerle paylaşıyoruz?</h2>
      <p>
        Verilerini satmıyoruz. Yalnızca hizmeti sunmak için gerekli teknik
        sağlayıcılarla (ödeme: {LEGAL.paymentProcessor}; barındırma: Vercel;
        veritabanı: Neon; e-posta: SMTP sağlayıcısı) sınırlı biçimde paylaşırız.
        Bazı sağlayıcıların sunucuları yurt dışında olabilir — ayrıntı için{" "}
        <a href="/kvkk">KVKK Aydınlatma Metni</a>.
      </p>

      <h2>6. Çerezler</h2>
      <p>
        Yalnızca oturum, güvenlik ve kredi takibi gibi <strong>işlevsel</strong>{" "}
        çerezler kullanırız; reklam/izleme amaçlı üçüncü taraf çerezleri
        kullanmayız. Ayrıntı: <a href="/cerez-politikasi">Çerez Politikası</a>.
      </p>

      <h2>7. Verilerini saklama ve silme</h2>
      <p>
        Verilerini, hizmet için gerekli olduğu ve mevzuatın gerektirdiği süre
        boyunca saklarız. Hesabını silmek veya verilerinin silinmesini istemek
        için <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>{" "}
        adresine yazman yeterli.
      </p>

      <h2>8. Haklarına saygı</h2>
      <p>
        KVKK kapsamında verilerine erişme, düzeltme, silme ve işlemeye itiraz
        etme gibi haklara sahipsin. Bu hakların ayrıntısı ve başvuru yolu için{" "}
        <a href="/kvkk">KVKK Aydınlatma Metni</a>’ne bakabilirsin.
      </p>

      <h2>9. Çocukların gizliliği</h2>
      <p>
        Platform 18 yaşın altındaki kişilere yönelik değildir; bilerek 18 yaş
        altından kişisel veri toplamayız.
      </p>

      <h2>10. Değişiklikler ve iletişim</h2>
      <p>
        Bu politika zaman zaman güncellenebilir; güncel sürüm her zaman bu
        sayfada yayımlanır. Sorularını{" "}
        <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>{" "}
        adresine iletebilirsin.
      </p>
    </LegalShell>
  );
}
