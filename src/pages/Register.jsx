import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";


const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [agreeError, setAgreeError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setPasswordError("Şifreler eşleşmiyor");
      return;
    }
    setPasswordError("");

    if (!form.agree) {
      setAgreeError("Devam etmek için şartları kabul etmelisiniz.");
      return;
    }
    setAgreeError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      await sendEmailVerification(user);

      // Kullanıcı bilgilerini localStorage'a geçici olarak kaydet
      localStorage.setItem("temp_user_data", JSON.stringify({
        name: form.name,
        surname: form.surname,
        agreedToTerms: true,
      }));

      // Bekleme ekranına yönlendir
      navigate("/verify-waiting");
    } catch (err) {
      setError(err.message);
    }
  };



  return (
    <div className="min-h-screen bg-[#e3e3e3] flex flex-col justify-center items-center dark:bg-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-6 dark:text-white">LOGO</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm dark:bg-gray-800 dark:text-black"
      >
        <h2 className="text-lg font-semibold text-center mb-4 text-white">
          Hoş Geldiniz
        </h2>
        <p className="text-center text-white mb-4">Hesabınızı oluşturunuz</p>

        <input
          name="name"
          placeholder="Adınızı giriniz"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="surname"
          placeholder="Soyadınızı giriniz"
          value={form.surname}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email adresinizi giriniz"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Şifrenizi giriniz"
          value={form.password}
          onChange={handleChange}
          className={`w-full p-3 border rounded ${passwordError ? "border-red-500 animate-shake" : ""
            }`}
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Şifrenizi tekrar giriniz"
          value={form.confirmPassword}
          onChange={handleChange}
          className={`w-full p-3 border rounded   ${passwordError ? "border-red-500 animate-shake" : ""
            }`}
        />

        {passwordError && (
          <p className="mt-2 bg-white dark:bg-gray-800 text-red-600 text-sm px-3 py-2 rounded shadow border border-red-500">
            ⚠️ {passwordError}
          </p>
        )}

        <div className="mt-4 mb-6 flex items-start ">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={(e) => setForm({ ...form, agree: e.target.checked })}
            className="ml-5 mr-3 mt-1 w-6 h-6"
          />
          <label className="text-sm text-white">
            <span
              onClick={() => setShowTerms(true)}
              className="font-medium text-green-300 underline cursor-pointer"
            >
              Kullanım Şartları
            </span> ve{" "}
            <span
              onClick={() => setShowPrivacy(true)}
              className="font-medium text-green-300 underline cursor-pointer"
            >
              Gizlilik Politikasını
            </span> okudum, kabul ediyorum.
          </label>
        </div>

        {agreeError && (
          <p className="text-red-500 text-sm mt-2">{agreeError}</p>
        )}


        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button type="submit" className="btn w-full">Üye Ol</button>

        <p className="text-center mt-4 text-sm text-white underline cursor-pointer">
          <a href="/login">Zaten hesabınız var mı? Giriş yap</a>
        </p>
      </form>
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Kullanım Şartları</h2>
            <p className="text-sm text-gray-800 space-y-2">
              <strong>1. Taraflar</strong><br />
              Bu kullanım şartları, NextStepCV platformunun tüm kullanıcıları ile hizmeti sunan taraf arasında düzenlenmiştir. NextStepCV'ye erişen her kullanıcı bu şartları okumuş, anlamış ve kabul etmiş sayılır.

              <br /><br />
              <strong>2. Hizmetin Tanımı</strong><br />
              NextStepCV, kullanıcılara online ortamda hızlı, şık ve profesyonel özgeçmiş (CV) hazırlama hizmeti sunar. Kullanıcılar, kişisel bilgilerini girerek PDF çıktısı alabilir veya platform üzerinde CV'lerini saklayabilirler.

              <br /><br />
              <strong>3. Hesap Oluşturma</strong><br />
              Kullanıcılar hizmetten yararlanmak için ad, soyad, e-posta ve şifre bilgileriyle hesap oluşturmak zorundadır. Kullanıcı bilgileri doğru ve güncel olmalıdır. Hesap sahibinin dışında bir kişi tarafından kullanılmasına izin verilmemelidir.

              <br /><br />
              <strong>4. Kullanım Koşulları</strong><br />
              Kullanıcılar:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Gerçek, doğru ve yasal içerikler üretmekle yükümlüdür.</li>
                <li>Platformu kötüye kullanamaz, zararlı içerikler paylaşamaz.</li>
                <li>Diğer kullanıcıların güvenliğini tehdit edemez.</li>
                <li>Yasa dışı, saldırgan, hakaret içeren veya cinsellik barındıran içerikler oluşturamaz.</li>
              </ul>

              <br />
              <strong>5. Hizmet Sürekliliği</strong><br />
              NextStepCV hizmetleri genellikle kesintisiz şekilde sunulsa da, bakım, güncelleme, sunucu arızası gibi nedenlerle geçici kesintiler yaşanabilir. Platform bu tür kesintilerden doğacak zararlardan sorumlu değildir.

              <br /><br />
              <strong>6. İçerik Sahipliği</strong><br />
              Oluşturulan özgeçmişler, ilgili kullanıcıya aittir. Ancak platform, kamuya açık hale getirilmeyen içeriklere hiçbir şekilde erişmez ya da kullanmaz. Kullanıcılar, CV’lerini platform üzerinde saklayarak veri işlenmesine rıza göstermiş olur.

              <br /><br />
              <strong>7. Ücretlendirme</strong><br />
              Platform, şu an için ücretsizdir. Ancak ileride bazı gelişmiş özellikler için ücretli üyelik modelleri uygulanabilir. Böyle bir değişiklik olması durumunda, kullanıcılar önceden bilgilendirilir.

              <br /><br />
              <strong>8. Üçüncü Taraf Hizmetleri</strong><br />
              NextStepCV, hizmetin sağlanması sırasında bazı üçüncü taraf servis sağlayıcılardan destek alabilir (örneğin: sunucu barındırma, veri analitiği hizmetleri vb.). Bu hizmet sağlayıcılar yalnızca gerekli verilere erişim hakkına sahiptir.

              <br /><br />
              <strong>9. Hesap İptali</strong><br />
              Kullanıcı, istediği zaman hesabını silebilir. Hesap silindiğinde veriler 30 gün içinde sistemden kalıcı olarak kaldırılır. Platform, ciddi kural ihlalleri durumunda kullanıcı hesabını uyarı vermeksizin askıya alma hakkını saklı tutar.

              <br /><br />
              <strong>10. Değişiklik Hakkı</strong><br />
              NextStepCV, bu şartları dilediği zaman güncelleme hakkını saklı tutar. Kullanıcılar güncellemeleri platform üzerinden takip etmekle yükümlüdür.

              <br /><br />
              <strong>11. İletişim</strong><br />
              Soru, öneri veya şikayetleriniz için bize <i>support@nextstepcv.tech</i> adresinden ulaşabilirsiniz.
            </p>

            <button
              onClick={() => setShowTerms(false)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Gizlilik Politikası</h2>
            <p className="text-sm text-gray-800 space-y-2">
              <strong>1. Giriş</strong><br />
              NextStepCV olarak kullanıcı gizliliğini önemsiyoruz. Bu belge, sizinle ilgili hangi bilgileri topladığımızı, neden topladığımızı ve bu bilgileri nasıl işlediğimizi açıklar.

              <br /><br />
              <strong>2. Toplanan Veriler</strong><br />
              Platform üzerinden sizin gönüllü olarak sağladığınız aşağıdaki kişisel bilgileri toplarız:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Ad ve soyad</li>
                <li>E-posta adresi</li>
                <li>Telefon numarası</li>
                <li>Şehir ve ülke</li>
                <li>Eğitim ve iş geçmişi</li>
                <li>Yetenekler, projeler ve özet bilgiler</li>
                <li>Profil fotoğrafı (isteğe bağlı)</li>
              </ul>

              <br />
              <strong>3. Verilerin İşlenme Amaçları</strong><br />
              Verileriniz aşağıdaki amaçlarla işlenir:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Size CV oluşturma hizmeti sunmak</li>
                <li>Giriş bilgilerinizi doğrulamak</li>
                <li>Destek taleplerinizi yanıtlamak</li>
                <li>Sistem performansını analiz etmek</li>
                <li>Platformu güvenli tutmak</li>
                <li>Hukuki yükümlülükleri yerine getirmek</li>
              </ul>

              <br />
              <strong>4. Verilerin Saklanma Süresi</strong><br />
              Hesabınız aktif olduğu sürece verileriniz saklanır. Hesabınızı sildiğinizde veya belirli bir süre boyunca platformu kullanmazsanız, verileriniz kalıcı olarak silinir.

              <br /><br />
              <strong>5. Güvenlik</strong><br />
              NextStepCV, verilerinizi korumak için gerekli tüm fiziksel, teknik ve idari güvenlik önlemlerini alır. Ancak internet üzerinden veri aktarımı tamamen güvenli değildir, bu nedenle mutlak güvenlik garanti edilemez.

              <br /><br />
              <strong>6. Üçüncü Taraflarla Paylaşım</strong><br />
              Bilgileriniz reklam amaçlı üçüncü taraflara satılmaz. Ancak platform altyapısında yer alan servis sağlayıcılar (örneğin: barındırma hizmeti, görsel işleme servisi, analiz araçları) gibi bazı hizmetlerde sınırlı veri paylaşımı gerçekleşebilir. Bu taraflar yalnızca hizmetin çalışması için gereken bilgilere erişebilir ve gizlilik yükümlülüğü altındadır.

              <br /><br />
              <strong>7. Kullanıcı Hakları</strong><br />
              Kullanıcı olarak:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Verilerinize erişme</li>
                <li>Düzeltme talep etme</li>
                <li>Veri silinmesini isteme</li>
                <li>İşleme faaliyetlerine itiraz etme</li>
              </ul>
              hakkına sahipsiniz.

              <br /><br />
              <strong>8. Çerezler</strong><br />
              Platformumuz, oturum yönetimi ve kullanıcı deneyimini geliştirmek amacıyla çerezler kullanır. Bu çerezler kişisel bilgi içermez ve sadece anonim analizler için değerlendirilir.

              <br /><br />
              <strong>9. Yasal Yükümlülükler</strong><br />
              Talep halinde resmi kurumlarla gerekli bilgi paylaşımı yapılabilir. Bu tür durumlar dışında verileriniz üçüncü şahıslara açıklanmaz.

              <br /><br />
              <strong>10. Politika Değişiklikleri</strong><br />
              Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler size e-posta yoluyla bildirilecektir.

              <br /><br />
              <strong>11. İletişim</strong><br />
              Gizliliğinizle ilgili herhangi bir soru veya talep için bizimle <i>support@nextstepcv.tech</i> adresinden iletişime geçebilirsiniz.
            </p>


            <button
              onClick={() => setShowPrivacy(false)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Register;
