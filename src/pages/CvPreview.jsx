import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useForm } from "../context/FormContext";
import TemplateSimple from "../components/templates/TemplateSimple";
import { PDFDownloadLink } from '@react-pdf/renderer';
import CvPdf from '../components/pdf/CvPdf';

const CvPreview = () => {
  const componentRef = useRef();
  const navigate = useNavigate();
  const { formData } = useForm();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${formData.name}_CV`,
  });

  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen dark:bg-gray-800 dark:text-white">
        <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">CV Önizleme</h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/cv-builder")}
            className=" border border-gray-400 text-gray-700 px-4 py-2 rounded mr-4 dark:text-white hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Geri Dön
          </button>

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
        </div>

        {/* Sadece yazdırılacak içerik */}
        <div className="flex justify-center">
          <TemplateSimple ref={componentRef} data={formData} />
        </div>
      </div>
    </div>
  );
};

export default CvPreview;
