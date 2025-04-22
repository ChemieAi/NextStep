import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useForm } from "../context/FormContext";
import TemplateSimple from "../components/templates/TemplateSimple";

const CvPreview = () => {
  const componentRef = useRef();
  const navigate = useNavigate();
  const { formData } = useForm();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${formData.name}_CV`,
  });

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">CV Önizleme</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/cv-builder")}
          className="border border-gray-400 text-gray-700 px-4 py-2 rounded mr-4"
        >
          Geri Dön
        </button>
        <button
          onClick={handlePrint}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          PDF Olarak İndir
        </button>
      </div>

      {/* Sadece yazdırılacak içerik */}
      <div ref={componentRef}>
        <TemplateSimple data={formData} />
      </div>
    </div>
  );
};

export default CvPreview;
