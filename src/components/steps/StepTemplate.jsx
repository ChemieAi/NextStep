import { useNavigate } from "react-router-dom";
import { useForm } from "../../context/FormContext";

const StepTemplate = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useForm();

  const handleSelect = (templateName) => {
    setFormData((prev) => ({ ...prev, selectedTemplate: templateName }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold dark:text-white">Bir CV Şablonu Seçin</h2>
        <p className="text-gray-600 dark:text-gray-300">PDF olarak indirilecek tasarımı belirleyin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-4 border rounded cursor-pointer transition-all duration-150 ${formData.selectedTemplate === "simple"
            ? "border-green-600 shadow-lg scale-[1.01]"
            : "hover:border-green-400"
            }`}
          onClick={() => handleSelect("simple")}
        >
          <h3 className="text-lg font-semibold mb-2 dark:text-white">🧾 Şablon 1</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ATS uyumlu, basit ve etkili bir tasarım.
          </p>
        </div>

        <div
          className={`p-4 border rounded cursor-pointer transition-all duration-150 ${formData.selectedTemplate === "simple_2"
              ? "border-green-600 shadow-lg scale-[1.01]"
              : "hover:border-green-400"
            }`}
          onClick={() => handleSelect("simple_2")}
        >
          <h3 className="text-lg font-semibold mb-2 dark:text-white">🧾 Şablon 2</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ATS uyumlu, basit ve etkili bir tasarım.
          </p>
        </div>

        <div
          className="p-4 border rounded hover:border-green-500 opacity-50 cursor-not-allowed"
        >
          <h3 className="text-lg font-semibold mb-2 dark:text-white">🧾 Şablon 3</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bu şablon yakında gelecek! Şu anda kullanılamıyor.
          </p>
        </div>

        <div
          className="p-4 border rounded hover:border-green-500 opacity-50 cursor-not-allowed"
        >
          <h3 className="text-lg font-semibold mb-2 dark:text-white">🧾 Şablon 4</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bu şablon yakında gelecek! Şu anda kullanılamıyor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepTemplate;
