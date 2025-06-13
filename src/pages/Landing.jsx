import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ motion importu eklendi

const testimonials = [
  {
    quote:
      "Over 75% of resumes are never seen by human eyes if they're not ATS compliant.",
    name: "Jon Shields",
    title: "Recruiting Strategist, Jobscan",
  },
  {
    quote:
      "An ATS-friendly resume ensures your application actually gets read. It's the first filter you need to pass.",
    name: "Amanda Augustine",
    title: "Career Expert, TopResume",
  },
  {
    quote:
      "If your resume isn’t optimized for ATS, you’re essentially invisible to employers.",
    name: "Lily Zhang",
    title: "Career Development Specialist, MIT",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#e5e5e5] dark:bg-gray-900 dark:text-white flex flex-col items-center px-4 pt-40 pb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl flex flex-col items-center"
      >
        {/* Hero */}
        <img src="/favicon.svg" alt="Logo" className="h-12 mx-auto mb-6 lg:mt-20"/>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#2c2c2c] dark:text-white">
          ATS uyumlu, profesyonel CV’nizi kolayca oluşturun
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mb-6 dark:text-[#babdc2]">
          CV'nizi dakikalar içinde oluşturun, işverenlerin dikkatini çekin.
        </p>
        <button
          onClick={() => navigate("/cv-builder")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow transition mb-16"
        >
          CV Oluştur
        </button>

        {/* ATS Info */}
        <div className="max-w-3xl mb-14 pt-6">
          <h2 className="text-2xl font-semibold mb-3 text-green-500">ATS Nedir?</h2>
          <p className="text-md text-gray-800 dark:text-gray-300 leading-relaxed">
            ATS (Aday Takip Sistemi), işe alım süreçlerinde kullanılan yazılımlardır.
            İşverenler, adayların CV'lerini bu sistemler üzerinden otomatik olarak tarar.
            Biçimlendirmesi hatalı veya anahtar kelimeleri eksik olan CV’ler, sistemden
            geçemez. Bu nedenle <strong>ATS uyumlu bir CV</strong> ile başvuru yapmak, mülakat şansınızı ciddi ölçüde artırır.
          </p>
        </div>

        {/* Expert Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl w-full px-4 pt-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#c9c9c9] dark:bg-gray-800 p-6 rounded-lg shadow-md text-left"
            >
              <p className="italic text-gray-800 dark:text-gray-300 mb-4">"{t.quote}"</p>
              <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.title}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
