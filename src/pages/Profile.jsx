import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../context/FormContext";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CvPDF from "../components/pdf/CvPdf";
import CvPdf_2 from "../components/pdf/CvPdf_2";
import { useNavigate } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { currentUser } = useAuth();
  const { formData, setFormData } = useForm();
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const API_BASE = import.meta.env.VITE_API_URL;
  const [hovered, setHovered] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        const token = await currentUser.getIdToken();

        // CV verisini backend'den al
        const response = await fetch(`${API_BASE}/api/cv`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let cvData = {};
        if (response.ok) {
          cvData = await response.json();
        }

        // Profil fotoğrafını Firestore'dan çek
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const profileImage = userDoc.exists() ? userDoc.data().profileImage : "";

        setFormData({ ...cvData, profileImage, profileImageBase64: cvData.profileImageBase64 || "" });
      } catch (err) {
        console.error("Kullanıcı bilgileri alınamadı ❌", err);
      }
    };

    fetchUserData();
  }, [currentUser, navigate, setFormData]);


  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    if (file.size > 1024 * 1024) {
      setErrorMessage(t("profile.uploadErrorSize"));
      return;
    }

    setErrorMessage("");
    setUploading(true);

    try {
      const token = await currentUser.getIdToken();
      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const response = await fetch(`${API_BASE}/api/profile-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      });

      const data = await response.json();

      if (data.url) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result;

          // 🔁 URL'ye timestamp ekle (cache busting)
          const separator = data.url.includes("?") ? "&" : "?";
          const cacheBustedUrl = `${data.url}${separator}t=${Date.now()}`;

          // 🟢 1. Form datasını güncelle
          setFormData((prev) => ({
            ...prev,
            profileImage: cacheBustedUrl,
            profileImageBase64: base64,
          }));

          // 🟢 2. Firestore'daki CV verisini güncelle
          const cvRef = doc(db, "users", currentUser.uid, "cvs", "main");
          await setDoc(cvRef, {
            profileImage: cacheBustedUrl,
            profileImageBase64: base64,
            updatedAt: new Date()
          }, { merge: true });

          // 🟢 3. (Opsiyonel) localStorage güncelle
          localStorage.setItem("profileImageBase64", base64);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Fotoğraf yükleme hatası ❌", error);
      setErrorMessage(t("profile.uploadErrorGeneric"));
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#e5e5e5] p-6 dark:bg-gray-900 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8 dark:bg-gray-800 dark:text-white w-full"
      >
        <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">{t("profile.title")}</h1>

        <div
          className="relative group w-32 h-32 mb-4 justify-center items-center mx-auto rounded-full overflow-hidden cursor-pointer border-2 border-gray-300 dark:border-gray-600"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {uploading ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-700">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            </div>
          ) :
            formData.profileImage ? (
              <>
                <img
                  src={formData.profileImage}
                  alt="Profil Fotoğrafı"
                  className="w-full h-full object-cover rounded-full border-2 border-white shadow"
                />
                {hovered && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col justify-center items-center text-xs">
                    <label className="flex flex-col items-center cursor-pointer text-white">
                      <PencilIcon className="w-10 h-10 text-white mb-1" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadPhoto}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative">
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-black/30 transition">
                  <UserCircleIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 mt-1">{t("profile.uploadLabel")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPhoto}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            )
          }
        </div>


        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}



        <div className="mb-6 dark:text-white">
          <p className="dark:text-white"><strong>{t("profile.fullname")}:</strong> {formData.name || "-"}</p>
          <p className="dark:text-white"><strong>{t("profile.titleLabel")}:</strong> {formData.title || "-"}</p>
          <p className="dark:text-white"><strong>{t("profile.email")}:</strong> {formData.email}</p>
        </div>

        <div className="flex justify-center mt-4 gap-4">
          {formData.name && (
            <PDFDownloadLink
              document={
                (formData.selectedTemplate || "simple") === "simple_2"
                  ? <CvPdf_2 formData={formData} />
                  : <CvPDF formData={formData} />
              }
              fileName={`${formData.name || "CV"}_NextStepCV.pdf`}
            >
              {({ loading }) => (
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
                  {loading ? t("profile.downloading") : t("profile.download")}
                </button>
              )}
            </PDFDownloadLink>
          )}
          <button
            onClick={() => navigate("/cv-builder")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            {t("profile.createCv")}
          </button>
        </div>
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => navigate("/update-password")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            {t("profile.updatePassword")}
          </button>
        </div>
      </motion.div>
    </div >
  );
};

export default Profile;
