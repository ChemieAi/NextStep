import { useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const VerifyWaiting = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white text-center px-4">
      <h1 className="text-2xl font-bold mb-4">{t("verifyWaiting.title")}</h1>
      <p className="mb-6 text-gray-400">{t("verifyWaiting.instruction")}</p>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
    </div>
  );
};

export default VerifyWaiting;
