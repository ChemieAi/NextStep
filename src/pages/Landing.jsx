import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-2xl leading-snug">
        ATS uyumlu, profesyonel CV’nizi kolayca oluşturun
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-6">
        CV'nizi dakikalar içinde oluşturun, işverenlerin dikkatini çekin.
      </p>
      <button
        onClick={() => navigate("/cv-builder")}
        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow transition"
      >
        CV Oluştur
      </button>
    </div>
  );
};

export default Landing;
