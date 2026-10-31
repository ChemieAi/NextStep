import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

// Base64 dönüşüm fonksiyonu
const compressImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");

        const maxSize = 500;
        const scale = Math.min(
          maxSize / img.width,
          maxSize / img.height,
          1
        );

        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Canvas oluşturulamadı");
        }

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const base64 = canvas.toDataURL("image/jpeg", 0.75);

        resolve(base64);
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Fotoğraf okunamadı"));
    };

    img.src = objectUrl;
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
  const { t } = useTranslation();

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
  const file = e.target.files?.[0];
  if (!file || !currentUser) return;

  if (file.size > 10 * 1024 * 1024) {
    setPhotoError(t("basicInfo.photoError"));
    return;
  }

  if (!file.type.startsWith("image/")) {
    setPhotoError("Lütfen geçerli bir fotoğraf seçin.");
    return;
  }

  setPhotoError("");
  setUploading(true);

  try {
    // PDF için küçük Base64 oluştur
    const compressedBase64 = await compressImageToBase64(file);

    // Orijinal fotoğrafı backend'e yükle
    const token = await currentUser.getIdToken();

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch(`${API_BASE}/api/profile-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error(`Fotoğraf yükleme hatası: ${response.status}`);
    }

    const result = await response.json();

    if (!result.url) {
      throw new Error("Fotoğraf URL'si alınamadı.");
    }

    const separator = result.url.includes("?") ? "&" : "?";
    const cacheBustedUrl =
      `${result.url}${separator}t=${Date.now()}`;

    // Firestore'a küçük Base64 kaydet
    const cvRef = doc(db, "users", currentUser.uid, "cvs", "main");

    await setDoc(
      cvRef,
      {
        profileImage: cacheBustedUrl,
        profileImageBase64: compressedBase64,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    // Context'i güncelle
    setData((prev) => ({
      ...prev,
      profileImage: cacheBustedUrl,
      profileImageBase64: compressedBase64,
    }));

    // localStorage opsiyonel; küçük görseli sakla
    try {
      localStorage.setItem(
        "profileImageBase64",
        compressedBase64
      );
    } catch (storageError) {
      console.warn("localStorage kaydı başarısız:", storageError);
    }

    console.log("Profil fotoğrafı PDF için hazır.");
  } catch (error) {
    console.error("Profil fotoğrafı hatası:", error);
    setPhotoError(
      "Fotoğraf kaydedilemedi. Lütfen tekrar deneyin."
    );
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
                <span className="text-xs text-gray-600 mt-1 dark:text-gray-300">{t("basicInfo.photoLabel")}</span>
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
        <label className="font-medium block mb-1">{t("basicInfo.nameLabel")}</label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder={t("basicInfo.namePlaceholder")}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="font-medium block mb-1">{t("basicInfo.titleLabel")}</label>
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          placeholder={t("basicInfo.titlePlaceholder")}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="font-medium block mb-1">{t("basicInfo.emailLabel")}</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          onBlur={(e) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(e.target.value)) {
              setEmailError(t("basicInfo.emailError"));
            } else {
              setEmailError("");
            }
          }}
          placeholder={t("basicInfo.emailPlaceholder")}
          className={`w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white ${emailError ? "border-red-500 animate-shake" : ""
            }`}
        />
        {emailError && (
          <p className="mt-1 mb-2 bg-white dark:bg-gray-800 text-red-600 text-sm px-3 py-2 rounded shadow border border-red-300 z-10">⚠️ {emailError}</p>
        )}
      </div>
      <div>
        <label className="font-medium block mb-1">{t("basicInfo.cityLabel")}</label>
        <input
          type="text"
          name="city"
          value={data.city}
          onChange={handleChange}
          placeholder={t("basicInfo.cityPlaceholder")}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="font-medium block mb-1">{t("basicInfo.phoneLabel")}</label>
        <input
          type="tel"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          onBlur={(e) => {
            const phoneRegex = /^\+?[1-9]\d{7,14}$/; // + opsiyonel, 8-15 arası hane alan koduyla birlikte
            if (!phoneRegex.test(e.target.value)) {
              setPhoneError(t("basicInfo.phoneError"));
            } else {
              setPhoneError("");
            }
          }}
          placeholder={t("basicInfo.phonePlaceholder")}
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
          {t("basicInfo.showImage")}
        </label>
      </div>
    </div>
  );
};

export default StepBasicInfo;
