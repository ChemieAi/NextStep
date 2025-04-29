import { useNavigate } from "react-router-dom";

const StepTemplate = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/cv-preview"); // ⬅️ Sonraki adım Preview sayfası
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold dark:text-white">Bir CV Şablonu Seçin</h2>
        <p className="text-gray-600 dark:text-gray-300">PDF olarak indirilecek tasarımı belirleyin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="p-4 border rounded hover:border-green-500 cursor-pointer"
          onClick={handleNext}
        >
          <h3 className="text-lg font-semibold mb-2 dark:text-white">🧾 Basit ve Temiz</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Eğer sade ve okunabilir bir CV istiyorsanız bu şablonu tercih edin.
          </p>
        </div>

        <div
          className="p-4 border rounded opacity-50 cursor-not-allowed"
        >
          <h3 className="text-lg font-semibold mb-2">🎨 Modern ve Minimal</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bu şablon çok yakında eklenecek. 👷‍♂️
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepTemplate;
