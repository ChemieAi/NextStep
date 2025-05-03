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

  useEffect(() => {
    if (currentUser === null) {
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const image = userDoc.data().profileImage || "";
          setFormData((prev) => ({ ...prev, profileImage: image }));
        }
        const cvRef = doc(db, "users", currentUser.uid, "cvs", "main");
        const cvSnap = await getDoc(cvRef);
        if (cvSnap.exists()) {
          const image = userDoc.data().profileImage || "";
          setFormData({ ...cvSnap.data(), profileImage: image });
        }
      } catch (err) {
        console.error("Kullanıcı bilgileri alınamadı ❌", err);
      }
    };
    fetchUserData();
  }, [currentUser, setFormData]);

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { profileImage: downloadURL }, { merge: true });

      setFormData((prev) => ({
        ...prev,
        profileImage: downloadURL,
      }));
    } catch (error) {
      console.error("Fotoğraf yükleme hatası ❌", error);
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
                </div>

                <div className="mb-6 dark:text-white">
                    <p className="dark:text-white"><strong>Ad Soyad:</strong> {formData.name || "-"}</p>
                    <p className="dark:text-white"><strong>Ünvan:</strong> {formData.title || "-"}</p>
                    <p className="dark:text-white"><strong>Email:</strong> {formData.email}</p>
                </div>

                <div className="flex justify-center">
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
                </div>
            </div>
        </div>
    );
};

export default Profile;
