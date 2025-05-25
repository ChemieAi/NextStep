import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { PencilIcon } from "@heroicons/react/24/solid";

// Base64 dönüşüm fonksiyonu
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const StepBasicInfo = ({ data, setData }) => {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const API_BASE = import.meta.env.VITE_API_URL;
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // localStorage'tan base64 al (ilk yüklenirken)
    const base64 = localStorage.getItem("profileImageBase64");
    if (base64 && !data.profileImageBase64) {
      setData((prev) => ({ ...prev, profileImageBase64: base64 }));
    }
  }, []);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    // 1MB sınırı (1MB = 1024 * 1024 byte)
    if (file.size > 1024 * 1024) {
      setPhotoError("Dosya boyutu 1MB'dan büyük olamaz.");
      return;
    }
    setPhotoError(""); // ⬅️ başarılı yüklemeden sonra temizle
    setUploading(true);

    try {
      const token = await currentUser.getIdToken();
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/api/profile-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result;

          // 🔁 URL’ye cache busting ekleme (sadece görünüm için)
          const separator = data.url.includes("?") ? "&" : "?";
          const cacheBustedUrl = `${data.url}${separator}t=${Date.now()}`;

          // 🔄 local state güncelle
          setData((prev) => ({
            ...prev,
            profileImage: cacheBustedUrl,
            profileImageBase64: base64,
          }));

          // 🔄 Firestore cv verisini güncelle ki PDF de doğru base64'ü alsın
          const cvRef = doc(db, "users", currentUser.uid, "cvs", "main");
          await setDoc(cvRef, {
            profileImage: cacheBustedUrl,
            profileImageBase64: base64,
            updatedAt: new Date(),
          }, { merge: true });

          // 🔄 localStorage opsiyonel
          localStorage.setItem("profileImageBase64", base64);
        };

        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Profil fotoğrafı yüklenemedi ❌", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Profil resmi alanı */}
      <div className="col-span-2 flex flex-col items-center mt-4 mb-4">
        <div
          className="relative group w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {uploading ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-700">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            </div>
          ) : data.profileImage ? (
            <>
              <img
                src={data.profileImage}
                alt="Profil Fotoğrafı"
                className="w-full h-full object-cover rounded-full"
              />
              {hovered && (
                <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
                  <label className="flex flex-col items-center cursor-pointer">
                    <PencilIcon className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm relative dark:bg-gray-700">
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-black/30 transition">
                <UserCircleIcon className="w-14 h-14 text-gray-400" />
                <span className="text-xs text-gray-600 mt-1 dark:text-gray-300">Fotoğraf Yükle</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {photoError && (
          <p className="mt-2 bg-white dark:bg-gray-800 text-red-600 text-sm px-3 py-2 rounded shadow border border-red-300 z-10">
            ⚠️ {photoError}
          </p>
        )}
      </div>

      {/* Diğer inputlar */}
      <div>
        <label className="font-medium block mb-1">Ad Soyad</label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="Örneğin: Burak Kızılay"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="font-medium block mb-1">Ünvan</label>
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          placeholder="Örneğin: Yazılım Mühendisi"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="font-medium block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          onBlur={(e) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(e.target.value)) {
              setEmailError("Lütfen geçerli bir e-posta adresi girin.");
            } else {
              setEmailError("");
            }
          }}
          placeholder="Mail adresiniz"
          className={`w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white ${emailError ? "border-red-500 animate-shake" : ""
            }`}
        />
        {emailError && (
          <p className="mt-1 mb-2 bg-white dark:bg-gray-800 text-red-600 text-sm px-3 py-2 rounded shadow border border-red-300 z-10">⚠️ {emailError}</p>
        )}
      </div>
      <div>
        <label className="font-medium block mb-1">Ülke/Şehir</label>
        <input
          type="text"
          name="city"
          value={data.city}
          onChange={handleChange}
          placeholder="Örneğin: İstanbul"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="font-medium block mb-1">Telefon</label>
        <input
          type="tel"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          onBlur={(e) => {
            const phoneRegex = /^\+?[1-9]\d{7,14}$/; // + opsiyonel, 8-15 arası hane alan koduyla birlikte
            if (!phoneRegex.test(e.target.value)) {
              setPhoneError("Lütfen geçerli bir telefon numarası girin. Örnek Format: +905551112233  (Alan kodu ile birlikte boşluksuz giriniz)");
            } else {
              setPhoneError("");
            }
          }}
          placeholder="Örneğin: +905551112233 (Alan kodu ile birlikte boşluksuz giriniz)"
          className={`w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white ${phoneError ? "border-red-500 animate-shake" : ""
            }`}
        />
        {phoneError && (
          <p className="mt-1 mb-2 bg-white dark:bg-gray-800 text-red-600 text-sm px-3 py-2 rounded shadow border border-red-300 z-10">
            ⚠️ {phoneError}
          </p>
        )}
      </div>

      <div className="col-span-1 flex items-center justify-center mt-7 ml-3 space-x-2">
        <input
          type="checkbox"
          id="showProfileImage"
          name="showProfileImage"
          checked={data.showProfileImage || false}
          onChange={(e) =>
            setData({ ...data, showProfileImage: e.target.checked })
          }
          className="w-6 h-6 accent-green-500"
        />
        <label htmlFor="showProfileImage" className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          CV'de profil fotoğrafımı göster
        </label>
      </div>
    </div>
  );
};

export default StepBasicInfo;
