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
      setErrorMessage("Fotoğraf yüklenirken bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#e5e5e5] p-6 dark:bg-gray-900 ">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8 dark:bg-gray-800 dark:text-white">
        <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">Profilim</h1>

        <div className="flex flex-col items-center mb-6">
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt="Profil Fotoğrafı"
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-gray-500">No Photo</span>
            </div>
          )}

          <label className="text-sm mb-2 font-medium">Fotoğrafı Değiştir</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadPhoto}
            className="text-sm dark:bg-gray-700 dark:text-white"
            disabled={uploading}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}

        </div>

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
