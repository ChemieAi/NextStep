import { useNavigate } from "react-router-dom";
import { DocumentTextIcon } from "@heroicons/react/24/solid";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex flex-col justify-center items-center px-4 text-center dark:bg-gray-900 dark:text-white">
      <DocumentTextIcon className="h-20 w-20 text-green-500 mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#2c2c2c] dark:text-white">
        ATS uyumlu, profesyonel CV’nizi kolayca oluşturun
      </h1>
      <p className="text-lg text-gray-700 max-w-xl mb-6 dark:text-[#babdc2]">
        CV'nizi dakikalar içinde oluşturun, işverenlerin dikkatini çekin.
      </p>
      <button
        onClick={() => navigate("/cv-builder")}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow transition"
      >
        CV Oluştur
      </button>
    </div>
  );
};

export default Landing;
