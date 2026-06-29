import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin işlenmesine ilişkin aydınlatma metni.",
  alternates: { canonical: "/kvkk" },
};

export default function KvkkPage() {
  return (
    <LegalShell
      title="KVKK Aydınlatma Metni"
      current="/kvkk"
      lead="6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında, kişisel verilerinizin veri sorumlusu sıfatıyla nasıl işlendiğine ilişkin bilgilendirmedir."
    >
      <h2>1. Veri Sorumlusu</h2>
      <p>
        Kişisel verileriniz, KVKK uyarınca veri sorumlusu sıfatıyla{" "}
        <strong>{LEGAL.controller}</strong> (“{LEGAL.platformName}”, “Platform”)
        tarafından aşağıda açıklanan kapsamda işlenmektedir. İletişim:{" "}
        <a href={`mailto:${LEGAL.kvkkEmail}`}>{LEGAL.kvkkEmail}</a>.
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li>
          <strong>Kimlik & iletişim:</strong> ad (isteğe bağlı), e-posta adresi.
        </li>
        <li>
          <strong>Astrolojik analiz verileri:</strong> doğum tarihi, doğum saati
          ve doğum yeri (natal harita hesaplaması için).
        </li>
        <li>
          <strong>Hesap & işlem verileri:</strong> şifre (yalnızca geri
          döndürülemez biçimde — scrypt ile özetlenerek saklanır), kredi
          bakiyesi, oluşturduğun analiz geçmişi, üyelik tercihleri.
        </li>
        <li>
          <strong>İşlem güvenliği verileri:</strong> IP adresi ve erişim
          kayıtları (güvenlik, kötüye kullanım ve sahte hesap önleme amacıyla).
        </li>
        <li>
          <strong>Ödeme verileri:</strong> ödeme işlemleri{" "}
          <strong>{LEGAL.paymentProcessor}</strong> tarafından (Merchant of
          Record olarak) yürütülür; kart bilgileriniz Platform tarafından
          görülmez, saklanmaz veya işlenmez.
        </li>
      </ul>

      <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <ul>
        <li>Üyelik kaydının oluşturulması ve hesabın yönetilmesi,</li>
        <li>
          Doğum haritası ve astrolojik yorum hizmetinin sunulması,
        </li>
        <li>Kredi/ödeme süreçlerinin yürütülmesi ve faturalandırma desteği,</li>
        <li>
          Açık rızanız bulunması hâlinde günlük burç yorumu ve bilgilendirme
          e-postalarının gönderilmesi,
        </li>
        <li>
          Bilgi ve hizmet güvenliğinin sağlanması, dolandırıcılık ve kötüye
          kullanımın önlenmesi,
        </li>
        <li>Yasal yükümlülüklerin yerine getirilmesi ve taleplerin yanıtlanması.</li>
      </ul>

      <h2>4. İşlemenin Hukuki Sebepleri (KVKK m. 5)</h2>
      <ul>
        <li>
          <strong>Sözleşmenin kurulması/ifası:</strong> üyelik ve hizmetin
          sunulması (m. 5/2-c).
        </li>
        <li>
          <strong>Hukuki yükümlülük:</strong> mevzuattan doğan saklama ve
          bilgilendirme yükümlülükleri (m. 5/2-ç).
        </li>
        <li>
          <strong>Meşru menfaat:</strong> güvenlik, kötüye kullanımın önlenmesi
          (m. 5/2-f).
        </li>
        <li>
          <strong>Açık rıza:</strong> ticari elektronik ileti (pazarlama/günlük
          yorum e-postaları) gönderimi (m. 5/1).
        </li>
      </ul>

      <h2>5. Kişisel Verilerin Aktarılması ve Yurt Dışına Aktarım</h2>
      <p>
        Hizmetin teknik olarak sunulabilmesi için kişisel verileriniz, yalnızca
        ilgili amaçla sınırlı olmak üzere aşağıdaki hizmet sağlayıcılarla
        paylaşılabilir. Bu sağlayıcıların bir kısmının sunucuları yurt dışında
        bulunduğundan, KVKK m. 9 kapsamında <strong>yurt dışına aktarım</strong>{" "}
        söz konusu olabilir:
      </p>
      <ul>
        <li>
          <strong>{LEGAL.paymentProcessor}</strong> — ödeme altyapısı (Merchant
          of Record),
        </li>
        <li>
          <strong>Vercel</strong> — barındırma (hosting) ve içerik dağıtımı,
        </li>
        <li>
          <strong>Neon / PostgreSQL</strong> — veritabanı,
        </li>
        <li>
          <strong>E-posta (SMTP)</strong> sağlayıcısı — işlem ve bilgilendirme
          e-postaları.
        </li>
      </ul>
      <p>
        Kişisel verileriniz, yukarıdaki amaçlar dışında üçüncü kişilere
        satılmaz veya pazarlama amacıyla devredilmez.
      </p>

      <h2>6. Toplama Yöntemi</h2>
      <p>
        Verileriniz; üyelik formu, analiz formları ve Platform’u kullanımınız
        sırasında elektronik ortamda, otomatik ve kısmen otomatik yollarla
        toplanır.
      </p>

      <h2>7. Saklama Süresi</h2>
      <p>
        Kişisel verileriniz, işleme amacının gerektirdiği süre ve ilgili
        mevzuatta öngörülen zamanaşımı/saklama süreleri boyunca saklanır; bu
        süreler sona erdiğinde silinir, yok edilir veya anonim hâle getirilir.
        Hesabını sildirdiğinde, yasal saklama yükümlülüğü bulunmayan verilerin
        silinmesi sağlanır.
      </p>

      <h2>8. İlgili Kişi Olarak Haklarınız (KVKK m. 11)</h2>
      <p>Veri sahibi olarak;</p>
      <ul>
        <li>kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
        <li>işlenmişse buna ilişkin bilgi talep etme,</li>
        <li>işlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,</li>
        <li>eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
        <li>
          şartları oluştuğunda silinmesini/yok edilmesini ve aktarıldığı üçüncü
          kişilere bildirilmesini isteme,
        </li>
        <li>
          otomatik analiz sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz
          etme,
        </li>
        <li>kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme</li>
      </ul>
      <p>haklarına sahipsiniz.</p>

      <h2>9. Başvuru</h2>
      <p>
        Yukarıdaki haklarınıza ilişkin taleplerinizi{" "}
        <a href={`mailto:${LEGAL.kvkkEmail}`}>{LEGAL.kvkkEmail}</a> adresine
        iletebilirsiniz. Talebiniz, niteliğine göre en kısa sürede ve en geç{" "}
        <strong>30 gün</strong> içinde ücretsiz olarak sonuçlandırılır; işlemin
        ayrıca bir maliyet gerektirmesi hâlinde Kurul’ca belirlenen tarife
        uygulanabilir.
      </p>
    </LegalShell>
  );
}
