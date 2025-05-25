import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../context/FormContext";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CvPDF from "../components/pdf/CvPdf";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useAuth();
  const { formData, setFormData } = useForm();
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const API_BASE = import.meta.env.VITE_API_URL;
  const [hovered, setHovered] = useState(false);


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

        // ✅ localStorage'dan base64'i de al
        const base64 = localStorage.getItem(`profileImageBase64_${currentUser.uid}`);

        // ⬇️ formData'yı tam doldur
        setFormData({ ...cvData, profileImage, profileImageBase64: base64 || "" });
      } catch (err) {
        console.error("Kullanıcı bilgileri alınamadı ❌", err);
      }
    };

    fetchUserData();
  }, [currentUser, navigate, setFormData]);


  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    // ⬇️ 1MB sınırı kontrolü
    if (file.size > 1024 * 1024) {
      setErrorMessage("⚠️ Dosya boyutu 1MB'dan büyük olamaz.");
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
        // Base64 oluştur
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result;

          const separator = data.url.includes("?") ? "&" : "?";
          const cacheBustedUrl = `${data.url}${separator}t=${Date.now()}`;

          // 🔄 formData'yı güncelle (UI + PDF için)
          setFormData((prev) => ({
            ...prev,
            profileImage: cacheBustedUrl,
            profileImageBase64: base64,
          }));

          // Opsiyonel: localStorage'a da yazılabilir
          localStorage.setItem("profileImageBase64", base64);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Fotoğraf yükleme hatası ❌", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!currentUser) return;
    setUploading(true);

    try {
      const token = await currentUser.getIdToken();
      await fetch(`${API_BASE}/api/profile-image`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData((prev) => ({ ...prev, profileImage: "" }));
      localStorage.removeItem(`profileImageBase64_${currentUser.uid}`);
    } catch (error) {
      console.error("Fotoğraf silinemedi ❌", error);
      setErrorMessage("Fotoğraf silinemedi.");
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#e5e5e5] p-6 dark:bg-gray-900 ">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8 dark:bg-gray-800 dark:text-white">
        <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">Profilim</h1>

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
                    <label className="bg-green-200 dark:bg-green-200 dark:hover:bg-green-300 text-gray-800 px-2 py-1 rounded cursor-pointer mb-1 hover:bg-green-300">
                      Fotoğrafı Değiştir
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadPhoto}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={handleDeletePhoto}
                      className="bg-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-300"
                    >
                      Sil
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-sm relative">
                <label className="bg-green-200 text-gray-800 px-3 py-1 rounded cursor-pointer hover:bg-green-300 z-10">
                  Fotoğraf Yükle
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
          <p className="dark:text-white"><strong>Ad Soyad:</strong> {formData.name || "-"}</p>
          <p className="dark:text-white"><strong>Ünvan:</strong> {formData.title || "-"}</p>
          <p className="dark:text-white"><strong>Email:</strong> {formData.email}</p>
        </div>

        <div className="flex justify-center mt-4 gap-4">
          {formData.name && (
            <PDFDownloadLink
              document={<CvPDF formData={formData} />}
              fileName={`${formData.name || "CV"}_NextStepCV.pdf`}
            >
              {({ loading }) => (
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
                  {loading ? "Hazırlanıyor..." : "CV'yi İndir"}
                </button>
              )}
            </PDFDownloadLink>
          )}
          <button
            onClick={() => navigate("/cv-builder")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            CV Oluştur
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => navigate("/update-password")}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Şifre Güncelle
        </button>
      </div>

    </div>
  );
};

export default Profile;
