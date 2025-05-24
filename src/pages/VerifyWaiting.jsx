import { useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const VerifyWaiting = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!auth.currentUser) return;

      await auth.currentUser.reload();
      const user = auth.currentUser;

      if (user.emailVerified) {
        // ✅ localStorage'dan geçici veriyi al
        const savedData = JSON.parse(localStorage.getItem("temp_user_data"));

        // 🔥 Firestore'a yaz
        await setDoc(doc(db, "users", user.uid), {
          name: savedData?.name || "",
          surname: savedData?.surname || "",
          email: user.email,
          agreedToTerms: true,
          agreedAt: new Date(),
          createdAt: new Date(),
        });

        // temizle ve yönlendir
        localStorage.removeItem("temp_user_data");
        navigate("/");
      }
    }, 3000); // her 3 saniyede bir kontrol

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white text-center px-4">
      <h1 className="text-2xl font-bold mb-4 text-white">E-posta Doğrulaması Bekleniyor</h1>
      <p className="mb-6 text-gray-400">Lütfen e-posta adresinizi kontrol edin ve gelen bağlantıya tıklayarak hesabınızı doğrulayın.</p>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
    </div>
  );
};

export default VerifyWaiting;
