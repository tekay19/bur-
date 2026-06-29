import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";
import { CookiePrefsButton } from "@/components/legal/CookiePrefsButton";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    "Astrotek AI’ın kullandığı çerezler: oturum, güvenlik ve kredi takibi için işlevsel çerezler. Reklam/izleme çerezi kullanılmaz.",
  alternates: { canonical: "/cerez-politikasi" },
};

export default function CerezPage() {
  return (
    <LegalShell
      title="Çerez Politikası"
      current="/cerez-politikasi"
      lead="Bu politika, Astrotek AI’ın hangi çerezleri hangi amaçla kullandığını açıklar. Reklam veya profilleme amaçlı izleme çerezi kullanmıyoruz."
    >
      <h2>1. Çerez nedir?</h2>
      <p>
        Çerez, ziyaret ettiğin sitenin tarayıcına kaydettiği küçük bir metin
        dosyasıdır. Oturumunun açık kalması veya tercihlerinin hatırlanması gibi
        temel işlevler için kullanılır.
      </p>

      <h2>2. Kullandığımız çerezler</h2>
      <p>
        Yalnızca hizmetin çalışması için zorunlu olan{" "}
        <strong>işlevsel/zorunlu çerezleri</strong> kullanırız:
      </p>
      <table>
        <thead>
          <tr>
            <th>Amaç</th>
            <th>Tür</th>
            <th>Açıklama</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Oturum</td>
            <td>Zorunlu (httpOnly)</td>
            <td>Giriş yaptıktan sonra hesabının açık kalmasını sağlar.</td>
          </tr>
          <tr>
            <td>Misafir kredisi</td>
            <td>Zorunlu</td>
            <td>
              Üye olmadan kullanılan ücretsiz analiz hakkını cihaz bazında takip
              eder.
            </td>
          </tr>
          <tr>
            <td>Kötüye kullanım önleme</td>
            <td>Zorunlu</td>
            <td>
              Aynı cihazdan çok sayıda sahte hesap/ücretsiz hak suistimalini
              engeller.
            </td>
          </tr>
          <tr>
            <td>Deneme süresi</td>
            <td>İşlevsel</td>
            <td>Günlük yorum deneme süresini cihaz bazında saklar.</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Tarayıcı depolaması (localStorage)</h2>
      <p>
        Bazı kolaylıklar için tarayıcının yerel depolaması da kullanılır; örneğin
        doğum bilgilerini formlar arasında taşımak ve onboarding akışını yalnızca
        bir kez göstermek. Bu veriler cihazında kalır.
      </p>

      <h2>4. Üçüncü taraf / reklam çerezleri</h2>
      <p>
        <strong>Reklam, profilleme veya siteler arası izleme çerezi
        kullanmıyoruz.</strong> Ödeme adımında {LEGAL.paymentProcessor}’a
        yönlendirildiğinde, ilgili sağlayıcının kendi çerez politikası geçerli
        olur.
      </p>

      <h2>5. Çerezleri yönetme</h2>
      <p>
        Çerez tercihlerini (ör. analiz çerezlerine onayını) istediğin zaman
        aşağıdaki butondan değiştirebilirsin:
      </p>
      <p>
        <CookiePrefsButton />
      </p>
      <p>
        Ayrıca çerezleri tarayıcı ayarlarından da silebilir veya
        engelleyebilirsin. Ancak oturum ve güvenlik çerezleri engellendiğinde
        giriş yapma gibi temel işlevler çalışmayabilir.
      </p>

      <h2>6. İletişim</h2>
      <p>
        Sorularını <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>{" "}
        adresine iletebilirsin.
      </p>
    </LegalShell>
  );
}
