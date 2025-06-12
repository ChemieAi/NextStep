import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useForm } from "../context/FormContext";
import { useAuth } from "../context/AuthContext";
import TemplateSimple from "../components/templates/TemplateSimple";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CvPdf from "../components/pdf/CvPdf";
import { getFormDataFromLocal, saveFormDataToLocal } from "../utils/localStorage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";

const CvPreview = () => {
  const componentRef = useRef();
  const navigate = useNavigate();
  const { formData, setFormData } = useForm();
  const { currentUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;


  const fetchFormData = async () => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE}/api/cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let backendData = {};
      if (response.ok) {
        backendData = await response.json();
      }

      // Profil fotoğrafı ayrı alınabilir
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      const profileImage = userSnap.exists() ? userSnap.data().profileImage : "";

      const fullData = { ...backendData, profileImage };
      setFormData(fullData);
      saveFormDataToLocal(fullData);
    } catch (err) {
      console.error("Backend'den CV verisi alınamadı ❌", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    const cachedData = getFormDataFromLocal();

    if (cachedData) {
      setFormData(cachedData);
      setLoading(false);
    }

    fetchFormData();
  }, [authLoading, navigate, currentUser]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${formData.name}_CV`,
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen dark:bg-gray-800 dark:text-white"
      >
        <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">CV Önizleme</h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/cv-builder")}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded mr-4 dark:text-white hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Geri Dön
          </button>
          {formData.name && (
            <PDFDownloadLink
              document={<CvPdf formData={formData} />}
              fileName={`${formData.name || "PlaceHolder"}_CV.pdf`}
            >
              {({ loading }) => (
                <button className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 dark:hover:bg-green-700">
                  {loading ? "Hazırlanıyor..." : "PDF Olarak İndir"}
                </button>
              )}
            </PDFDownloadLink>
          )}
        </div>

        <div className="flex justify-center">
          <TemplateSimple ref={componentRef} data={formData} />
        </div>
      </motion.div>
    </div>
  );
};

export default CvPreview;
