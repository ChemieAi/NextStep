import { useNavigate } from "react-router-dom";
import { useForm } from "../../context/FormContext";
import { useTranslation } from "react-i18next";

const StepTemplate = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useForm();
  const { t } = useTranslation();

  const handleSelect = (templateName) => {
    setFormData((prev) => ({ ...prev, selectedTemplate: templateName }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold dark:text-white">{t("template.title")}</h2>
        <p className="text-gray-600 dark:text-gray-300">{t("template.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-4 border rounded cursor-pointer transition-all duration-150 ${formData.selectedTemplate === "simple"
            ? "border-green-600 shadow-lg scale-[1.01]"
            : "hover:border-green-400"
            }`}
          onClick={() => handleSelect("simple")}
        >
          <h3 className="text-lg font-semibold mb-2 dark:text-white">{t("template.template1")}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("template.description")}
          </p>
        </div>

        <div
          className={`p-4 border rounded cursor-pointer transition-all duration-150 ${formData.selectedTemplate === "simple_2"
            ? "border-green-600 shadow-lg scale-[1.01]"
            : "hover:border-green-400"
            }`}
          onClick={() => handleSelect("simple_2")}
        >
          <h3 className="text-lg font-semibold mb-2 dark:text-white">{t("template.template2")}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("template.description")}
          </p>
        </div>

        <div
          className="p-4 border rounded hover:border-green-500 opacity-50 cursor-not-allowed"
        >
          <h3 className="text-lg font-semibold mb-2 dark:text-white">{t("template.template3")}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("template.comingSoon")}
          </p>
        </div>

        <div
          className="p-4 border rounded hover:border-green-500 opacity-50 cursor-not-allowed"
        >
          <h3 className="text-lg font-semibold mb-2 dark:text-white">{t("template.template4")}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("template.comingSoon")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepTemplate;
